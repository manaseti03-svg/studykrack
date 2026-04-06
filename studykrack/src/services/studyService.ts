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
  date: string;
}

const StudyService = {
  // --- Research Archive (Tasks) ---
  async fetchTasks(userId: string): Promise<TaskNode[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Synthesis sync failure: ${error.message}`);
    return data || [];
  },

  async upsertTask(task: TaskNode) {
    const { data, error } = await supabase
      .from('tasks')
      .upsert(task)
      .select();
    
    if (error) throw new Error(`Node injection failure: ${error.message}`);
    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw new Error(`Node deletion failure: ${error.message}`);
  },

  // --- Academic Ledger (Grades) ---
  async fetchGrades(userId: string): Promise<AcademicRecord[]> {
    const { data, error } = await supabase
      .from('grade_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw new Error(`Ledger sync failure: ${error.message}`);
    return data || [];
  },

  async addGrade(record: AcademicRecord) {
    const { data, error } = await supabase
      .from('grade_records')
      .insert(record)
      .select();
    
    if (error) throw new Error(`Metric injection failure: ${error.message}`);
    return data;
  }
};

export default StudyService;
