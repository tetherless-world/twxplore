export enum MapFeatureState {
  //Feature has been added to redux state list of features and is awaiting being added to the map
  LOADED = "loaded",

  //Feature has been added to the map and is not currently being clicked/queried
  RENDERED = "rendered",
  //Feature has been clicked and is about to be queried for features within
  CLICKED = "clicked",
  //Feature was clicked and queries to get all features within are ongoing
  CLICKED_AND_LOADING = "clicked and loading",
}
