# koa-template-samples

- [Generate API Documentation](#generate-api-documentation)
- [Run tests](#run-tests)
- [Run API Locally](#run-api-locally)
- [Code coverage](#code-coverage)

## Generate API Documentation :

- run : `$ npm run doc`
- open `./apidoc/index.html` to read the documentation

## Run tests :

- run : `$ npm install`
- run test in docker containers : `npm run test:docker` This will run the tests and relaunch the tests if files are changing.
- run test locally : `$ npm test` You will need to have a postgresSQL on localhost. You can use the docker created by the `npm run test:docker` command.

## Run API Locally :

- run API server locally with docker : `npm run start:docker`

## Code Coverage :

After running `$ npm test` you can access the code coverage report here : `./coverage/index.html`
