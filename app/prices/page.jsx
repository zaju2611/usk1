import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navigation/Navbar";
import TestsList from "../components/TestsList/TestsList";

export default function Prices() {
	return (
		<div className="container">
			<Navbar />
			<div className="central">
				<h1>Prices</h1>
				<TestsList />
			</div>
			<Footer />
		</div>
	);
}
