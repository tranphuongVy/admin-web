import type { PostApiResponse } from "../types/post.api";
import axios from "./axiosAdmin";

export const postApi = {
  getPostById: async (
    postId: string
  ): Promise<PostApiResponse> => {
    const res = await axios.get(`/posts/${postId}`);
    return res.data.data;
  },
};
