import axiosAdmin from "./axiosAdmin";
import type { User } from "../types/user";

/* ================= TYPES ================= */

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
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
    status?: "ACTIVE" | "BANNED";
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
  }) {
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
  }) {
    const res = await axiosAdmin.get("/admin/comments", { params });
    return res.data.data;
  },

  hideComment(commentId: string) {
    return axiosAdmin.patch(`/admin/comments/${commentId}/hide`);
  },

  deleteComment(commentId: string) {
    return axiosAdmin.delete(`/admin/comments/${commentId}`);
  },

  /* ==========================
   * ANNOUNCEMENTS
   * ========================== */

  createAnnouncement(data: {
    title: string;
    content: string;
  }) {
    return axiosAdmin.post("/admin/announcements", data);
  },
};
