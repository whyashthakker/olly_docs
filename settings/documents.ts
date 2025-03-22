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
