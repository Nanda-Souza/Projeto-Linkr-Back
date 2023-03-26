import joi from "joi"

export const timelineSchema = joi.object({
    url: joi.string().uri().required(),
    description: joi.string().allow(null, '').optional(),
    repost: joi.boolean().optional(),
    originalId: joi.number().when('repost', {
        is: true,
        then: joi.required(), 
        otherwise: joi.optional()
    })
})

export const updatePostSchema = joi.object({
    description: joi.string().required()
})

