'use client'

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface SearchResult {
  trigger: string;
  summary: string;
  link: string;
}

export default function SummaryPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchLatestUserLogs = async () => {
      const userLogsRef = collection(db, 'userLogs');
      const q = query(userLogsRef, orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestLog = querySnapshot.docs[0].data();
        setSearchResults(latestLog.searchResults);
      }
    };

    fetchLatestUserLogs();
  }, []);

  return (
    <div>
      <h1>Summary</h1>
      {searchResults.map((result, index) => (
        <div key={index}>
          <h2>{result.trigger}</h2>
          <p>{result.summary}</p>
          <a href={result.link} target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </div>
      ))}
    </div>
  );
}
