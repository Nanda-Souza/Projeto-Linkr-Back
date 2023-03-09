import joi from "joi"

export const timelineSchema = joi.object({
    url: joi.string().uri().required(),
    description: joi.string().allow(null, '').optional()
})