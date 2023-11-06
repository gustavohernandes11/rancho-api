import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddAnimalController } from "../factories/controllers/make-add-animal-controller";
import { makeUpdateAnimalController } from "@main/factories/controllers/make-update-animal-controller";
import { auth } from "@main/middlewares/auth";
import { makeRemoveAnimalController } from "@main/factories/controllers/make-remove-animal-controller";
import { makeLoadAnimalController } from "@main/factories/controllers/make-load-animal-controller";
import { makeListAnimalsController } from "@main/factories/controllers/make-list-animals-controller";

export default (router: Router) => {
	router.get(
		"/animals/:animalId",
		auth,
		adaptRoute(makeLoadAnimalController())
	);
	router.put(
		"/animals/:animalId",
		auth,
		adaptRoute(makeUpdateAnimalController())
	);
	router.delete(
		"/animals/:animalId",
		auth,
		adaptRoute(makeRemoveAnimalController())
	);
	router.post("/animals", auth, adaptRoute(makeAddAnimalController()));
	router.get("/animals", auth, adaptRoute(makeListAnimalsController()));
};
