export enum MapFeatureTypeState {
  //When not a single Feature of a Feature Type has been added to the map then it is considered absent
  ABSENT_ON_MAP = "absent on map",
  //This is the state given to Feature Types when they are present on the map and a query has started. All KeplerGl filters will be removed
  WAITING_FOR_LOAD = "waiting for load",
  // There is no query currently running and this Feature Type is present on the map and filters haven't been adedd for it yet
  NEEDS_FILTERS = "needs filters",
  //Filters for the feature type have been added but the filters have not been attached to attributes of that feature type yet.
  NEEDS_INITIAL_FILTER_SETTING = "needs initial filter setting",

  //Needs popup change to prevent 'new Dataset' display on popup and to determine what fields to show
  NEEDS_POPUP_CHANGE = "needs popup change",

  //Used if wanting to change the type of the layer e.g from Point -> Hexagon
  NEEDS_LAYER_TYPE_CHANGE = "needs layer type change",

  //Used columns specified. Usually done after the layer type has just been changed. E.g. Polygons need _geojson, hexagons need lng and lat.
  NEEDS_COLUMNS = "needs columns",

  //3d/height for this feature type needs to be enabled
  NEEDS_3D_ENABLED = "needs 3d enabled",

  //Needs an attribute to determine what to base height on
  NEEDS_HEIGHT_ATTRIBUTE = "needs height attribute",

  //No more horrendous yellow. In this state, a color is set for the layer of the feature type.
  NEEDS_LAYER_COLOR_CHANGE = "needs layer color change"

  //All setup for this feature type done. The filter component will now be rendered
  FINISHED_SETUP = "finished setup ",
}
