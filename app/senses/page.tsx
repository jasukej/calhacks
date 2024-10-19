'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ear, Eye, Hand } from 'lucide-react';
import MenuButton from '@/components/MenuButton';
import { assistantOptions } from '@/lib/constants/sensesAssistant';
import { vapi } from '@/lib/vapi.sdk';

function SensesPage() {
  const [currentSense, setCurrentSense] = useState<'hear' | 'see' | 'feel'>('hear');
  const [userInputs, setUserInputs] = useState({ hear: [], see: [], feel: [] });
  const [feedback, setFeedback] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // Step 1: Start the assistant when the component is mounted / user presses start button
  const startAssistant = () => {
    vapi.start(assistantOptions);
    setConnecting(true);
  };

  // Step 2: Stop the assistant
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
      setFeedback('Great job! You’ve completed the exercise.');
      endCall(); // End the call after finishing all senses
    }
  };

  // Step 3: Update user input state when they provide a response
  const handleUserResponse = (response: any) => {
    const newInput = response.transcription;  // capturing user speech transcription
    if (!isSenseComplete(currentSense)) {
      setUserInputs((prev) => ({
        ...prev,
        [currentSense]: [...prev[currentSense], newInput],
      }));
      setFeedback(`Great! "${newInput}" added to ${currentSense} list.`);
    }

    // After 3 valid responses, move to the next sense
    if (isSenseComplete(currentSense)) {
      moveToNextSense();
      setFeedback(`Moving on to ${currentSense}. What can you ${currentSense}?`);
    }
  };

  // Step 4: Initialize VAPI event listeners
  useEffect(() => {
    // Event listener to handle user responses (message from VAPI)
    vapi.on('message', (message) => {
      if (message.transcription) {
        handleUserResponse(message);
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

  }, [currentSense]);

  const senses = [
    { title: 'Hear', icon: Ear },
    { title: 'See', icon: Eye },
    { title: 'Feel', icon: Hand },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200">
      <div className="text-2xl font-semibold font-serif mb-4 text-teal-600">Name 3 things you can...</div>
      <div className="p-8 rounded-lg w-full h-full max-w-4xl">
        <div className="flex">
          {senses.map((sense, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 min-w-1/3px-4 text-center">
                {React.createElement(sense.icon, { strokeWidth: 1, className: 'w-16 h-16 mx-auto mb-4' })}
                <h2 className="text-2xl font-semibold font-serif mb-8 text-black">{sense.title}</h2>
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
                      className="text-gray-600 mb-2 text-center px-4 py-2 text-lg"
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
      <div className="mt-8 text-xl font-semibold text-teal-700">{feedback}</div>
      <MenuButton from="senses" />
      {!connected ? (
        <button className="mt-4 btn-primary" onClick={startAssistant}>Start</button>
      ) : (
        <button className="mt-4 btn-primary" onClick={endCall}>End</button>
      )}
    </div>
  );
}

export default SensesPage;
