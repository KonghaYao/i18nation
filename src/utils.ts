export const isOneWord = (str: string) => {
    return /^[a-zA-Z|_|\-|0-9]+$/.test(str)
}