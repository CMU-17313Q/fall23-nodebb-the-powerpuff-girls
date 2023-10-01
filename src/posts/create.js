'use strict';

const _ = require('lodash');

const meta = require('../meta');
const db = require('../database');
const plugins = require('../plugins');
const user = require('../user');
const topics = require('../topics');
const categories = require('../categories');
const groups = require('../groups');
const utils = require('../utils');
const ANONYMOUS_UID = -1;

module.exports = function (Posts) {
    Posts.create = async function (data) {
        // This is an internal method, consider using Topics.reply instead
        const { uid } = data;
        const { tid } = data;
        const content = data.content.toString();
        const timestamp = data.timestamp || Date.now();
        const isMain = data.isMain || false;
        const { postType } = data;


        if (!uid && parseInt(uid, 10) !== 0) {
            throw new Error('[[error:invalid-uid]]');
        }

        if (data.toPid && !utils.isNumber(data.toPid)) {
            throw new Error('[[error:invalid-pid]]');
        }

        const pid = await db.incrObjectField('global', 'nextPid');
        let postData = {
            pid: pid,
            uid: uid,
            tid: tid,
            content: content,
            timestamp: timestamp,
<<<<<<< HEAD
            isAnonymous: false
=======
            postType: postType,
>>>>>>> 7def5522de816318f4381428eadf43b15ffc2577
        };

        if (data.toPid) {
            postData.toPid = data.toPid;
        }
        if (data.ip && meta.config.trackIpPerPost) {
            postData.ip = data.ip;
        }
        if (data.handle && !parseInt(uid, 10)) {
            postData.handle = data.handle;
        }

        // Adding and checking if Anonymous feature is enabled
<<<<<<< HEAD
        if (data.postVisibility === "anonymous"){
            //postData.uid = ANONYMOUS_UID;
            postData.handle = "Anonymous"
            postData.isAnonymous = true;
        } else {
            postData.isAnonymous = false;
        }
=======
        // making anonymous users' uid -4
>>>>>>> 7def5522de816318f4381428eadf43b15ffc2577

        let result = await plugins.hooks.fire('filter:post.create', { post: postData, data: data });
        postData = result.post;
        await db.setObject(`post:${postData.pid}`, postData);

        const topicData = await topics.getTopicFields(tid, ['cid', 'pinned']);
        postData.cid = topicData.cid;

        await Promise.all([
            db.sortedSetAdd('posts:pid', timestamp, postData.pid),
            db.incrObjectField('global', 'postCount'),
            user.onNewPostMade(postData),
            topics.onNewPostMade(postData),
            categories.onNewPostMade(topicData.cid, topicData.pinned, postData),
            groups.onNewPostMade(postData),
            addReplyTo(postData, timestamp),
            Posts.uploads.sync(postData.pid),
        ]);

        result = await plugins.hooks.fire('filter:post.get', { post: postData, uid: data.uid });
        result.post.isMain = isMain;
        plugins.hooks.fire('action:post.save', { post: _.clone(result.post) });
        return result.post;
    };

    async function addReplyTo(postData, timestamp) {
        if (!postData.toPid) {
            return;
        }
        await Promise.all([
            db.sortedSetAdd(`pid:${postData.toPid}:replies`, timestamp, postData.pid),
            db.incrObjectField(`post:${postData.toPid}`, 'replies'),
        ]);
    }
};
