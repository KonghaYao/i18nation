export interface PresetConfig {
    filename: string;
    json: Record<string, string>;
    createTranslateCode: (hash: string, params?: string) => string;
    createStringSlot: (key: string) => string;
}

export * from './jsx'
export * from './vue'