# Documentation of New Features Added
## Feature 1)
**<span style="color:red;">Instructor Endorsement</span>**
### How to use: 
Login to NodeBB as an instructor and head over to the "Comments & Feedback" section where you will see all posts. You will then see an "Endorse" button under every student's post. You can then click it and a confirmation pop-up will appear asking you if you are sure you would like to endorse the post. If you click "Yes", a message stating that you have endorsed the post will appear. You also have the option to unendorse, with a confirmation pop-up as well asking if you are sure if you want to perform the action. You may click "Yes" and the post will be successffuly unendorsed and the endorse message will disappear. If you login as a student and you click on the endorse option, you get an error message saying that "You are not authorized to make this call".
### How to test:
Run npm run test
- we have several console log lines
### Where to find the tests:
Run the tests under [Link to test/posts.js](test/posts.js)
### What is being tested:
We have created automated tests to test whether the post is being endorsed or undendorsed. In order to do this, we have created a mock user in the same test file whose account type is "instructor". Only the specified user with instrcutor account type can endorse/unendorse in the test. We also have a test that checks if the account type is a student and if it is, an error is thrown.
### Why we believe the tests are sufficient for covering the changes we have made:
The tests are comprehensive because they cover all cases related to the endorsement feature.
- check if instructors can endorse/unendorse a post
- check that students are prevented from endorsing

Feature 2)
**<span style="color:red;">Student Anonymity</span>**
How to use:
How to test:
Where to find the tests:
What is being tested:
Why we believe the tests are sufficient for covering the changes we have made:
