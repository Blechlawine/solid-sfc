import sfc from "solid-sfc";
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
    plugins: [sfc(), solid({
        extensions: [".solid"],
    }), inspect()],
});
