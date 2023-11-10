/* eslint-disable quotes */
/* eslint-disable max-len */

"use strict";

const helpers = require("../helpers");
const user = require("../../user");
const db = require("../../database");

/* https://career-service-kev265hxta-de.a.run.app/api?data=
{"Student ID":"123","Gender":"M","Age":20,"Major":"Computer Science","GPA":3.5,"Extra Curricular":"Sorority","Num Programming Languages":2,"Num Past Internships":1}*/


const Career = module.exports;


Career.register = async (req, res) => {
    const userData = req.body;
    //console.log(userData);
    const URL = `https://career-service-kev265hxta-de.a.run.app/api?data={"Student%20ID":"${userData.student_id}","Gender":"${userData.gender}","Age":${userData.age},"Major":"${encodeURIComponent(userData.major)}","GPA":${encodeURIComponent(userData.gpa)},"Extra%20Curricular":"${encodeURIComponent(userData.extra_curricular)}","Num%20Programming%20Languages":${userData.num_programming_languages},"Num%20Past%20Internships":${userData.num_past_internships}}`
    //console.log(URL);
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }     
        });

        response = await response.json();

        userCareerData.prediction = response.result;
        //console.log(userCareerData.prediction);

        await user.setCareerData(req.uid, userCareerData);
        db.sortedSetAdd("users:career", req.uid, req.uid);
        // helpers.formatApiResponse(200, res);

        //console.log("blabla")
        res.json({});
    } catch (err) {
        //console.log("err:"+err);
        
        console.error(response.status);
        helpers.noScriptErrors(req, res, err.message, 400);
    }
};
