'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ear, Eye, Hand, Mic, Phone } from 'lucide-react';
import Progress from '@/components/Progress';
import MenuButton from '@/components/MenuButton';
import { assistantOptions } from '@/lib/constants/sensesAssistant';
import { vapi } from '@/lib/vapi.sdk';
import { Button } from '@/components/ui/button';
import axios from 'axios';

function SensesPage() {
  const [currentSense, setCurrentSense] = useState<'hear' | 'see' | 'feel'>('hear');
  const [userInputs, setUserInputs] = useState({ hear: [], see: [], feel: [] });
  const [feedback, setFeedback] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [latestInput, setLatestInput] = useState<string | null>(null);

  // Start the assistant when the component is mounted / user presses start button
  const startAssistant = () => {
    vapi.start(assistantOptions);
    setConnecting(true);
  };

  // Stop the assistant
  const endCall = () => {
    vapi.stop();
    setConnected(false);
  };

  // Check if the current sense has 3 inputs
  const isSenseComplete = (sense: 'hear' | 'see' | 'feel') => {
    return userInputs[sense].length >= 3;
  };

  // Move to the next sense after completing the current one
  const moveToNextSense = () => {
    if (currentSense === 'hear') {
      setCurrentSense('see');
    } else if (currentSense === 'see') {
      setCurrentSense('feel');
    } else {
      setFeedback('Great job! You\'ve completed the exercise.');
      endCall(); // End the call after finishing all senses
    }
    setLatestInput(null); // Reset latest input when moving to next sense
  };

  const validateInputWithLLM = async (sense: string, input: string): Promise<string | null> => {
    try {
      const response = await axios.post('/api/validate-input', { sense, input });
      return response.data.validatedInput;
    } catch (error) {
      console.error('Error validating input with LLM:', error);
      return null;
    }
  };
  
  
  const handleUserResponse = async (response: any) => {
    const rawInput = response.transcript;
  
    // Validate input with the LLM
    const validatedInput = await validateInputWithLLM(currentSense, rawInput);
    console.log("OpenAI response:", validatedInput);
  
    const containsNull = validatedInput?.toLowerCase().includes('null');
    const maxLength = 20; // You can tweak this limit for your needs
    if (validatedInput && !containsNull && validatedInput.length <= maxLength && !isSenseComplete(currentSense)) {
      setUserInputs((prev) => ({
        ...prev,
        [currentSense]: [...prev[currentSense], validatedInput],
      }));
  
      setFeedback(`Great! "${validatedInput}" added to the "${currentSense}" list.`);
      setLatestInput(validatedInput);
  
      // Move to the next sense if 3 inputs have been provided for the current sense
      if (userInputs[currentSense].length + 1 === 3) {
        setTimeout(() => {
          moveToNextSense();
        }, 1000); // Small delay to give feedback before moving to the next sense
      }
    } else {
      setFeedback('That input is not valid for this sense, try again.');
    }
  };  

  // Step 4: Initialize VAPI event listeners
  useEffect(() => {
    // Event listener to handle user responses (message from VAPI)
    vapi.on('message', (message) => {
      if (message.type == 'transcript' && message.role == 'user' && message.transcriptType == 'final') {
        console.log(message);
        handleUserResponse(message);
        console.log("User inputs:", userInputs);
      }
    });

    // Event listeners to manage assistant state
    vapi.on('call-start', () => {
      setConnecting(false);
      setConnected(true);
    });

    vapi.on('call-end', () => {
      setConnecting(false);
      setConnected(false);
    });

  }, [currentSense, userInputs]);

  const senses = [
    { title: 'Hear', icon: Ear },
    { title: 'See', icon: Eye },
    { title: 'Feel', icon: Hand },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200">
      <div className="text-xl font-regular font-mono mb-4 text-black">Name 3 things you can...</div>
      <div className="p-8 rounded-lg w-full h-full max-w-4xl mb-6">
        <div className="flex">
          {senses.map((sense, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 min-w-1/3px-4 text-center">
                {React.createElement(sense.icon, { strokeWidth: 1, className: 'w-16 h-16 mx-auto mb-4' })}
                <h2 className="text-2xl font-semibold font-mono mb-8 text-black">{sense.title}</h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-left"
                >
                  {userInputs[sense.title.toLowerCase() as 'hear' | 'see' | 'feel'].map((input, inputIndex) => (
                    <motion.div
                      key={inputIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: inputIndex * 0.2 }}
                      className={`text-gray-600 border-gray-800 border-1 rounded-md mb-2 text-center px-4 py-2 text-lg ${input === latestInput ? 'bg-gray-200 border-[1px] border-gray-500' : ''}`}
                    >
                      {input}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              {index < senses.length - 1 && <div className="w-px bg-gray-500 mx-4"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* <div className="mt-8 text-xl font-semibold text-teal-700">{feedback}</div> */}
      <MenuButton from="senses" />
      {!connected ? (
          <Button className="text-md hover:scale-105 transition-all duration-300 ease-in-out font-mono btn-primary flex items-center gap-2" onClick={startAssistant}>
            <Mic className="w-6 h-6" />
            <span>START</span>
          </Button>
        ) : (
          <Button className="text-md hover:scale-105 transition-all duration-300 ease-in-out font-mono btn-primary flex items-center gap-2" onClick={endCall} variant="destructive">
            <Phone className="w-6 h-6 opacity-60" />
            <span>END</span>
          </Button>
        )}
        <div className="w-full absolute flex bottom-0 justify-center">
            <Progress currentStep={2} />
        </div>
    </div>
  );
}

export default SensesPage;
