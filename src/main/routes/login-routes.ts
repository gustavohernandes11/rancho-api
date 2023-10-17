import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignupController } from "../factories/controllers/make-signup-controller";
import { makeLoginController } from "../factories/controllers/make-login-controller";

export default (router: Router) => {
	router.use("/signup", adaptRoute(makeSignupController()));
	router.use("/login", adaptRoute(makeLoginController()));
};
