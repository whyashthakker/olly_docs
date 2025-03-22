/**
 * RAG (Retrieval-Augmented Generation) Service
 * 
 * This service integrates OpenAI with Langchain for Retrieval-Augmented Generation
 * to provide AI-powered responses based on documentation content.
 */

import { Documents } from "@/settings/documents";
import { generateResponse, generateEmbedding } from "./openai-service";
import { ChatMessage, DocumentMatch } from "./types";

// Sample document content based on titles
const documentContent: Record<string, string> = {
  "Introduction": "Olly is a browser extension that helps content creators produce better content across social media platforms with AI assistance. This documentation will guide you through setting up and using Olly effectively.",
  
  "Installation": "To install Olly, visit the Chrome Web Store and add the extension to your browser. Once installed, you'll need to activate your account and configure your preferred AI providers.",
  
  "Activating": "After installation, you'll need to activate Olly with your license key. Click the Olly icon in your browser extensions bar and enter your activation key when prompted.",
  
  "Adding to Chrome": "To add Olly to Chrome: 1) Visit the Chrome Web Store 2) Search for 'Olly AI Assistant' 3) Click 'Add to Chrome' 4) Confirm the installation when prompted 5) The Olly icon will appear in your browser toolbar",
  
  "Connecting to LLMs": "Olly supports multiple LLM providers including OpenAI, Claude, Gemini, and more. You'll need to provide API keys for your preferred providers in the Olly settings panel.",
  
  "Brand Voice": "The Brand Voice feature allows you to define and maintain a consistent tone and style across all your content. Create voice profiles with specific characteristics that Olly will use when generating content.",
  
  "Custom Actions": "Custom Actions allow you to create specific prompt templates for common tasks. Define input parameters, output formats, and save them for quick access across your workflow.",
  
  "Features": "Olly includes features like Brand Voice, Custom Actions, Reply to Comments, Post Summarizer, Similar Post Generator, and more to help streamline your content creation workflow."
};

/**
 * Generate a RAG-based response using document retrieval and OpenAI
 */
export async function generateRagResponse(
  userQuery: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // 1. Retrieve relevant documents based on the query
    const matches = await retrieveRelevantDocuments(userQuery);
    
    // 2. If no matches found, generate response without context
    if (matches.length === 0) {
      return generateResponse(userQuery, "", chatHistory);
    }
    
    // 3. Format context from the most relevant documents
    const context = formatDocumentsForContext(matches);
    
    // 4. Generate response using OpenAI with context from documents
    return generateResponse(userQuery, context, chatHistory);
  } catch (error) {
    console.error("RAG service error:", error);
    return "Sorry, I encountered an error processing your request. Please try again.";
  }
}

/**
 * Retrieves relevant documents based on a user query
 * In a production implementation, this would use vector similarity search
 */
async function retrieveRelevantDocuments(query: string): Promise<DocumentMatch[]> {
  try {
    // Try to use embeddings for semantic search
    const queryEmbedding = await generateEmbedding(query);
    
    // If embeddings aren't available (no API key or error), fall back to keyword matching
    if (!queryEmbedding) {
      return keywordBasedDocumentRetrieval(query);
    }
    
    // In a real implementation, we would get embeddings for all docs and compute similarity
    // For this demo, we'll use keyword matching as our fallback
    return keywordBasedDocumentRetrieval(query);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return [];
  }
}

/**
 * Simple keyword-based document retrieval as a fallback when embeddings aren't available
 */
function keywordBasedDocumentRetrieval(query: string): DocumentMatch[] {
  const keywords = query.toLowerCase().split(/\s+/);
  const matches: DocumentMatch[] = [];
  
  // Create a simple in-memory document store with content
  const documentStore = Documents.filter(doc => 'title' in doc && 'href' in doc).map(doc => {
    if ('title' in doc && 'href' in doc) {
      const title = doc.title;
      // Use our predefined content if available, otherwise use a generic description
      const content = documentContent[title] || 
        `This is the documentation for ${title}. It contains information about how to use and configure this feature in Olly.`;
      
      return {
        title,
        href: doc.href,
        content
      };
    }
    return null;
  }).filter(Boolean) as Array<{title: string, href: string, content: string}>;
  
  // Simple keyword matching with content importance
  documentStore.forEach(doc => {
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    
    // Title matches are weighted more heavily
    let titleRelevance = 0;
    let contentRelevance = 0;
    
    keywords.forEach(keyword => {
      if (titleLower.includes(keyword)) {
        titleRelevance += 2; // Title matches count double
      }
      if (contentLower.includes(keyword)) {
        contentRelevance += 1;
      }
    });
    
    const totalRelevance = titleRelevance + contentRelevance;
    
    if (totalRelevance > 0) {
      matches.push({
        title: doc.title,
        content: doc.content,
        href: doc.href,
        relevanceScore: totalRelevance / (keywords.length * 3) // Normalize score (max score per keyword is 3)
      });
    }
  });
  
  // Sort by relevance score
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
}

/**
 * Formats retrieved documents into a context string for the AI
 */
function formatDocumentsForContext(documents: DocumentMatch[]): string {
  return documents.map(doc => (
    `DOCUMENT: ${doc.title}
URL: /docs${doc.href}
CONTENT: ${doc.content}

`
  )).join('');
}