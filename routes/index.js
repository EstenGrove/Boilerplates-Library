// NOTE: using es6 modules (esm) ONLY works w/ node 13 or greater!!

import express from "express"; // standar express import; for access to "Router"

const routes = express.Router();

routes.get("/", (req, res) => {
	return res.status(200).json({ message: "CONNECTED!!!" });
});
routes.get("/", (req, res) => {
	return res.status(200).json({ message: "CONNECTED!!!" });
});
routes.get("/", (req, res) => {
	return res.status(200).json({ message: "CONNECTED!!!" });
});
routes.get("/", (req, res) => {
	return res.status(200).json({ message: "CONNECTED!!!" });
});

// es6 export syntax
export { routes };
