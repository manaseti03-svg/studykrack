// Scholaris 2.0 // Centralized Data Service (Firebase Migration)
// Synthesis layer for research nodes and academic metrics

import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

export interface TaskNode {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  created_at?: any;
}

export interface AcademicRecord {
  id?: string;
  user_id: string;
  subject: string;
  score: number;
  total: number;
  weight: number;
  date?: string;
  created_at?: any;
}

const StudyService = {
  // --- Research Archive (Tasks) ---
  async fetchTasks(userId: string): Promise<TaskNode[]> {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TaskNode[];
    } catch (err: any) {
      console.warn('[StudyService] Task fetch failure. Returning empty set.', err.message);
      return [];
    }
  },

  async upsertTask(task: TaskNode) {
    try {
      if (task.id) {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, { ...task, updated_at: serverTimestamp() });
        return { id: task.id, ...task };
      } else {
        const docRef = await addDoc(collection(db, 'tasks'), {
          ...task,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        return { id: docRef.id, ...task };
      }
    } catch (err: any) {
      console.error('[StudyService] upsertTask failure:', err.message);
      throw new Error(`Node injection failure: ${err.message}`);
    }
  },

  async deleteTask(taskId: string) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err: any) {
      console.error('[StudyService] deleteTask failure:', err.message);
      throw new Error(`Node deletion failure: ${err.message}`);
    }
  },

  // --- Academic Ledger (Grades) ---
  async fetchGrades(userId: string): Promise<AcademicRecord[]> {
    try {
      const q = query(
        collection(db, 'grade_records'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AcademicRecord[];
    } catch (err: any) {
      console.warn('[StudyService] Grade fetch failure. Returning empty set.', err.message);
      return [];
    }
  },

  async addGrade(record: AcademicRecord) {
    try {
      const docRef = await addDoc(collection(db, 'grade_records'), {
        ...record,
        created_at: serverTimestamp()
      });
      return { id: docRef.id, ...record };
    } catch (err: any) {
      console.error('[StudyService] addGrade failure:', err.message);
      throw new Error(`Metric injection failure: ${err.message}`);
    }
  },

  async deleteGrade(id: string) {
    try {
      await deleteDoc(doc(db, 'grade_records', id));
    } catch (err: any) {
      console.error('[StudyService] deleteGrade failure:', err.message);
      throw new Error(`Metric deletion failure: ${err.message}`);
    }
  }
};

export default StudyService;
