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

#### **To Use ```dotenv```**

```javascript
// import it into src/index.js
import 'dotenv/config';
```











