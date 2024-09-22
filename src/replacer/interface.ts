import { NodePath } from "go-better-code";

export interface Tools {
    /**
     * 左右两侧的包裹字符, 第一二字符为左右字符
     * @default ''
     */
    wrapperChar: string;
    replaceAttrName?: (name: string) => void;
    parentType: string;
    nodePath: NodePath;
}

export interface ReplacerConfig {
    /**
     * 字符串替换函数，用于根据不同的语言类型（html或js）替换字符串。
     * @param str - 需要被替换的原始字符串。
     * @param lang - 字符串的语言类型，可以是 "html" 或 "js"。
     * @param tools - 替换操作使用的工具对象。
     * @returns 替换后的字符串。
     */
    stringReplacer: (
        str: string,
        lang: "html" | "js",
        tools: Tools,
    ) => string | null;

    /**
     * 模板替换函数，用于根据不同的语言类型（html或js）替换模板字符串。
     * @param str - 需要被替换的原始字符串。
     * @param lang - 字符串的语言类型，可以是 "html" 或 "js"。
     * @returns 替换后的字符串。
     */
    templateReplacer: (str: string, lang: "html" | "js") => string | null;

    /**
     * 属性替换函数，用于替换属性名和属性值。
     * @param attrName - 属性名称。
     * @param str - 属性值字符串。
     * @param replaceAttrName - 一个函数，用于修改属性名称。
     * @returns 替换后的属性值字符串。
     */
    attrReplacer: (
        attrName: string,
        str: string,
        tools: Tools,
    ) => string | null;

    /** 对象属性替换函数 */
    propertyReplacer?: (
        propertyName: string,
        str: string,
        tools: Tools,
        nodePath: NodePath,
    ) => string | null;
    /** 检查是否为替换后的代码 */
    checkReplaced?: (str: string) => boolean | undefined;

    ignore: {
        HTMLTag?: string[];
        regexp?: RegExp[];
    };
}
