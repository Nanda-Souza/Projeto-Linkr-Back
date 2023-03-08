import joi from "joi";

export const likeSchema = joi.object({
    postId: joi.number().required(),
  });