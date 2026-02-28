import { c as G, d as h, e as m, f as g } from "./chunk-HDFA5JOA.js";
import { isTruthy as k } from "remeda";
function c(e, t, o) {
  if (!(typeof t == "object" && t !== null) || !(e in t)) return !1;
  let r = t[e];
  return o ? o(r) : r !== void 0;
}
function S(e) {
  return typeof e == "object" && !!e && "clipsContent" in e && typeof e.clipsContent == "boolean";
}
function T(e) {
  return (
    typeof e == "object" &&
    !!e &&
    "absoluteBoundingBox" in e &&
    typeof e.absoluteBoundingBox == "object" &&
    !!e.absoluteBoundingBox &&
    "x" in e.absoluteBoundingBox &&
    "y" in e.absoluteBoundingBox &&
    "width" in e.absoluteBoundingBox &&
    "height" in e.absoluteBoundingBox
  );
}
function L(e, t) {
  let o = ["HORIZONTAL", "VERTICAL"];
  return S(t) && o.includes(t.layoutMode ?? "NONE") && T(e) && e.layoutPositioning !== "ABSOLUTE";
}
function B(e) {
  return (
    typeof e == "object" && e !== null && "top" in e && "right" in e && "bottom" in e && "left" in e
  );
}
function M(e, t) {
  let o = t;
  return (
    typeof t == "object" &&
    !!t &&
    e in o &&
    typeof o[e] == "object" &&
    !!o[e] &&
    "x" in o[e] &&
    "y" in o[e] &&
    "width" in o[e] &&
    "height" in o[e]
  );
}
function V(e) {
  return Array.isArray(e) && e.length === 4 && e.every((t) => typeof t == "number");
}
function I(e, t, o = {}, i = { styles: {} }) {
  let r = { globalVars: i, currentDepth: 0 };
  return {
    nodes: e
      .filter((n) => N(n, o))
      .map((n) => w(n, t, r, o))
      .filter((n) => n !== null),
    globalVars: r.globalVars,
  };
}
function w(e, t, o, i) {
  if (!N(e, i)) return null;
  let r = { id: e.id, name: e.name, type: e.type === "VECTOR" ? "IMAGE-SVG" : e.type };
  for (let a of t) a(e, r, o);
  if (ee(e, o, i)) {
    let a = { ...o, currentDepth: o.currentDepth + 1, parent: e };
    if (c("children", e) && e.children.length > 0) {
      let n = e.children
        .filter((s) => N(s, i))
        .map((s) => w(s, t, a, i))
        .filter((s) => s !== null);
      if (n.length > 0) {
        let s = i.afterChildren ? i.afterChildren(e, r, n) : n;
        s.length > 0 && (r.children = s);
      }
    }
  }
  return r;
}
function N(e, t) {
  return !(!m(e) || (t.nodeFilter && !t.nodeFilter(e)));
}
function ee(e, t, o) {
  return !(o.maxDepth !== void 0 && t.currentDepth >= o.maxDepth);
}
function $(e) {
  return Object.fromEntries(
    Object.entries(e).map(([t, o]) => [
      t,
      { id: t, key: o.key, name: o.name, componentSetId: o.componentSetId },
    ]),
  );
}
function O(e) {
  return Object.fromEntries(
    Object.entries(e).map(([t, o]) => [
      t,
      { id: t, key: o.key, name: o.name, description: o.description },
    ]),
  );
}
function te(e, t, o = {}) {
  let { metadata: i, rawNodes: r, components: a, componentSets: n, extraStyles: s } = oe(e),
    l = { styles: {}, extraStyles: s },
    { nodes: f, globalVars: p } = I(r, t, o, l);
  return {
    ...i,
    nodes: f,
    components: $(a),
    componentSets: O(n),
    globalVars: { styles: p.styles },
  };
}
function oe(e) {
  let t = {},
    o = {},
    i = {},
    r;
  if ("nodes" in e) {
    let n = Object.values(e.nodes);
    n.forEach((s) => {
      s.components && Object.assign(t, s.components),
        s.componentSets && Object.assign(o, s.componentSets),
        s.styles && Object.assign(i, s.styles);
    }),
      (r = n.map((s) => s.document).filter(m));
  } else
    Object.assign(t, e.components),
      Object.assign(o, e.componentSets),
      e.styles && (i = e.styles),
      (r = e.document.children.filter(m));
  let { name: a } = e;
  return { metadata: { name: a }, rawNodes: r, extraStyles: i, components: t, componentSets: o };
}
function z(e, t) {
  let o = ne(e),
    i = se(e, t, o.mode) || {};
  return { ...o, ...i };
}
function P(e, t) {
  if (t && t.mode !== "none") {
    let { children: o, mode: i, axis: r } = t,
      a = re(r, i);
    if (
      o.length > 0 &&
      o.reduce(
        (s, l) =>
          s
            ? "layoutPositioning" in l && l.layoutPositioning === "ABSOLUTE"
              ? !0
              : a === "horizontal"
                ? "layoutSizingHorizontal" in l && l.layoutSizingHorizontal === "FILL"
                : a === "vertical"
                  ? "layoutSizingVertical" in l && l.layoutSizingVertical === "FILL"
                  : !1
            : !1,
        !0,
      )
    )
      return "stretch";
  }
  switch (e) {
    case "MIN":
      return;
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "SPACE_BETWEEN":
      return "space-between";
    case "BASELINE":
      return "baseline";
    default:
      return;
  }
}
function ie(e) {
  switch (e) {
    case "MIN":
      return;
    case "MAX":
      return "flex-end";
    case "CENTER":
      return "center";
    case "STRETCH":
      return "stretch";
    default:
      return;
  }
}
function v(e) {
  if (e === "FIXED") return "fixed";
  if (e === "FILL") return "fill";
  if (e === "HUG") return "hug";
}
function re(e, t) {
  switch (e) {
    case "primary":
      switch (t) {
        case "row":
          return "horizontal";
        case "column":
          return "vertical";
      }
      break;
    case "counter":
      switch (t) {
        case "row":
          return "vertical";
        case "column":
          return "horizontal";
      }
  }
}
function ne(e) {
  if (!S(e)) return { mode: "none" };
  let t = {
      mode:
        !e.layoutMode || e.layoutMode === "NONE"
          ? "none"
          : e.layoutMode === "HORIZONTAL"
            ? "row"
            : "column",
    },
    o = [];
  return (
    e.overflowDirection?.includes("HORIZONTAL") && o.push("x"),
    e.overflowDirection?.includes("VERTICAL") && o.push("y"),
    o.length > 0 && (t.overflowScroll = o),
    t.mode === "none" ||
      ((t.justifyContent = P(e.primaryAxisAlignItems ?? "MIN", {
        children: e.children,
        axis: "primary",
        mode: t.mode,
      })),
      (t.alignItems = P(e.counterAxisAlignItems ?? "MIN", {
        children: e.children,
        axis: "counter",
        mode: t.mode,
      })),
      (t.alignSelf = ie(e.layoutAlign)),
      (t.wrap = e.layoutWrap === "WRAP" ? !0 : void 0),
      (t.gap = e.itemSpacing ? `${e.itemSpacing ?? 0}px` : void 0),
      (e.paddingTop || e.paddingBottom || e.paddingLeft || e.paddingRight) &&
        (t.padding = h({
          top: e.paddingTop ?? 0,
          right: e.paddingRight ?? 0,
          bottom: e.paddingBottom ?? 0,
          left: e.paddingLeft ?? 0,
        }))),
    t
  );
}
function se(e, t, o) {
  if (!T(e)) return;
  let i = { mode: o };
  if (
    ((i.sizing = { horizontal: v(e.layoutSizingHorizontal), vertical: v(e.layoutSizingVertical) }),
    S(t) &&
      !L(e, t) &&
      (e.layoutPositioning === "ABSOLUTE" && (i.position = "absolute"),
      e.absoluteBoundingBox &&
        t.absoluteBoundingBox &&
        (i.locationRelativeToParent = {
          x: g(e.absoluteBoundingBox.x - t.absoluteBoundingBox.x),
          y: g(e.absoluteBoundingBox.y - t.absoluteBoundingBox.y),
        })),
    M("absoluteBoundingBox", e))
  ) {
    let r = {};
    o === "row"
      ? (!e.layoutGrow &&
          e.layoutSizingHorizontal == "FIXED" &&
          (r.width = e.absoluteBoundingBox.width),
        e.layoutAlign !== "STRETCH" &&
          e.layoutSizingVertical == "FIXED" &&
          (r.height = e.absoluteBoundingBox.height))
      : o === "column"
        ? (e.layoutAlign !== "STRETCH" &&
            e.layoutSizingHorizontal == "FIXED" &&
            (r.width = e.absoluteBoundingBox.width),
          !e.layoutGrow &&
            e.layoutSizingVertical == "FIXED" &&
            (r.height = e.absoluteBoundingBox.height),
          e.preserveRatio &&
            (r.aspectRatio = e.absoluteBoundingBox?.width / e.absoluteBoundingBox?.height))
        : ((!e.layoutSizingHorizontal || e.layoutSizingHorizontal === "FIXED") &&
            (r.width = e.absoluteBoundingBox.width),
          (!e.layoutSizingVertical || e.layoutSizingVertical === "FIXED") &&
            (r.height = e.absoluteBoundingBox.height)),
      Object.keys(r).length > 0 &&
        (r.width && (r.width = g(r.width)),
        r.height && (r.height = g(r.height)),
        (i.dimensions = r));
  }
  return i;
}
function ae(e, t, o) {
  let i = t;
  switch (e) {
    case "FILL":
      return {
        css: i
          ? { backgroundSize: "cover", backgroundRepeat: "no-repeat", isBackground: !0 }
          : { objectFit: "cover", isBackground: !1 },
        processing: { needsCropping: !1, requiresImageDimensions: !1 },
      };
    case "FIT":
      return {
        css: i
          ? { backgroundSize: "contain", backgroundRepeat: "no-repeat", isBackground: !0 }
          : { objectFit: "contain", isBackground: !1 },
        processing: { needsCropping: !1, requiresImageDimensions: !1 },
      };
    case "TILE":
      return {
        css: {
          backgroundRepeat: "repeat",
          backgroundSize: o
            ? `calc(var(--original-width) * ${o}) calc(var(--original-height) * ${o})`
            : "auto",
          isBackground: !0,
        },
        processing: { needsCropping: !1, requiresImageDimensions: !0 },
      };
    case "STRETCH":
      return {
        css: i
          ? { backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", isBackground: !0 }
          : { objectFit: "fill", isBackground: !1 },
        processing: { needsCropping: !1, requiresImageDimensions: !1 },
      };
    default:
      return { css: {}, processing: { needsCropping: !1, requiresImageDimensions: !1 } };
  }
}
function le(e) {
  let o = e.flat().reduce((i, r) => {
    let a = r.toString();
    for (let n = 0; n < a.length; n++) i = ((i << 5) - i + a.charCodeAt(n)) & 4294967295;
    return i;
  }, 0);
  return Math.abs(o).toString(16).substring(0, 6);
}
function ce(e) {
  let t = le(e);
  return {
    needsCropping: !0,
    requiresImageDimensions: !1,
    cropTransform: e,
    filenameSuffix: `${t}`,
  };
}
function H(e, t = !1) {
  let o = { colors: [] };
  return (
    c("strokes", e) &&
      Array.isArray(e.strokes) &&
      e.strokes.length &&
      (o.colors = e.strokes.filter(m).map((i) => R(i, t))),
    c("strokeWeight", e) &&
      typeof e.strokeWeight == "number" &&
      e.strokeWeight > 0 &&
      (o.strokeWeight = `${e.strokeWeight}px`),
    c("strokeDashes", e) &&
      Array.isArray(e.strokeDashes) &&
      e.strokeDashes.length &&
      (o.strokeDashes = e.strokeDashes),
    c("individualStrokeWeights", e, B) && (o.strokeWeight = h(e.individualStrokeWeights)),
    o
  );
}
function R(e, t = !1) {
  if (e.type === "IMAGE") {
    let o = {
        type: "IMAGE",
        imageRef: e.imageRef,
        scaleMode: e.scaleMode,
        scalingFactor: e.scalingFactor,
      },
      i = t || o.scaleMode === "TILE",
      { css: r, processing: a } = ae(o.scaleMode, i, e.scalingFactor),
      n = a;
    if (e.imageTransform) {
      let s = ce(e.imageTransform);
      n = {
        ...a,
        ...s,
        requiresImageDimensions: a.requiresImageDimensions || s.requiresImageDimensions,
      };
    }
    return { ...o, ...r, imageDownloadArguments: n };
  } else if (e.type === "SOLID") {
    let { hex: o, opacity: i } = pe(e.color, e.opacity);
    return i === 1 ? o : u(e.color, i);
  } else {
    if (e.type === "PATTERN") return ue(e);
    if (
      ["GRADIENT_LINEAR", "GRADIENT_RADIAL", "GRADIENT_ANGULAR", "GRADIENT_DIAMOND"].includes(
        e.type,
      )
    )
      return { type: e.type, gradient: Se(e) };
    throw new Error(`Unknown paint type: ${e.type}`);
  }
}
function ue(e) {
  let t = "repeat",
    o = "left";
  switch (e.horizontalAlignment) {
    case "START":
      o = "left";
      break;
    case "CENTER":
      o = "center";
      break;
    case "END":
      o = "right";
      break;
  }
  let i = "top";
  switch (e.verticalAlignment) {
    case "START":
      i = "top";
      break;
    case "CENTER":
      i = "center";
      break;
    case "END":
      i = "bottom";
      break;
  }
  return {
    type: e.type,
    patternSource: { type: "IMAGE-PNG", nodeId: e.sourceNodeId },
    backgroundRepeat: t,
    backgroundSize: `${Math.round(e.scalingFactor * 100)}%`,
    backgroundPosition: `${o} ${i}`,
  };
}
function pe(e, t = 1) {
  let o = Math.round(e.r * 255),
    i = Math.round(e.g * 255),
    r = Math.round(e.b * 255),
    a = Math.round(t * e.a * 100) / 100;
  return {
    hex: "#" + ((1 << 24) + (o << 16) + (i << 8) + r).toString(16).slice(1).toUpperCase(),
    opacity: a,
  };
}
function u(e, t = 1) {
  let o = Math.round(e.r * 255),
    i = Math.round(e.g * 255),
    r = Math.round(e.b * 255),
    a = Math.round(t * e.a * 100) / 100;
  return `rgba(${o}, ${i}, ${r}, ${a})`;
}
function fe(e, t = { width: 1, height: 1 }) {
  let o = e.gradientHandlePositions;
  if (!o || o.length < 2)
    return {
      stops: e.gradientStops
        .map(({ position: s, color: l }) => `${u(l, 1)} ${Math.round(s * 100)}%`)
        .join(", "),
      cssGeometry: "0deg",
    };
  let [i, r, a] = o;
  switch (e.type) {
    case "GRADIENT_LINEAR":
      return me(e.gradientStops, i, r, t);
    case "GRADIENT_RADIAL":
      return ge(e.gradientStops, i, r, a, t);
    case "GRADIENT_ANGULAR":
      return ye(e.gradientStops, i, r, a, t);
    case "GRADIENT_DIAMOND":
      return he(e.gradientStops, i, r, a, t);
    default:
      return {
        stops: e.gradientStops
          .map(({ position: s, color: l }) => `${u(l, 1)} ${Math.round(s * 100)}%`)
          .join(", "),
        cssGeometry: "0deg",
      };
  }
}
function me(e, t, o, i) {
  let r = o.x - t.x,
    a = o.y - t.y;
  if (Math.sqrt(r * r + a * a) === 0)
    return {
      stops: e.map(({ position: d, color: E }) => `${u(E, 1)} ${Math.round(d * 100)}%`).join(", "),
      cssGeometry: "0deg",
    };
  let s = Math.atan2(a, r) * (180 / Math.PI) + 90,
    l = de(t, o);
  if (l.length >= 2) {
    let p = Math.min(l[0], l[1]),
      d = Math.max(l[0], l[1]);
    return {
      stops: e
        .map(({ position: F, color: Y }) => {
          let Z = u(Y, 1),
            J = (F * 1 + 0 - p) / (d - p),
            Q = Math.max(0, Math.min(1, J));
          return `${Z} ${Math.round(Q * 100)}%`;
        })
        .join(", "),
      cssGeometry: `${Math.round(s)}deg`,
    };
  }
  return {
    stops: e.map(({ position: p, color: d }) => `${u(d, 1)} ${Math.round(p * 100)}%`).join(", "),
    cssGeometry: `${Math.round(s)}deg`,
  };
}
function de(e, t) {
  let o = t.x - e.x,
    i = t.y - e.y;
  if (Math.abs(o) < 1e-10 && Math.abs(i) < 1e-10) return [];
  let r = [];
  if (Math.abs(i) > 1e-10) {
    let n = -e.y / i,
      s = e.x + n * o;
    s >= 0 && s <= 1 && r.push(n);
  }
  if (Math.abs(i) > 1e-10) {
    let n = (1 - e.y) / i,
      s = e.x + n * o;
    s >= 0 && s <= 1 && r.push(n);
  }
  if (Math.abs(o) > 1e-10) {
    let n = -e.x / o,
      s = e.y + n * i;
    s >= 0 && s <= 1 && r.push(n);
  }
  if (Math.abs(o) > 1e-10) {
    let n = (1 - e.x) / o,
      s = e.y + n * i;
    s >= 0 && s <= 1 && r.push(n);
  }
  return [...new Set(r.map((n) => Math.round(n * 1e6) / 1e6))].sort((n, s) => n - s);
}
function ge(e, t, o, i, r) {
  let a = Math.round(t.x * 100),
    n = Math.round(t.y * 100);
  return {
    stops: e.map(({ position: l, color: f }) => `${u(f, 1)} ${Math.round(l * 100)}%`).join(", "),
    cssGeometry: `circle at ${a}% ${n}%`,
  };
}
function ye(e, t, o, i, r) {
  let a = Math.round(t.x * 100),
    n = Math.round(t.y * 100),
    s = Math.atan2(o.y - t.y, o.x - t.x) * (180 / Math.PI) + 90;
  return {
    stops: e.map(({ position: f, color: p }) => `${u(p, 1)} ${Math.round(f * 100)}%`).join(", "),
    cssGeometry: `from ${Math.round(s)}deg at ${a}% ${n}%`,
  };
}
function he(e, t, o, i, r) {
  let a = Math.round(t.x * 100),
    n = Math.round(t.y * 100);
  return {
    stops: e.map(({ position: l, color: f }) => `${u(f, 1)} ${Math.round(l * 100)}%`).join(", "),
    cssGeometry: `ellipse at ${a}% ${n}%`,
  };
}
function Se(e) {
  let t = { ...e, gradientStops: [...e.gradientStops].sort((r, a) => r.position - a.position) },
    { stops: o, cssGeometry: i } = fe(t);
  switch (e.type) {
    case "GRADIENT_LINEAR":
      return `linear-gradient(${i}, ${o})`;
    case "GRADIENT_RADIAL":
      return `radial-gradient(${i}, ${o})`;
    case "GRADIENT_ANGULAR":
      return `conic-gradient(${i}, ${o})`;
    case "GRADIENT_DIAMOND":
      return `radial-gradient(${i}, ${o})`;
    default:
      return `linear-gradient(0deg, ${o})`;
  }
}
function j(e) {
  if (!c("effects", e)) return {};
  let t = e.effects.filter((l) => l.visible),
    o = t.filter((l) => l.type === "DROP_SHADOW").map(xe),
    i = t.filter((l) => l.type === "INNER_SHADOW").map(be),
    r = [...o, ...i].join(", "),
    a = t
      .filter((l) => l.type === "LAYER_BLUR")
      .map(_)
      .join(" "),
    n = t
      .filter((l) => l.type === "BACKGROUND_BLUR")
      .map(_)
      .join(" "),
    s = {};
  return (
    r && (e.type === "TEXT" ? (s.textShadow = r) : (s.boxShadow = r)),
    a && (s.filter = a),
    n && (s.backdropFilter = n),
    s
  );
}
function xe(e) {
  return `${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread ?? 0}px ${u(e.color)}`;
}
function be(e) {
  return `inset ${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread ?? 0}px ${u(e.color)}`;
}
function _(e) {
  return `blur(${e.radius}px)`;
}
function W(e) {
  return e.type === "TEXT";
}
function D(e) {
  return c("style", e) && Object.keys(e.style).length > 0;
}
function U(e) {
  if (c("characters", e, k)) return e.characters;
}
function X(e) {
  if (D(e)) {
    let t = e.style;
    return {
      fontFamily: t.fontFamily,
      fontWeight: t.fontWeight,
      fontSize: t.fontSize,
      lineHeight:
        "lineHeightPx" in t && t.lineHeightPx && t.fontSize
          ? `${t.lineHeightPx / t.fontSize}em`
          : void 0,
      letterSpacing:
        t.letterSpacing && t.letterSpacing !== 0 && t.fontSize
          ? `${(t.letterSpacing / t.fontSize) * 100}%`
          : void 0,
      textCase: t.textCase,
      textAlignHorizontal: t.textAlignHorizontal,
      textAlignVertical: t.textAlignVertical,
    };
  }
}
function y(e, t, o) {
  let [i] =
    Object.entries(e.styles).find(([a, n]) => JSON.stringify(n) === JSON.stringify(t)) ?? [];
  if (i) return i;
  let r = G(o);
  return (e.styles[r] = t), r;
}
var b = (e, t, o) => {
    let i = z(e, o.parent);
    Object.keys(i).length > 1 && (t.layout = y(o.globalVars, i, "layout"));
  },
  A = (e, t, o) => {
    if ((W(e) && (t.text = U(e)), D(e))) {
      let i = X(e);
      if (i) {
        let r = x(e, o, ["text", "typography"]);
        r
          ? ((o.globalVars.styles[r] = i), (t.textStyle = r))
          : (t.textStyle = y(o.globalVars, i, "style"));
      }
    }
  },
  C = (e, t, o) => {
    let i = c("children", e) && Array.isArray(e.children) && e.children.length > 0;
    if (c("fills", e) && Array.isArray(e.fills) && e.fills.length) {
      let n = e.fills.map((l) => R(l, i)).reverse(),
        s = x(e, o, ["fill", "fills"]);
      s ? ((o.globalVars.styles[s] = n), (t.fills = s)) : (t.fills = y(o.globalVars, n, "fill"));
    }
    let r = H(e, i);
    if (r.colors.length) {
      let n = x(e, o, ["stroke", "strokes"]);
      n
        ? ((o.globalVars.styles[n] = r.colors),
          (t.strokes = n),
          r.strokeWeight && (t.strokeWeight = r.strokeWeight),
          r.strokeDashes && (t.strokeDashes = r.strokeDashes),
          r.strokeWeights && (t.strokeWeights = r.strokeWeights))
        : (t.strokes = y(o.globalVars, r, "stroke"));
    }
    let a = j(e);
    if (Object.keys(a).length) {
      let n = x(e, o, ["effect", "effects"]);
      n
        ? ((o.globalVars.styles[n] = a), (t.effects = n))
        : (t.effects = y(o.globalVars, a, "effect"));
    }
    c("opacity", e) && typeof e.opacity == "number" && e.opacity !== 1 && (t.opacity = e.opacity),
      c("cornerRadius", e) &&
        typeof e.cornerRadius == "number" &&
        (t.borderRadius = `${e.cornerRadius}px`),
      c("rectangleCornerRadii", e, V) &&
        (t.borderRadius = `${e.rectangleCornerRadii[0]}px ${e.rectangleCornerRadii[1]}px ${e.rectangleCornerRadii[2]}px ${e.rectangleCornerRadii[3]}px`);
  },
  q = (e, t, o) => {
    e.type === "INSTANCE" &&
      (c("componentId", e) && (t.componentId = e.componentId),
      c("componentProperties", e) &&
        (t.componentProperties = Object.entries(e.componentProperties ?? {}).map(
          ([i, { value: r, type: a }]) => ({ name: i, value: r.toString(), type: a }),
        )));
  };
function x(e, t, o) {
  if (!c("styles", e)) return;
  let i = e.styles;
  for (let r of o) {
    let a = i[r];
    if (a) {
      let n = t.globalVars.extraStyles?.[a];
      if (n?.name) return n.name;
    }
  }
}
var Ae = [b, A, C, q],
  Ee = [b, A],
  Te = [A],
  Ne = [C],
  Ie = [b],
  K = new Set(["IMAGE-SVG", "STAR", "LINE", "ELLIPSE", "REGULAR_POLYGON", "RECTANGLE"]);
function Re(e, t, o) {
  let i = o.every((r) => K.has(r.type));
  return (e.type === "FRAME" || e.type === "GROUP" || e.type === "INSTANCE") && i
    ? ((t.type = "IMAGE-SVG"), [])
    : o;
}
export {
  I as a,
  te as b,
  b as c,
  A as d,
  C as e,
  q as f,
  Ae as g,
  Ee as h,
  Te as i,
  Ne as j,
  Ie as k,
  Re as l,
};
