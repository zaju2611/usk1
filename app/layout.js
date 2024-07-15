import "./globals.css";

export const metadata = {
	title: "Generate referral App",
	description:
		"Application for generating referrals for paid examinations at usk1 in Lublin",
};

export default function RootLayout({ children }) {
	return (
		<html lang="pl">
			<body>{children}</body>
		</html>
	);
}
