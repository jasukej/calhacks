'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import MenuButton from '@/components/MenuButton';

function BreathePage() {
    const router = useRouter();

    const [breathePhase, setBreathePhase] = useState<string>('inhale');
    const [sliderProgress, setSliderProgress] = useState(0);

    useEffect(() => {
        let isMounted = true;
        let animationFrameId: number;

        const breathingCycle = async () => {
            if (!isMounted) return;

            // Inhale phase
            setBreathePhase('inhale');
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
            await new Promise(resolve => setTimeout(resolve, 7000));

            if (!isMounted) return;
            // Exhale phase
            setBreathePhase('exhale');
            const exhaleStartTime = Date.now();
            const animateExhale = () => {
                const elapsed = Date.now() - exhaleStartTime;
                const progress = Math.max(1 - elapsed / 8000, 0);
                setSliderProgress((1 - progress) * 100);
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
    }, []);



  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200">
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
      <MenuButton from="breathe" />
    </div>
  )
}

export default BreathePage