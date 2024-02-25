# InfoProfile
## Overview Project
This project is based on monolithic service  architecture which we find user onboarding process, is built in hapi js framework. Developing web services with hapi allow us to focus on many problems to be solved, not only the details of the tool being used. Hapi provides the right set of core APIs and extensible plugins to support the requirements of a modern access-token management,security, connectivity,and code quality.

## Prerequisite

- ***Redis Server*** - In your system redis server should be up and running
- ***MongoDb*** - In your system MongoDb server >=6.x should be up and running
- ***NodeJs*** - In your system NodeJS >= 20.X should be up and running


- ***Install dependency*** - Run npm install to install all dependency
```
npm install 
```
## Environment 
- ***Setup Environment*** - Create a file in your root folder by name .env.local with following details 

## Scripts 
```
    "prestart": "tsc",
    "local": " tsc && NODE_ENV=local node ./build/server.js",
    "watch": "tsc --watch",
    "development": "tsc && NODE_ENV=development node ./build/server.js",
    "nodemon": "NODE_ENV=local nodemon --exec ts-node -- server.ts",
    "sc": "node_modules/sonar-scanner/bin/sonar-scanner"
```

## Folder Structure 

```
Folder structure:-
 src
    ├── config
    ├── interfaces
    ├── json
    ├── lib
    │   └── redis
    ├── modules
    │   ├── baseDao
    │   ├── loginHistory
    │   │   └── v1
    │   └── user
    │       └── v1
    ├── plugins
    ├── routes
    ├── uploads
    ├── utils
    └── views
```

## Project run on local machine
```
npm run local 
```

## ScreenShots



![WhatsApp Image 2023-12-25 at 13 36 33 (2)](https://github.com/harshitpratapsingh01/InfoProfile/assets/137901657/1b9b97df-2902-4925-b2a6-5cdde5fc4e58)
![WhatsApp Image 2023-12-25 at 13 36 33 (1)](https://github.com/harshitpratapsingh01/InfoProfile/assets/137901657/530c5617-5854-49bc-bc7d-5fac5c924961)
![WhatsApp Image 2023-12-25 at 13 36 33](https://github.com/harshitpratapsingh01/InfoProfile/assets/137901657/85ed27eb-84bf-4aa5-adb4-def90967a81a)
