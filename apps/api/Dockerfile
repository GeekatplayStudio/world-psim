FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 4000

CMD ["pnpm", "--filter", "@balancesphere/api", "dev"]