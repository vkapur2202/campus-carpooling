import config from './config'
const nodemailer = require('nodemailer')

export const transport = nodemailer.createTransport({
  //   host: config.MAIL_HOST,
  //   port: config.MAIL_PORT,
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
})

export const activateAccountEmail = (text) => `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <p>
            Welcome! Thanks for signing up.
        </p>
        <p>${text}</p>
        <p>
            If you didn't send this request, just disregard this message. No further
            action is necessary.
        </p>
        <p>Cheers!</p>
    </div>
`

export const resetPasswordEmail = (text) => `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <p>
            Hello again! You requested a password reset email.
        </p>
        <p>${text}</p>
        <p>
            If you didn't send this request, just disregard this message. No further
            action is necessary.
        </p>
        <p>Cheers!</p>
    </div>
`
