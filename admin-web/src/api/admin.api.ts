import axiosAdmin from "./axiosAdmin";

/**
 * ADMIN API
 * Map 1–1 với AdminController (backend)
 */
export const adminApi = {
  /* ==========================
   * USERS
   * ========================== */

  // GET /api/admin/users
  listUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return axiosAdmin.get("/admin/users", { params });
  },

  // PATCH /api/admin/users/:id/ban
  banUser(userId: string) {
    return axiosAdmin.patch(`/admin/users/${userId}/ban`);
  },

  // PATCH /api/admin/users/:id/unban
  unbanUser(userId: string) {
    return axiosAdmin.patch(`/admin/users/${userId}/unban`);
  },

  // POST /api/admin/users/:id/reset-password
  resetUserPassword(userId: string, newPassword: string) {
    return axiosAdmin.post(`/admin/users/${userId}/reset-password`, {
      newPassword,
    });
  },

  /* ==========================
   * POSTS
   * ========================== */

  // GET /api/admin/posts
  listPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return axiosAdmin.get("/admin/posts", { params });
  },

  // PATCH /api/admin/posts/:id/hide
  hidePost(postId: string) {
    return axiosAdmin.patch(`/admin/posts/${postId}/hide`);
  },

  // PATCH /api/admin/posts/:id/unhide
  unhidePost(postId: string) {
    return axiosAdmin.patch(`/admin/posts/${postId}/unhide`);
  },

  // DELETE /api/admin/posts/:id
  deletePost(postId: string) {
    return axiosAdmin.delete(`/admin/posts/${postId}`);
  },

  /* ==========================
   * COMMENTS
   * ========================== */

  // GET /api/admin/comments
  listComments(params: {
    page?: number;
    limit?: number;
    postId?: string;
  }) {
    return axiosAdmin.get("/admin/comments", { params });
  },

  // PATCH /api/admin/comments/:id/hide
  hideComment(commentId: string) {
    return axiosAdmin.patch(`/admin/comments/${commentId}/hide`);
  },

  // DELETE /api/admin/comments/:id
  deleteComment(commentId: string) {
    return axiosAdmin.delete(`/admin/comments/${commentId}`);
  },

  /* ==========================
   * ANNOUNCEMENTS
   * ========================== */

  // POST /api/admin/announcements
  createAnnouncement(data: {
    title: string;
    content: string;
  }) {
    return axiosAdmin.post("/admin/announcements", data);
  },
};
