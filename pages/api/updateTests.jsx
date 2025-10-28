import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
	if (req.method !== "PUT") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { _id, name, price, type } = req.body;

	if (!_id || !name || !price || !type) {
		return res.status(422).json({ message: "Missing data" });
	}

	const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.rh28ezq.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=Project1`;

	let client;

	try {
		client = await MongoClient.connect(connectionString);
		const db = client.db();

		const result = await db
			.collection("badania")
			.updateOne({ _id: new ObjectId(_id) }, { $set: { name, price, type } });

		client.close();

		return res.status(200).json({ message: "Test updated", result });
	} catch (error) {
		console.error(error);
		if (client) client.close();
		return res.status(500).json({ message: "Updating test failed." });
	}
}

export default handler;
