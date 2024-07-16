import { Fragment } from "react";
import Footer from "./Footer/Footer";
import Navbar from "./Navigation/Navbar";

export default function Layout(props) {
	return (
		<div className="container">
			<Navbar />
			<main className="main">{props.children}</main>
			<Footer />
		</div>
	);
}
