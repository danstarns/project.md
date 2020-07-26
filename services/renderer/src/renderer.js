const puppeteer = require("puppeteer");
const debug = require("./debug.js")("Renderer: ");
const { Document } = require("./models/index.js");
const redis = require("./redis.js");
const storage = require("./storage.js");
const { constants, generateHTML } = require("./util/index.js");

async function renderer(job) {
    let browser;

    try {
        debug("Rendering");
        const document = await Document.findById(job.data.document);

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--disable-web-security",
                "--window-size=2480,3508",
                "--disable-dev-shm-usage"
            ]
        });

        const page = await browser.newPage();
        await page._client.send("Emulation.clearDeviceMetricsOverride");

        const html = generateHTML(document);

        await page.setContent(html, {
            waitUntil: "networkidle2"
        });

        const bucket = `document-${document._id.toString()}`;
        const fileName = `${document._id.toString()}.pdf`;

        const buffer = await page.pdf();
        const etag = await storage.client.putObject(bucket, fileName, buffer);

        const [url] = await Promise.all([
            storage.client.presignedUrl(
                "GET",
                bucket,
                fileName,
                constants.IMAGE_URL_EXPIRE_SECONDS
            ),
            Document.findByIdAndUpdate(document._id, {
                $set: {
                    rendered: {
                        etag,
                        fileName,
                        bucket
                    }
                }
            })
        ]);

        await redis.dbs.imageUrls.set(
            etag,
            JSON.stringify({ etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );

        await job.moveToCompleted();
        await job.remove();
        debug("Rendered");
    } catch (error) {
        debug("Error");
        console.error(error);

        if (browser) {
            browser.close().catch(console.error);
        }

        throw error;
    }
}

module.exports = renderer;
