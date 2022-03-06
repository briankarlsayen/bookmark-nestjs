starting dev

npm run db:dev:restart
- initialize db

npm run start:dev
- start && watch changes to backend

npx prisma studio
- start prisma in http://localhost:5555/, view data in db

npx prisma migrate dev --name ['new name']
- create new migration