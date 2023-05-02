import { compileComponent } from "./compiler";
import { parse } from "./parser";
import { Plugin } from "vite";

type Config = {};

export default function vitePlugin(config?: Config): Plugin {
    return {
        name: "solid-sfc",
        enforce: "pre",
        transform(code, id) {
            if (id.endsWith(".solid")) {
                const parsed = parse(code);
                if (!parsed) return null;
                const { script, template } = parsed;

                console.log("SCRIPT:", script);
                console.log("TEMPLATE:", template);

                const compiled = compileComponent(script, template, id);

                return {
                    code: compiled,
                };
            }
        },
    };
}
