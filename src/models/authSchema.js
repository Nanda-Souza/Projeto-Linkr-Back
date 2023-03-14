// dependencies
import joi from "joi";

export const signUpSchema = joi.object({
  name: joi.string().min(1).required(),
  email: joi.string().min(1).email().required(),
  img_url: joi.string().uri().min(1).required(),
  password: joi.string().min(1).required(),
  // confirmPassword: joi
  //   .string()
  //   .valid(joi.ref("password"))
  //   .messages({
  //     "any.only": "Passwords do not match",
  //   })
  //   .required(),
});

export const signInSchema = joi.object({
  email: joi.string().min(1).email().required(),
  password: joi.string().min(1).required(),
});
