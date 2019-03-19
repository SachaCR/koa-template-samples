FROM node:10

# Copy source
ARG NPM_TOKEN
ARG BUILD_ENV
ADD package.json /tmp/package.json
RUN cd /tmp; npm install $([ "$BUILD_ENV" != "test" ] && echo "--production")

RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Bootstrap data
WORKDIR /src
ADD . /src
EXPOSE 80
CMD ["node", "index.js"]
