export type Privacy = "PUBLIC" | "PRIVATE" | "FRIENDS";

export type Media = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  size: number;
  order: number;
};

export type Author = {
  id: string;
  name: string;
  email?: string;
};

export type Post = {
  id: string;
  text: string | null;
  privacy: Privacy;
  author: Author;
  media: Media[];
  aiStatus: "APPROVED" | "REJECTED" | "PENDING";
  aiReason?: string;
  createdAt: Date;

  // === optional fields để giống backend ===
  deletedAt?: Date | null;
  sharedFrom?: Post;
};
