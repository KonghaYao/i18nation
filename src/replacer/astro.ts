import md5 from "md5";
import { htmlCommentToJsx, jsxCommentToHtml } from "../utils";
import { ReplacerConfig } from "./interface";
import { createJSReplacer } from "./javascript";
import { createReplacer as createJSXReplacer } from "./jsx";
import $, { GoGoAST } from "go-better-code";

const frontmatterRegex = /^\n*?---\s*([\s\S]*?)\n---\s*/;

/**
 * 拆分 astro 语法的 js 部分和 template 部分
 * template 部分由 jsx 解析
 */
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

/** 专门用于解析 astro 中不规范的 jsx 写法的问题 */
class AstroTemplateParser {
    constructor(public code: string) {}
    skipReplacer: Record<string, string> = {};
    jsReplacer: Record<string, GoGoAST> = {};
    /** 根据类 html 代码创建 AST */
    createAst() {
        const jsInJSX: Record<string, GoGoAST> = {};

        const skipFn = (match: string) => {
            const key = md5(match);
            this.skipReplacer[key] = match;
            return `<S${key}></S${key}>`;
        };
        const pureJSX = htmlCommentToJsx(this.code)
            // 处理 style 标签
            .replace(/(<style[\s\S]*?<\/style>)/g, (match, p1) => {
                if (!p1.trim()) return match;
                const key = md5(p1);
                this.skipReplacer[key] = p1;
                return `<S${key}></S${key}>`;
            })
            .replace(
                /<script([^>]*?)>([\s\S]*?)<\/script>/g,
                (match, p1, p2) => {
                    if (!p2.trim()) return match;
                    const key = md5(p2);
                    jsInJSX[key] = $(p2);
                    return `<J${key} ${p1}></J${key}>`;
                },
            )
            .replace(/<!doctype html>/gi, skipFn);
        const jsx = $(`<>\n${pureJSX}\n</>`);
        this.jsReplacer = jsInJSX;
        return {
            jsx,
        };
    }
    replacerJSinJSX(replacer: (ast: GoGoAST) => GoGoAST) {
        this.jsReplacer = Object.fromEntries(
            Object.entries(this.jsReplacer).map(([key, value]) => {
                return [key, replacer(value).root()];
            }),
        );
    }
    /** 渲染特殊的标签回原来模样 */
    replaceSlotToCode(code: string) {
        return jsxCommentToHtml(code)
            .replace(/<S([\w\d]{32})><\/S\1>/g, (match, p1) => {
                return this.skipReplacer[p1] || match;
            })
            .replace(/<J([\w\d]{32}) ([^>]*?)><\/J\1>/g, (match, p1, p2) => {
                return (
                    `<script${
                        !p2 || p2?.startsWith(" ") ? p2 : " " + p2
                    }>${this.jsReplacer[p1]?.generate()}` + "</script>" || match
                );
            });
    }
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
            const p = new AstroTemplateParser(ast.jsx);
            const { jsx } = p.createAst();
            const js = $(ast.js);
            jsxReplacer(jsx);
            jsReplacer(js);
            p.replacerJSinJSX(jsReplacer);

            return {
                root() {
                    jsx.root();
                    js.root();
                    return this;
                },
                generate() {
                    return `---\n${js.generate()}\n---\n${p.replaceSlotToCode(
                        jsx.generate().slice(3, -3),
                    )}`;
                },
            };
        };
    },
};
