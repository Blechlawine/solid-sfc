import { findStaticImports } from "mlly";
import { basename } from "pathe";
import { Plugin } from "vite";

type Config = {};

export default function vitePlugin(config?: Config): Plugin {
    return {
        name: "solid-sfc",
        enforce: "pre",
        transform(code, id) {
            if (id.endsWith(".solid")) {
                const scriptPart = code.match(/<script +lang *= *"ts">(.*)<\/script>/s);
                const templatePart = code.match(/<template>(.*)<\/template>/s);
                if (!scriptPart || !templatePart) return null;

                console.log("SCRIPT:", scriptPart[1]);
                console.log("TEMPLATE:", templatePart[1]);
                const imports = findStaticImports(scriptPart[1]);

                const componentName = basename(id).replace(".solid", "");

                const scriptPartWithoutImports = scriptPart[1].substring(
                    Math.max(...imports.map((i) => i.end)),
                );

                const compiledCode = `
                ${imports.map((i) => i.code).join("\n")}
                function ${componentName}() {
                    ${scriptPartWithoutImports}
                    return (
                        ${templatePart[1]}
                    );
                }
                export default ${componentName};
                `;
                return {
                    code: compiledCode,
                };
            }
        },
    };
}
