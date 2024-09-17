import md5 from 'md5';
import { ReplacerConfig } from '../replacer/interface';

export interface PresetConfig {
    filename: string;
    json: Record<string, string>;
    /** 转代码中的文本为翻译函数 */
    createTranslateCode: (hash: string, params?: string) => string;
    /** 转 DOM 结构代码中的文本为模板字符串的方式 */
    createStringSlot: (key: string) => string;
    /** 翻译 key 的生成方式 */
    getKey?: (hash: string, source: string) => string
    ignore?: ReplacerConfig['ignore']
}
/** 调用此函数，创建获取 key 的函数 */
export const createKey = (source: string, config: PresetConfig) => {
    return (config.getKey ?? getKey)(md5(source), source)
}
/** 默认的获取 key 的方式 */
const getKey = (hash: string, source: string) => hash


export * from './jsx'
export * from './vue'