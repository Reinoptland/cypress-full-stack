# Simple Fullstack Cypress

## Setup

1. Install the dependencies for the frontend and backend

   - open 2 terminals and split them
   - Frontend terminal: `cd frontend && npm i`
   - Backend terminal: `cd backend && npm i`

2. Run the app in development mode

   - Make sure no processes are running on localhost 3000 and 3001
   - Backend terminal: `npm run setup && npm run dev`
   - Frontend terminal: `npm run dev`
   - check the dummy data in `backend/prisma/data/users.json`

3. Run the app with local e2e tests

   - Make sure no processes are running on localhost 3000 and 3001
   - Frontend terminal: `npm run test:e2e:dev`
