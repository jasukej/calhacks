import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {

    const { sense, input } = await req.json();

    // TODO: make this more lenient, and allow for more creative inputs
    const prompt = `The user is doing a grounding exercise. They are focusing on the sense of ${sense}. 
    They gave this input: "${input}". From the input, please return just the word or phrase they can actually ${sense}. 
    For example, if they said "I can see a car", you would return "car".`;

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    let validatedInput = completion.choices[0]?.message.content?.trim() ?? '';
    console.log("OpenAI completions:", validatedInput);

    // basic checks: filter out long responses or irrelevant input
    if (validatedInput.split(' ').length > 3) {
      validatedInput = 'null';
    }

    // Return null if input is not valid for the current sense
    if (validatedInput.toLowerCase() === 'null') {
        return new Response(JSON.stringify({ validatedInput: null }), { status: 200 });
      }
  
      return new Response(JSON.stringify({ validatedInput }), { status: 200 });
    } catch (error) {
      console.error('Error validating input with LLM:', error);
      return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 500 });
    }
}
