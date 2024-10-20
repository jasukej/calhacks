"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight, House } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import HomeButton from '@/components/HomeButton';

function SharePage() {
  const [post, setPost] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming you have Firebase initialized and auth set up
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const db = getFirestore();
      const postsCollection = collection(db, 'posts');
      
      await addDoc(postsCollection, {
        content: post,
        userId: user.uid,
        createdAt: Date.now()
      });

      console.log('Post saved successfully');
      setPost('');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200 px-[10rem] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold font-mono text-teal-800 mb-6">How are you feeling today?</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Share your thoughts..."
          />
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 justify-end font-mono text-white rounded-full font-bold py-2 px-6 transition duration-300 ease-in-out transform"
          >
            POST
          </Button>
        </form>
      </div>
      <div className="flex justify-center space-x-10">
      <HomeButton />

        <Button
        onClick={() => router.push('/forum')}
        className="mt-8 mr-4 border-teal-950 cursor-pointer border-[0.5px] px-4 py-2 flex items-center space-x-2 bg-teal-700 hover:bg-teal-800 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <span className="flex items-center">
          Forum
          <ArrowRight strokeWidth={1.2} className="w-4 h-4 ml-1 hover:translate-x-[1px]" />
        </span>
      </Button>
      </div>
    </div>
  );
}

export default SharePage;
