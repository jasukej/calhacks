import { House } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
export default function HomeButton() {
    const router = useRouter();
  return (
    <Button
    onClick={() => router.push('/')}
    className="mt-8 border-teal-950 cursor-pointer border-[0.5px] px-4 py-2 flex items-center space-x-2 bg-transparent hover:bg-teal-700 text-teal-700 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
    >
        <span>Back to <House strokeWidth={1.2} className="inline-block w-4 h-4 ml-0.5 mb-0.5" /></span>
    </Button>
  );
}
