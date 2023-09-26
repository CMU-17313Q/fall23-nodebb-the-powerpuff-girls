/* eslint-disable quotes */

"use strict";

const posts = require("../../posts");
const privileges = require("../../privileges");

const api = require("../../api");
const helpers = require("../helpers");
const apiHelpers = require("../../api/helpers");
// const postActions = require("../../posts/actions");

const Posts = module.exports;

Posts.get = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.posts.get(req, { pid: req.params.pid })
    );
};

Posts.edit = async (req, res) => {
    const editResult = await api.posts.edit(req, {
        ...req.body,
        pid: req.params.pid,
        uid: req.uid,
        req: apiHelpers.buildReqObject(req),
    });

    helpers.formatApiResponse(200, res, editResult);
};

Posts.purge = async (req, res) => {
    await api.posts.purge(req, { pid: req.params.pid });
    helpers.formatApiResponse(200, res);
};

Posts.restore = async (req, res) => {
    await api.posts.restore(req, { pid: req.params.pid });
    helpers.formatApiResponse(200, res);
};

Posts.delete = async (req, res) => {
    await api.posts.delete(req, { pid: req.params.pid });
    helpers.formatApiResponse(200, res);
};

Posts.move = async (req, res) => {
    await api.posts.move(req, {
        pid: req.params.pid,
        tid: req.body.tid,
    });
    helpers.formatApiResponse(200, res);
};

async function mock(req) {
    const tid = await posts.getPostField(req.params.pid, "tid");
    return { pid: req.params.pid, room_id: `topic_${tid}` };
}

Posts.vote = async (req, res) => {
    const data = await mock(req);
    if (req.body.delta > 0) {
        await api.posts.upvote(req, data);
    } else if (req.body.delta < 0) {
        await api.posts.downvote(req, data);
    } else {
        await api.posts.unvote(req, data);
    }

    helpers.formatApiResponse(200, res);
};

Posts.unvote = async (req, res) => {
    const data = await mock(req);
    await api.posts.unvote(req, data);
    helpers.formatApiResponse(200, res);
};

Posts.bookmark = async (req, res) => {
    const data = await mock(req);
    await api.posts.bookmark(req, data);
    helpers.formatApiResponse(200, res);
};

Posts.unbookmark = async (req, res) => {
    const data = await mock(req);
    await api.posts.unbookmark(req, data);
    helpers.formatApiResponse(200, res);
};

Posts.getDiffs = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.posts.getDiffs(req, { ...req.params })
    );
};

Posts.loadDiff = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.posts.loadDiff(req, { ...req.params })
    );
};

Posts.restoreDiff = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.posts.restoreDiff(req, { ...req.params })
    );
};

Posts.deleteDiff = async (req, res) => {
    if (!parseInt(req.params.pid, 10)) {
        throw new Error("[[error:invalid-data]]");
    }

    const cid = await posts.getCidByPid(req.params.pid);
    const [isAdmin, isModerator] = await Promise.all([
        privileges.users.isAdministrator(req.uid),
        privileges.users.isModerator(req.uid, cid),
    ]);

    if (!(isAdmin || isModerator)) {
        return helpers.formatApiResponse(
            403,
            res,
            new Error("[[error:no-privileges]]")
        );
    }

    await posts.diffs.delete(req.params.pid, req.params.timestamp, req.uid);

    helpers.formatApiResponse(
        200,
        res,
        await api.posts.getDiffs(req, { ...req.params })
    );
};

Posts.endorse = async (req, res) => {
    // const { pid } = req.params.pid;
    // console.log(req);
    console.log(req.params.pid);
    console.log("endorse happening");

    try {
        // Add your logic to mark the post as endorsed using the 'posts' model

        // await Posts.markAsEndorsed(req.params.pid, req.uid);
        const data = await mock(req);
        await api.posts.endorse(req, data);

        helpers.formatApiResponse(200, res);
    } catch (error) {
        // Handle errors appropriately
        console.error("Error endorsing post:", error);
        /* res.status(500).json({
            success: false,
            message: "Failed to endorse post",
        }); */
        helpers.formatApiResponse(500, res);
    }
};

// Controller for unendorsing a post
Posts.unendorse = async (req, res) => {
    // const { pid } = req.params.pid;
    console.log("unendorse happening");

    try {
        // Add your logic to mark the post as unendorsed using the 'posts' model

        const data = await mock(req);
        await api.posts.unendorse(req, data);
        // await Posts.markAsUnendorsed(req.params.pid, req.uid);

        helpers.formatApiResponse(200, res);
    } catch (error) {
        // Handle errors appropriately
        console.error("Error unendorsing post:", error);
        /* res.status(500).json({
            success: false,
            message: "Failed to unendorse post",
        }); */
        helpers.formatApiResponse(500, res);
    }
};
