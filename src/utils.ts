import { GoGoAST } from "gogocode";

export const isOneWord = (str: string) => {
    if(!str.trim()) return true
    return /^[a-zA-Z|_|\-|0-9|*&^%$#@:=\+!,\.\/]+$/.test(str.trim())
}
export function quoteString(str: string, quoteType="") {
    if(quoteType[0]==='"' && str.includes('"')){
        quoteType = "''"
    }
    if(quoteType[0]==="'" && str.includes("'")){
        quoteType = '``'
    }
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
    return htmlString.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
}
export function jsxCommentToHtml(jsxString: string) {
    return jsxString.replace(/\{\s*\/\*([\s\S]*?)\*\/\s*\}/g, '<!--$1-->');
}