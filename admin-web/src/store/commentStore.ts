import type { Comment } from "../types/comment";

/* ================= GLOBAL STORE (MOCK) ================= */

let hiddenComments: Comment[] = [];

export function hideComment(comment: Comment) {
  hiddenComments.push(comment);
}

export function restoreComment(commentId: string) {
  hiddenComments = hiddenComments.filter(
    (c) => c.id !== commentId
  );
}

export function getHiddenComments() {
  return hiddenComments;
}
