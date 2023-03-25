import joi from "joi";

export const commentSchema = joi.object({
    comment: joi.string().min(1).required(),
  });