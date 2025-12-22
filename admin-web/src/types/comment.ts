export type CommentAuthor = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type CommentPost = {
  id: string;
  text: string | null;
  privacy: "PUBLIC" | "FRIENDS" | "PRIVATE";
  deletedAt: Date | null;
  hiddenAt: Date | null;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId: string | null;
  content: string;
  aiStatus: "OK" | "PENDING" | "REJECTED";
  aiReason: string;
  createdAt: Date;
  updatedAt: Date;
  hiddenAt?: Date | null;
  deletedAt: Date | null;
  author: CommentAuthor;
  post: CommentPost;
};

export type CommentApiResponse = {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId: string | null;
  content: string;
  aiStatus: "OK" | "PENDING" | "REJECTED";
  aiReason: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  post: {
    id: string;
    text: string | null;
    privacy: "PUBLIC" | "FRIENDS" | "PRIVATE";
    hiddenAt?: Date | null;
    deletedAt: string | null;
  };
};
