import Link from "next/link";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navigation/Navbar";

export default function Home() {
	return (
		<div className="container">
			<nav>
				<Navbar />
			</nav>
			<main className="central main">
				<Link href="/testGenerator" legacyBehavior>
					<a className="button">Generuj skierowanie</a>
				</Link>
				<Link href="/prices" legacyBehavior>
					<a className="button">Cennik</a>
				</Link>
			</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
}
