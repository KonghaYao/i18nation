<template>
    <section class="container">
        <div class="error-bg">
            <!-- 抽取所有的文本内容 -->
            <p class="err-title">404 RightThisWay</p>
            <p class="err-msg">Soury,&nbsp;&nbsp;&nbsp; Invisible~</p>
            <p class="err-msg"> {{ 'info' }} </p>
            <p class="err-msg"> prefix{{ 'info' }}suffix </p>
            <!-- 需要抽取 alt 属性 -->
            <img class="err-msg" alt='important message' src='./index.jpg' /> 
            <img class="err-msg" :alt='"important message"' src='./index.jpg' /> 
        </div>
    </section>
</template>
<script>
export default {
    name: '404',
};
</script>