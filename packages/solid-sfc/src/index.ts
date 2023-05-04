import { compileComponent } from "./compiler";
import { parse } from "./parser";
import { createSfcId, parseRequest, virtualStyleModuleId } from "./utils";
import { Plugin } from "vite";

export * from "./runtime";

type Config = {};

export default function vitePlugin(config?: Config): Plugin {
    const vfsStyles = new Map<string, string>();
    const vfs = new Map<string, string>();
    return {
        name: "solid-sfc",
        enforce: "pre",
        resolveId(id, importer, options) {
            // resolveId just says: "hey yes i can give you this module, if you ask for this specific name"
            const parsedId = parseRequest(id);
            if (vfsStyles.has(id)) {
                return id;
            } else if (parsedId.query.solidSfc != null) {
                return id;
            }
        },
        transform(code, id) {
            const parsedId = parseRequest(id);
            if (!id.endsWith(".solid") || parsedId.query.solidSfc != null) return null;

            // console.log("ParsedID:", parsedId);

            const parsed = parse(code);
            if (!parsed) return null;

            const compiled = compileComponent(parsed, id);

            if (parsed.style) {
                vfsStyles.set(virtualStyleModuleId(id), parsed.style);
            }

            const vfsId = createSfcId(id);
            vfs.set(vfsId, compiled);

            return {
                code: `import _Component from "${vfsId}";
                export default _Component;`,
            };
        },
        load(id) {
            // load says: "heres the content of this module"
            if (vfsStyles.has(id)) {
                return vfsStyles.get(id);
            } else if (vfs.has(id)) {
                return vfs.get(id);
            }
            return null;
        },
    };
}
