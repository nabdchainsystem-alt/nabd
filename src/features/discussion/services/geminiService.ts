import { Message } from "../types";

export interface Chat {
  sendMessageStream: (params: { message: string }) => AsyncGenerator<{ text: string }, void, unknown>;
}

export interface GenerateContentResponse {
  text: () => string;
}

export const createChatSession = (): Chat => {
  return {
    sendMessageStream: async function* ({ message }) {
      // Mock streaming response
      const response = `Echo: ${message} (This is a mock AI response)`;
      const chunks = response.split(' ');
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
        yield { text: chunk + ' ' };
      }
    }
  };
};

export const sendMessageStream = (
  chat: Chat,
  message: string,
  history: Message[]
): AsyncGenerator<{ text: string }, void, unknown> => {
  return chat.sendMessageStream({ message });
};