import axios from 'axios';

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessageToOpenAI = async (message, apiKey) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for Nav Accounts, a business solutions and accounting services company. Provide concise, professional responses focused on accounting, tax, and business matters. And try to be as helpful as possible and a real human, the gender is girl."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limit hit - wait and retry
        retries++;
        if (retries < MAX_RETRIES) {
          await sleep(RETRY_DELAY * retries);
          continue;
        }
      }
      
      // Handle specific error types
      if (error.response?.status === 429) {
        throw new Error("We're experiencing high traffic. Please try again in a few moments.");
      } else if (error.response?.status === 401) {
        throw new Error("Authentication error. Please contact support.");
      } else if (error.response?.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
      
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }
};
