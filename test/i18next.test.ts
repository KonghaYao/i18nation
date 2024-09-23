import {
    createDefaultConfig,
    defineConfig,
    JSXPresets,
    sourceCodeReplacer,
    VuePresets,
} from "../src";
import { expect, describe, it, test } from "vitest";
import sourceCodeWithTemplate from "./samples/i18next.vue?raw";
import JSXSource from "./samples/i18next.jsx?raw";
import AstroSource from "./samples/i18next.astro?raw";

describe("vue template 测试", async () => {
    const json = {};
    const data = await sourceCodeReplacer(
        "index.vue",
        sourceCodeWithTemplate,
        createDefaultConfig({
            entry: [],
            ...VuePresets({
                filename: "index.vue",
                json,
                createTranslateCode(hash, params) {
                    return `i18next.t("${hash}"${params ? `, ${params}` : ""})`;
                },
                createStringSlot(key) {
                    return `{{${key}}}`;
                },
            }),
        }),
    );
    // console.log(data);
    test("所有 key 在代码中存在", () => {
        Object.keys(json).forEach((key) => {
            expect(data).include(key);
        });
    });
    test("无开头空行", () => {
        expect(data.startsWith("<template>")).toBe(true);
    });
    test("alt 属性被替换", () => {
        expect(data)
            .includes(`:alt='"important message"'`)
            .include(`:alt='i18next.t("`)
            .include(`:title='i18next.t("`);
    });
    test("不抽取内容", () => {
        expect(data)
            .include("<p>{{ item.desc }}</p>")
            .includes("<span plant></span>")
            .include("satisfies string[]")
            .includes("忽略DOM文本");
    });
    test("保持 meta 标签", () => {
        expect(data).includes("content='width=device-width");
    });
});

describe("jsx template 测试", async () => {
    const json = {};
    const doIt = async (JSXSource: string) =>
        await sourceCodeReplacer(
            "index.jsx",
            JSXSource,
            createDefaultConfig({
                entry: [],
                ...JSXPresets({
                    filename: "index.jsx",
                    json,
                    createTranslateCode(hash, params) {
                        return `i18next.t("${hash}"${params ? `, ${params}` : ""})`;
                    },
                    createStringSlot(key) {
                        return `{${key}}`;
                    },
                    propertyReplacer(name, str, tools) {
                        if (name === "need-to-be-extracted") {
                            const replaced = tools.config.stringReplacer(
                                str,
                                "js",
                                tools,
                            );
                            return tools.quoteString(
                                replaced,
                                tools.wrapperChar,
                            );
                        }
                    },
                }),
            }),
        );
    // let data = await doIt(JSXSource);
    const data1 = (await doIt(JSXSource)) as string;
    let data = await doIt(data1);
    console.log(data);
    // console.log(json)
    test("所有 key 在代码中存在", () => {
        Object.keys(json).forEach((key) => {
            expect(data).include(key);
        });
    });
    test("jsx slot 正确", () => {
        expect(data).include(`>{i18next.t`).include("U+{props");
    });
    test("属性被替换", () => {
        expect(data)
            .include(`alt={i18next.t("`)
            .include("alt={item.name + i18n")
            .includes("placeholder={i18next.t")
            .includes("title={i18next.t")
            .includes("keywords={i18next.t")
            .includes("content={i18next.t")
            .includes("description={i18next.t")
            .includes('"need-to-be-extracted": i18next.t');
    });
    test("import 保持", () => {
        expect(data)
            .include(`url_info`)
            .includes("../info")
            .includes("@/info")
            .includes('"../../assets/logo/Apple Safari.svg"');
    });
    test("特殊字符保持", () => {
        expect(data)
            .include(".woff2")
            .include("#300")
            .includes("100%")
            .includes('const cant1 = "    \\n    "')
            .includes('const cant = "\\n"')
            .include("<span plant></span>")
            .includes(" ❌ ");
    });
    test("保持 meta 标签", () => {
        expect(data).includes("content='width=device-width");
    });
    test("typescript 保持", () => {
        expect(data).include("satisfies string[]");
    });
    test("保持 URL 模板", () => {
        expect(data)
            .include(
                "https://jsdelivr.deno.dev/npm/font-analyze@1.3.3/data/${name}",
            )
            .includes("`/packages/${font}/dist/${fileName}/result.css`");
    });
    test("保持特殊标签内的模板字符串", () => {
        expect(data)
            .include("` @font-face {font-family: '${fontFamily()}';src: url(${")
            .includes('"font-feature-settings": `"${i}" 0`,')
            .includes("const temp = html`<a");
    });
    test("ignore注释", () => {
        expect(data)
            .includes("comment for ban")
            .includes('`prefix-ignore${info + "23232"}after`')
            .includes("不进行抽取 ignore")
            .includes("不进行抽取DOM ignore");
    });
});
describe("astro template 测试", async () => {
    const json = {};
    const data = await sourceCodeReplacer(
        "index.astro",
        AstroSource,
        createDefaultConfig({
            entry: [],
            ...JSXPresets({
                filename: "index.astro",
                json,
                createTranslateCode(hash, params) {
                    return `i18next.t("${hash}"${params ? `, ${params}` : ""})`;
                },
                createStringSlot(key) {
                    return `{${key}}`;
                },
            }),
        }),
    );
    // console.log(data)
    // console.log(json)
    test("所有 key 在代码中存在", () => {
        Object.keys(json).forEach((key) => {
            expect(data).include(key);
        });
    });
    test("jsx slot 正确", () => {
        expect(data).include(`>{i18next.t`).includes("title={i18n");
    });
    test("alt 属性被替换", () => {
        expect(data).include(`alt={i18next.t("`);
    });
    test("doctype 保持", () => {
        expect(data).include("<!doctype html>");
    });
    test("url 保持", () => {
        expect(data).includes(
            "`/packages/${font}/dist/${fileName}/result.css`",
        );
    });
    test("style 保持", () => {
        expect(data).include(`<style>
    .html {
        height: 100%;
    }
</style>`);
    });
    test("script 保持", () => {
        expect(data)
            .includes('<script type="module">')
            .includes("const inline_script_replaced = i18next.t(")
            .includes("</script>");
    });
    test("保持 meta 标签", () => {
        expect(data).includes("content='width=device-width");
    });
});
import AstroVoidHeader from "./samples/voidHeader.astro?raw";
describe("astro void template 测试", async () => {
    const json = {};
    const data = await sourceCodeReplacer(
        "index.astro",
        AstroVoidHeader,
        createDefaultConfig({
            entry: [],
            ...JSXPresets({
                filename: "index.astro",
                json,
                createTranslateCode(hash, params) {
                    return `i18next.t("${hash}"${params ? `, ${params}` : ""})`;
                },
                createStringSlot(key) {
                    return `{${key}}`;
                },
            }),
        }),
    );
    // console.log(data)
    test("void header 保持", () => {
        expect(data).not.includes("---\n---");
    });
});
