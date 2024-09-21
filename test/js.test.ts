import sourceCode from "./samples/sample.js?raw";
import { sourceCodeReplacer } from "../src";
import { expect, describe, it } from "vitest";
import { isOneWord } from "../src/utils";

describe("纯 js 测试", async () => {
    const data = await sourceCodeReplacer("index.js", sourceCode, {
        stringReplacer(str) {
            if (isOneWord(str)) return str;
            return `${str.toUpperCase() + "_REPLACED"}`;
        },
        templateReplacer(str) {
            return `\$t(${str})`;
        },
        // 纯 js  没有 attrReplacer
        attrReplacer(attrName, str) {
            return str;
        },
        ignore: {},
    });
    // console.log(data)
    it("纯文本 单个单词测试", () => {
        expect(data).include(`const info = "hello";`);
        expect(data).include(`const data = "useful-info";`);
        expect(data).include(`const enumWord = "TEST_KEY"`);
    });
    it("纯文本 多个单词测试", () => {
        expect(data).include(`const replaced = "HELLO WORLD_REPLACED"`);
    });
    it("模板字符串 测试", () => {
        expect(data).include('$t(`prefix${info + "23232"}after`)');
    });
    it("作为成员字符串 测试", () => {
        expect(data).include(`obj['name info']`);
    });
    it("作为模板成员字符串 测试", () => {
        expect(data).include("obj[`name_${info}`]");
    });

    it("普通字符串不被选中", () => {
        expect(data).include(`"hello"`);
        expect(data).include(`"TEST_KEY"`);
    });
});
