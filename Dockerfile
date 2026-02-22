FROM node:18-bullseye


RUN apt-get update && apt-get install -y default-jdk


WORKDIR /app


COPY sentinal-backend/package*.json ./
RUN npm install

COPY sentinal-backend/ .

RUN javac SentinalCore.java

EXPOSE 5000
CMD ["node", "server.js"]






























# docker run -p 5000:5000 sentinel-ai-backend