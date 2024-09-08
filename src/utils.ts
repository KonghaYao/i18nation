import { GoGoAST } from "gogocode";

export const isOneWord = (str: string) => {
    return /^[a-zA-Z|_|\-|0-9|*&^%$#@:=\+!,\.\/]+$/.test(str)
}
export function quoteString(str: string, quoteType?: string) {
    return `${quoteType![0] ?? ""}${str}${quoteType![1] ?? ''}`;
}
/** 保证 ast 类型，而不是报错 */
export function checkAst(ast: any): GoGoAST {
    if (ast.error) {
        console.log(ast.src)
        throw ast.error
    }
    return ast
}
export function htmlCommentToJsx(htmlString: string) {
    return htmlString.replace(/<!--(.*?)-->/g, '{/* $1 */}');
}
export function jsxCommentToHtml(jsxString: string) {
    return jsxString.replace(/\{\s*\/\*(.*?)\*\/\s*\}/g, '<!--$1-->');
}