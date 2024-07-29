import Head from "next/head";
import { LoadingProvider } from "../context/LoadingContext";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Head>
				<title>Referrals App</title>
				<meta
					name="description"
					content="Application for generating referrals for paid examinations at usk1 in Lublin"
				/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<LoadingProvider>
				<Component {...pageProps} />
			</LoadingProvider>
		</Layout>
	);
}

export default MyApp;
