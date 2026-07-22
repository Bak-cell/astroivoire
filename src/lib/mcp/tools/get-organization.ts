import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_organization",
  title: "Get organization info",
  description: "Get information about the Association Ivoirienne d'Astronomie (AIA): mission, founding, and location.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          name: "Association Ivoirienne d'Astronomie (AIA)",
          founded: 2021,
          city: "Abidjan",
          country: "Côte d'Ivoire",
          tagline: "Faisons briller les étoiles au cœur de l'Afrique",
          summary:
            "Organisation scientifique fondée en 2021 à Abidjan qui vulgarise l'astronomie et développe la culture scientifique et spatiale en Côte d'Ivoire.",
          website: "https://astroivoire.lovable.app",
        }),
      },
    ],
  }),
});