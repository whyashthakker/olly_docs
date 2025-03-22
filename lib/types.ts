import { OpenAI } from "openai";

// Type definitions for global objects
declare global {
  var openai: OpenAI | undefined;
}

// Type for chat message
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Interface for search result document
export interface DocumentMatch {
  title: string;
  content: string;
  href: string;
  relevanceScore: number;
} 