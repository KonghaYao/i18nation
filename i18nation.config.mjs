export default {
    src: 'test/cli/**/*.{jsx,tsx,astro}',
    createTranslateCode(hash, params) {
        return `$t("${hash}"${params ? `, ${params}` : ''})`
    },
    createStringSlot(key) {
        return `{{${key}}}`
    },

    outputJSON: 'test/i18n/zh-cn.json',
    jsonConfig: {
        mode: "flat",
        indent: 4,
    },

    dryRun: false,
    // 修改 key 的生成方式
    getKey(hash, source) {
        return 'i18nation1.' + hash
    }
}