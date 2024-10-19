"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { sendSMStoContact } from "@/hooks/sendSMStoContact";
export default function Home() {

  const router = useRouter();

  const handleButtonClick = async () => {
    router.push('/breathe');
    await sendSMStoContact();
  }

  return (
    <div className="relative">
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-200">
      <button 
        className="relative w-64 h-64 cursor-pointer"
        onClick={handleButtonClick}>
        {/* Pulsing blurred background */}
        <div 
          className="absolute inset-0 bg-white rounded-full filter blur-xl animate-pulse"
          style={{
            animation: 'pulse 3s infinite, move 10s infinite',
          }}
        ></div>
        
        {/* Button text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-serif cursor-pointer font-bold text-teal-600 z-10 hover:scale-105 transition-all duration-300">
            tap me
          </span>
        </div>
      </button>
    </div>

    <style jsx>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      @keyframes move {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(8px, 8px); }
        50% { transform: translate(0, 16px); }
        75% { transform: translate(-8px, 8px); }
      }
    `}</style>

    <Button
      onClick={() => router.push('/share')}
      className="border-teal-950 cursor-pointer absolute bottom-8 right-8 border-[0.5px] px-4 py-2 flex items-center space-x-2 bg-transparent hover:bg-teal-700 text-teal-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <span>i want to share</span>
      <ArrowRight className="w-4 h-4" />
    </Button>
  </div>
  );
}
