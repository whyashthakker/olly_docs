import { OpenAI } from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatMessage } from "./types";

// Initialize OpenAI client if API key is available
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // For client-side usage
});

// Initialize Langchain ChatOpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
  temperature: 0.2, // Low temperature for factual responses
});

/**
 * Generate a response using the OpenAI API with context from our docs
 */
export async function generateResponse(
  userQuery: string,
  context: string = "", 
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return `I can help answer your question about "${userQuery}", but the OpenAI API key is not configured. Please set up your API key in the .env.local file.`;
    }

    const systemContent = context 
      ? `You are Olly Documentation Assistant. You help users with questions about Olly.
      
Here is relevant information from our documentation:

${context}

Instructions for your response:
1. Answer the user's question based on the documentation provided
2. If the information doesn't fully answer the question, acknowledge what you do know and what you don't
3. Always include the full document path (e.g., /docs/installation or /docs/features/brand-voice) when referencing documentation
4. Format your response with properly structured markdown
5. When referring to documentation, use proper link format like: [title](/docs/path)
6. Never use URLs like "your-olly-docs-url" - instead, use explicit paths like /docs/installation
7. Include 2-3 document references from the context if relevant
8. Be concise, helpful, and accurate`
      : `You are Olly Documentation Assistant. You help users with questions about Olly.
      
Instructions for your response:
1. Try to answer the user's question based on your general knowledge about documentation systems and AI assistants
2. Be clear that you're providing general information rather than specific details about Olly
3. Suggest that the user check the documentation for more specific information
4. When referring to documentation, use proper link format like: [title](/docs/path)
5. Never use URLs like "your-olly-docs-url" - instead, use explicit paths like /docs/installation
6. Be concise, helpful, and accurate`;

    const completionResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userQuery }
      ],
      temperature: 0.3,
    });

    return completionResponse.choices[0].message.content || 
      "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI service error:", error);
    return `I encountered an error while trying to answer your question. Please ensure your OpenAI API key is valid.`;
  }
}

/**
 * Generate embeddings for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return null;
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
} 