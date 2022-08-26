FROM debian:latest
RUN apt update && apt install -y wget curl
RUN wget -qO- https://raw.githubusercontent.com/Sirherobrine23/DebianNodejsFiles/main/debianInstall.sh | bash

WORKDIR /app
STOPSIGNAL SIGINT
ENTRYPOINT [ "node", "dist/api.js" ]
EXPOSE 443:8443/tcp 80:8080/tcp
ENV KEY="" CERT="" RUNNINGON="railway"
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
