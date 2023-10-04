(async () => {
	const { setupApp } = await import("./config/app");
	const app = await setupApp();
	const port = 8080;
	app.listen(port, () =>
		console.log(`Server running at http://localhost:${port}`)
	);
})();
