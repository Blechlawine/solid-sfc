import { basename } from "pathe";

export const virtualStyleModuleId = (id: string) => `virtual:${basename(id)}-styles.css`;
