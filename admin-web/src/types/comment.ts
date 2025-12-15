export type Comment = {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
};
