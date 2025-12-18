import type { Post } from "../post";
import type { PostApiResponse } from "../post.api";
import { mapComment } from "./comment.mapper";

export function mapPost(api: PostApiResponse): Post {
  return {
    id: api.id,
    text: api.text,
    privacy: api.privacy,

    author: api.author,

    aiStatus: api.aiStatus,
    aiReason: api.aiReason,

    media: api.media ?? [],

    createdAt: new Date(api.createdAt),

    // 🔥 FIX 1: lọc null / undefined
    comments: (api.comments ?? [])
      .filter(Boolean)
      .map(mapComment),

    hiddenAt: api.hiddenAt
      ? new Date(api.hiddenAt)
      : null,

    deletedAt: api.deletedAt
      ? new Date(api.deletedAt)
      : null,

    // 🔥 FIX 2: đảm bảo sharedFrom cũng được map
    sharedFrom: api.sharedFrom
      ? mapPost(api.sharedFrom)
      : null,
  };
}
