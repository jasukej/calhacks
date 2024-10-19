import MenuButton from '@/components/MenuButton';
import { getHumeAccessToken } from '@/lib/hume'
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/chat/Chat"), {
  ssr: false,
});

async function TalkPage() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    return <div>Error: Unable to fetch Hume access token</div>;
  }

  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken} />
    </div>
  )
}

export default TalkPage
