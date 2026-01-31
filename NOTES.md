# NOTES (Candidate)

Please answer briefly:

1) What issues did you find in the starter code?

-Not UI/UX friendly.
-No input validations both front-end and back-end.
-Incorrect logic with the implementation of pricing mode.
-Security issue with the database query as it is not using prepared statement and makes it vulnerable on sql injection
-No logic to get and display summary.

2) What did you change and why?

-Made some changes with the UI/UX, to make it easier to use, added and updated some logics that are incorrect or missing, added some validations to give user an idea which input they should provide correct value.

3) Where did you compute the summary row (frontend vs backend) and why?

-Front-end for now, because it will lessen the back-end or server process or workload, and it will be faster, since the data is also available in the front-end, we can compute it on client-side to lessen backend process.

4) What would you improve next if you had more time?

-Improve design, UI/UX more and make it responsive and usable on both mobile, tablet and desktop.
-Format the code and make it more organize specially in the back-end


EXAMINEE NOTE:
-In the provided schema.sql, pricing_mode column is already there, so I did not change anything with the schema.sql
-I added front-end validation as well, so to test the back-end validation please refer to the comment under script.js, code line 57.

Thank you!