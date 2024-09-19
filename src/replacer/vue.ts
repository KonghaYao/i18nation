import { GoGoAST } from "go-better-code";
import { ReplacerConfig } from "./interface";
import { createJSReplacer } from "./javascript";
import { createHTMLReplacer } from "./html";

export const createReplacer = (config: ReplacerConfig) => {
    const htmlReplacer = createHTMLReplacer(config);
    const jsReplacer = createJSReplacer(config);

    return (ast: GoGoAST) => {
        htmlReplacer(ast.find("<template></template>"));
        jsReplacer(ast.find("<script></script>"));
        jsReplacer(ast.find("<script setup></script>"));
        return ast.root();
    };
};
