import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_missions",
  title: "List AIA missions",
  description: "List the core missions of the Association Ivoirienne d'Astronomie.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify([
          { title: "Vulgariser les sciences de l'univers", description: "Rendre l'astronomie accessible à tous les publics" },
          { title: "Sensibiliser les jeunes", description: "Inspirer les futures générations aux carrières spatiales" },
          { title: "Organiser des observations", description: "Conférences et séances d'observation astronomique" },
          { title: "Favoriser l'inclusion", description: "Promouvoir la parité dans les domaines scientifiques" },
        ]),
      },
    ],
  }),
});