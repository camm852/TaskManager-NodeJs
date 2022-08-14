import nodemailer from 'nodemailer';

const emailSignUp = async (datos) => {
	const { name, email, token } = datos;

	const transport = nodemailer.createTransport({
		host: process.env.NODEEMAIL_HOST,
		port: process.env.NODEEMAIL_PORT,
		secure: true,
		auth: {
			user: process.env.NODEEMAIL_USER,
			pass: process.env.NODEEMAIL_PASS,
		},
	});
	transport.verify().then(() => {
		console.log('redy for send emails');
	});

	//email information

	const info = await transport.sendMail({
		from: '"TaskManager" <accounts@taskManager.com',
		to: email,
		subject: 'TaskManager - Confirm account',
		text: 'Confirm your account',
		html: `
		
			<h3 style="color: #0284c7">TaskManager</h3>	
			<p>Hello: <strong>${name}</strong> confirm your account in TaskManager</p>
			
			<p>Your account is almost already, you must be confirm to following link:
				<a href='${process.env.FRONTED_URL}/confirm/${token}' style="text-decoration: none">Confirm Account</a>
			</p>
			
			<p>If you didn't create this account, ignore this message</p>		

		`,
	});
};

const changePassword = async (datos) => {
	const { name, email, token } = datos;

	const transport = nodemailer.createTransport({
		host: process.env.NODEEMAIL_HOST,
		port: process.env.NODEEMAIL_PORT,
		auth: {
			user: process.env.NODEEMAIL_USER,
			pass: process.env.NODEEMAIL_PASS,
		},
	});

	//email information

	const info = await transport.sendMail({
		from: '"TaskManager" <accounts@taskManager.com',
		to: email,
		subject: 'TaskManager - Forgot password',
		text: 'Change your password',
		html: `
		
			<h3 style="color: #0284c7">TaskManager</h3>	
			<p>Hello: <strong>${name}</strong> change your password in TaskManager</p>
			
			<p>You can change your password to following link:
				<a href='${process.env.FRONTED_URL}/forgot-password/${token}' style="text-decoration: none">Change Password</a>
			</p>
			
			<p>If you didn't want this change, ignore this message</p>		

		`,
	});
};

export { emailSignUp, changePassword };
