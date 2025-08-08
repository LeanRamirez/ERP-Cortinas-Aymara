# FROM node:18
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# EXPOSE 4000
# CMD ["npm", "start"]


FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

# Copiamos los archivos del proyecto
COPY . .

# Ejecutamos prisma generate para generar cliente Prisma
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]
