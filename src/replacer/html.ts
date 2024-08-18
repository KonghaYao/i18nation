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
    } else if (ast.type === 'JSXText') {
        const oldContent = getTextNodeContent(ast)
        const oldContentLength = oldContent.length;
        const newValue = getNewValue(oldContent);
        const newContentLength = newValue.length;

        // 更新文本内容
        ast.value = newValue;

        // 更新位置信息
        ast.loc.startPosition += newContentLength - oldContentLength;
        ast.loc.endPosition = ast.loc.startPosition + newContentLength;
    }
}
function getTextNodeContent(ast: any) {
    if (ast.type === 'JSXText') return ast.value
    return ast.content.value.content;
}
export const createHTMLReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => ast.find(['<$_$0>$_$content</$_$0>', '<$_$0 />']).each(node => {
        // @ts-ignore
        const astNode = node[0].nodePath.node

        // @ts-ignore 标签属性遍历
        astNode.content?.attributes.forEach(i => {
            const attrName = i.key.content
            const value = i.value.content
            const newValue = config.attrReplacer(attrName.toString(), value)
            i.value.content = newValue
            i.value.endPosition = i.value.startPosition + newValue.length
        })


        // 下面为处理文本节点
        // @ts-ignore
        const children = astNode.content?.children || astNode.children || []
        // console.log(children)
        // @ts-ignore
        const textNodes = children.filter(child => child.nodeType === 'text' || child.type === 'JSXText')

        if (!textNodes.length) return

        textNodes.forEach((ast: any) => {
            const text = getTextNodeContent(ast)
            if (!text.trim()) return false
            if (isVueTemplateSnippets(text)) {
                updateTextNode(ast, config.templateReplacer)
                return;
            }
            updateTextNode(ast, config.stringReplacer)
        })
    }).root()
}
function isVueTemplateSnippets(html: string) {
    const reg = /\{\{\s*(.*?)\s*\}\}/g;

    return reg.test(html)
}