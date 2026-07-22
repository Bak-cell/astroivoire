import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_upcoming_events",
  title: "List upcoming events",
  description: "List upcoming AIA events (observations, tours, trainings).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify([
          { date: "12 juillet 2025", title: "Nuit de la Lune", location: "UFR SSMT, Abidjan", type: "Observation", status: "À venir" },
          { date: "Septembre 2025", title: "AstroTour II", location: "Bouaké, Yamoussoukro, Korhogo", type: "Tournée", status: "Planifié" },
          { date: "Novembre 2025", title: "Formation enseignants", location: "Abidjan", type: "Formation", status: "Inscription ouverte" },
        ]),
      },
    ],
  }),
});