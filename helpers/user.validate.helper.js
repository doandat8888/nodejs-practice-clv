const Joi = require('joi');

const userValidate = (data) => {
    const userSchema = Joi.object({
       username: Joi.string().required(),
       fullname: Joi.string().required(),
       role: Joi.string().required(),
       projects: Joi.array().required(),
       activeYn: Joi.string().required(),
    })
    return userSchema.validate(data);
}

module.exports = {
    userValidate
}