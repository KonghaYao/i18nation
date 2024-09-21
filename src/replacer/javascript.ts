import { GoGoAST, NodePath } from "go-better-code";
import { ReplacerConfig, Tools } from "./interface";
import { checkAst, quoteString } from "../utils";
import { getParentAttrName, getParentChain, getParentTagName } from "./html";
import { ReplaceSpecialChars } from "../constants";

export const createTool = (nodePath: NodePath, defaultWrapperChar = '""') => {
    // @ts-ignore
    const originWrapperChar = nodePath.node.extra?.raw[0] ?? defaultWrapperChar;
    const tools: Tools = {
        wrapperChar: `${originWrapperChar}${originWrapperChar}`,
        parentType: nodePath.parentPath.node.type,
    };
    return tools;
};

export const isIgnoreComment = (comment?: string) =>
    comment && /^[\*|\s]*@i18n-ignore/.test(comment);
/**
 * 检测父级是否存在注释禁止抽取
 */
export const hasCommentForIgnore = (nodePath: NodePath) => {
    const comment = (
        nodePath.node.leadingComments ||
        nodePath.node.innerComments ||
        nodePath?.parentPath?.parentPath?.node?.leadingComments
    )?.at(-1)?.value;
    if (isIgnoreComment(comment)) {
        return true;
    }
    return;
};

export const createJSReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) =>
        checkAst(ast)
            .replace(`'$_$str'`, (match, nodePath) => {
                if (hasCommentForIgnore(nodePath)) return null;

                const tools = createTool(nodePath);
                const matchedText = match.str[0].value;
                const pChain = getParentChain(nodePath);
                const attrTag = pChain.find(
                    (i) => i.node.type === "JSXAttribute",
                );

                // 忽略 jsx 的 attr 中的字符串
                if (attrTag) {
                    /** @ts-ignore */
                    const attrName = attrTag.node.name.name;
                    if (hasCommentForIgnore(attrTag)) return null;

                    const replaceAttrName = (name: string) => {
                        /** @ts-ignore */
                        attrTag.node.name.name = name;
                    };
                    tools.replaceAttrName = replaceAttrName;
                    // console.log(nodePath.parentPath.node.type, matchedText)
                    return quoteString(
                        config.attrReplacer(
                            attrName.toString(),
                            matchedText,
                            tools,
                        ),
                        tools.wrapperChar,
                    );
                }

                if (
                    nodePath.parentPath.node.type === "ObjectProperty" &&
                    config.propertyReplacer
                ) {
                    return quoteString(
                        config.propertyReplacer(
                            /** @ts-ignore */
                            nodePath.parentPath.node.key.name,
                            matchedText,
                            tools,
                            nodePath,
                        ),
                        tools.wrapperChar,
                    );
                }
                if (
                    nodePath.parentPath.node.type === "MemberExpression" ||
                    // 是 Object 的属性时，不进行处理
                    nodePath.parentPath.node.type === "ObjectProperty" ||
                    pChain.some((i) => i.node.type === "ImportDeclaration")
                ) {
                    // 传出 null 可以跳过
                    return null as any;
                }

                const replaced = config.stringReplacer(
                    matchedText,
                    "js",
                    tools,
                );
                return ReplaceSpecialChars.replace(
                    quoteString(replaced, tools.wrapperChar),
                );
            })
            // \` 不作为 jsx 标签属性的边界
            .find("`$_$str`")
            .each((item) => {
                const sourceCode = item.generate();
                // console.log(sourceCode)
                item.replace("`$_$str`", (matched, nodePath) => {
                    if (hasCommentForIgnore(nodePath)) {
                        return null;
                    }
                    const tools = createTool(nodePath);
                    const nodePaths = getParentChain(nodePath);
                    if (
                        nodePaths
                            .map((i) => i.node.type)
                            .some((i) =>
                                [
                                    "MemberExpression",
                                    "TaggedTemplateExpression",
                                ].includes(i),
                            )
                    ) {
                        // console.log(sourceCode)
                        return null as any;
                    }
                    // 检查 html 属性
                    if (
                        // jsx html 包裹
                        getParentTagName(nodePaths).some((i) => {
                            return config.ignore?.HTMLTag?.includes(i);
                        })
                    ) {
                        return null as any;
                    }
                    let tag = getParentAttrName(nodePaths, () => true);
                    if (tag) {
                        const replaceAttrName = (name: string) => {
                            /** @ts-ignore */
                            tag.node.name.name = name;
                        };
                        tools.replaceAttrName = replaceAttrName;
                        return config.attrReplacer(
                            /** @ts-ignore */
                            tag.node.name.name,
                            sourceCode,
                            tools,
                        );
                    }
                    // console.log(nodePath.parentPath.node,sourceCode)
                    return config.templateReplacer(sourceCode, "js");
                });
            })
            .root();
};
