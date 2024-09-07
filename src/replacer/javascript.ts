import { GoGoAST, NodePath } from "gogocode";
import { ReplacerConfig, Tools } from "./interface";
import { quoteString } from "../utils";
import { getParentAttrName, getParentChain, getParentTagName } from "./html";

export const createJSReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => ast
        .replace(`'$_$str'`, (match, nodePath) => {
            const tools: Tools = {
                wrapperChar: "''"
            }

            const matchedText = match.str[0].value
            // 忽略 jsx 的 attr 中的字符串
            if (nodePath.parentPath.node.type === 'JSXAttribute') {
                const attrName = nodePath.parentPath.node.name.name
                const replaceAttrName = (name: string) => {
                    /** @ts-ignore */
                    nodePath.parentPath.node.name.name = name
                }
                tools.replaceAttrName = replaceAttrName
                return quoteString(config.attrReplacer(attrName.toString(), matchedText, tools), tools.wrapperChar)
            }
            if (nodePath.parentPath.node.type === 'MemberExpression') {
                return quoteString(matchedText, tools.wrapperChar)
            }
            return quoteString(config.stringReplacer(matchedText, 'js', tools), tools.wrapperChar)
        })
        // \` 不作为 jsx 标签属性的边界
        .find('`$_$str`').each((item) => {
            const sourceCode = item.generate()
            item.replace('`$_$str`', (matched, nodePath) => {
                const tools: Tools = {
                    wrapperChar: "''"
                }
                const nodePaths = getParentChain(nodePath)
                if (nodePath.parentPath.node.type === 'MemberExpression') {
                    return sourceCode
                }
                // 检查 html 属性
                if (
                    // jsx html 包裹
                    getParentTagName(nodePaths).some(i => {
                        return config.ignore.HTMLTag?.includes(i)
                    })

                ) {
                    return sourceCode
                }
                let tag = getParentAttrName(nodePaths, () => true)
                if (tag) {
                    const replaceAttrName = (name: string) => {
                        /** @ts-ignore */
                        tag.node.name.name = name
                    }
                    tools.replaceAttrName = replaceAttrName
                    /** @ts-ignore */
                    return config.attrReplacer(tag.node.name.name, sourceCode, tools)
                }
                return config.templateReplacer(sourceCode, 'js')

            })
        })
        .root()
}