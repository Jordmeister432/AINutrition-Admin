import { supabase } from './supabaseClient';

export interface Run {
  id: string;
  user_id: string | null;
  name: string | null;
  initial_query: string | null;
  status: string;
  is_reviewed: boolean;
  flag: boolean | null;
  created_at: string;
  user_name?: string; // Full name from user_profile
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
  trigger_message?: string; // First message in the conversation flow
}

export async function fetchRuns(limit = 50): Promise<Run[]> {
  const { data, error } = await supabase
    .from('nutri_search_runs')
    .select('*')
    .eq('flag', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  
  console.log('Fetched runs:', data);
  
  // Get all unique user IDs from the runs
  const userIds = [...new Set(data.map((run: any) => run.user_id).filter(Boolean))];
  console.log('User IDs from runs:', userIds);
  
  // Fetch user profiles separately
  const { data: userProfiles, error: userError } = await supabase
    .from('user_profile')
    .select('user_id, name, surname')
    .in('user_id', userIds);
  
  console.log('Fetched user profiles:', userProfiles);
  
  if (userError) {
    console.warn('Error fetching user profiles:', userError);
  }
  
  // Create a map of user_id to full name
  const userMap = new Map();
  if (userProfiles) {
    userProfiles.forEach((user: any) => {
      const fullName = user.name ? `${user.name} ${user.surname || ''}`.trim() : 'Unknown User';
      userMap.set(user.user_id, fullName);
      console.log(`Mapped ${user.user_id} to ${fullName}`);
    });
  }
  
  // Transform the data to include full names
  const result = data.map((run: any) => ({
    ...run,
    user_name: userMap.get(run.user_id) || 'Unknown User'
  })) as Run[];
  
  console.log('Final result with user names:', result);
  return result;
}

export async function fetchStepLogs(runId: string): Promise<StepLog[]> {
  const { data, error } = await supabase
    .from('nutri_search_step_logs')
    .select('*')
    .eq('run_id', runId)
    .order('step_number');
  if (error) throw error;
  
  // Get the trigger message from the first step's input data
  const triggerMessage = data.length > 0 && data[0].input_data?.triggerMessage 
    ? data[0].input_data.triggerMessage 
    : null;
  
  // Add trigger message to all step logs
  return data.map((stepLog: any) => ({
    ...stepLog,
    trigger_message: triggerMessage
  })) as StepLog[];
}

export async function deleteRun(runId: string): Promise<void> {
  const { error } = await supabase
    .from('nutri_search_runs')
    .delete()
    .eq('id', runId);
  if (error) throw error;
}

// Types for the new chat monitor feature
export interface UserProfile {
  user_id: string;
  name: string;
}

export interface ChatMessage {
  message_id: string;
  user_id: string;
  sender: 'user' | 'assistant';
  message_type: string;
  content_text: string | null;
  content_json: any | null;
  created_at: string;
}

// Fetches all user profiles
export const getUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('user_profile')
    .select('user_id, name, surname')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
  
  // Transform the data to include full names
  return data.map((user: any) => ({
    user_id: user.user_id,
    name: user.name ? `${user.name} ${user.surname || ''}`.trim() : 'Unknown User'
  }));
};

// Fetches all chat messages for a specific user
export const getChatMessages = async (userId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Error fetching chat messages for user ${userId}:`, error);
    throw new Error(error.message);
  }
  return data;
};
