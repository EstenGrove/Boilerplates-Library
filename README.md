# Custom Boilerplate Library: ```node-babel``` Branch

## **NOTE: THIS CURRENT BRANCH DOES *NOT* INCLUDE EXPRESS; ONLY NODE AND BABEL!!!**


## To Start the Node (w/ Babel) App

```bash
npm start
```

---

## Adding ```ENV``` Variables to a Node App
It's helpful to use the ```dotenv``` node package for this.

```bash
# create and env file
touch .env

# add an env var
MY_SECRET=<some-api-token>

# install dotenv (regular dep)
npm i dotenv --save
```

#### **To Use Environment Variables w/ ```dotenv```**

```javascript
// create .env file in the project root
// add some env variable: MY_VAR=<put-something-here>

// import it into src/index.js
import 'dotenv/config';

console.log('MY_VAR:', process.env.MY_VAR);
```











