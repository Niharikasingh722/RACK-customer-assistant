
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const listTicketsTool: FunctionDeclaration = {
  name: "list_tickets",
  description: "Retrieve a list of all active customer support tickets.",
  parameters: { type: Type.OBJECT, properties: {} }
};

const getTicketDetailsTool: FunctionDeclaration = {
  name: "get_ticket_details",
  description: "Get full details for a specific ticket by its ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      ticketId: { type: Type.STRING, description: "The unique ID of the ticket (e.g., TKT-1001)" }
    },
    required: ["ticketId"]
  }
};

const updateTicketTool: FunctionDeclaration = {
  name: "update_ticket",
  description: "Update the status or priority of a support ticket.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      ticketId: { type: Type.STRING },
      status: { type: Type.STRING, enum: ["open", "in-progress", "resolved", "escalated"] },
      priority: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] }
    },
    required: ["ticketId"]
  }
};

const escalateToHumanTool: FunctionDeclaration = {
  name: "escalate_to_human",
  description: "Trigger human-in-the-loop escalation when AI cannot resolve or lacks authority.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: "Detailed reason for escalation." }
    },
    required: ["reason"]
  }
};

export const chatWithGemini = async (messages: { role: string; content: string }[]) => {
  const model = 'gemini-3-pro-preview';
  
  const history = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{
          functionDeclarations: [
            listTicketsTool,
            getTicketDetailsTool,
            updateTicketTool,
            escalateToHumanTool
          ]
        }]
      }
    });

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
