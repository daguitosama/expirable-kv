import { Database } from "better-sqlite3";
import { ExpirableKV } from "./index";

// Extend the globalThis type
declare global {
    var kv: Database;
}
globalThis.kv = ExpirableKV.init("test-dev.db");
