'use strict';

const db = require('../database');
const plugins = require('../plugins');

module.exports = function (Posts) {
    Posts.addtag = async function (pid, uid) {
        return await toggleIsTagged('addtag', pid, uid);
    };

    Posts.untag = async function (pid, uid) {
        return await toggleIsTagged('untag', pid, uid);
    };

    async function toggleIsTagged(type, pid, uid) {
        if (parseInt(uid, 10) <= 0) {
            throw new Error('[[error:not-logged-in]]');
        }

        const isTagging = type === 'addtag';

        const [postData] = await Promise.all([
            Posts.getPostFields(pid, ['pid', 'uid', 'istagged']),
        ]);
        await Posts.setPostField(pid, 'istagged', isTagging);

        /* plugins.hooks.fire(`action:post.${type}`, {
            pid: pid,
            uid: uid,
            owner: postData.uid,
        }); */
        console.log(postData);
        postData.istagged = isTagging;
        console.log('in toggleIsTagged', isTagging);
        return {
            post: postData,
        };
    }
};
