// src/types/index.ts

export interface User {
  user_id: string;
  wallet_address: string;
  access_token?: string;
}

export interface UserProfile {
  _id: string;
  wallet_address: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;

  preferences: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    web_push_enabled: boolean;
    language: string;
  };

  profile_summary: {
    total_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    pending_tasks: number;
    productivity_score: number;
    last_updated_summary: string;
  };
  user_tasks?: Task[];
  groups_overview?: GroupOverview[];
  skill_tag?: string;
  proficiency_level?: number;
  last_used_at?: string;
  verified_by_tasks?: string[];
  endorsed_by?: string[];
}

export interface GroupOverview {
  group_id: string;
  group_name: string;
  role: "owner" | "admin" | "member" | "guest";
  task_count: number;
}

export interface UserUpdateRequest {
  display_name?: string;
  avatar_url?: string;
  preferences?: Partial<UserProfile["preferences"]>;
}

export type UserPreferencesUpdate = Partial<UserProfile["preferences"]>;

export type TaskStatus = "pending" | "in_progress" | "completed" | "archived";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  task_id: string;
  user_id: string;
  group_id?: string | null;
  access_token?: string;
  wallet_address: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  is_completed: boolean;
  color_code: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  metadata?: Record<string, unknown>;
}

export type JoinPolicy = "invite_only" | "request_to_join" | "open";

export interface Group {
  group_id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  name: string;
  description?: string;
}

export interface GroupCreatePayload {
  name: string;
  description?: string;
  is_public?: boolean;
  join_policy?: JoinPolicy;
}

export interface GroupResponse {
  _id: string;
  group_id: string;
  name: string;
  description?: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  join_policy: JoinPolicy;
}

export interface GroupMemberResponse {
  _id: string;
  group_id: string;
  user_id: string;
  wallet_address: string;
  role: "owner" | "admin" | "member" | "guest";
  joined_at: string;
  last_active_at?: string;
  permissions: string[];
}

export interface GroupMemberCreate {
  group_id: string;
  user_id: string;
  wallet_address: string;
  role?: "owner" | "admin" | "member" | "guest";
}
export interface TaskComment {
  _id: string;
  task_id: string;
  user_id: string;
  wallet_address: string;
  content: string;
  replies_to_comment_id?: string | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
}
