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

export interface ChatMessage {
  id: string;
  user_id: string;
  role: string; // 'user' | 'assistant' | 'system'
  content: string;
  created_at: string;
}

export interface ChatUser {
  id: string;
  name: string;
}

export async function fetchChatUsers(): Promise<ChatUser[]> {
  // Get distinct user_ids from chat_messages
  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('user_id')
    .neq('user_id', null);

  if (error) throw error;
  const ids = Array.from(new Set((rows as { user_id: string }[]).map(r => r.user_id)));

  // Attempt to fetch user metadata (name/email) via admin API. Fallback to shortened id.
  const users: ChatUser[] = await Promise.all(
    ids.map(async id => {
      try {
        // Using service role key, we can call the admin API
        // Docs: https://supabase.com/docs/reference/javascript/auth-admin-getuserbyid
        // If this call fails for any reason, fall back gracefully.
        // @ts-ignore – admin feature is available when using service role key
        const { data: userResp, error: userErr } = await supabase.auth.admin.getUserById(id);
        if (!userErr && userResp?.user) {
          const { email, user_metadata } = userResp.user as any;
          const friendly = user_metadata?.full_name || user_metadata?.name || email || id.substring(0, 8);
          return { id, name: friendly } as ChatUser;
        }
      } catch {
        // ignore
      }
      return { id, name: id.substring(0, 8) } as ChatUser;
    }),
  );

  // Sort alphabetically by name for nicer UX
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchUserChats(userId: string, limit = 500): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data as ChatMessage[];
}
