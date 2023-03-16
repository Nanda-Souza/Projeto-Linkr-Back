import joi from "joi";

export const trendSchema = joi.object({
    trendName: joi.string().required(),
  });