import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_activities",
  title: "List AIA activities",
  description: "List the main activities and programs run by the Association Ivoirienne d'Astronomie.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify([
          {
            title: "AstroTour Côte d'Ivoire",
            description: "Tournée scientifique dans les villes du pays pour sensibiliser le grand public, les jeunes et les élèves à l'astronomie.",
          },
          {
            title: "Soirées d'observation",
            description: "Événements publics pour observer la Lune, les étoiles et les planètes avec des télescopes accessibles à tous.",
          },
          {
            title: "AstroPause",
            description: "Conférences à l'université pour débattre des enjeux du spatial ivoirien et africain.",
          },
          {
            title: "Ateliers scolaires",
            description: "Séances éducatives dans les écoles pour initier les plus jeunes à l'astronomie.",
          },
        ]),
      },
    ],
  }),
});