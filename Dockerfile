FROM --platform=$BUILDPLATFORM node:18.20-alpine AS builder

WORKDIR /opt/app

COPY . ./

RUN npm ci && npm cache clean --force
RUN npm run build

FROM node:18.20-alpine

WORKDIR /opt/app

COPY --from=builder /opt/app/.output  ./.output
COPY --from=builder /opt/app/.nuxt  ./.nuxt

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
