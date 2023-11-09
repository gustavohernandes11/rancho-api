import { adaptRoute } from "@main/adapters/express-route-adapter";
import { makeAddBatchController } from "@main/factories/controllers/make-add-batch-controller";
import { makeListBatchesController } from "@main/factories/controllers/make-list-batches-controller";
import { makeLoadBatchController } from "@main/factories/controllers/make-load-batch-controller";
import { makeRemoveBatchController } from "@main/factories/controllers/make-remove-batch-controller";
import { makeUpdateBatchController } from "@main/factories/controllers/make-udpate-batch-controller";
import { auth } from "@main/middlewares/auth";
import { Router } from "express";

export default (router: Router) => {
	router.get(
		"/batches/:batchId",
		auth,
		adaptRoute(makeLoadBatchController())
	);
	router.put(
		"/batches/:batchId",
		auth,
		adaptRoute(makeUpdateBatchController())
	);
	router.delete(
		"/batches/:batchId",
		auth,
		adaptRoute(makeRemoveBatchController())
	);
	router.post("/batches", auth, adaptRoute(makeAddBatchController()));
	router.get("/batches", auth, adaptRoute(makeListBatchesController()));
};
