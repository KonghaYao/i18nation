import { ReplacerConfig } from "./replacer/interface";
import { glob } from "glob";
import fs from "fs";
import { sourceCodeReplacer } from "./sourceCodeReplacer";
import { isOneWord } from "./utils";
export interface ConfigFileType extends ReplacerConfig {
  entry: string | string[];
  /**
   * 配置替换的属性
   * @default {
   *   alt: true,
   *   title: true,
   *   placeholder: true
   * }
   */
  replaceAttr?: Record<string, boolean>;
}

export const createDefaultConfig = (config: ConfigFileType) => {
  const replaceAttr: Record<string, boolean> = Object.assign(
    {
      alt: true,
      title: true,
      placeholder: true,
      description: true,
      keywords: true,
      content: true
    },
    config.replaceAttr ?? {}
  );
  const ignore = {
    HTMLTag: [
      "pre",
      "code",
      "script",
      "style",
      ...(config?.ignore?.HTMLTag ?? []),
    ],
    regexp: [
      // http:// 等协议开头的文本
      /^.+?:\/\/[\S]*?$/,
      // 相对路径文本
      /^\.*\/\S*?$/,
      ...(config?.ignore?.regexp ?? []),
    ],
  };
  const matchOneIgnoreRegExp = (str: string) =>
    ignore.regexp.some((reg) => reg.test(str));
  const defaultConfig: ReplacerConfig = {
    stringReplacer(str, lang, tools) {
      if (isOneWord(str)) return str;
      if (matchOneIgnoreRegExp(str)) return str;
      return config.stringReplacer(str, lang, tools);
    },
    templateReplacer(str, lang) {
      if (str.trim().length === 0) return str;
      if (str.startsWith('`')) {
        if (matchOneIgnoreRegExp(str.slice(1, -1))) return str;
      } else {
        if (matchOneIgnoreRegExp(str)) return str;
      }
      return config.templateReplacer(str, lang);
    },
    attrReplacer(attrName, str, replaceAttrName) {
      if (str.trim().length === 0) return str;
      if (matchOneIgnoreRegExp(str)) return str;
      if (replaceAttr[attrName.toLocaleLowerCase()]) {
        return config.attrReplacer(attrName, str, replaceAttrName);
      }
      return str;
    },
    ignore,
  };
  return defaultConfig;
};

export default async (config: ConfigFileType) => {
  const files = await glob(config.entry, { absolute: true });
  for (const file of files) {
    const resultContent = await sourceCodeReplacer(
      file,
      await fs.promises.readFile(file, "utf-8"),
      createDefaultConfig(config)
    );
    await fs.promises.writeFile(file, resultContent);
  }
};
export * from "./sourceCodeReplacer";
export * from "./utils";
export * from "./presets/index";
