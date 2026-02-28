#!/usr/bin/env node
import { c as r } from "./chunk-ZZWKYF7W.js";
import "./chunk-GSVCRUP4.js";
import "./chunk-Q77VG2BX.js";
import "./chunk-HDFA5JOA.js";
import { config as o } from "dotenv";
import { resolve as t } from "path";
o({ path: t(process.cwd(), ".env") });
r().catch((e) => {
  console.error("Failed to start server:", e), process.exit(1);
});
