import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";

export const createJSReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => ast
        .replace(`'$_$str'`, (match, nodePath) => {
            const matchedText = match.str[0].value
            // 忽略 jsx 的 attr 中的字符串
            if (nodePath.parentPath.node.type === 'JSXAttribute') {
                const attrName = nodePath.parentPath.node.name.name
                const replaceAttrName = (name: string) => {
                    /** @ts-ignore */
                    nodePath.parentPath.node.name.name = name
                }
                return `'${config.attrReplacer(attrName.toString(), matchedText, replaceAttrName)}'`
            }
            // console.log(nodePath)
            if (nodePath.parentPath.node.type === 'MemberExpression') {
                return `'${matchedText}'`
            }
            return `${config.stringReplacer(matchedText, 'js')}`
        })
        // \` 不作为 jsx 标签属性的边界
        .find('`$_$str`').each((item) => {
            const sourceCode = item.generate()
            item.replace('`$_$str`', (matched, nodePath) => {
                if (nodePath.parentPath.node.type === 'MemberExpression') {
                    return sourceCode
                } else {
                    return config.templateReplacer(sourceCode, 'js')
                }
            })
        })
        .root()
}