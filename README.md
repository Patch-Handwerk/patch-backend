# patch-backend
It is used for all Patch related backend business logics and databases work.

# Remove dist folder 
Remove-Item -Recurse -Force .\dist

# Remove Port Conflicts
# Normal start
npm run start:dev

# If you get port conflicts, use a different port
set PORT=3003 && npm run start:dev

# Or kill processes on port 3002 first
netstat -ano | findstr :3002
taskkill /PID <PID> /F
npm run start:dev

# Migration Generate
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/database/migrations/changes-name-to-be-here -d data-source.ts

#Migrations Run
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d data-source.ts

#Seeders Run
npx ts-node run-seed.ts

-- Delete all rows from specific tables
DELETE FROM questions;
DELETE FROM answers;
DELETE FROM phases;
DELETE FROM "user";

-- Reset sequences (so new inserts start from 1)
ALTER SEQUENCE questions_id_seq RESTART WITH 1;
ALTER SEQUENCE answers_id_seq RESTART WITH 1;
ALTER SEQUENCE phases_id_seq RESTART WITH 1;
ALTER SEQUENCE sub_phases_id_seq RESTART WITH 1;
ALTER SEQUENCE user_id_seq RESTART WITH 1;

kill task
taskkill /f /im node.exe

//hellosql123----> postgresql pass