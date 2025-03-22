import { Paths } from "@/lib/pageroutes";

export const Documents: Paths[] = [
  {
    title: "Introduction",
    href: "/introduction",
    heading: "Getting started",
    items: [
      {
        title: "Personas",
        href: "/personas",
      },
    ],
  },
  {
    spacer: true,
  },
  // {
  //   title: "Navigation",
  //   href: "/navigation",
  //   heading: "Documents",
  // },
  {
    title: "Installation",
    href: "/installation",
    items: [
      {
        title: "Activating",
        href: "/activating",
      },
      {
        title: "Adding to Chrome",
        href: "/adding-to-chrome",
      },
      {
        title: "Connecting to LLMs",
        href: "/connecting-llms",
        items: [
          {
            title: "Claude",
            href: "/claude",
          },
          {
            title: "Gemini",
            href: "/gemini",
          },
          {
            title: "Groq",
            href: "/groq",
          },
          {
            title: "Ollama",
            href: "/ollama",
          },
          {
            title: "Olly",
            href: "/olly",
          },
          {
            title: "OpenAI",
            href: "/openai",
          },
          {
            title: "OpenRouter",
            href: "/openrouter",
          },
          {
            title: "Straico",
            href: "/straico",
          },
        ],
      },
    ],
  },
  {
    spacer: true,
  },
  {
    title: "Features",
    href: "/features",
    heading: "Platform Features",
    items: [
      {
        title: "Brand Voice",
        href: "/brand-voice",
      },
      {
        title: "Custom Actions",
        href: "/custom-actions",
      },
      {
        title: "Custom Personalities",
        href: "/custom-personalities",
      },
      {
        title: "Disabling Olly on Specific Websites",
        href: "/disabling-olly-on-specific-websites",
      },
      {
        title: "Native Language Support",
        href: "/native-language-support",
      },
      {
        title: "Post Summarizer",
        href: "/post-summarizer",
      },
      {
        title: "Similar Post Generator",
        href: "/similar-post-generator",
      },
      {
        title: "Virality Checker",
        href: "/virality-checker",
      },
      {
        title: "Reply to Comments",
        href: "/reply-to-comments",
      },
      {
        title: "Comment Generator",
        href: "/comment-generator",
      },
    ],
  },
  {
    spacer: true,
  },
  {
    title: "Common Errors",
    href: "/common-errors",
    heading: "Troubleshooting",
    items: [
      {
        title: "Error 429: Exceeded API Quota",
        href: "/error-429",
      },
      {
        title: "Error 401: Incorrect LLM Vendor or API Key",
        href: "/error-401",
      },
      {
        title: "Error 404: Model Not Available",
        href: "/error-404",
      },
      {
        title: "Error: Invalid Activation Key",
        href: "/invalid-activation-key",
      },
      {
        title: "Error 500: Internal Server Error",
        href: "/error-500",
      },
    ],
  },
];
