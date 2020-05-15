export enum MapFeatureTypeState {
  //When not a single Feature of a Feature Type has been added to the map then it is considered absent
  ABSENT_ON_MAP = "absent on map",
  //This is the state given to Feature Types when they are prent on the map and a query has started. All KeplerGl filters will be removed
  WAITING_FOR_LOAD = "waiting for load",
  // There is no query currently running and this Feature Type is present on the map and filters haven't been adedd for it yet
  NEEDS_FILTERS = "needs filters",
  //Filters for the feature type have been added for the relevant attributes of this Feature Type
  FILTERS_ADDED = "filters added",
  //The values of the filters for this Feature Type have been set. E.g. name, type, value
  FILTERS_SET = "filters set",

  NEEDS_LAYER_LABEL = "needs layer label",

  NEEDS_LAYER_CHANGE = "needs layer change",

  NEEDS_3D_ENABLED = "needs 3d enabled",

  NEEDS_HEIGHT_ATTRIBUTE = "needs height attribute",

  FINISHED_SETUP = "finished setup ",
}
