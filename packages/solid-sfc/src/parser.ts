function extractScript(code: string) {
    const matched = code.match(/<script +lang *= *"ts">(.*)<\/script>/s);
    if (!matched) return null;
    return matched[1];
}

function extractTemplate(code: string) {
    const matched = code.match(/<template +lang *= *"tsx">(.*)<\/template>/s);
    if (!matched) return null;
    return matched[1];
}

function extractStyle(code: string) {
    const matched = code.match(/<style>(.*)<\/style>/s);
    if (!matched) return null;
    return matched[1];
}

function extractPropsType(code: string) {
    const matched = code.match(/((const|let|var) (\w+) *= *)?defineProps<(.*)>\(\);?/s);
    if (!matched) return null;
    return {
        propsVarName: matched[3],
        propsType: matched[4],
        full: matched[0],
    };
}

export function parse(code: string) {
    const script = extractScript(code);
    const template = extractTemplate(code);
    const style = extractStyle(code);
    const propsType = extractPropsType(code);
    if (!script || !template) return null;

    return { script, template, style, propsType };
}
