import { parse } from "./parser";
import { virtualStyleModuleId } from "./utils";
import { findStaticImports } from "mlly";
import { basename } from "pathe";

export function compileComponent(
    parsed: NonNullable<ReturnType<typeof parse>>,
    id: string,
) {
    const { script, template, style, propsType } = parsed;
    const imports = findStaticImports(script);
    const componentName = basename(id).replace(".solid", "");

    let scriptPart = script.substring(Math.max(...imports.map((i) => i.end)));
    scriptPart = scriptPart.replace(propsType?.full ?? "", "");

    const propsVarName = propsType?.propsVarName ?? "";

    const compiledCode = `
    ${imports.map((i) => i.code).join("\n")}
    import type { Component } from "solid-js";
    ${style ? `import "${virtualStyleModuleId(id)}";` : ""}
    const ${componentName}: Component<${propsType?.propsType}> = (${propsVarName}) => {
        ${scriptPart}
        return (
            ${template}
        );
    };
    export default ${componentName};
    `;
    return compiledCode;
}
