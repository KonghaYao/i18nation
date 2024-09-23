import { glob } from "glob";
import fs from "fs-extra";
import { I18NationConfig } from "./I18NationConfig.js";
import { flatten } from "safe-flat";
import { injectJSON } from "./injectJSON.js";

export async function doI18nPrune(config: I18NationConfig) {
    if (!config.prune) {
        console.warn("prune is not set");
        return;
    }
    const jsonFiles = await glob(config.prune.json, {
        absolute: true,
    });
    const keys = new Set<string>();
    const allowKeys = new Set<string>();
    for (const file of jsonFiles) {
        const json = await fs.readJSON(file);
        const flatJson = flatten(json) as any;
        Object.keys(flatJson).forEach((key) => {
            keys.add(key);
        });
    }
    const files = await glob(config.prune.src ?? config.src, {
        absolute: true,
    });
    for (const file of files) {
        const content = await fs.readFile(file, "utf-8");
        keys.forEach((key) => {
            if (content.includes(key)) {
                keys.delete(key);
                allowKeys.add(key);
            }
        });
    }
    for (const file of jsonFiles) {
        const json = await fs.readJSON(file);
        const flatJson = flatten(json) as any;
        const newJSON = Object.fromEntries(
            Object.entries(flatJson).filter(([k, v]) => {
                return allowKeys.has(k);
            }),
        );
        await injectJSON(
            file,
            newJSON,
            Object.assign(
                {
                    mode: "flat",
                    indent: 2,
                },
                config.jsonConfig ?? {},
            ),
        );
        console.log(`✅ prune ${file}`);
    }
}
