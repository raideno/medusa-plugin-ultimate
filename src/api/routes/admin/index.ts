import { Router } from "express";

import ultimateEntitiesRoutes from "./ultimate-entities";
import ultimateEntitiesDocumentsRoutes from "./ultimate-entities-documents";
import ultimateEntitiesDocumentsOperationsRoutes from "./ultimate-entities-documents-operations";

export function attachAdminRoutes(adminRouter: Router) {
  ultimateEntitiesRoutes(adminRouter);
  ultimateEntitiesDocumentsRoutes(adminRouter);
  ultimateEntitiesDocumentsOperationsRoutes(adminRouter);
}
