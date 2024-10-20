import React from 'react'
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

interface PostProps {
    index: number;
    content: string;
    createdAt: Date;
}

function Post({ index, content, createdAt }: PostProps) {
  return (
    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-800">{content}</p>
        <p className="text-xs text-gray-500 mt-2">
        {(new Date(createdAt)).toLocaleTimeString()} at {(new Date(createdAt)).toLocaleDateString()}
        </p>
        <Button className="mt-4 border-teal-950 cursor-pointer border-[0.5px] px-4 py-2 flex items-center space-x-2 bg-transparent hover:bg-teal-700 text-teal-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105">
            <Heart strokeWidth={1.2} className="w-4 h-4 mr-2" />
            Respond
        </Button>
    </div>
  )
}

export default Post