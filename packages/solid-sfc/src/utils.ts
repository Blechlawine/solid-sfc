import { basename } from "pathe";

export const virtualStyleModuleId = (id: string) => `virtual:${basename(id)}-styles.css`;

export function parseRequest(id: string) {
    const [filename, rawQuery] = id.split("?", 2);
    const query = Object.fromEntries(new URLSearchParams(rawQuery).entries());
    return { filename, query };
}

export function createSfcId(id: string) {
    const params = new URLSearchParams({
        solidSfc: "",
        type: "tsx",
    });
    return `virtual:${basename(id, ".solid")}.tsx?${params.toString()}`;
}
