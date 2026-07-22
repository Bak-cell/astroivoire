import { defineMcp } from "@lovable.dev/mcp-js";
import getOrganization from "./tools/get-organization";
import listMissions from "./tools/list-missions";
import listActivities from "./tools/list-activities";
import listUpcomingEvents from "./tools/list-events";
import getContact from "./tools/get-contact";

export default defineMcp({
  name: "aia-mcp",
  title: "AIA — Association Ivoirienne d'Astronomie",
  version: "0.1.0",
  instructions:
    "Public MCP server for the Association Ivoirienne d'Astronomie (AIA). Use these tools to answer questions about AIA's mission, activities, upcoming events, and contact info.",
  tools: [getOrganization, listMissions, listActivities, listUpcomingEvents, getContact],
});