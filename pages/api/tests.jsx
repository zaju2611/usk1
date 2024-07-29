import { MongoClient } from "mongodb";

async function handler(req, res) {
	const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.rh28ezq.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=Project1`;

	try {
		const client = await MongoClient.connect(connectionString);

		const db = client.db();
		const tests = await db.collection("badania").find().toArray();
		res.status(200).json({
			tests: tests,
		});
		client.close();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Could not connect to database" });
	}
}

export default handler;
