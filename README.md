## Start development

to build docker container type <br/>
`docker-compose up`

then install dependecies by running <br/>
`npm install`

initialize db <br/>
`npm run db:dev:restart`

start && watch changes to backend <br/>
`npm run start:dev`

start prisma in http://localhost:5555/, view data in db <br/>
`npx prisma studio`

create new migration <br/>
`npx prisma migrate dev --name ['new name']`

## Testing
end to end testing is done by running <br/>
`npm run test:e2e`

## Remarks
This project is using docker version 20.10.11 & docker-compose version 2.2.3. <br/>
If encountered error update <strong>docker-compose</strong> to <strong>docker compose</strong>  in the scripts of package.json.
