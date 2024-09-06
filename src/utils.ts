export const isOneWord = (str: string) => {
    return /^[a-zA-Z|_|\-|0-9|*&^%$#@:=\+!,\.\/]+$/.test(str)
}
export function quoteString(str: string, quoteType = '') {
    return `${quoteType[0] ?? ""}${str}${quoteType[1] ?? ''}`;
}