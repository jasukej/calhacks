"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import Post from '@/components/Post';
interface Post {
  id: string;
  content: string;
  createdAt: Date;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
      })) as Post[];
      setPosts(postList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-mono text-teal-800 mb-6">Community Forum</h1>
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Post key={index} index={index} content={post.content} createdAt={post.createdAt} />
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => router.push('/share')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-mono rounded-full font-bold py-2 px-6 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <PlusCircle strokeWidth={1.2} className="w-4 h-4 mr-2" />
            <span>New Post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
