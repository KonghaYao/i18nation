export default {
    src: 'test/cli/**/*.{jsx,tsx,astro}',
    createTranslateCode(hash, params) {
        return `$t("${hash}"${params ? `, ${params}` : ''})`
    },
    createStringSlot(key) {
        return `{{${key}}}`
    },
    outputJSON: 'test/i18n/zh-cn.json',
    dryRun: true
}