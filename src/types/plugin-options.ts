export type PluginOptions = {
  /**
   * If set to false, Generated UI on admin dashboard will be disabled.
   *
   *  @prop {boolean} [enableUI=true]
   */
  enableUI?: boolean;
  /**
   * Your medusa backend URL.
   *
   *  @prop {string}
   */
  backendUrl: string;
};
