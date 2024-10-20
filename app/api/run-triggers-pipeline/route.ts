import { HumeClient } from 'hume';
import { fetchCopingMechanisms } from '@/lib/utils/gemini';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper to process message and remove stopwords
async function extractKeyPhrases(content: string): Promise<string[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: "system", content: "You are a helpful assistant helping the user recover from their anxiety attack." }, 
      { role: 'user', content: `Extract 1-3 anxiety triggers the user has from the following messages: ${content} and return them in an array of strings. Do not return anything else.` }
    ],
  });

  console.log(completion.choices[0].message.content);

  // Parse the result from OpenAI as JSON
  let result: string[] = [];

  try {
    const cleanedContent = completion?.choices[0].message.content?.replace(/```json|```/g, '').trim() ?? '';
    result = JSON.parse(cleanedContent);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  return result;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { chatGroupId } = await req.json();

  console.log(chatGroupId);

  if (!chatGroupId) {
    return NextResponse.json({ error: 'chatGroupId is required' }, { status: 400 });
  }

  const client = new HumeClient({
    apiKey: process.env.HUME_API_KEY,
  });

  try {
    let pageNumber = 0;
    const pageSize = 32;
    let allChatEvents: any[] = [];
    let morePagesAvailable = true;

    while (morePagesAvailable) {
      const response = await client.empathicVoice.chatGroups.listChatGroupEvents(chatGroupId, {
        pageNumber,
        pageSize,
        ascendingOrder: true,
      });

      console.log(response);

      const chatEvents = response.eventsPage;
      allChatEvents = allChatEvents.concat(chatEvents); 

      if (chatEvents.length < pageSize) {
        morePagesAvailable = false; 
      } else {
        pageNumber += 1;  
      }
    }

    // Filter messages based on emotion features
    const filteredMessages = (allChatEvents.filter(event => {
      const emotions = JSON.parse(event.emotionFeatures ?? '{}');
      return emotions.Anxiety > 0.01;
    })).map(event => event.messageText).join(' ');

    const triggers = await extractKeyPhrases(filteredMessages);

    const searchResults = await fetchCopingMechanisms(triggers);

    try {
      const userLogsRef = collection(db, 'userLogs');
      const docRef = await addDoc(userLogsRef, { createdAt: serverTimestamp(), searchResults });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error('Failed to add document to Firebase');
    }

    return NextResponse.json(searchResults);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process messages' }, { status: 500 });
  }
}
