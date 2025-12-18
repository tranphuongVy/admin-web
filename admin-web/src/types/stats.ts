export type Stats = {
  users: {
    active: number;
    banned: number;
  };
  posts: {
    total: number;
    hidden: number;
    deleted: number;
  };
  comments: {
    total: number;
    hidden: number;
    deleted: number;
  };
};
