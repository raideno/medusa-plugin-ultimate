import { Router } from "express";

import ultimateEntitiesRoutes from "./ultimate-entities";
import ultimateEntitiesDocumentsRoutes from "./ultimate-entities-documents";
import ultimateEntitiesDocumentsOperationsRoutes from "./ultimate-entities-documents-operations";
import ultimateEntitiesDocumentsOrderingRoutes from "./ultimate-entities-documents-ordering";

export function attachAdminRoutes(adminRouter: Router) {
  ultimateEntitiesRoutes(adminRouter);
  ultimateEntitiesDocumentsOrderingRoutes(adminRouter);
  ultimateEntitiesDocumentsRoutes(adminRouter);
  ultimateEntitiesDocumentsOperationsRoutes(adminRouter);
}
