import { GoGoAST } from "go-better-code";

export const isOneWord = (str: string) => {
    if (!str.trim()) return true;
    return /^[a-zA-Z|_|\-|0-9|*&^%$#@:=\+!,\.\/\(\)]+$/.test(str.trim());
};
export function quoteString(str: string | null, quoteType = "") {
    if (str === null) return null;
    if (quoteType[0] === '"' && str.includes('"')) {
        quoteType = "''";
    }
    if (quoteType[0] === "'" && str.includes("'")) {
        quoteType = "``";
        str = str.replace(/(?<!\\)`/g, "\\`");
    }
    return `${quoteType![0] ?? ""}${str}${quoteType![1] ?? ""}`;
}
/**
 * @zh 守护 ast 类型，而不是报错
 * @en Guard ast type, not error
 */
export function checkAst(ast: any): GoGoAST {
    if (ast.error) {
        console.log(ast.src);
        throw ast.error;
    }
    return ast;
}
export function htmlCommentToJsx(htmlString: string) {
    return htmlString.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");
}
export function jsxCommentToHtml(jsxString: string) {
    return jsxString.replace(/\{\s*\/\*([\s\S]*?)\*\/\s*\}/g, "<!--$1-->");
}
