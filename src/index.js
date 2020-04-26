import "dotenv/config";
import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
	const user = process.env.API_USER; // using ENV vars
	
	console.log(`✅ - APP is listening on port ${PORT}`);
	console.log(`API_USER: ${user}`);
	
});

