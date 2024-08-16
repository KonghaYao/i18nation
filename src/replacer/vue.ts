import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";
import { createReplacer as createJsxReplacer } from "./tsx";

export const createReplacer = (config: ReplacerConfig) => {
    const jsxReplacer = createJsxReplacer(config)
    return (ast: GoGoAST) => {
        const normalTemplate = jsxReplacer(ast.find('<script></script>'))
        const setupTemplate = jsxReplacer(normalTemplate.find('<script setup></script>'))
        return setupTemplate
    }
}
