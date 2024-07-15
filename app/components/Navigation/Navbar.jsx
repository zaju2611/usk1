import Image from "next/image";
import Link from "next/link";
import classes from "./Navbar.module.css";

export default function Navbar() {
	return (
		<div className={classes.navbar}>
			<Link href="/">
				<Image src="/logo.png" alt="hospital logo" width={100} height={100} />
			</Link>
			<p className={classes.text}>Aplikacja do generowania skierowań</p>
		</div>
	);
}
