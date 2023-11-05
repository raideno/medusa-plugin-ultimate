export interface UltimateEntity {
  id: string;
  name?: string;
  group?: string;
  hidden?: boolean;
  description?: string;
  // TODO: add a loader to validate that this field is correctly set
  isBuiltInEntity?: boolean;
  // ---
  // Automatically set if @UltimateEntityPositionColumn() decorator is set on the entity class
  ordering?: {
    enabled: boolean;
    positionPropertyName: string;
  }
}
