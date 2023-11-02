import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddAnimalController } from "../factories/controllers/make-add-animal-controller";

export default (router: Router) => {
	router.use("/animals", adaptRoute(makeAddAnimalController()));
};
