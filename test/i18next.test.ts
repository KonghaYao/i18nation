import {
  createDefaultConfig,
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
    })
  );
  // console.log(data)
  console.log(json)
  test("所有 key 在代码中存在", () => {
    Object.keys(json).forEach((key) => {
      expect(data).include(key);
    });
  });
  test("alt 属性被替换", () => {
    expect(data).include(`:alt='i18next.t("`);
  });
});

describe("jsx template 测试", async () => {
  const json = {};
  const data = await sourceCodeReplacer(
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
      }),
    })
  );
  console.log(data);
  // console.log(json)
  test("所有 key 在代码中存在", () => {
    Object.keys(json).forEach((key) => {
      expect(data).include(key);
    });
  });
  test("jsx slot 正确", () => {
    expect(data).include(`>{i18next.t`).include('U+{props');
  });
  test("属性被替换", () => {
    expect(data)
      .include(`alt={i18next.t("`)
      .include("alt={item.name + i18n")
      .includes("placeholder={i18next.t")
      .includes("title={i18next.t")
      .includes("keywords={i18next.t")
      .includes("content={i18next.t")
      .includes("description={i18next.t");
  });
  test("import 保持", () => {
    expect(data).include(`url_info`).includes("../info").includes("@/info").includes('"../../assets/logo/Apple Safari.svg"');
  });
  test("特殊字符保持", () => {
    expect(data).include(".woff2").include("#300").includes("100%").includes('const cant1 = "    \\n    "').includes('const cant = "\\n"')
  });
  test("保持 URL 模板", () => {
    expect(data).include(
      "https://jsdelivr.deno.dev/npm/font-analyze@1.3.3/data/${name}"
    ).includes("`/packages/${font}/dist/${fileName}/result.css`")
  });
  test("保持特殊标签内的模板字符串", () => {
    expect(data)
      .include("` @font-face {font-family: '${fontFamily()}';src: url(${")
      .includes('"font-feature-settings": `"${i}" 0`,')
      .includes("const temp = html`<a")
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
    })
  );
  // console.log(data)
  // console.log(json)
  test("所有 key 在代码中存在", () => {
    Object.keys(json).forEach((key) => {
      expect(data).include(key);
    });
  });
  test("jsx slot 正确", () => {
    expect(data).include(`>{i18next.t`).includes("title={i18n")
  });
  test("alt 属性被替换", () => {
    expect(data).include(`alt={i18next.t("`);
  });
  test("doctype 保持", () => {
    expect(data).include("<!doctype html>");
  });
  test("url 保持", () => {
    expect(data).includes("`/packages/${font}/dist/${fileName}/result.css`")
  })
  test("style 保持", () => {
    expect(data).include(`<style>
    .html {
        height: 100%;
    }
</style>`);
  });
  test("script 保持", () => {
    expect(data).includes('<script type="module">').includes('const inline_script_replaced = i18next.t(').includes("</script>")
  })
});
import AstroVoidHeader from './samples/voidHeader.astro?raw'
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
    })
  );
  // console.log(data)
  test('void header 保持', () => {
    expect(data).not.includes('---\n---')
  })
})