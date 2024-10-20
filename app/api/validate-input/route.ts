import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {

    const { sense, input } = await req.json();

    // TODO: make this more lenient, and allow for more creative inputs
    const prompt = `
      The user is doing a grounding exercise focused on their sense of ${sense}.
      They gave this input: "${input}". 
      
      Please extract the specific word or phrase that corresponds to something they can ${sense}. 
      For example:
      - If they said "I can see a car", return "car".
      - If they said "I hear birds chirping", return "birds chirping".
      - If they said "I feel the sun on my skin", return "sun on my skin".
      
      Ignore unnecessary words like "I", "can", "feel", "hear", or "see". 
      Only return the relevant description of what they ${sense}. 

      If the input is not relevant to the sense, like 'hello', return "null".
    `;

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant trained to extract user observations.' },
        { role: 'user', content: prompt },
      ],
    });

    let validatedInput = completion.choices[0]?.message.content?.trim() ?? '';
    console.log("OpenAI completions:", validatedInput);

    // basic checks: filter out long responses or irrelevant input
    if (validatedInput.split(' ').length > 4) {
      validatedInput = 'null';
    }

    // Return null if input is not valid for the current sense
    if (validatedInput.toLowerCase() === 'null' || validatedInput.toLowerCase() === 'undefined') {
        return new Response(JSON.stringify({ validatedInput: null }), { status: 200 });
      }
  
      return new Response(JSON.stringify({ validatedInput }), { status: 200 });
    } catch (error) {
      console.error('Error validating input with LLM:', error);
      return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 500 });
    }
}
