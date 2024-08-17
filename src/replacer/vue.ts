import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";
import { createReplacer as createJsxReplacer } from "./tsx";
import { createReplacer as createHtmlReplacer } from "./html";

export const createReplacer = (config: ReplacerConfig) => {
    const htmlReplacer = createHtmlReplacer(config)
    const jsxReplacer = createJsxReplacer(config)
    return (ast: GoGoAST) => {
        htmlReplacer(ast.find("<template></template>"))
        jsxReplacer(ast.find('<script></script>'))
        jsxReplacer(ast.find('<script setup></script>'))
        return ast.root()
    }
}
