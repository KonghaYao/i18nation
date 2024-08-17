import $ from 'gogocode';

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
function updateTextNode(ast, getNewValue) {
    if (ast.nodeType === 'text') {
        const oldContent = getTextNodeContent(ast)
        const oldContentLength = oldContent.length;
        const newValue = getNewValue(oldContent);
        const newContentLength = newValue.length;

        // 更新文本内容
        ast.content.value.content = newValue;

        // 更新位置信息
        ast.content.value.startPosition += newContentLength - oldContentLength;
        ast.content.value.endPosition = ast.content.value.startPosition + newContentLength;
    }
}
function getTextNodeContent(ast) {
    return ast.content.value.content;
}
const ast = $(source, {
    parseOptions: {
        language: 'vue'
    }
}).find("<template></template>").find('<$_$0>$_$content</$_$1>').each(node => {
    const astNode = node[0].nodePath.node
    const children = astNode.content.children
    const textNodes = children.filter(child => child.nodeType === 'text')
    if (textNodes.length) {
        textNodes.forEach(ast => {
            if (!getTextNodeContent(ast).trim()) return false
            updateTextNode(ast, content => {
                return content.toUpperCase()+'heoo'
            })
        })
    }
}).root().generate()
console.log(ast)