// 单个单词：外部扩展为不被选中
const info = 'hello';
const data = "useful-info";
const enumWord = "TEST_KEY"

// 多个单词：必定选中
const replaced = 'hello world'

// 模板字符串通通被选中
const templateTest = `prefix${info + '23232'}after`

const obj = {
    // value 均遵循单词方式，key 永不选中
    name: 'my-component-name'
};
// 作为 key 永不选中
const item = obj['name info']
const item2 = obj[`name_${info}`]
