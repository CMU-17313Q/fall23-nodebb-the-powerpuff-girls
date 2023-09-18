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

module.exports = function (Posts) {
    Posts.create = async function (data) {
        // This is an internal method, consider using Topics.reply instead
        const { uid } = data;
        const { tid } = data;
        const content = data.content.toString();
        const timestamp = data.timestamp || Date.now();
        const isMain = data.isMain || false;

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
        // making anonymous users' uid -4
        if (data.postVisibility === "anonymous"){
            postData.uid = -4;
            postData.handle = "Anonymous"
            postData.isAnonymous = true;
        } else {
            postData.isAnonymous = false;
        }

        // Event handler for clicking the postVisibility element
        $("#postVisibility").on("click", function(event) {
            displayGuidelinesModal();
        });

        $(document).ready(function() {
            // Function to display the community guidelines modal
            function displayGuidelinesModal() {
              const modal = bootbox.dialog({
                message: $(".dialogueModal").html(),
                title: "Community Guidelines",
                buttons: [
                  {
                    label: "I understand",
                    className: "btn btn-primary",
                    callback: function() {
                    // Display a message to the user once they understand
                    alert("Thank you for understanding the community guidelines.");
                    }
                  },
                ],
                onEscape: function() {
                  modal.modal("hide");
                }
              });
          
              modal.modal("show");
            }
          

          });          

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
