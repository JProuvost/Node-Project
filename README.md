# Nodejs Project ECE

[![Build Status](https://travis-ci.com/JProuvost/Node-Project.svg?branch=master)](https://travis-ci.com/JProuvost/Node-Project)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)![Contributors](https://img.shields.io/badge/Contributors-2-blue)
![Node version](https://img.shields.io/badge/Node%20version-11.6-green)

## Introduction

This repository is our node project. It also serves of project for our DevOps module.

## Description

This project is a basic API with a dashboard. The project saves users and their metrics, and display the according metrics for each user. 

## Installing
You need to first run the following command
```bash
git clone https://github.com/JProuvost/Node-Project.git
cd Node-Project
npm install
```
It should be noted that you may want to use node version 11.6, as it is the one this project was build and tested on.
## Build
To transpile the typescript files into javascript files, run:
```bash
npm run build
```
## Run
There are several ways to run this project:

If there is need for development to be done, run:
```bash
npm run dev
```
This will run the project from a nodemon file.

If you need a project ready for production, run:
```bash
npm run start-js
```
:warning: You **must run** npm run build first if you want to use this command

Finally, you can simply use the command:
```bash
npm start
```

The project will be accessible from port [8080](http://localhost:8080)
## Database population

The database can be populated with a script using the command:
```bash
npm run populate
```

## Docker integration

The project is available on docker hub, it can be pulled with the command:
```bash
docker pull zarothunder/nodeproject_web:latest
```
The docker image can be run with the command:
```bash
docker run zarothunder/nodeproject_web:latest
```

Alternatively, a docker compose file was created to automate the deployment of the docker images (exposition of port), it can be run using the command:
```bash
docker-compose up
```
## CI with Travis

This project was developped with Travis-CI as CI support.

For every push on the master branch, Travis verifies if the project builds properly, if the scripts work accordingly and push the new docker image to docker hub.

## Deployment with Heroku

The app is deployed on Heroku [here](https://ecenodeproject.herokuapp.com/login)

Heroku deploys automatically the new version after each successful push on the master branch that satisfies the test realised by Travis.
## Contributors

[**Jean Prouvost**](https://github.com/JProuvost) (SI 04)

[**Jordan Do Barreiro**](https://github.com/jordan-dobarreiro)  (SI04)
