import { compileComponent } from "./compiler";
import { parse } from "./parser";
import { virtualStyleModuleId } from "./utils";
import { Plugin } from "vite";

type Config = {};

export default function vitePlugin(config?: Config): Plugin {
    const vfs = new Map<string, string>();

    return {
        name: "solid-sfc",
        enforce: "pre",
        resolveId(id, importer, options) {
            if (vfs.has(id)) {
                return id;
            }
        },
        transform(code, id) {
            if (id.endsWith(".solid")) {
                const parsed = parse(code);
                if (!parsed) return null;
                const { script, template, style } = parsed;

                console.log("SCRIPT:", script);
                console.log("TEMPLATE:", template);
                console.log("STYLE:", style);

                const compiled = compileComponent(script, template, style, id);

                if (style) {
                    vfs.set(virtualStyleModuleId(id), style);
                }

                return {
                    code: compiled,
                };
            }
        },
        load(id) {
            if (vfs.has(id)) {
                return vfs.get(id);
            }
            return null;
        },
    };
}
