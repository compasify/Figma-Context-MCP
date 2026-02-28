import { b as M, g as _, l as C } from "./chunk-GSVCRUP4.js";
import { a as l, b as O } from "./chunk-Q77VG2BX.js";
import { McpServer as ae } from "@modelcontextprotocol/sdk/server/mcp.js";
import N from "path";
import B from "fs";
import L from "sharp";
async function J(s, o) {
  let { Logger: e } = await import("./logger-RNG6OBLU.js");
  try {
    let r = o[0]?.[0] ?? 1,
      a = o[0]?.[2] ?? 0,
      t = o[1]?.[1] ?? 1,
      i = o[1]?.[2] ?? 0,
      n = L(s),
      g = await n.metadata();
    if (!g.width || !g.height) throw new Error(`Could not get image dimensions for ${s}`);
    let { width: d, height: c } = g,
      v = Math.max(0, Math.round(a * d)),
      p = Math.max(0, Math.round(i * c)),
      f = Math.min(d - v, Math.round(r * d)),
      m = Math.min(c - p, Math.round(t * c));
    if (f <= 0 || m <= 0) return e.log(`Invalid crop dimensions for ${s}, using original image`), s;
    let u = s + ".tmp";
    return (
      await n.extract({ left: v, top: p, width: f, height: m }).toFile(u),
      B.renameSync(u, s),
      e.log(`Cropped image saved (overwritten): ${s}`),
      e.log(`Crop region: ${v}, ${p}, ${f}x${m} from ${d}x${c}`),
      s
    );
  } catch (r) {
    return e.error(`Error cropping image ${s}:`, r), s;
  }
}
async function G(s) {
  let { Logger: o } = await import("./logger-RNG6OBLU.js");
  try {
    let e = await L(s).metadata();
    if (!e.width || !e.height) throw new Error(`Could not get image dimensions for ${s}`);
    return { width: e.width, height: e.height };
  } catch (e) {
    return o.error(`Error getting image dimensions for ${s}:`, e), { width: 1e3, height: 1e3 };
  }
}
async function x(s, o, e, r = !1, a, t = !1) {
  let { Logger: i } = await import("./logger-RNG6OBLU.js"),
    n = [],
    { downloadFigmaImage: g } = await import("./common-D7KV4EZS.js"),
    d = await g(s, o, e);
  i.log(`Downloaded original image: ${d}`);
  let c = await G(d);
  i.log(`Original dimensions: ${c.width}x${c.height}`);
  let v = d,
    p = !1,
    f;
  if (r && a) {
    i.log("Applying crop transform...");
    let h = a[0]?.[0] ?? 1,
      w = a[1]?.[1] ?? 1,
      y = a[0]?.[2] ?? 0,
      I = a[1]?.[2] ?? 0,
      S = Math.max(0, Math.round(y * c.width)),
      F = Math.max(0, Math.round(I * c.height)),
      $ = Math.min(c.width - S, Math.round(h * c.width)),
      E = Math.min(c.height - F, Math.round(w * c.height));
    $ > 0 && E > 0
      ? ((f = { left: S, top: F, width: $, height: E }),
        (v = await J(d, a)),
        (p = !0),
        i.log(`Cropped to region: ${S}, ${F}, ${$}x${E}`))
      : i.log("Invalid crop dimensions, keeping original image");
  }
  let m = await G(v);
  i.log(`Final dimensions: ${m.width}x${m.height}`);
  let u;
  return (
    t && (u = X(m)),
    {
      filePath: v,
      originalDimensions: c,
      finalDimensions: m,
      wasCropped: p,
      cropRegion: f,
      cssVariables: u,
      processingLog: n,
    }
  );
}
function X({ width: s, height: o }) {
  return `--original-width: ${s}px; --original-height: ${o}px;`;
}
import { execFile as Z } from "child_process";
import { promisify as Q } from "util";
var ee = Q(Z);
async function H(s, o = {}) {
  try {
    let e = await fetch(s, o);
    if (!e.ok) throw new Error(`Fetch failed with status ${e.status}: ${e.statusText}`);
    return await e.json();
  } catch (e) {
    let r = e instanceof Error ? e.message : String(e);
    l.log(
      `[fetchWithRetry] Initial fetch failed for ${s}: ${r}. Likely a corporate proxy or SSL issue. Attempting curl fallback.`,
    );
    let t = ["-s", "-S", "--fail-with-body", "-L", ...oe(o.headers), s];
    try {
      l.log(`[fetchWithRetry] Executing curl with args: ${JSON.stringify(t)}`);
      let { stdout: i, stderr: n } = await ee("curl", t);
      if (n) {
        if (!i || n.toLowerCase().includes("error") || n.toLowerCase().includes("fail"))
          throw new Error(`Curl command failed with stderr: ${n}`);
        l.log(
          `[fetchWithRetry] Curl command for ${s} produced stderr (but might be informational): ${n}`,
        );
      }
      if (!i) throw new Error("Curl command returned empty stdout.");
      let g = JSON.parse(i);
      if (g.status && g.status !== 200) throw new Error(`Curl command failed: ${g}`);
      return g;
    } catch (i) {
      let n = i instanceof Error ? i.message : String(i);
      throw (l.error(`[fetchWithRetry] Curl fallback also failed for ${s}: ${n}`), e);
    }
  }
}
function oe(s) {
  if (!s) return [];
  let o = [];
  for (let [e, r] of Object.entries(s)) o.push("-H", `${e}: ${r}`);
  return o;
}
var k = class {
  apiKey;
  oauthToken;
  useOAuth;
  baseUrl = "https://api.figma.com/v1";
  constructor({ figmaApiKey: o, figmaOAuthToken: e, useOAuth: r }) {
    (this.apiKey = o || ""),
      (this.oauthToken = e || ""),
      (this.useOAuth = !!r && !!this.oauthToken);
  }
  getAuthHeaders() {
    return this.useOAuth
      ? (l.log("Using OAuth Bearer token for authentication"),
        { Authorization: `Bearer ${this.oauthToken}` })
      : (l.log("Using Personal Access Token for authentication"), { "X-Figma-Token": this.apiKey });
  }
  filterValidImages(o) {
    return o ? Object.fromEntries(Object.entries(o).filter(([, e]) => !!e)) : {};
  }
  async request(o) {
    try {
      l.log(`Calling ${this.baseUrl}${o}`);
      let e = this.getAuthHeaders();
      return await H(`${this.baseUrl}${o}`, { headers: e });
    } catch (e) {
      let r = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to make request to Figma API endpoint '${o}': ${r}`);
    }
  }
  buildSvgQueryParams(o, e) {
    return new URLSearchParams({
      ids: o.join(","),
      format: "svg",
      svg_outline_text: String(e.outlineText),
      svg_include_id: String(e.includeId),
      svg_simplify_stroke: String(e.simplifyStroke),
    }).toString();
  }
  async getImageFillUrls(o) {
    let e = `/files/${o}/images`;
    return (await this.request(e)).meta.images || {};
  }
  async getNodeRenderUrls(o, e, r, a = {}) {
    if (e.length === 0) return {};
    if (r === "png") {
      let t = a.pngScale || 2,
        i = `/images/${o}?ids=${e.join(",")}&format=png&scale=${t}`,
        n = await this.request(i);
      return this.filterValidImages(n.images);
    } else {
      let t = a.svgOptions || { outlineText: !0, includeId: !1, simplifyStroke: !0 },
        i = this.buildSvgQueryParams(e, t),
        n = `/images/${o}?${i}`,
        g = await this.request(n);
      return this.filterValidImages(g.images);
    }
  }
  async downloadImages(o, e, r, a = {}) {
    if (r.length === 0) return [];
    let t = N.normalize(e).replace(/^(\.\.(\/|\\|$))+/, ""),
      i = N.resolve(t);
    if (!i.startsWith(N.resolve(process.cwd())))
      throw new Error("Invalid path specified. Directory traversal is not allowed.");
    let { pngScale: n = 2, svgOptions: g } = a,
      d = [],
      c = r.filter((f) => !!f.imageRef),
      v = r.filter((f) => !!f.nodeId);
    if (c.length > 0) {
      let f = await this.getImageFillUrls(o),
        m = c
          .map(
            ({
              imageRef: u,
              fileName: h,
              needsCropping: w,
              cropTransform: y,
              requiresImageDimensions: I,
            }) => {
              let S = f[u];
              return S ? x(h, i, S, w, y, I) : null;
            },
          )
          .filter((u) => u !== null);
      m.length > 0 && d.push(Promise.all(m));
    }
    if (v.length > 0) {
      let f = v.filter((u) => !u.fileName.toLowerCase().endsWith(".svg")),
        m = v.filter((u) => u.fileName.toLowerCase().endsWith(".svg"));
      if (f.length > 0) {
        let u = await this.getNodeRenderUrls(
            o,
            f.map((w) => w.nodeId),
            "png",
            { pngScale: n },
          ),
          h = f
            .map(
              ({
                nodeId: w,
                fileName: y,
                needsCropping: I,
                cropTransform: S,
                requiresImageDimensions: F,
              }) => {
                let $ = u[w];
                return $ ? x(y, i, $, I, S, F) : null;
              },
            )
            .filter((w) => w !== null);
        h.length > 0 && d.push(Promise.all(h));
      }
      if (m.length > 0) {
        let u = await this.getNodeRenderUrls(
            o,
            m.map((w) => w.nodeId),
            "svg",
            { svgOptions: g },
          ),
          h = m
            .map(
              ({
                nodeId: w,
                fileName: y,
                needsCropping: I,
                cropTransform: S,
                requiresImageDimensions: F,
              }) => {
                let $ = u[w];
                return $ ? x(y, i, $, I, S, F) : null;
              },
            )
            .filter((w) => w !== null);
        h.length > 0 && d.push(Promise.all(h));
      }
    }
    return (await Promise.all(d)).flat();
  }
  async getRawFile(o, e) {
    let r = `/files/${o}${e ? `?depth=${e}` : ""}`;
    l.log(`Retrieving raw Figma file: ${o} (depth: ${e ?? "default"})`);
    let a = await this.request(r);
    return O("figma-raw.json", a), a;
  }
  async getRawNode(o, e, r) {
    let a = `/files/${o}/nodes?ids=${e}${r ? `&depth=${r}` : ""}`;
    l.log(`Retrieving raw Figma node: ${e} from ${o} (depth: ${r ?? "default"})`);
    let t = await this.request(a);
    return O("figma-raw.json", t), t;
  }
};
import { z as D } from "zod";
import te from "js-yaml";
var K = {
    fileKey: D.string()
      .regex(/^[a-zA-Z0-9]+$/, "File key must be alphanumeric")
      .describe(
        "The key of the Figma file to fetch, often found in a provided URL like figma.com/(file|design)/<fileKey>/...",
      ),
    nodeId: D.string()
      .regex(
        /^I?\d+[:|-]\d+(?:;\d+[:|-]\d+)*$/,
        "Node ID must be like '1234:5678' or 'I5666:180910;1:10515;1:10336'",
      )
      .optional()
      .describe(
        "The ID of the node to fetch, often found as URL parameter node-id=<nodeId>, always use if provided. Use format '1234:5678' or 'I5666:180910;1:10515;1:10336' for multiple nodes.",
      ),
    depth: D.number()
      .optional()
      .describe(
        "OPTIONAL. Do NOT use unless explicitly requested by the user. Controls how many levels deep to traverse the node tree.",
      ),
  },
  se = D.object(K);
async function re(s, o, e) {
  try {
    let { fileKey: r, nodeId: a, depth: t } = se.parse(s),
      i = a?.replace(/-/g, ":");
    l.log(
      `Fetching ${t ? `${t} layers deep` : "all layers"} of ${i ? `node ${i} from file` : "full file"} ${r}`,
    );
    let n;
    i ? (n = await o.getRawNode(r, i, t)) : (n = await o.getRawFile(r, t));
    let g = M(n, _, { maxDepth: t, afterChildren: C });
    O("figma-simplified.json", g),
      l.log(
        `Successfully extracted data: ${g.nodes.length} nodes, ${Object.keys(g.globalVars.styles).length} styles`,
      );
    let { nodes: d, globalVars: c, ...v } = g,
      p = { metadata: v, nodes: d, globalVars: c };
    l.log(`Generating ${e.toUpperCase()} result from extracted data`);
    let f = e === "json" ? JSON.stringify(p, null, 2) : te.dump(p);
    return l.log("Sending result to client"), { content: [{ type: "text", text: f }] };
  } catch (r) {
    let a = r instanceof Error ? r.message : JSON.stringify(r);
    return (
      l.error(`Error fetching file ${s.fileKey}:`, a),
      { isError: !0, content: [{ type: "text", text: `Error fetching file: ${a}` }] }
    );
  }
}
var A = {
  name: "get_figma_data",
  description:
    "Get comprehensive Figma file data including layout, content, visuals, and component information",
  parameters: K,
  handler: re,
};
import { z as b } from "zod";
var j = {
    fileKey: b
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "File key must be alphanumeric")
      .describe("The key of the Figma file containing the images"),
    nodes: b
      .object({
        nodeId: b
          .string()
          .regex(
            /^I?\d+[:|-]\d+(?:;\d+[:|-]\d+)*$/,
            "Node ID must be like '1234:5678' or 'I5666:180910;1:10515;1:10336'",
          )
          .describe("The ID of the Figma image node to fetch, formatted as 1234:5678"),
        imageRef: b
          .string()
          .optional()
          .describe(
            "If a node has an imageRef fill, you must include this variable. Leave blank when downloading Vector SVG images.",
          ),
        fileName: b
          .string()
          .regex(
            /^[a-zA-Z0-9_.-]+\.(png|svg)$/,
            "File names must contain only letters, numbers, underscores, dots, or hyphens, and end with .png or .svg.",
          )
          .describe(
            "The local name for saving the fetched file, including extension. Either png or svg.",
          ),
        needsCropping: b
          .boolean()
          .optional()
          .describe("Whether this image needs cropping based on its transform matrix"),
        cropTransform: b
          .array(b.array(b.number()))
          .optional()
          .describe("Figma transform matrix for image cropping"),
        requiresImageDimensions: b
          .boolean()
          .optional()
          .describe("Whether this image requires dimension information for CSS variables"),
        filenameSuffix: b
          .string()
          .optional()
          .describe(
            "Suffix to add to filename for unique cropped images, provided in the Figma data (e.g., 'abc123')",
          ),
      })
      .array()
      .describe("The nodes to fetch as images"),
    pngScale: b
      .number()
      .positive()
      .optional()
      .default(2)
      .describe(
        "Export scale for PNG images. Optional, defaults to 2 if not specified. Affects PNG images only.",
      ),
    localPath: b
      .string()
      .describe(
        "The absolute path to the directory where images are stored in the project. If the directory does not exist, it will be created. The format of this path should respect the directory format of the operating system you are running on. Don't use any special character escaping in the path name either.",
      ),
  },
  ne = b.object(j);
async function ie(s, o) {
  try {
    let { fileKey: e, nodes: r, localPath: a, pngScale: t = 2 } = ne.parse(s),
      i = [],
      n = new Map(),
      g = new Map();
    for (let p of r) {
      let { nodeId: f, ...m } = p,
        u = f?.replace(/-/g, ":"),
        h = m.fileName;
      if (m.filenameSuffix && !h.includes(m.filenameSuffix)) {
        let y = h.split(".").pop();
        h = `${h.substring(0, h.lastIndexOf("."))}-${m.filenameSuffix}.${y}`;
      }
      let w = {
        fileName: h,
        needsCropping: m.needsCropping || !1,
        cropTransform: m.cropTransform,
        requiresImageDimensions: m.requiresImageDimensions || !1,
      };
      if (m.imageRef) {
        let y = `${m.imageRef}-${m.filenameSuffix || "none"}`;
        if (!m.filenameSuffix && g.has(y)) {
          let I = g.get(y),
            S = n.get(I);
          S.includes(h) || S.push(h),
            w.requiresImageDimensions && (i[I].requiresImageDimensions = !0);
        } else {
          let I = i.length;
          i.push({ ...w, imageRef: m.imageRef }), n.set(I, [h]), g.set(y, I);
        }
      } else {
        let y = i.length;
        i.push({ ...w, nodeId: u }), n.set(y, [h]);
      }
    }
    let d = await o.downloadImages(e, a, i, { pngScale: t }),
      c = d.filter(Boolean).length,
      v = d.map((p, f) => {
        let m = p.filePath.split("/").pop() || p.filePath,
          u = `${p.finalDimensions.width}x${p.finalDimensions.height}`,
          h = p.wasCropped ? " (cropped)" : "",
          w = p.cssVariables ? `${u} | ${p.cssVariables}` : u,
          y = n.get(f) || [m],
          I = y.length > 1 ? ` (also requested as: ${y.filter((S) => S !== m).join(", ")})` : "";
        return `- ${m}: ${w}${h}${I}`;
      }).join(`
`);
    return {
      content: [
        {
          type: "text",
          text: `Downloaded ${c} images:
${v}`,
        },
      ],
    };
  } catch (e) {
    return (
      l.error(`Error downloading images from ${s.fileKey}:`, e),
      {
        isError: !0,
        content: [
          {
            type: "text",
            text: `Failed to download images: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
      }
    );
  }
}
var R = {
  name: "download_figma_images",
  description:
    "Download SVG and PNG images used in a Figma file based on the IDs of image or icon nodes",
  parameters: j,
  handler: ie,
};
var le = { name: "Figma MCP Server", version: "0.6.4" };
function q(s, { isHTTP: o = !1, outputFormat: e = "yaml", skipImageDownloads: r = !1 } = {}) {
  let a = new ae(le),
    t = new k(s);
  return ge(a, t, { outputFormat: e, skipImageDownloads: r }), (l.isHTTP = o), a;
}
function ge(s, o, e) {
  s.tool(A.name, A.description, A.parameters, (r) => A.handler(r, o, e.outputFormat)),
    e.skipImageDownloads || s.tool(R.name, R.description, R.parameters, (r) => R.handler(r, o));
}
import { config as me } from "dotenv";
import ce from "yargs";
import { hideBin as de } from "yargs/helpers";
import { resolve as U } from "path";
function V(s) {
  return !s || s.length <= 4 ? "****" : `****${s.slice(-4)}`;
}
function W(s) {
  let o = ce(de(process.argv))
      .options({
        "figma-api-key": { type: "string", description: "Figma API key (Personal Access Token)" },
        "figma-oauth-token": { type: "string", description: "Figma OAuth Bearer token" },
        env: {
          type: "string",
          description: "Path to custom .env file to load environment variables from",
        },
        port: { type: "number", description: "Port to run the server on" },
        host: { type: "string", description: "Host to run the server on" },
        json: {
          type: "boolean",
          description: "Output data from tools in JSON format instead of YAML",
          default: !1,
        },
        "skip-image-downloads": {
          type: "boolean",
          description: "Do not register the download_figma_images tool (skip image downloads)",
          default: !1,
        },
      })
      .help()
      .version("0.6.4")
      .parseSync(),
    e,
    r;
  o.env ? ((e = U(o.env)), (r = "cli")) : ((e = U(process.cwd(), ".env")), (r = "default")),
    me({ path: e, override: !0 });
  let a = { figmaApiKey: "", figmaOAuthToken: "", useOAuth: !1 },
    t = {
      port: 3333,
      host: "127.0.0.1",
      outputFormat: "yaml",
      skipImageDownloads: !1,
      configSources: {
        figmaApiKey: "env",
        figmaOAuthToken: "none",
        port: "default",
        host: "default",
        outputFormat: "default",
        envFile: r,
        skipImageDownloads: "default",
      },
    };
  return (
    o["figma-api-key"]
      ? ((a.figmaApiKey = o["figma-api-key"]), (t.configSources.figmaApiKey = "cli"))
      : process.env.FIGMA_API_KEY &&
        ((a.figmaApiKey = process.env.FIGMA_API_KEY), (t.configSources.figmaApiKey = "env")),
    o["figma-oauth-token"]
      ? ((a.figmaOAuthToken = o["figma-oauth-token"]),
        (t.configSources.figmaOAuthToken = "cli"),
        (a.useOAuth = !0))
      : process.env.FIGMA_OAUTH_TOKEN &&
        ((a.figmaOAuthToken = process.env.FIGMA_OAUTH_TOKEN),
        (t.configSources.figmaOAuthToken = "env"),
        (a.useOAuth = !0)),
    o.port
      ? ((t.port = o.port), (t.configSources.port = "cli"))
      : process.env.FRAMELINK_PORT
        ? ((t.port = parseInt(process.env.FRAMELINK_PORT, 10)), (t.configSources.port = "env"))
        : process.env.PORT &&
          ((t.port = parseInt(process.env.PORT, 10)), (t.configSources.port = "env")),
    o.host
      ? ((t.host = o.host), (t.configSources.host = "cli"))
      : process.env.FRAMELINK_HOST &&
        ((t.host = process.env.FRAMELINK_HOST), (t.configSources.host = "env")),
    o.json
      ? ((t.outputFormat = "json"), (t.configSources.outputFormat = "cli"))
      : process.env.OUTPUT_FORMAT &&
        ((t.outputFormat = process.env.OUTPUT_FORMAT), (t.configSources.outputFormat = "env")),
    o["skip-image-downloads"]
      ? ((t.skipImageDownloads = !0), (t.configSources.skipImageDownloads = "cli"))
      : process.env.SKIP_IMAGE_DOWNLOADS === "true" &&
        ((t.skipImageDownloads = !0), (t.configSources.skipImageDownloads = "env")),
    !a.figmaApiKey &&
      !a.figmaOAuthToken &&
      (console.error(
        "Either FIGMA_API_KEY or FIGMA_OAUTH_TOKEN is required (via CLI argument or .env file)",
      ),
      process.exit(1)),
    s ||
      (console.log(`
Configuration:`),
      console.log(`- ENV_FILE: ${e} (source: ${t.configSources.envFile})`),
      a.useOAuth
        ? (console.log(
            `- FIGMA_OAUTH_TOKEN: ${V(a.figmaOAuthToken)} (source: ${t.configSources.figmaOAuthToken})`,
          ),
          console.log("- Authentication Method: OAuth Bearer Token"))
        : (console.log(
            `- FIGMA_API_KEY: ${V(a.figmaApiKey)} (source: ${t.configSources.figmaApiKey})`,
          ),
          console.log("- Authentication Method: Personal Access Token (X-Figma-Token)")),
      console.log(`- FRAMELINK_PORT: ${t.port} (source: ${t.configSources.port})`),
      console.log(`- FRAMELINK_HOST: ${t.host} (source: ${t.configSources.host})`),
      console.log(`- OUTPUT_FORMAT: ${t.outputFormat} (source: ${t.configSources.outputFormat})`),
      console.log(
        `- SKIP_IMAGE_DOWNLOADS: ${t.skipImageDownloads} (source: ${t.configSources.skipImageDownloads})`,
      ),
      console.log()),
    { ...t, auth: a }
  );
}
import { randomUUID as pe } from "node:crypto";
import z from "express";
import { SSEServerTransport as fe } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport as ue } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest as he } from "@modelcontextprotocol/sdk/types.js";
import "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport as we } from "@modelcontextprotocol/sdk/server/stdio.js";
var P = null,
  T = { streamable: {}, sse: {} };
