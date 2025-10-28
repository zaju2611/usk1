import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useLoading } from "../context/LoadingContext";
import { useRouter } from "next/router";
import { HashLoader } from "react-spinners";

export default function Home() {
	const { loading, setLoading } = useLoading();
	const router = useRouter();

	const handleLinkClick = () => {
		setLoading(true);
	};
	useEffect(() => {
		setLoading(false);
	}, [router.pathname, setLoading]);

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
					<a className="button" onClick={handleLinkClick}>
						{loading ? (
							<HashLoader size={25} color="#f2f8f9" />
						) : (
							"Generuj skierowanie"
						)}
					</a>
				</Link>
				<Link href="/prices" legacyBehavior>
					<a className="button" onClick={handleLinkClick}>
						{loading ? <HashLoader size={25} color="#f2f8f9" /> : "Cennik"}
					</a>
				</Link>
				<Link href="/editTests" legacyBehavior>
					<a className="button" onClick={handleLinkClick}>
						{loading ? (
							<HashLoader size={25} color="#f2f8f9" />
						) : (
							"Edytuj badania"
						)}
					</a>
				</Link>
			</main>
		</div>
	);
}
