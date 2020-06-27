const { Organization, User } = require("../../models/index.js");
const redis = require("../../redis.js");

async function get(req, res) {
    try {
        const job = await redis.dbs.invite.get(req.query.code);

        if (!job) {
            const html = req.views.error({
                title: "Invalid Code",
                error: {
                    message: "Invalid code"
                }
            });

            return res.send(html);
        }

        const { organization, host, invitee } = JSON.parse(job);

        const [hostUser, targetUser, targetOrg] = await Promise.all([
            User.findById(host),
            User.findById(invitee),
            Organization.findById(organization)
        ]);

        const html = req.views.invite.organization({
            title: `Invitation to Organization ${targetOrg.name}`,
            user: {
                username: targetUser.username
            },
            host: {
                username: hostUser.username
            },
            organization: {
                name: targetOrg.name
            }
        });

        return res.send(html);
    } catch (error) {
        const html = req.views.error({
            title: "Error",
            error: {
                message: error.message
            }
        });

        return res.send(html);
    }
}

async function post(req, res) {
    try {
        const job = await redis.dbs.invite.get(req.params.code);

        if (!job) {
            throw new Error("Invalid code");
        }

        const { organization, invitee } = JSON.parse(job);

        await Organization.findByIdAndUpdate(
            organization,
            {
                $addToSet: { users: invitee }
            },
            { new: true }
        );

        await redis.dbs.invite.del(req.params.code);

        return res.send("OK");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports = {
    get,
    post
};
