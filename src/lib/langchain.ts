import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.object({
      main_purpose: z.string().describe("The primary purpose and goal of the repository"),
      technical_overview: z.string().describe("Brief overview of the technical implementation and architecture"),
      target_audience: z.string().describe("Who this repository is intended for"),
    }).describe("A structured summary of the repository"),
    
    technical_details: z.object({
      primary_language: z.string().describe("The main programming language used"),
      tech_stack: z.array(z.string()).describe("List of main technologies, frameworks, and tools used"),
      dependencies: z.array(z.string()).min(0).describe("Key external dependencies or requirements"),
    }).describe("Technical details extracted from the repository"),
    
    cool_facts: z.array(
      z.object({
        fact: z.string().describe("The interesting fact or feature"),
        category: z.enum(["INNOVATION", "PERFORMANCE", "SECURITY", "INTEGRATION", "USAGE", "OTHER"])
          .describe("Category of the cool fact"),
        impact_score: z.number().min(1).max(5).describe("Impact score of this fact (1-5)")
      })
    ).min(1).max(5).describe("List of interesting facts about the repository"),
    
    evaluation: z.object({
      strengths: z.array(z.string()).min(1).describe("Key strengths of the repository"),
      limitations: z.array(z.string()).min(0).describe("Potential limitations or areas for improvement"),
      maturity_score: z.number().min(1).max(5).describe("Repository maturity score (1-5)"),
    }).describe("Overall evaluation of the repository")
  })
);

const prompt = PromptTemplate.fromTemplate(`
You are a technical analyst specialized in understanding GitHub repositories.
Based on the following README content from a GitHub repository, provide a detailed analysis.

README Content:
{readme_content}

{format_instructions}

Guidelines:
1. Be specific and technical in your analysis
2. Focus on concrete features and capabilities
3. Evaluate the repository objectively
4. Consider both technical and practical aspects
5. Assign scores based on clear evidence from the README

Ensure all arrays have unique entries and scores are justified by the content.
Be concise but precise in your descriptions.
`);

export async function generateRepoSummary(readmeContent: {
  title: string;
  description: string;
  sections: { heading: string; content: string }[];
}) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    maxTokens: 1000
  });

  // Format the README content into a single string
  const formattedContent = `
Title: ${readmeContent.title}
Description: ${readmeContent.description}
${readmeContent.sections
  .map((section) => `
${section.heading}:
${section.content}
`)
  .join('\n')}
`;

  const chain = RunnableSequence.from([
    {
      format_instructions: () => parser.getFormatInstructions(),
      readme_content: () => formattedContent
    },
    prompt,
    model,
    parser
  ]);

  try {
    const result = await chain.invoke({});
    return result;
  } catch (error: any) {
    console.error("Error generating repository summary:", error);
    throw new Error("Failed to generate repository summary");
  }
} 