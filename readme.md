# ABSB - Spondon Android App

This repository contains the backend code

## Feature:

1. User can search a blood donor; Search parameter: name, blood group, division, district, availability
2. User can search an ambulance or oxygen cylinder; Search parameter: name division, district
3. User can show the live bed status of all the hospitals of Bangladesh and filter the hospitals according to hospital name, division, district, availability, last update

We have an admin side built in React from where admin can perform **CRUD operation** for ambulance and oxygen cylinder.

## Prerequisites:

- [NodeJS](https://nodejs.org) from 10 to 13 (Backend)

## Set up and run demo

### Clone

Clone the repository from GitHub.

```
$ git clone https://github.com/shovito66/bloodBank.git
```

#### Create a `.env` file and Set the parameters:

- [Credential Documentation](https://docs.google.com/spreadsheets/d/1II2hOKT4fJeMtNjqb7sovW1jMt4Ri57Ehf9XuuGPmJw/edit#gid=2020176758) [Restricted]
  
  | Variable Name | Value |
  | --------------- | ------------------------------------------------------ |
  | MONGO_URL | |
  | JWT_PRIVATE_KEY | Private key of your App that is used to sign the JWTs. |
  | EMAIL_HOST | bbank.absbpeople.com |
  | EMAIL_USER | admin@bbank.absbpeople.com |
  | EMAIL_PASS | |
  | EMAIL_PORT | 465 |
  | EMAIL_FROM | "ABSB-Spondon" <bbank@absbpeople.com> |

Add this parameters to your `create.env` file.

### Install Dependencies and Run the Server

```
$ npm install
By default, npm install will install all modules listed as dependencies in package.json
$ nodemon
```

### API

Test the API from postman using https://absb.herokuapp.com/api/ at your browser

- [API Documentation](https://docs.google.com/spreadsheets/d/1II2hOKT4fJeMtNjqb7sovW1jMt4Ri57Ehf9XuuGPmJw/edit#gid=1481506332) [Restricted]


## Authentication Token
JWT Token is under the `x-auth-token` variable of the `req.header` section

