import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddAnimalController } from "../factories/controllers/make-add-animal-controller";
import { makeUpdateAnimalController } from "@main/factories/controllers/make-update-animal-controller";
import { auth } from "@main/middlewares/auth";
import { makeRemoveAnimalController } from "@main/factories/controllers/make-remove-animal-controller";

export default (router: Router) => {
	router.put(
		"/animals/:animalId",
		auth,
		adaptRoute(makeUpdateAnimalController())
	);
	router.post("/animals", auth, adaptRoute(makeAddAnimalController()));
	router.delete(
		"/animals/:animalId",
		auth,
		adaptRoute(makeRemoveAnimalController())
	);
};
