// Scholaris 2.0 // Centralized Data Service
// Synthesis layer for research nodes and academic metrics

import { supabase } from '@/lib/supabase';

export interface TaskNode {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  created_at?: string;
}

export interface AcademicRecord {
  id?: string;
  user_id: string;
  subject: string;
  score: number;
  total: number;
  weight: number;
  date?: string;
  created_at?: string;
}

const StudyService = {
  // --- Research Archive (Tasks) ---
  async fetchTasks(userId: string): Promise<TaskNode[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[StudyService] fetchTasks failure. Root cause:', error.message, error.details, error.hint);
        // Fallback for demo: return empty if table missing
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.warn('[StudyService] Recovering from task fetch failure. Returning empty set.');
      return [];
    }
  },

  async upsertTask(task: TaskNode) {
    const { data, error } = await supabase
      .from('tasks')
      .upsert(task)
      .select();
    
    if (error) {
      console.error('[StudyService] upsertTask failure:', error.message);
      throw new Error(`Node injection failure: ${error.message}`);
    }
    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) {
      console.error('[StudyService] deleteTask failure:', error.message);
      throw new Error(`Node deletion failure: ${error.message}`);
    }
  },

  // --- Academic Ledger (Grades) ---
  async fetchGrades(userId: string): Promise<AcademicRecord[]> {
    try {
      const { data, error } = await supabase
        .from('grade_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[StudyService] fetchGrades failure. Root cause:', error.message, error.details, error.hint);
        // Fallback for demo: return empty if table missing or column missing
        if (error.code === '42P01' || error.message.includes('column')) return [];
        throw error;
      }
      return data || [];
    } catch (err) {
      console.warn('[StudyService] Recovering from grade fetch failure. Returning empty set.');
      return [];
    }
  },

  async addGrade(record: AcademicRecord) {
    const { data, error } = await supabase
      .from('grade_records')
      .insert(record)
      .select();
    
    if (error) {
      console.error('[StudyService] addGrade failure:', error);
      throw new Error(`Metric injection failure: ${error.message}`);
    }
    return data;
  }
};

export default StudyService;
