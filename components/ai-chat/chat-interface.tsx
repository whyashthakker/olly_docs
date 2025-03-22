"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/lib/types";
import Link from "next/link";

// Message type definition with timestamp
type Message = ChatMessage & {
  timestamp: Date;
};

// Document reference type
interface DocReference {
  url: string;
  title: string;
}

// Simple textarea component since we had import issues
const Textarea = ({ 
  className, 
  rows = 3,
  value,
  onChange,
  onKeyDown,
  placeholder,
  ...props
}: { 
  className?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) => (
  <textarea
    className={cn(
      "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    rows={rows}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    {...props}
  />
);

// Simple Avatar component
const Avatar = ({ 
  className, 
  children 
}: { 
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn(
    "flex items-center justify-center rounded-full h-8 w-8 shrink-0 text-xs font-medium",
    className
  )}>
    {children}
  </div>
);

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuestionSet, setInitialQuestionSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('olly-chat-messages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert stored date strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('olly-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Process the content to make URLs clickable
  const formatMessageWithLinks = (content: string) => {
    // First handle any full HTML links that might be in the content from the AI
    // This regex will match patterns like: <a href="url">text</a>
    const htmlLinkRegex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let processedContent = content.replace(htmlLinkRegex, (match, url, text) => {
      // Ensure URL is properly formatted
      if (url.startsWith('/docs/')) {
        url = `https://docs.olly.social${url}`;
      } else if (url.includes('your-olly-docs-url')) {
        url = url.replace('your-olly-docs-url', 'docs.olly.social');
      }
      return `<a href="javascript:void(0)" class="text-blue-500 hover:underline" onclick="window.open('${url}', '_blank');">${text}</a>`;
    });
    
    // Handle markdown-style links: [text](url)
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        // Ensure the URL is absolute and points to the official docs
        if (url.startsWith('/docs/')) {
          url = `https://docs.olly.social${url}`;
        } else if (url.includes('your-olly-docs-url')) {
          url = url.replace('your-olly-docs-url', 'docs.olly.social');
        }
        return `<a href="javascript:void(0)" class="text-blue-500 hover:underline" onclick="window.open('${url}', '_blank');">${text}</a>`;
      }
    );
    
    // Then handle regular URLs and doc paths
    // But exclude URLs that are already part of HTML links
    processedContent = processedContent.replace(
      /(https?:\/\/[^\s"<>]+)|(?<![["'=])(\/docs\/[^\s.,()<>"]+)/g,
      (match) => {
        // Skip if this is part of an HTML tag
        if (match.startsWith('<') || match.includes('href=') || match.includes('">')) {
          return match;
        }
        
        // For doc paths, ensure they point to the official docs site
        let url = match;
        if (match.startsWith('/docs/')) {
          url = `https://docs.olly.social${match}`;
        } else if (match.includes('your-olly-docs-url')) {
          url = url.replace('your-olly-docs-url', 'docs.olly.social');
        }
        
        return `<a href="javascript:void(0)" class="text-blue-500 hover:underline" onclick="window.open('${url}', '_blank');">${match}</a>`;
      }
    );
    
    return (
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
    );
  };

  // Extract document references from content
  const extractDocumentReferences = (content: string): DocReference[] => {
    const references: DocReference[] = [];
    
    // Match markdown links and HTML links with docs paths
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+\/docs\/[^)]+)\)/g;
    let markdownMatch;
    while ((markdownMatch = markdownLinkRegex.exec(content)) !== null) {
      const [_, text, url] = markdownMatch;
      let fullUrl = url;
      
      // Ensure proper URL format
      if (url.startsWith('/docs/')) {
        fullUrl = `https://docs.olly.social${url}`;
      } else if (!url.startsWith('http')) {
        fullUrl = `https://docs.olly.social/${url}`;
      } else if (url.includes('your-olly-docs-url')) {
        fullUrl = url.replace('your-olly-docs-url', 'docs.olly.social');
      }
      
      references.push({
        url: fullUrl,
        title: text || 'Documentation'
      });
    }
    
    // Match HTML links
    const htmlLinkRegex = /<a href="([^"]+\/docs\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
    let htmlMatch;
    while ((htmlMatch = htmlLinkRegex.exec(content)) !== null) {
      const [_, url, text] = htmlMatch;
      let fullUrl = url;
      
      // Ensure proper URL format
      if (url.startsWith('/docs/')) {
        fullUrl = `https://docs.olly.social${url}`;
      } else if (!url.startsWith('http')) {
        fullUrl = `https://docs.olly.social/${url}`;
      } else if (url.includes('your-olly-docs-url')) {
        fullUrl = url.replace('your-olly-docs-url', 'docs.olly.social');
      }
      
      // Check for duplicates before adding
      if (!references.some(ref => ref.url === fullUrl)) {
        references.push({
          url: fullUrl,
          title: text || 'Documentation'
        });
      }
    }
    
    // Also match plain URLs like /docs/installation
    const urlRegex = /(?<!\]\(|href=["'])(\/docs\/[^\s.,()\"'<>]+)/g;
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      const path = match[0];
      if (!path) continue;
      
      // Create a full URL to the official docs
      const fullUrl = `https://docs.olly.social${path}`;
      
      // Don't add duplicates
      if (references.some(ref => ref.url === fullUrl)) continue;
      
      // Create a readable title from the URL
      const pathParts = path.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      const title = lastPart
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      references.push({
        url: fullUrl,
        title: title || 'Documentation'
      });
    }
    
    return references;
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle external trigger of the chat with a predefined question
  useEffect(() => {
    const handleChatTrigger = (event: MouseEvent) => {
      // Check if the chat is already open and if we already set a question
      if (isOpen && initialQuestionSet) return;
      
      const target = event.target as HTMLElement;
      const button = target.closest('button');
      
      // Only capture clicks on buttons with the data-question attribute
      if (button && button.hasAttribute('data-question')) {
        const question = button.getAttribute('data-question') || '';
        // Set this question in the input field when the chat opens
        setInput(question);
        setInitialQuestionSet(true);
        
        // If chat is already open, send the question immediately
        if (isOpen) {
          handleSendMessage(question);
        }
      }
    };

    window.addEventListener('click', handleChatTrigger);
    
    return () => {
      window.removeEventListener('click', handleChatTrigger);
    };
  }, [isOpen]);

  // Handle the open state change - if opened with a question, send it
  useEffect(() => {
    if (isOpen && initialQuestionSet && input && !isLoading && messages.length === 0) {
      handleSendMessage(input);
    }
  }, [isOpen, initialQuestionSet, input]);

  // Connect to our RAG API
  const handleSendMessage = async (manualInput?: string) => {
    const currentInput = manualInput || input;
    if (!currentInput.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!manualInput) setInput("");
    setIsLoading(true);
    
    try {
      // Convert messages to the format expected by the API
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call our RAG API
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentInput,
          history: chatHistory
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response
      const botResponse: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // Add error message
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error while searching the documentation. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInitialQuestionSet(false);
    localStorage.removeItem('olly-chat-messages');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Sheet 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          // Reset initialQuestionSet when chat is closed
          if (!open) {
            setInitialQuestionSet(false);
          }
        }}
      >
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-4 right-4 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 border-0 flex items-center gap-2 z-50"
            aria-label="Open Documentation Chat"
          >
            <span className="hidden sm:inline">Ask AI</span>
            <SendIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] max-w-full sm:max-w-[600px] sm:mx-auto rounded-t-lg px-0 pb-0 sm:border sm:shadow-xl">
          <div className="px-4 pb-2 border-b flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">
              Olly Documentation Assistant
            </h2>
            <SheetClose asChild>

            </SheetClose>
          </div>

          <ScrollArea className="flex-1 h-[calc(80vh-150px)] sm:h-[calc(70vh-150px)]">
            <div className="flex flex-col p-4 gap-4">
              {messages.length === 0 ? (
                <div className="text-center p-8">
                  <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Welcome to Olly Documentation Assistant</h3>
                    <p className="text-muted-foreground">Ask me anything about Olly features, installation, or troubleshooting!</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === "user" 
                          ? "flex-row-reverse" 
                          : "flex-row"
                      }`}
                    >
                      <Avatar className={
                        message.role === "assistant" 
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white" 
                          : "bg-muted"
                      }>
                        {message.role === "assistant" ? "AI" : "You"}
                      </Avatar>
                      <div 
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary/50"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {formatMessageWithLinks(message.content)}
                        </div>
                        
                        {/* Display reference documents if assistant message contains references */}
                        {message.role === "assistant" && extractDocumentReferences(message.content).length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground w-full mb-1">References:</span>
                            {extractDocumentReferences(message.content).map((ref, refIdx) => (
                              <a 
                                key={refIdx}
                                href="javascript:void(0)"
                                className="text-xs px-2 py-1 bg-secondary rounded-full hover:bg-secondary/80 text-secondary-foreground transition-colors flex items-center gap-1"
                                onClick={() => window.open(ref.url, '_blank')}
                              >
                                {ref.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        )}
                        
                        <div 
                          className={`text-xs mt-1 ${
                            message.role === "user" 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                      AI
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-secondary/50 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="ml-2">Searching documentation...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <SheetFooter className="px-4 py-3 border-t bg-background sm:shadow-inner">
            <div className="flex w-full items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Olly documentation..."
                className="min-h-10 focus-visible:ring-purple-500"
                rows={1}
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()} 
                size="icon"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex-shrink-0"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
} 