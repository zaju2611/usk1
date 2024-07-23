export const fetchFont = async () => {
	const response = await fetch("/Lora.ttf");
	return await response.arrayBuffer();
};
