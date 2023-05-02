import { findStaticImports } from "mlly";
import { basename } from "pathe";

export function compileComponent(script: string, template: string, id: string) {
    const imports = findStaticImports(script);
    const componentName = basename(id).replace(".solid", "");

    const scriptPartWithoutImports = script.substring(Math.max(...imports.map((i) => i.end)));

    const compiledCode = `
    ${imports.map((i) => i.code).join("\n")}
    function ${componentName}() {
        ${scriptPartWithoutImports}
        return (
            ${template}
        );\
    }
    export default ${componentName};
    `;
    return compiledCode;
}
