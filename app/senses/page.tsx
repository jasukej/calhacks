'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ear, Eye, Hand } from 'lucide-react';
import MenuButton from '@/components/MenuButton';

function SensesPage() {
  const [currentSense, setCurrentSense] = useState<'hear' | 'see' | 'feel'>('hear');
  const [userInputs, setUserInputs] = useState({ hear: [], see: [], feel: [] });
  const [feedback, setFeedback] = useState('');

  // sampled data for now
  const sampleData = {
    hear: ['birds chirping', 'car honking', 'music playing'],
    see: ['blue sky', 'tall building', 'green tree'],
    feel: ['soft pillow', 'warm sunlight', 'cold breeze'],
  };

  // check if user has completed the current sense
  const isSenseComplete = (sense: 'hear' | 'see' | 'feel') => {
    return userInputs[sense].length >= 3;
  };

  // move to the next sense
  const moveToNextSense = () => {
    if (currentSense === 'hear') setCurrentSense('see');
    else if (currentSense === 'see') setCurrentSense('feel');
  };

  // hard code for now, simulate user input
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSenseComplete(currentSense)) {
        const newInput = sampleData[currentSense][userInputs[currentSense].length];
        setUserInputs((prev) => ({
          ...prev,
          [currentSense]: [...prev[currentSense], newInput],
        }));
        setFeedback(`Great! "${newInput}" added to ${currentSense} list.`);

        if (isSenseComplete(currentSense)) {
          if (currentSense !== 'feel') {
            moveToNextSense();
            setFeedback(`Moving on to ${currentSense}. What can you ${currentSense}?`);
          } else {
            setFeedback('Great job! You\'ve completed the exercise.');
            clearInterval(interval);
          }
        }
      }
    }, 2000); 

    return () => clearInterval(interval);
  }, [currentSense, userInputs]);

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
    </div>
  );
}

export default SensesPage;
