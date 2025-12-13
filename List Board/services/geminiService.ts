import { GoogleGenAI, Type } from "@google/genai";
import { Status, TaskItem } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTasksForGroup = async (groupTitle: string): Promise<Partial<TaskItem>[]> => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 relevant project management tasks for a group named "${groupTitle}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The task name" },
              status: { 
                type: Type.STRING, 
                enum: ["Working on it", "Done", "Stuck", ""],
                description: "Initial status of the task" 
              }
            },
            required: ["name", "status"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((item: any) => ({
      name: item.name,
      status: item.status as Status,
      person: null,
      date: new Date().toISOString().split('T')[0],
      selected: false
    }));

  } catch (error) {
    console.error("Failed to generate tasks:", error);
    return [];
  }
};