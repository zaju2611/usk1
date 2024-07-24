import classes from "./Footer.module.css";

export default function Footer() {
	return (
		<div className={classes.footer}>
			<a className={classes.link} href="https://lublin.twojewyniki.com.pl/">
				Badania wysyłkowe - wyniki
			</a>
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d624.3233430576895!2d22.5628506831715!3d51.25050755537094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472257428edea1bd%3A0x71d6d06feeeef98c!2sUniwersytecki%20Szpital%20Kliniczny%20nr%201%20w%20Lublinie!5e0!3m2!1spl!2spl!4v1721034679455!5m2!1spl!2spl"
				width="200"
				height="100"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"></iframe>
		</div>
	);
}
