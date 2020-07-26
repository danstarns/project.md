const nodemailer = require("nodemailer");
const debug = require("../debug.js")("Email: ");
const redis = require("../redis.js");
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SECURE,
    EMAIL_FROM
} = require("../config.js");

let transporter;

async function process(job) {
    debug("Sending Email");

    await transporter.sendMail({
        from: EMAIL_FROM,
        to: job.data.to,
        subject: job.data.subject,
        html: job.data.html,
        text: job.data.html.replace(/(<([^>]+)>)/g, "")
    });

    await job.moveToCompleted();
    await job.remove();
    debug("Email sent");
}

async function start() {
    debug("Starting");

    transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });

    await transporter.verify();

    redis.queues.email.process(process);

    debug("Started");
}

module.exports = { start };
