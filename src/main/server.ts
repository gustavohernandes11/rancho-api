import { MongoHelper } from "../infra/db/mongodb/mongo-helper";
import env from "./config/env";

MongoHelper.connect(env.mongoUrl)
	.then(async () => {
		const { setupApp } = await import("./config/app");
		const app = await setupApp();
		const port = 8080;
		app.listen(port, () =>
			console.log(`Server running at http://localhost:${port}`)
		);
	})
	.catch((e) => console.log(e));
