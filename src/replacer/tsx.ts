import { GoGoAST } from "gogocode";
import { ReplacerConfig } from "./interface";

export const createReplacer = (config: ReplacerConfig) => {
    return (ast: GoGoAST) => ast
        .replace(`'$_$str'`, (match) => {
            return `'${config.stringReplacer(match.str[0].value)}'`;
        })
        .find(`\`$_$str\``).each(item => {
            const originCode = config.templateReplacer(item.generate())
            item.replaceBy(originCode)
        })
        .root()
}