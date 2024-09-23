import { PresetConfig } from "../presets";

export interface I18NationConfig extends Omit<PresetConfig, "filename"> {
    /**
     * 匹配原始文件 glob 语法
     */
    src: string | string[];
    /** glob 忽略文件 */
    exclude?: string | string[];
    /**
     * 将会把 json 合并到这个 json 文件中
     */
    outputJSON: string;
    presets: "vue" | "jsx";

    jsonConfig?: {
        /**
         * 是否注入到 json 中
         * @default flat
         */
        mode?: "flat" | "nested" | ((newJSON: any) => any);
        /**
         * json 文件缩进
         * @default 2
         */
        indent?: number;
    };
    /** 删减 json 时的配置 */
    prune?: {
        /** 删减时的源代码范围 
         * @default src
        */
        src?: string | string[];
        /** 删减时的 json 文件范围 */
        json: string | string[];
    };
    /** 将不会进行写入操作 */
    dryRun: boolean;
}
