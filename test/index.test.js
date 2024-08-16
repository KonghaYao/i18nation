"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourceCode = `
<script lang="ts" setup>

const info = 'hello';
const templateTest = \`prefix\${info + '23232'}after\`
const data = "useful-info";
export default {
    name: 'my-component-name',
};
</script>
`;
