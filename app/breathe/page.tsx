'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import MenuButton from '@/components/MenuButton';
import { useTTS } from '@cartesia/cartesia-js/react';

// Backend: call Cartesia API for every cycle
function BreathePage() {
    const [breathePhase, setBreathePhase] = useState<string>('inhale');
    const [sliderProgress, setSliderProgress] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    // Initialize TTS
    const tts = useTTS({
        apiKey: process.env['NEXT_PUBLIC_CARTESIA_API_KEY'] || '',
        sampleRate: 44100,
    })

    // Helper for playing breathing phase
    const handlePlay = async (text: string) => {
        // Begin buffering the audio.
        const response = await tts.buffer({
            model_id: "sonic-english",
            voice: {
                mode: "id",
                id: "21b81c14-f85b-436d-aff5-43f2e788ecf8",
                "__experimental_controls": {
                    "speed": "slow",
                    "emotion": [
                        "positivity:high",
                        "curiosity"
                    ]
                }
            },
            transcript: text,
        });

        // Immediately play the audio.
        await tts.play();
    }

    // Start breathing cycle
    useEffect(() => {
        if (!isStarted) return;

        let isMounted = true;
        let animationFrameId: number;

        const breathingCycle = async () => {
            if (!isMounted) return;

            // Inhale phase
            setBreathePhase('inhale');
            handlePlay('breathe in');
            const inhaleStartTime = Date.now();
            const animateInhale = () => {
                const elapsed = Date.now() - inhaleStartTime;
                const progress = Math.min(elapsed / 4000, 1);
                setSliderProgress(progress * 100);
                if (progress < 1 && isMounted) {
                    animationFrameId = requestAnimationFrame(animateInhale);
                }
            };
            animateInhale();
            await new Promise(resolve => setTimeout(resolve, 4000));

            if (!isMounted) return;
            // Hold phase
            setBreathePhase('hold');
            handlePlay('hold your breath');
            await new Promise(resolve => setTimeout(resolve, 7000));

            if (!isMounted) return;
            // Exhale phase
            setBreathePhase('exhale');
            handlePlay('breathe out');
            const exhaleStartTime = Date.now();
            const animateExhale = () => {
                const elapsed = Date.now() - exhaleStartTime;
                const progress = Math.max(1 - elapsed / 8000, 0);
                setSliderProgress(progress * 100);
                if (progress > 0 && isMounted) {
                    animationFrameId = requestAnimationFrame(animateExhale);
                }
            };
            animateExhale();
            await new Promise(resolve => setTimeout(resolve, 8000));
        };

        const startBreathing = async () => {
            while (isMounted) {
                await breathingCycle();
            }
        };

        startBreathing();

        return () => {
            isMounted = false;
            cancelAnimationFrame(animationFrameId);
        };
    }, [isStarted]);

    const handleStart = () => {
        setIsStarted(true);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200">
            {!isStarted ? (
                <button
                    onClick={handleStart}
                    className="px-6 py-3 text-white bg-teal-500 rounded-full hover:bg-teal-600 transition-colors"
                >
                    Start Breathing Exercise
                </button>
            ) : (
                <>
                    <div className="relative w-64 h-64">
                        <motion.div
                            className="absolute inset-0 bg-white rounded-full filter blur-md"
                            animate={{
                                scale: breathePhase === 'inhale' ? 1.5 : breathePhase === 'exhale' ? 0.8 : 1.5,
                            }}
                            transition={{
                                duration: breathePhase === 'inhale' ? 4 : breathePhase === 'exhale' ? 8 : 0,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                    <p className="mt-24 text-2xl font-semibold font-serif text-teal-600">
                        {breathePhase === 'inhale' ? 'breathe in' : breathePhase === 'exhale' ? 'breathe out' : 'hold'}
                    </p>
                    <div className="w-64 h-1 bg-teal-100 rounded-full mt-4">
                        <div 
                            className="h-full bg-teal-500 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${sliderProgress}%` }}
                        ></div>
                    </div>
                </>
            )}
            <MenuButton from="breathe" />
        </div>
    )
}

export default BreathePage
