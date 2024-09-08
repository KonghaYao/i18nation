import { GoGoAST, NodePath } from "gogocode";
import { ReplacerConfig, Tools } from "./interface";
import { checkAst, quoteString } from "../utils";
function updateTextNode(ast: any, getNewValue: (oldContent: string) => string) {
  if (ast.nodeType === "text") {
    const oldContent = getTextNodeContent(ast);
    const oldContentLength = oldContent.length;
    const newValue = getNewValue(oldContent);
    const newContentLength = newValue.length;

    // 更新文本内容
    ast.content.value.content = newValue;

    // 更新位置信息
    ast.content.value.startPosition += newContentLength - oldContentLength;
    ast.content.value.endPosition =
      ast.content.value.startPosition + newContentLength;
  } else if (ast.type === "JSXText") {
    const oldContent = getTextNodeContent(ast);
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
  if (ast.type === "JSXText") return ast.value;
  return ast.content.value.content;
}
/** 获取父级链 */
export const getParentChain = (nodePath: NodePath) => {
  const paths: NodePath[] = []
  do {
    paths.push(nodePath)
    if (!nodePath.parentPath) break
    nodePath = nodePath.parentPath
  } while (!nodePath || nodePath.node.type !== 'Program')
  return paths
}

/** 获取父级链的所有 tagName */
export const getParentTagName = (nodePaths: NodePath[]) => {
  return nodePaths.map(i => {
    if (i.node.type === 'JSXElement') {
      // @ts-ignore
      return i.node.openingElement.name.name
    }
    if (i.node.type === 'JSXOpeningElement') {
      // @ts-ignore
      return i.node.name.name
    }
    if (i.node.type === 'JSXFragment') {
      // return i.node.children
    }
  }).filter(i => i)
}
/** 获取最近级别的 attrName */
export const getParentAttrName = (nodePaths: NodePath[], allowFn: (nodeName: string, nodePath: NodePath) => boolean) => {
  return nodePaths.find(i => {
    if (i.node.type === "JSXAttribute") {
      return allowFn(i.node.name.name as string, i)
    }
  })
}

export const createHTMLReplacer = (config: ReplacerConfig) => {
  return (ast: GoGoAST) =>
    checkAst(ast)
      .find(["<$_$0>$_$content</$_$0>", "<$_$0 />"])
      .each((node) => {
        // @ts-ignore
        const nodePath = node[0].nodePath;
        const astNode = nodePath.node;


        // 忽略 html 标签
        const parentChain = getParentTagName(getParentChain(nodePath))
        const tagName = astNode.openingElement?.name.name;
        const ignoreHTMLTag = config.ignore?.HTMLTag;
        if (ignoreHTMLTag) {
          if (ignoreHTMLTag?.includes(tagName)) return;
          if (parentChain.some(tagName => ignoreHTMLTag?.includes(tagName))) {
            return;
          }
        }


        // @ts-ignore 标签属性遍历，当标签元素不包含属性的时候，astNode.content.attributes为undefined，需要使用 ?. 判断一下forEach
        astNode.content?.attributes?.forEach((i) => {
          if (i.key.content === "\r") return; // 过滤掉换行符
          const attrName = i.key.content;
          const value = i.value.content;
          const newValue = config.attrReplacer(attrName.toString(), value, {
            // TODO 暂时无用
            wrapperChar: "''",
            replaceAttrName(name) {
              i.key.content = name;
            },
          });
          i.value.content = newValue;
          i.value.endPosition = i.value.startPosition + newValue.length;
        });

        // 下面为处理文本节点
        // @ts-ignore
        const children: any[] = astNode.content?.children || astNode.children || [];
        // console.log(children)
        // @ts-ignore
        const textNodes = children.filter(
          (child) => child.nodeType === "text" || child.type === "JSXText"
        );

        if (!textNodes.length) return;


        textNodes.forEach((ast: any) => {
          const text = getTextNodeContent(ast);
          if (!text.trim()) return false;

          if (isVueTemplateSnippets(text)) {
            updateTextNode(ast, (text) =>
              config.templateReplacer(text, "html")
            );
            return;
          }
          updateTextNode(ast, (text) => {
            const tools: Tools = {
              wrapperChar: "",
            };
            return quoteString(
              config.stringReplacer(text, "html", tools),
              tools.wrapperChar
            );
          });
        });
      })
      .root();
};
function isVueTemplateSnippets(html: string) {
  const reg = /\{\{\s*(.*?)\s*\}\}/g;

  return reg.test(html);
}
