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
    heading: "Go Deeper",
    items: [
      {
        title: "Comment Generator",
        href: "/comment-generator",
      },
      {
        title: "Virality Checker",
        href: "/virality-checker",
      },
      {
        title: "Post Summarizer",
        href: "/post-summarizer",
      },
      {
        title: "Similar Post Generator",
        href: "/Similar-Post-Generator",
      },
      {
        title: "Reply to Comments",
        href: "/Reply-to-Comments",
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
        title: "Brand Voice",
        href: "/brand-voice",
      },
      {
        title: "Native Language Support",
        href: "/native-language-support",
      },
      {
        title: "Disabling Olly on Specific Websites",
        href: "/disabling-olly-on-specific-websites",
      },
    ],
  },
];
