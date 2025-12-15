// ===== QUERY DTOs =====

export type ListUsersParams = {
  page: number;
  limit: number;
  search?: string;
  isBanned?: "true" | "false";
};

export type ListPostsParams = {
  page: number;
  limit: number;
  includeDeleted?: "true" | "false";
  includeHidden?: "true" | "false";
};

export type ListCommentsParams = {
  page: number;
  limit: number;
  includeDeleted?: "true" | "false";
};

// ===== BODY DTOs =====

export type ResetUserPasswordBody = {
  newPassword: string;
};

export type AdminAnnouncementBody = {
  title: string;
  content: string;
};
