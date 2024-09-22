import { GoGoAST, NodePath } from "go-better-code";

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

export const hasFileLevelCommentForIgnore = (ast: GoGoAST) => {
    return [
        "/* @i18n-disable */",
        "// @i18n-disable",
        "<!-- @i18n-disable -->",
    ].some((i) => ast.has(i));
};
