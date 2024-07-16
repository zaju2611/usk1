import Head from "next/head";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			<Head>
				<title>Referrals App</title>
				<meta
					name="description"
					content="Application for generating referrals for paid examinations at usk1 in Lublin"
				/>
			</Head>
			<main className="main row-btn">
				<Link href="/testGenerator" legacyBehavior>
					<a className="button">Generuj skierowanie</a>
				</Link>
				<Link href="/prices" legacyBehavior>
					<a className="button">Cennik</a>
				</Link>
			</main>
		</div>
	);
}