async function uo() {
  let s = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio"),
    o = W(s),
    e = q(o.auth, {
      isHTTP: !s,
      outputFormat: o.outputFormat,
      skipImageDownloads: o.skipImageDownloads,
    });
  if (s) {
    let r = new we();
    await e.connect(r);
  } else
    console.log(`Initializing Figma MCP Server in HTTP mode on ${o.host}:${o.port}...`),
      await ve(o.host, o.port, e),
      process.on("SIGINT", async () => {
        l.log("Shutting down server..."),
          await ye(),
          l.log("Server shutdown complete"),
          process.exit(0);
      });
}
async function ve(s, o, e) {
  if (P) throw new Error("HTTP server is already running");
  let r = z();
  r.use("/mcp", z.json()),
    r.post("/mcp", async (t, i) => {
      l.log("Received StreamableHTTP request");
      let n = t.headers["mcp-session-id"],
        g;
      if (n && T.streamable[n])
        l.log("Reusing existing StreamableHTTP transport for sessionId", n), (g = T.streamable[n]);
      else if (!n && he(t.body))
        l.log("New initialization request for StreamableHTTP sessionId", n),
          (g = new ue({
            sessionIdGenerator: () => pe(),
            onsessioninitialized: (p) => {
              T.streamable[p] = g;
            },
          })),
          (g.onclose = () => {
            g.sessionId && delete T.streamable[g.sessionId];
          }),
          await e.connect(g);
      else {
        l.log("Invalid request:", t.body),
          i
            .status(400)
            .json({
              jsonrpc: "2.0",
              error: { code: -32e3, message: "Bad Request: No valid session ID provided" },
              id: null,
            });
        return;
      }
      let d = null,
        c = t.body.params?._meta?.progressToken,
        v = 0;
      c &&
        (l.log(`Setting up progress notifications for token ${c} on session ${n}`),
        (d = setInterval(async () => {
          l.log("Sending progress notification", v),
            await e.server.notification({
              method: "notifications/progress",
              params: { progress: v, progressToken: c },
            }),
            v++;
        }, 1e3))),
        l.log("Handling StreamableHTTP request"),
        await g.handleRequest(t, i, t.body),
        d && clearInterval(d),
        l.log("StreamableHTTP request handled");
    });
  let a = async (t, i) => {
    let n = t.headers["mcp-session-id"];
    if (!n || !T.streamable[n]) {
      i.status(400).send("Invalid or missing session ID");
      return;
    }
    console.log(`Received session termination request for session ${n}`);
    try {
      await T.streamable[n].handleRequest(t, i);
    } catch (g) {
      console.error("Error handling session termination:", g),
        i.headersSent || i.status(500).send("Error processing session termination");
    }
  };
  return (
    r.get("/mcp", a),
    r.delete("/mcp", a),
    r.get("/sse", async (t, i) => {
      l.log("Establishing new SSE connection");
      let n = new fe("/messages", i);
      l.log(`New SSE connection established for sessionId ${n.sessionId}`),
        l.log("/sse request headers:", t.headers),
        l.log("/sse request body:", t.body),
        (T.sse[n.sessionId] = n),
        i.on("close", () => {
          delete T.sse[n.sessionId];
        }),
        await e.connect(n);
    }),
    r.post("/messages", async (t, i) => {
      let n = t.query.sessionId,
        g = T.sse[n];
      if (g)
        l.log(`Received SSE message for sessionId ${n}`),
          l.log("/messages request headers:", t.headers),
          l.log("/messages request body:", t.body),
          await g.handlePostMessage(t, i);
      else {
        i.status(400).send(`No transport found for sessionId ${n}`);
        return;
      }
    }),
    new Promise((t, i) => {
      let n = r.listen(o, s, () => {
        l.log(`HTTP server listening on port ${o}`),
          l.log(`SSE endpoint available at http://${s}:${o}/sse`),
          l.log(`Message endpoint available at http://${s}:${o}/messages`),
          l.log(`StreamableHTTP endpoint available at http://${s}:${o}/mcp`),
          t(n);
      });
      n.once("error", (g) => {
        (P = null), i(g);
      }),
        (P = n);
    })
  );
}
async function Y(s) {
  for (let o in s)
    try {
      await s[o]?.close(), delete s[o];
    } catch (e) {
      console.error(`Error closing transport for session ${o}:`, e);
    }
}
async function ye() {
  if (!P) throw new Error("HTTP server is not running");
  return (
    await Y(T.sse),
    await Y(T.streamable),
    new Promise((s, o) => {
      P.close((e) => {
        (P = null), e ? o(e) : s();
      });
    })
  );
}
export { q as a, W as b, uo as c, ve as d, ye as e };
