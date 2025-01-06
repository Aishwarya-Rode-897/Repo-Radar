import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Initialize the OpenAI model
export const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
});

// Example prompt template
export const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a brief summary about {topic} in {words} words."
);

// Example chain
export const chain = promptTemplate
    .pipe(chatModel)
    .pipe(new StringOutputParser());

// Example usage function
export async function generateSummary(topic: string, words: number = 100) {
    try {
        const response = await chain.invoke({
            topic,
            words: words.toString(),
        });
        return response;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw error;
    }
} 