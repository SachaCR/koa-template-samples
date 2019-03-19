# koa-template-samples

- [About](#about)
- [Code Samples](#code-samples)
- [Generate API Documentation](#generate-api-documentation)
- [Run tests](#run-tests)
- [Run API Locally](#run-api-locally)
- [Code coverage](#code-coverage)

## About :
This repository contains use cases code samples based on [koa-template](https://github.com/SachaCR/koa-template).

## Code samples :

I will try to create an article for each codes samples to explain why I choose to implement things like this.
I will add links to these articles in this README.md when they will be published.

- Illustrate dependencies injections with [koa-depsi](https://www.npmjs.com/package/koa-depsi) to simulate DB failures in your tests
- Clean error management with : [verror](https://www.npmjs.com/package/verror)
- Payload validation with AJV through [koa-validator-ajv](https://www.npmjs.com/package/koa-validator-ajv)
- Testing your API with operaton on the database
- Testing routes that performs HTTP calls to externals services with [nock](https://www.npmjs.com/package/nock)
- Implement a good SQL transaction management with PostgresSQL [pg](https://www.npmjs.com/package/pg)

## Generate API Documentation :

- run : `npm run doc`
- open `./apidoc/index.html` to read the documentation

## Run tests :

- run : `npm install`
- run test in docker containers : `npm run test:docker` This will run the tests and relaunch the tests if files are changing.
- run test locally : `npm test` You will need to have a postgresSQL on localhost. You can use the docker created by the `npm run test:docker` command.

## Run API Locally :

- run API server locally with docker : `npm run start:docker`

## Code Coverage :

After running `npm test` you can access the code coverage report here : `./coverage/index.html`
