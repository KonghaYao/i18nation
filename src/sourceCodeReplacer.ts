import $, { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./replacer/interface";
import path from "path";
import { createReplacer as createJsxReplacer } from "./replacer/jsx";
import { createJSReplacer as createJsReplacer } from "./replacer/javascript";
import { createReplacer as createVueReplacer } from "./replacer/vue";
import AstroPlugin from "./replacer/astro";
import { ReplaceSpecialChars } from "./constants";
const javascriptExtensions = [".ts", ".js", ".cjs", ".mjs", ".cts", ".mts"];
const tsxExtensions = [".tsx", ".jsx"];

/**
 * 获取源代码中的字符串并进行相应替换的函数, 此函数只做选中字符串的工作，替换需要使用其他方法
 */
export const sourceCodeReplacer = async (
  filePath: string,
  code: string,
  config: ReplacerConfig
) => {
  const ext = path.extname(filePath);
  let replacer: (ast: GoGoAST) => GoGoAST;
  let ast: GoGoAST;
  if (javascriptExtensions.includes(ext)) {
    replacer = createJsReplacer(config);
    ast = $(code);
  } else if (tsxExtensions.includes(ext)) {
    replacer = createJsxReplacer(config);
    ast = $(code);
  } else if (ext === ".vue") {
    replacer = createVueReplacer(config);
    ast = $(code, {
      parseOptions: {
        language: "vue",
      },
    });
  } else if (ext === ".astro") {
    /** @ts-ignore */
    replacer = AstroPlugin.createReplacer(config);
    /** @ts-ignore */
    ast = AstroPlugin.createAST(filePath, code, config);
  }
  const result = replacer!(ast!);
  return ReplaceSpecialChars.unReplace(result.root().generate());
};
