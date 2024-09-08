import { htmlCommentToJsx, jsxCommentToHtml } from "../utils";
import { ReplacerConfig } from "./interface";
import { createJSReplacer } from "./javascript";
import { createReplacer as createJSXReplacer } from "./jsx";
import $, { GoGoAST } from "gogocode";

const frontmatterRegex = /^\n*?---\s*\n([\s\S]*?)\n---\s*/;

function separateAstroSyntax(astroCode: string): AstroAST {
  let match = astroCode.match(frontmatterRegex);
  let jsContent = "";
  let jsxContent = astroCode;

  if (match) {
    // 提取 YAML frontmatter
    jsContent = match[1];
    // 移除 YAML frontmatter 从 HTML 中
    jsxContent = astroCode.replace(frontmatterRegex, "");
  }
  return {
    js: jsContent.trim(),
    jsx: jsxContent.trim(),
  };
}
interface AstroAST {
  js: string;
  jsx: string;
}
export default {
  name: "astro",
  createAST(filePath: string, code: string, config: ReplacerConfig) {
    return separateAstroSyntax(code);
  },
  createReplacer(config: ReplacerConfig) {
    const jsReplacer = createJSReplacer(config);
    const jsxReplacer = createJSXReplacer(config);
    return (ast: AstroAST) => {
      const jsx = $(`<>\n${htmlCommentToJsx(ast.jsx)}\n</>`);
      const js = $(ast.js);
      jsxReplacer(jsx);
      jsReplacer(js);
      return {
        root() {
          jsx.root();
          js.root();
          return this;
        },
        generate() {
          return `---\n${js.generate()}\n---\n${jsxCommentToHtml(jsx.generate().slice(3, -3))}`;
        },
      };
    };
  },
};
