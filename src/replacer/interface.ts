
export interface ReplacerConfig {
    stringReplacer: (str: string) => string;
    templateReplacer: (str: string) => string;
    attrReplacer: (attrName: string, str: string) => string;
}
