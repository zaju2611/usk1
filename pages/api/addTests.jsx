import { MongoClient } from "mongodb";

const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.rh28ezq.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=Project1`;

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { name, price, type } = req.body;

	if (
		name == null ||
		price == null ||
		type == null ||
		name === "" ||
		type === ""
	) {
		return res.status(400).json({ message: "Missing data" });
	}

	let client;

	try {
		client = await MongoClient.connect(connectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const db = client.db();

		const result = await db.collection("badania").insertOne({
			name: String(name),
			price: Number(price),
			type: String(type),
		});

		const newTest = {
			_id: result.insertedId,
			name: String(name),
			price: Number(price),
			type: String(type),
		};

		client.close();

		return res.status(201).json({ test: newTest });
	} catch (err) {
		console.error("Add test error:", err);
		if (client) client.close();
		return res.status(500).json({ message: "Adding test failed" });
	}
}
