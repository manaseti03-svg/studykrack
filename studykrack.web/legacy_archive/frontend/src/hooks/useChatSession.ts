'use client';

import { useState, useEffect } from 'react';
import { FirestoreService, Message, Session } from '@/lib/firestore-service';
import { processCognitiveMission } from '@/app/actions/ai-tutor';
import { AgentMode } from '@/services/agentService';

export function useChatSession(sessionId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    const unsubscribe = FirestoreService.listenToMessages(sessionId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = async (content: string, mode: AgentMode = 'Socratic') => {
    if (!sessionId || !userId) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare history for AI (excluding IDs and timestamps for Gemini)
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      await processCognitiveMission(userId, sessionId, content, history, mode);
    } catch (err: any) {
      setError(err.message || 'Failed to process mission');
      console.error('[useChatSession] sendMessage error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage
  };
}
