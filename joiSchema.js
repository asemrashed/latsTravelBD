const BaseJoi= require('joi')
const sanitizeHtml= require('sanitize-html')

const expresion= (joi)=> ({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(value !== clean) //value will be in console
                    return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
})
const Joi = BaseJoi.extend(expresion)

module.exports.spotSchema= Joi.object({
    spot: Joi.object({
        title: Joi.string().required().escapeHTML(),
        image: Joi.string(),
        // price: Joi.number().required().min(0),
        type: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array() // it should be added in name 
})

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(0).max(5).required(),
    }).required(),
})