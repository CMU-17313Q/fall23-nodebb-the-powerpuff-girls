/* eslint-disable quotes */

"use strict"

const db = require("../database")
const user = require("../user")

module.exports = function (Posts) {
  Posts.endorse = async function (pid, uid) {
    // Check the user's account type
    const instructorCondition = await user.isInstructor(uid)

    if (instructorCondition) {
      // Check if the post is already endorsed
      const hasEndorsed = await Posts.hasEndorsed(pid, uid)

      console.log(hasEndorsed)

      console.log(pid)
      await db.setObjectField(`post:${pid}`, "isEndorsed", true)
      console.log("set to true")
      return {
        postId: { pid }, // Adjust the structure to match your needs
        isEndorsed: true // Set this value accordingly
      }
    }
    throw new Error("User is not an instructor. Cannot endorse.")
  }

  Posts.unendorse = async function (pid, uid) {
    // Check the user's account type
    const instructorCondition = await user.isInstructor(uid)

    if (instructorCondition) {
      // Check if the post is already unendorsed
      const hasEndorsed = await Posts.hasEndorsed(pid, uid)

      console.log(hasEndorsed)

      console.log(pid)
      await db.setObjectField(`post:${pid}`, "isEndorsed", false)
      console.log("set to false")

      return {
        postId: { pid }, // Adjust the structure to match your needs
        isEndorsed: false // Set this value accordingly
      }
    }
    throw new Error("User is not an instructor. Cannot endorse.")
  }

  Posts.hasEndorsed = async function (pid, uid) {
    if (parseInt(uid, 10) <= 0) {
      return false
    }
    const isEndorsed = await db.getObjectField(`post:${pid}`, "isEndorsed")

    // Check if isEndorsed is a string and its value is "true"
    return isEndorsed === "true" || isEndorsed === true
  }
}
