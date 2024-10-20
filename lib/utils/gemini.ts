import axios from 'axios';
import OpenAI from 'openai';

// Helper function to get search results using Google Custom Search
async function searchCopingMechanisms(trigger: string): Promise<{ link: string; snippet: string } | null> {
  const apiKey = process.env.CUSTOM_SEARCH_API_KEY; // Google Custom Search API Key
  const cx = process.env.CUSTOM_SEARCH_ENGINE_ID;   // Custom Search Engine ID

  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=coping mechanisms for ${trigger} anxiety&key=${apiKey}&cx=${cx}`
    );
    const results = response.data.items;

    if (results && results.length > 0) {
      const { link, snippet } = results[0];
      return { link, snippet };
    }
  } catch (error) {
    console.error('Error searching for coping mechanisms:', error);
  }
  
  return null;
}

// Helper function to summarize using OpenAI
async function summarizeText(text: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: "system", content: "You are a helpful assistant summarizing coping mechanisms for the user's anxiety triggers." },
      { role: 'user', content: `Summarize how to cope with the anxiety trigger mentioned in the following text in 1-2 sentences: ${text}` }
    ],
  });

  return completion.choices[0].message.content?.trim() ?? '';
}

// Main function 
export async function fetchCopingMechanisms(triggers: string[]) {
  const copingMechanisms = [];

  for (const trigger of triggers) {
    try {
      const searchResult = await searchCopingMechanisms(trigger);

      if (searchResult) {
        const { link, snippet } = searchResult;

        // Summarize the snippet
        const summary = await summarizeText(snippet);

        // Add the trigger, summary, and link to the list
        copingMechanisms.push({ trigger, summary, link });
      } else {
        // Fallback for no results
        copingMechanisms.push({
          trigger,
          summary: 'No specific coping mechanism found for this trigger.',
          link: '',
        });
      }
    } catch (error) {
      console.error(`Error processing trigger "${trigger}":`, error);
      copingMechanisms.push({
        trigger,
        summary: 'Error occurred while searching for coping mechanisms.',
        link: '',
      });
    }
  }

  return copingMechanisms;
}

