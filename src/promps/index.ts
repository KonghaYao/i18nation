import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

const DEFAULT_REFERENCE =
    'You can adjust the tone and style, taking into account the cultural connotations and regional differences of certain words. As a translator, you need to translate the original text into a translation that meets the standards of accuracy and elegance.';
export const promptJsonTranslate = (reference: string = DEFAULT_REFERENCE) => {
    return ChatPromptTemplate.fromMessages<{
        from: string;
        json: string;
        to: string;
    }>([
        [
            'system',
            [
                `Translate the i18n JSON file from {from} to {to} according to the BCP 47 standard`,
                `Here are some reference to help with better translation.  ---${reference}---`,
                `Keep the keys the same as the original file and make sure the output remains a valid i18n JSON file.`,
            ]
                .filter(Boolean)
                .join('\n'),
        ],
        ['human', '{json}'],
    ]);
};

export const translate = async ({ from, json, to }: any) => {
    const formattedChatPrompt = await promptJsonTranslate().formatMessages({
        from: from,
        json: JSON.stringify(json),
        to,
    });
    const model = new ChatOpenAI({
        configuration: {
            baseURL: 'https://free.gpt.ge',
        },
        maxConcurrency: 1,
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: "sk-qXw0uU0tqGjqwrRv206fB8Ab4671408590A14232Cd86A341",
        temperature: 0,
    });
    const res = await model.invoke(
        formattedChatPrompt,
        {
            response_format: { type: 'json_object' },
        }
    );

    const result = res['content']
    console.log(result)
}