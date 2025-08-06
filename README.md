# patch-backend
It is used for all Patch related backend business logics and databases work.

# Remove dist folder 
Remove-Item -Recurse -Force .\dist

# Migration Generate
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/database/migrations/changes-name-to-be-here -d data-source.ts

#Migrations Run
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d data-source.ts

#Seeders Run
npx ts-node run-seed.ts

-- Delete all rows from specific tables
DELETE FROM client_evaluation_question;
DELETE FROM client_evaluation_answer;
DELETE FROM phases;
DELETE FROM "user";

-- Reset sequences (so new inserts start from 1)
ALTER SEQUENCE client_evaluation_question_id_seq RESTART WITH 1;
ALTER SEQUENCE client_evaluation_answer_id_seq RESTART WITH 1;
ALTER SEQUENCE phases_id_seq RESTART WITH 1;
ALTER SEQUENCE sub_phases_id_seq RESTART WITH 1;
ALTER SEQUENCE user_id_seq RESTART WITH 1;

kill task
taskkill /f /im node.exe

//hellosql123----> postgresql pass