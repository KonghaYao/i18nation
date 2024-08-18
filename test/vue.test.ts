import { sourceCodeReplacer } from '../src'
import { test, expect } from 'vitest'

const sourceCode = `
<script lang="ts" setup>

const info = 'hello';
const templateTest = \`prefix\${info + '23232'}after\`
const data = "useful-info";
export default {
    name: 'my-component-name',
};
</script>
`

test('vue script 测试', async () => {
    const data = await sourceCodeReplacer('index.vue', sourceCode, {
        stringReplacer(str) {
            return str.toUpperCase()
        },
        templateReplacer(str) {
            return str.toUpperCase()
        },
    })
    expect(data)
        .includes('HELLO')
        .includes('MY-COMPONENT-NAME')
        .includes('USEFUL-INFO')
        .includes('PREFIX${INFO + "23232"}AFTER')
});
const sourceCodeWithTemplate = `
<template>
    <section class="container">
        <div class="error-bg">
            <p class="err-title">404 RightThisWay</p>
            <p class="err-msg">Soury,&nbsp;&nbsp;&nbsp; Invisible~</p>
            <p class="err-msg"> {{ 'info' }} </p>
        </div>
    </section>
</template>
<script>
export default {
    name: '404',
};
</script>
`

test('vue template 测试', async () => {
    const data = await sourceCodeReplacer('index.vue', sourceCodeWithTemplate, {
        stringReplacer(str) {
            console.log(str)
            return str.toUpperCase()
        },
        templateReplacer(str) {
            return `测${str}试`
        },
    })
    expect(data).include(
        '404 RIGHTTHISWAY'
    )
});