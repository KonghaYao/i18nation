import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";
function updateTextNode(ast: any, getNewValue: (oldContent: string) => string) {
    if (ast.nodeType === 'text') {
        const oldContent = getTextNodeContent(ast)
        const oldContentLength = oldContent.length;
        const newValue = getNewValue(oldContent);
        const newContentLength = newValue.length;

        // 更新文本内容
        ast.content.value.content = newValue;

        // 更新位置信息
        ast.content.value.startPosition += newContentLength - oldContentLength;
        ast.content.value.endPosition = ast.content.value.startPosition + newContentLength;
    }
}
function getTextNodeContent(ast: any) {
    return ast.content.value.content;
}
export const createReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => ast.find('<$_$0>$_$content</$_$1>').each(node => {
            // @ts-ignore
            const astNode = node[0].nodePath.node
            // @ts-ignore
            const children = astNode.content.children
            // @ts-ignore
            const textNodes = children.filter(child => child.nodeType === 'text')
            console.log(textNodes)
            if (textNodes.length) {
                textNodes.forEach((ast: any) => {
                    if (!getTextNodeContent(ast).trim()) return false
                    updateTextNode(ast, config.stringReplacer)
                })
            }
        }).root()
}