'use client'

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import Progress from '@/components/Progress';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import { CircleHelp, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import HomeButton from '@/components/HomeButton';

interface SearchResult {
  trigger: string;
  summary: string;
  link: string;
}

export default function SummaryPage() {
  const [latestResult, setLatestResult] = useState<SearchResult[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestUserLog = async () => {
      try {
        const userLogsRef = collection(db, 'userLogs');
        const q = query(userLogsRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        console.log(querySnapshot);
        console.log(querySnapshot.docs[0].data());

        if (!querySnapshot.empty) {
          const latestLog = querySnapshot.docs[0].data();
          if (latestLog.searchResults && latestLog.searchResults.length > 0) {
            setLatestResult(latestLog.searchResults);
          } else {
            setLatestResult([]);
          }

          console.log(latestResult);
        }
      } catch (error) {
        console.error("Error fetching user logs: ", error);
        setLatestResult([]); 
      }
      setLoading(false);
    };

    fetchLatestUserLog();
  }, []);

  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col px-[10rem]">
        <h1 className="text-2xl font-bold font-mono text-teal-800">Possible anxiety triggers</h1>
        <span className="flex items-center gap-x-2">
          <CircleHelp strokeWidth={1.25} size={18} />
          <p className="text-sm text-gray-700">These are the triggers that we found in your messages.</p>
        </span>
        <div className="flex gap-x-6 max-w-[54rem] items-start mt-8">
          {loading ? (
            <ClipLoader
              color="#0f766e"
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="mx-auto"
            />
          ) : (
            latestResult.length > 0 ? (
              latestResult.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-y-2 max-w-[18rem]"
              >
                <h2 className="text-lg font-bold font-mono text-teal-800">{result.trigger}</h2>
                <p className="text-sm text-gray-700">{result.summary}</p>
              
                <div className="flex items-center hover:underline transition-all duration-300 text-sm gap-x-4 px-2 py-1 border-black border-[1px] w-fit rounded-full">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="flex text-sm items-center gap-x-2">
                    <span>Learn more</span><ExternalLink className="hover:scale-105 transition-all duration-300" size={16} strokeWidth={1.5} />
                  </a>
                </div>
              </motion.div>
              ))
            ) : (
              <p>No search results available.</p>
            )
          )}
        </div>
      </div>
      <div className="absolute bottom-0 justify-center mb-8">
        <Progress currentStep={4} />
      </div>
      <div className="flex justify-end space-x-10">
        <HomeButton />
      </div>
    </div>
  );
}
