/* eslint-disable quotes */

"use strict";

const db = require("../database");

const postActions = {};

postActions.markAsEndorsed = async (pid) => {
    // Add your logic to mark the post with given PID as endorsed
    // For example, you can update a field in the post object
    console.log(pid);
    await db.setObjectField(`post:${pid}`, "isEndorsed", true);
    console.log("set to true");
};

postActions.markAsUnendorsed = async (pid) => {
    // Add your logic to mark the post with given PID as unendorsed
    // For example, you can update a field in the post object
    console.log(pid);
    await db.setObjectField(`post:${pid}`, "isEndorsed", false);
    console.log("set to false");
};

module.exports = postActions;
