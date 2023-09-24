/* eslint-disable quotes */

"use strict";

const db = require("../database");
const user = require("../user");

const postActions = {};

postActions.markAsEndorsed = async (pid, uid) => {
    // Check the user's account type
    const instructorCondition = await user.isInstructor(uid);

    if (instructorCondition) {
        console.log(pid);
        await db.setObjectField(`post:${pid}`, "isEndorsed", true);
        console.log("set to true");
    } else {
        throw new Error("User is not an instructor. Cannot endorse.");
    }
};

postActions.markAsUnendorsed = async (pid, uid) => {
    // Check the user's account type
    const instructorCondition = await user.isInstructor(uid);

    if (instructorCondition) {
        console.log(pid);
        await db.setObjectField(`post:${pid}`, "isEndorsed", false);
        console.log("set to false");
    } else {
        throw new Error("User is not an instructor. Cannot endorse.");
    }
};

module.exports = postActions;
