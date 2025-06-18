"use client";

import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/loading';

// Lazy load the heavy chat page component
const ChatPageComponent = dynamic(() => import('./ChatPageComponent'), {
  loading: () => <Loading variant="chat" />,
  ssr: false
});

export default function ChatPage() {
  return <ChatPageComponent />;
}
