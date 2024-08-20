
export interface ReplacerConfig {
    stringReplacer: (str: string, lang: "html" | "js") => string;
    templateReplacer: (str: string, lang: "html" | "js") => string;
    attrReplacer: (attrName: string, str: string, replaceAttrName: (name: string) => void) => string;
}
