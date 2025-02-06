FROM --platform=$BUILDPLATFORM node:18.20-alpine AS builder

ARG SCRIPT

WORKDIR /opt/app

COPY . ./

RUN npm ci && npm cache clean --force
RUN npm run ${SCRIPT}

FROM node:18.20-alpine

WORKDIR /opt/app

COPY --from=builder /opt/app/.output  ./.output
COPY --from=builder /opt/app/.nuxt  ./.nuxt

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
