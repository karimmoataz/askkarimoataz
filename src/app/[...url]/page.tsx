import ChatWrapper from '@/components/ChatWrapper';
import { ragChat } from '@/lib/rag-chat';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';
import React from 'react';

// Adjusting PageProps for Next.js dynamic routing
interface PageProps {
  params: Promise<{
    url: string[]; // Ensure params.url is an array of strings
  }>;
}

// Function to reconstruct the URL from `url` array
function reconstructedUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component));
  return decodedComponents.join('/');
}

// Handling the page component as an async function
const Page = async ({ params }: PageProps) => {
  // Await the promise for params
  const resolvedParams = await params;
  const { url } = resolvedParams;
  const sessionCookie = (await cookies()).get('sessionId')?.value;

  // Ensure that `params.url` is a string[] and pass it to the reconstructedUrl function
  const reconstructedUrlValue = reconstructedUrl({ url });

  const sessionId = `${reconstructedUrlValue}--${sessionCookie}`.replace(/\//g, '');

  const isAlreadyIndexed = await redis.sismember('indexed-urls', reconstructedUrlValue);

  // Get initial messages from ragChat
  const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: 'html',
      source: reconstructedUrlValue,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });
    await redis.sadd('indexed-urls', reconstructedUrlValue);
  }

  // Return the ChatWrapper component
  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
};

export default Page;
