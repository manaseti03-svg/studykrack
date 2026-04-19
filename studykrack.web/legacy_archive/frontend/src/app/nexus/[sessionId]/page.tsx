'use client';

import { useAuth } from '@/providers/AuthProvider';
import AppShell from '@/components/nexus/AppShell';
import ChatWindow from '@/components/nexus/ChatWindow';
import { useChatSession } from '@/hooks/useChatSession';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Session } from '@/lib/firestore-service';
import { AgentMode } from '@/services/agentService';

export default function ChatSessionPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const { messages, loading, sendMessage } = useChatSession(sessionId, user?.uid || null);

  useEffect(() => {
    async function verifySession() {
      if (!sessionId || !user) return;
      
      try {
        const docRef = doc(db, 'sessions', sessionId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId !== user.uid) {
            router.push('/nexus');
            return;
          }
          setSession({ id: docSnap.id, ...data } as Session);
        } else {
          router.push('/nexus');
        }
      } catch (err) {
        console.error('Error verifying session:', err);
        router.push('/nexus');
      } finally {
        setLoadingSession(false);
      }
    }

    verifySession();
  }, [sessionId, user, router]);

  if (loadingSession) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-secondary animate-pulse font-headline font-black text-2xl uppercase italic tracking-tighter">
            Synchronizing Link...
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeSessionId={sessionId}>
      <div className="h-full">
        <ChatWindow 
          messages={messages} 
          loading={loading} 
          onSendMessage={(content) => sendMessage(content, (session?.mode as AgentMode) || 'Socratic')} 
        />
      </div>
    </AppShell>
  );
}
