import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";
import { createJSReplacer } from "./javascript";
import { createHTMLReplacer } from "./html";

export const createReplacer = (config: ReplacerConfig) => {
    const jsReplacer = createJSReplacer(config)
    const htmlReplacer = createHTMLReplacer(config)
    return (ast: GoGoAST) => {
        htmlReplacer(ast)
        jsReplacer(ast)
        return ast.root()
    }
}
