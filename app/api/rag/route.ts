import { NextResponse } from "next/server";
import { generateRagResponse } from "@/lib/rag-service";
import { ChatMessage } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { query, history } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query parameter is required and must be a string" }, 
        { status: 400 }
      );
    }
    
    const chatHistory = Array.isArray(history) ? history : [];
    
    // Get response from RAG service
    const response = await generateRagResponse(query, chatHistory);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error("RAG API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 