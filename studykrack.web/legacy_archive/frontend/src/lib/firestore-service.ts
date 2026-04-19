import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  thoughtProcess?: string;
  nodesExtracted?: string[];
  metadata?: {
    suggestions: string[];
    confidence: number;
  };
  timestamp: any;
}

export interface Session {
  id: string;
  userId: string;
  title: string;
  mode: string;
  createdAt: any;
  updatedAt: any;
}

export const FirestoreService = {
  // --- Session Management ---
  async createSession(userId: string, title: string, mode: string = 'Socratic'): Promise<string> {
    const sessionRef = await addDoc(collection(db, 'sessions'), {
      userId,
      title,
      mode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return sessionRef.id;
  },

  async getSessions(userId: string, callback: (sessions: Session[]) => void) {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];
      callback(sessions);
    });
  },

  // --- Message Management ---
  async addMessage(sessionId: string, message: Omit<Message, 'timestamp'>) {
    const messagesRef = collection(db, 'sessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp()
    });

    // Update session updatedAt
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      updatedAt: serverTimestamp()
    });
  },

  listenToMessages(sessionId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'sessions', sessionId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    });
  },

  // --- User Profile ---
  async syncUserProfile(userId: string, profile: any) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profile,
      lastActive: serverTimestamp()
    }, { merge: true });
  }
};
