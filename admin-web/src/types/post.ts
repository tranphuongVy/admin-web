// export type Privacy = "PUBLIC" | "PRIVATE" | "FRIENDS";

// export type Media = {
//   id: string;
//   type: "IMAGE" | "VIDEO";
//   url: string;
//   size: number;
//   order: number;
// };

// export type Author = {
//   id: string;
//   name: string;
//   email?: string;
// };

// export type Post = {
//   id: string;
//   text: string | null;
//   privacy: Privacy;
//   author: Author;
//   media: Media[];
//   aiStatus: "APPROVED" | "REJECTED" | "PENDING";
//   aiReason?: string;

//   createdAt: Date;

//   // ===== ADMIN FIELDS =====
//   hiddenAt?: Date | null;
//   deletedAt?: Date | null;

//   // ===== SHARE =====
//   sharedFrom?: Post;
// };

import type { Comment } from "./comment";

export type Privacy = "PUBLIC" | "PRIVATE" | "FRIENDS";

export type Media = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  size: number | null;
  order: number;
};

export type Author = {
  id: string;
  name: string;
  email?: string;
};

// post.ts
export type Post = {
  id: string;
  text: string | null;
  privacy: Privacy;

  author: Author;
  media: Media[];

  aiStatus: "OK" | "PENDING" | "REJECTED";
  aiReason?: string;

  createdAt: Date;


  comments: Comment[];

  hiddenAt?: Date | null;
  deletedAt?: Date | null;

  sharedFrom?: Post | null;
};
