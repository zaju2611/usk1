import { MongoClient } from "mongodb";

async function getTests() {
	const client = await MongoClient.connect(
		"mongodb+srv://test:dOylIYChyNeJOLwL@project1.rh28ezq.mongodb.net/usk?retryWrites=true&w=majority&appName=Project1"
	);

	const db = client.db();
	const tests = await db.collection("badania").find().toArray();

	client.close();

	return tests;
}

export default getTests;
