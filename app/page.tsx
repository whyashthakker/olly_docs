"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Search as SearchIcon, MessageSquare, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PageRoutes } from "@/lib/pageroutes";
import { Documents } from "@/settings/documents";
import Search from "@/components/navigation/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Define question links to documentation
interface QuestionLink {
  question: string;
  docPath: string;
}

export default function Home() {
  // Filter out spacers and get only top-level sections
  const mainSections = Documents.filter(doc => !('spacer' in doc) && 'title' in doc);
  
  // Common questions for quick access with documentation links
  const commonQuestions: QuestionLink[] = [
    {
      question: "How do I install Olly?",
      docPath: "/docs/installation"
    },
    {
      question: "How do I connect to OpenAI?",
      docPath: "/docs/connecting-llms/openai"
    },
    {
      question: "How to create custom actions?",
      docPath: "/docs/features/custom-actions"
    },
    {
      question: "What are brand voices?",
      docPath: "/docs/features/brand-voice"
    }
  ];
  
  return (
    <div className="flex flex-col px-4 py-8 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 sm:text-6xl tracking-tight">
          Olly Documentation
        </h1>
        <p className="max-w-[600px] text-muted-foreground mb-8 sm:text-lg">
          Learn how to set up your Olly account and configure the basic settings required to use the platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-md">
          <Search />
        </div>
        <div className="flex items-center gap-5">
          <Link
            href={`/docs${PageRoutes[0].href}`}
            className={buttonVariants({ className: "px-6", size: "lg" })}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      {/* Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {mainSections.map((section, index) => (
          'title' in section && 'href' in section && (
            <Card key={index} className="overflow-hidden border shadow-sm">
              <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="flex justify-between items-center">
                  <span>{section.title}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {('items' in section && section.items) ? 
                    section.items.map((subItem, subIndex) => (
                      'title' in subItem && 'href' in subItem && (
                        <li key={subIndex}>
                          <Link 
                            href={`/docs${section.href}${subItem.href}`}
                            className="block px-4 py-3 hover:bg-muted/50 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      )
                    )) : (
                      <li>
                        <Link 
                          href={`/docs${section.href}`}
                          className="block px-4 py-3 hover:bg-muted/50 transition-colors"
                        >
                          View Documentation
                        </Link>
                      </li>
                    )
                  }
                </ul>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      
      {/* Common Questions - Now placed at the bottom */}
      <div className="mb-16 mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Quick Access Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commonQuestions.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex flex-col">
                <a
                  href="javascript:void(0)"
                  className="px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between"
                  onClick={() => window.open(`https://docs.olly.social${item.docPath}`, '_blank')}
                >
                  <span className="font-medium">{item.question}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
                <button
                  className="text-sm px-4 py-2 text-left text-muted-foreground bg-muted/30 hover:bg-muted/50 transition-colors flex items-center border-t"
                  onClick={() => {
                    // Trigger the chat with the specific question
                    document.querySelector('[aria-label="Open Documentation Chat"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}
                  data-question={item.question}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}