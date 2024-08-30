import { Router } from "express";
import { ListController } from "@controllers/list/listController";

const ListRoutes = Router({ mergeParams: true });

const listController = new ListController();

ListRoutes.get("/", (req, res) => {
    listController.list(req, res);
});

export { ListRoutes };