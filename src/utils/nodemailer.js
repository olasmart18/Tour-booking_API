const nodemailer = require('nodemailer');

exports.sendMail = async option => {
	// Configure nodemailer
	const transporter = nodemailer.createTransport({
		host: process.env.HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.USER,
			pass: process.env.PASS,
		},
		dnsTimeout: 10000, // 10 seconds
	});
	// Email transporter
	await transporter.sendMail({
		from: option.sender,
		to: option.email,
		subject: option.subject,
		text: option.message,
	});
};
