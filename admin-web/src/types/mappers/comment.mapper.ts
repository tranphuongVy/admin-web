import type { Comment, CommentApiResponse } from "../comment";

export function mapComment(api: CommentApiResponse): Comment {
  return {
    id: api.id,
    postId: api.postId,
    authorId: api.authorId,
    parentCommentId: api.parentCommentId,
    content: api.content,
    aiStatus: api.aiStatus,
    aiReason: api.aiReason,

    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
    deletedAt: api.deletedAt ? new Date(api.deletedAt) : null,

    // 🔥 FIX 1: author fallback
    author: {
      id: api.author?.id ?? "unknown",
      name: api.author?.name ?? "Unknown",
      email: api.author?.email ?? "",
      avatarUrl: api.author?.avatarUrl ?? null,
    },

    // 🔥 FIX 2: post fallback
    post: {
      id: api.post?.id ?? api.postId,
      text: api.post?.text ?? null,
      privacy: api.post?.privacy ?? "PUBLIC",
      hiddenAt: api.post?.hiddenAt
        ? new Date(api.post.hiddenAt)
        : null,
      deletedAt: api.post?.deletedAt
        ? new Date(api.post.deletedAt)
        : null,
    },
  };
}
