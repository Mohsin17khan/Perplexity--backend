import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { internetSearch } from "./internet.service.js";


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


const mistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});


const searchInternetTool = tool(internetSearch, {
  name: "searchInternet",
  description:
    "Use this tool to search internet for relevant information to answer user question, Input should be a search query wil be a list of search ",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet"),
  }),
});


const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
});


export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: messages.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    })
  });

  return response.messages[response.messages.length - 1].text;  // ye set hora hai 
}


export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles for chat conversations.
      
      User will provide you with the first message of a chat conversation , and you will generate a title that 
      captures the essence of the conversation in 2-4 words. The title shoudl be clear, relevant, and engaging,
      giving users a quick understanding of the chat's topic.
      `),

    new HumanMessage(`
        Generate a title for a chat conversation based on the following first message:
        "${message}"
        `),
  ]);

  return response.text;
}

