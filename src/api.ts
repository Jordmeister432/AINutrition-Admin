import { supabase } from './supabaseClient';

export interface Run {
  id: string;
  user_id: string | null;
  name: string | null;
  initial_query: string | null;
  status: string;
  is_reviewed: boolean;
  created_at: string;
}

export interface StepLog {
  id: string;
  run_id: string;
  step_number: number;
  step_name: string;
  input_data: any;
  output_data: any;
  metadata: any;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
}

export async function fetchRuns(limit = 50): Promise<Run[]> {
  const { data, error } = await supabase
    .from('nutri_search_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Run[];
}

export async function fetchStepLogs(runId: string): Promise<StepLog[]> {
  const { data, error } = await supabase
    .from('nutri_search_step_logs')
    .select('*')
    .eq('run_id', runId)
    .order('step_number');
  if (error) throw error;
  return data as StepLog[];
}

export async function deleteRun(runId: string): Promise<void> {
  const { error } = await supabase
    .from('nutri_search_runs')
    .delete()
    .eq('id', runId);
  if (error) throw error;
}
