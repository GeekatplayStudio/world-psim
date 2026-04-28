FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

COPY docker/dev-entrypoint.sh /usr/local/bin/dev-entrypoint

RUN chmod +x /usr/local/bin/dev-entrypoint && pnpm install

EXPOSE 3000

CMD ["dev-entrypoint", "@balancesphere/web", "dev"]