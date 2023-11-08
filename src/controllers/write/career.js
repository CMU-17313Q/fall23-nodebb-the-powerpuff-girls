/* eslint-disable quotes */
/* eslint-disable max-len */

"use strict";

const helpers = require("../helpers");
const user = require("../../user");
const db = require("../../database");

const Career = module.exports;
const URL = "https://career-service-kev265hxta-de.a.run.app/api"

Career.register = async (req, res) => {
    const userData = req.body;
    try {
        const userCareerData = {
            student_id: userData.student_id,
            major: userData.major,
            age: userData.age,
            gender: userData.gender,
            gpa: userData.gpa,
            extra_curricular: userData.extra_curricular,
            num_programming_languages: userData.num_programming_languages,
            num_past_internships: userData.num_past_internships,
        };

        //userCareerData.prediction = Math.round(Math.random()); 
        // TODO: Change this line to do call and retrieve actual candidate success prediction from the model instead of using a random number

        let response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCareerData)
        });

        response = await response.json();
        console.log(response);
        userCareerData.prediction = response.good_employee;

        await user.setCareerData(req.uid, userCareerData);
        db.sortedSetAdd("users:career", req.uid, req.uid);
        helpers.formatApiResponse(200, res);
        res.json({});
    } catch (err) {
        console.log(err);
        helpers.noScriptErrors(req, res, err.message, 400);
    }
};
