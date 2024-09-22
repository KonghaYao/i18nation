/** 换行符 */
export const lineBreak = "#LINE_BREAK#";

/** 替换代码中的特殊符号 */
export const ReplaceSpecialChars = {
    replace(str: string | null) {
        if (str === null) return null;
        return str.replace(/\n/g, lineBreak);
    },
    unReplace(str: string) {
        return str.replace(new RegExp(lineBreak, "g"), "\\n");
    },
};
export const allowMetaName = ["keywords", "description", "author"];
