import axiosAdmin from "./axiosAdmin";
import type { User } from "../types/user";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";
import type { Announcement } from "../types/announcement";

/* ================= TYPES ================= */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/* ================= RAW TYPES FROM API ================= */

interface RawAnnouncement {
  id: string;
  userId: string;
  type: string;
  payload: {
    title: string;
    content: string;
  };
  isRead: boolean;
  createdAt: string;
}

/* ================= ADMIN API ================= */

export const adminApi = {
  /* ==========================
   * USERS
   * ========================== */

  async listUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    isBanned?: boolean;
  }): Promise<PaginatedResponse<User>> {
    const res = await axiosAdmin.get("/admin/users", { params });
    return res.data.data;
  },

  banUser(userId: string) {
    return axiosAdmin.patch(`/admin/users/${userId}/ban`);
  },

  unbanUser(userId: string) {
    return axiosAdmin.patch(`/admin/users/${userId}/unban`);
  },

  resetUserPassword(userId: string, newPassword: string) {
    return axiosAdmin.post(`/admin/users/${userId}/reset-password`, {
      newPassword,
    });
  },

  /* ==========================
   * POSTS
   * ========================== */

  async listPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
    includeDeleted?: boolean;
    includeHidden?: boolean;
  }): Promise<PaginatedResponse<Post>> {
    const res = await axiosAdmin.get("/admin/posts", { params });
    return res.data.data;
  },

  hidePost(postId: string) {
    return axiosAdmin.patch(`/admin/posts/${postId}/hide`);
  },

  unhidePost(postId: string) {
    return axiosAdmin.patch(`/admin/posts/${postId}/unhide`);
  },

  deletePost(postId: string) {
    return axiosAdmin.delete(`/admin/posts/${postId}`);
  },

  /* ==========================
   * COMMENTS
   * ========================== */

  async listComments(params: {
    page?: number;
    limit?: number;
    postId?: string;
    search?: string;
    includeHidden?: boolean;
    includeDeleted?: boolean;
  }): Promise<PaginatedResponse<Comment>> {
    const res = await axiosAdmin.get("/admin/comments", { params });
    return res.data.data;
  },

  hideComment(commentId: string) {
    return axiosAdmin.patch(`/admin/comments/${commentId}/hide`);
  },

  unhideComment(commentId: string) {
    return axiosAdmin.patch(`/admin/comments/${commentId}/unhide`);
  },

  deleteComment(commentId: string) {
    return axiosAdmin.delete(`/admin/comments/${commentId}`);
  },

  /* ==========================
   * ANNOUNCEMENTS
   * ========================== */

  createAnnouncement(data: { title: string; content: string }) {
    return axiosAdmin.post("/admin/announcements", data);
  },

  listAnnouncements: async (): Promise<Announcement[]> => {
  const res = await axiosAdmin.get("/notifications/announcements"); // full path tùy proxy
  const items: RawAnnouncement[] = res.data.data.items;
  return items.map<Announcement>((a) => ({
    id: a.id,
    title: a.payload.title,
    content: a.payload.content,
    createdAt: new Date(a.createdAt),
  }));
},

  /* ==========================
   * PASSWORD RESET REQUESTS
   * ========================== */

  listPasswordResetRequests() {
    return axiosAdmin.get("/admin/password-reset-requests");
  },

  approvePasswordResetRequest(token: string) {
    return axiosAdmin.post(`/admin/password-reset-requests/${token}/approve`);
  },

  /* ==========================
   * STATS
   * ========================== */

  getStats() {
    return axiosAdmin.get("/admin/stats");
  },
};
