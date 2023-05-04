import path from "node:path";
import sfc from "solid-sfc";
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
    plugins: [sfc(), solid(), inspect()],
    resolve: {
        alias: {
            "solid-sfc": path.resolve(__dirname, "../../packages/solid-sfc/src"),
        },
    },
});
