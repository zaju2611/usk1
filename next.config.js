/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		mongodb_username: "test",
		mongodb_password: "dOylIYChyNeJOLwL",
		mongodb_clustername: "project1",
		mongodb_database: "usk",
		API_URL: "https://usk1.vercel.app",
	},
};

module.exports = nextConfig;
