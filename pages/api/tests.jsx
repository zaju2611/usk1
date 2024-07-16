import { MongoClient } from "mongodb";

function handler(req, res) {
	// const eventId = req.query.eventId;
	// const client = await MongoClient.connect(
	// 	"mongodb+srv://test:dOylIYChyNeJOLwL@project1.rh28ezq.mongodb.net/usk?retryWrites=true&w=majority&appName=Project1"
	// );

	// const db = client.db();
	// const tests = await db.collection("badania").find({ eventId }).toArray();

	// client.close();

	// return tests;

	const dummyTest = [
		{
			_id: "6680600a23732b3db58c1461",
			name: "Pobranie materiału",
			price: 6,
			type: "pobranie",
		},
		{
			_id: "6680604223732b3db58c1462",
			name: "Morfologia krwi bez rozmazu z analizatora",
			price: 10,
			type: "Badania hematologiczne",
		},
	];
	res.status(200).json({
		tests: dummyTest,
	});
}

export default handler;
