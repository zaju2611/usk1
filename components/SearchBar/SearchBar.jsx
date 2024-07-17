import { useState } from "react";
import classes from "./SearchBar.module.css";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

function SearchBar({ onSearch }) {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			onSearch(inputValue);
		}
	};

	const handleSearchClick = () => {
		onSearch(inputValue);
	};

	return (
		<div className={classes.searchContainer}>
			<input
				type="text"
				placeholder="Wyszukaj badania..."
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				className={classes.searchBar}
			/>
			<button onClick={handleSearchClick} className={classes.searchButton}>
				<Icon path={mdiMagnify} size={1} />
			</button>
		</div>
	);
}

export default SearchBar;
