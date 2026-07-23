import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact",
  title: "Get contact info",
  description: "Get AIA contact information: email, address, and social links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          email: "associationivoirienneastro@gmail.com",
          address: "UFR SSMT, Université Félix Houphouët-Boigny, Cocody, Abidjan, Côte d'Ivoire",
          social: {
            facebook: "https://www.facebook.com/Association.Ivoirienne.Astronomie",
          },
        }),
      },
    ],
  }),
});