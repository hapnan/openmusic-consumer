const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASSWORD;

        if (!host || !port || !user || !pass) {
            throw new Error('Missing SMTP configuration in environment variables', {
                statusCode: 500,
                name: 'ConfigurationError',
            });
        }

        this._transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });

        this._sender = user;
    }

    async sendEmail(targetEmail, content) {
        const mailOptions = {
            from: this._sender,
            to: targetEmail,
            subject: 'OpenMusic Playlist Export',
            text: 'Attached is your requested playlist export.',
            attachments: [
                {
                    filename: 'playlist.json',
                    content: JSON.stringify({
                        "playlists": JSON.parse(content)
                    }),
                    contentType: 'application/json',
                },
            ],
        };

        return this._transporter.sendMail(mailOptions);
    }
}
module.exports = MailSender;
