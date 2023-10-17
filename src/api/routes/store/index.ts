import { Router } from "express";
import ultimateEntitiesDocumentsRoutes from "./ultimate-entities-documents";

export function attachStoreRoutes(storeRouter: Router) {
  ultimateEntitiesDocumentsRoutes(storeRouter);
}
