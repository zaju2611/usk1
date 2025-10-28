import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
	if (req.method !== "DELETE") {
		return res
			.setHeader("Allow", ["DELETE"])
			.status(405)
			.json({ message: `Method ${req.method} Not Allowed` });
	}

	const { id } = req.query;

	if (!id) {
		return res.status(422).json({ message: "Missing id" });
	}

	const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.rh28ezq.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=Project1`;

	let client;

	try {
		client = await MongoClient.connect(connectionString);
		const db = client.db();

		const result = await db
			.collection("badania")
			.deleteOne({ _id: new ObjectId(id) });

		client.close();

		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Nie znaleziono testu" });
		}

		return res.status(200).json({ message: "Usunięto test" });
	} catch (error) {
		console.error(error);
		if (client) client.close();
		return res.status(500).json({ message: "Błąd serwera" });
	}
}

export default handler;
