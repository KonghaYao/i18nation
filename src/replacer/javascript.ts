import { GoGoAST, NodePath } from "gogocode";
import { ReplacerConfig, Tools } from "./interface";
import { checkAst, quoteString } from "../utils";
import { getParentAttrName, getParentChain, getParentTagName } from "./html";

export const createTool = (nodePath: NodePath) => {
    // @ts-ignore
    const originWrapperChar = nodePath.node.extra?.raw[0] ?? '"'
    const tools: Tools = {
        wrapperChar: `${originWrapperChar}${originWrapperChar}`,
        parentType: nodePath.parentPath.node.type
    }
    return tools
}
export const createJSReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => checkAst(ast)
        .replace(`'$_$str'`, (match, nodePath) => {
            const tools = createTool(nodePath)

            const matchedText = match.str[0].value
            const pChain = getParentChain(nodePath)
            const attrTag = pChain.find(i => i.node.type === 'JSXAttribute')

            // 忽略 jsx 的 attr 中的字符串
            if (attrTag) {
                /** @ts-ignore */
                const attrName = attrTag.node.name.name
                const replaceAttrName = (name: string) => {
                    /** @ts-ignore */
                    attrTag.node.name.name = name
                }
                tools.replaceAttrName = replaceAttrName
                // console.log(nodePath.parentPath.node.type, matchedText)
                return quoteString(config.attrReplacer(attrName.toString(), matchedText, tools), tools.wrapperChar)
            }
            if (
                nodePath.parentPath.node.type === 'MemberExpression' ||
                // 是 Object 的属性时，不进行处理
                nodePath.parentPath.node.type === 'ObjectProperty'
            ) {
                return quoteString(matchedText, tools.wrapperChar)
            }
            return quoteString(config.stringReplacer(matchedText, 'js', tools), tools.wrapperChar)
        })
        // \` 不作为 jsx 标签属性的边界
        .find('`$_$str`').each((item) => {
            const sourceCode = item.generate()
            // console.log(sourceCode)
            item.replace('`$_$str`', (matched, nodePath) => {
                const tools = createTool(nodePath)
                const nodePaths = getParentChain(nodePath)
                if (nodePath.parentPath.node.type === 'MemberExpression') {
                    return sourceCode
                }
                // 检查 html 属性
                if (
                    // jsx html 包裹
                    getParentTagName(nodePaths).some(i => {
                        return config.ignore?.HTMLTag?.includes(i)
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