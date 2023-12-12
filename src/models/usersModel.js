const {Schema, model} = require('mongoose');
const validator = require('validator');
const Joi = require('joi');

// Const userSchema = Joi.object({
//   username: Joi.string().required(),
//   email: Joi.string()
//     .email()
//     .required()
//     .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
//   password: Joi.string()
//     .min(6)
//     .required()
//     .max(100)
//     .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
// });

const userSchema = new Schema(
	{
		googleId: {
			type: String,
		},
		username: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: value => validator.isEmail(value),
				message: 'Invalid email address',
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 100,
			validate: {
				validator: value => /^[a-zA-Z0-9][a-zA-Z0-9]{2,29}$/.test(value),
				message: 'Invalid password format',
			},
		},

		role: {
			type: String,
			required: true,
		},
		passwordResetToken: String,
		passwordResetExpires: Date,
		passwordChangedAt: Date,
	},
	{
		timestamps: true,
	},

);

const User = new model('User', userSchema);
const validateUser = user => userSchema.validate(user);

module.exports = User;
