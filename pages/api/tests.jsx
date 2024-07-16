import { MongoClient } from "mongodb";

async function handler(req, res) {
	try {
		const client = await MongoClient.connect(
			"mongodb+srv://test:dOylIYChyNeJOLwL@project1.rh28ezq.mongodb.net/usk?retryWrites=true&w=majority&appName=Project1"
		);

		const db = client.db();
		const tests = await db.collection("badania").find().toArray();
		res.status(200).json({
			tests: tests,
		});
		client.close();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export default handler;
