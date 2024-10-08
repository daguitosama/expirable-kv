import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        silent: false,
        onConsoleLog(log: string, type: "stdout" | "stderr"): false | void {
            console.log(log);
            if (log === "message from third party library" && type === "stdout") {
                return false;
            }
        },
    },
});
