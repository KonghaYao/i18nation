<template>
    <section class="container">
        <meta name='viewreport' content='width=device-width, initial-scale=1.0'/>
        <div class="error-bg">
            <!-- 抽取所有的文本内容 -->
            <p class="err-title">404 RightThisWay</p>
            <p class="err-msg">Soury,&nbsp;&nbsp;&nbsp; Invisible~</p>
            <p class="err-msg"> {{ 'info' }} </p>
            <p class="err-msg"> prefix{{ 'info' }}suffix </p>
            <!--  不抽取内容 -->
            <p>{{ item.desc }}</p>
            <!-- 需要抽取 alt 属性 -->
            <img class="err-msg" alt='important message' src='./index.jpg' /> 
            <img 
            class="err-msg" :alt='"important message"' src='./index.jpg' 
            title="左右双引号"
            /> 
            <span plant></span>

            <p class="err-msg"> 
                <!-- @i18n-ignore -->
                忽略DOM文本

                839483943
             </p>
        </div>
    </section>
</template>
<script setup lang='ts'>
import.meta.env.HELLO;
const tsExpression = [] satisfies string[]
export default {
    name: '404',
};
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
this.$message({
    message: 'sorry，暂未完成此功能哟 ~',
    type: 'warning'
})
</script>