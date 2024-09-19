// 随便测试用
import $ from 'go-better-code';

const source = `
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

const ast = $(source, {
    parseOptions: {
        language: 'vue'
    }
}).find("<template></template>").root().generate()
console.log(ast)