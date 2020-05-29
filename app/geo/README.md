# Geo-app Documentation



## Kepler Specifics
### Filters
- Kepler holds all filters (which are objects) in a single list
	 - The list of filters can be found in ```keplerState.map.visState.filters```
	 - Because they are all in a single list and not organized/separated by the layer/FeatureType they filter, it is up to geo-app code to keep track of which filter handles attributes of each FeatureType
		-  This is done by using the 'filterIndex' field in the attributeState of a FeatureType's featureByType.

- Some Relevant Actions:
	- addFilter
		- dispatching addFilter(datasetName) creates a filter object and adds it to kepler's list of filters. 
		- The filter object will filter features of the dataset (FeatureType) provided 
		- This filter object is mostly blank and has no attachment to an attribute yet.

	- setFIlter
		- The setFilter action is used for multiple purposes and basically provides/replaces fields of a filter object. Here are some examples:
			- Can be used to attach a filter to an attribute.
				- ```setFilter(filterIndex, "name", attributeName)```
			- Can be used to provide a new value (or range) to the filter
				- ```setFilter(filterIndexOfAttribute, "value", [newRange.min, newRange.max])```
			- To prevent kepler from bringing up its own filter component on the map
				- ```setFilter(filterIndex, "enlarged", false)```

- Debugging tips
	-  Consider setting readonly in mapOptions to ```false```. Kepler's side-panel will now show up on the app. You can now go into the filters-tab and see if things look like how you want them
	- Consider navigating to ```keplerState.map.visState.filters``` and looking through the filter objects yourself.

### Layers (and Datasets)

- Kepler holds all layers (which are objects) in a single list 
	- The list of layers can be found in ```keplerState.map.visState.layers```
- Kepler creates a layer for each dataset with a unique id added to the map (via addDataToMap action).

- Types of Layers (relevant to the app)
	- Polygon (geoJSON)
		- This is the default as features are added to the map because geo-app provides Kepler a FeatureCollection geoJSON as dataset data when adding to the map
	- Hexbin (hexagon)
		- This layer is useful for 3d visualization.
		- To convert a Polygon to a Hexagon, the lat and lng attributes must be defined for that features of that layer. Therefore, geoJSON layers that have features that are 'points' can be easily converted to hexagons.

- Some Relevant Actions:
	- addDataToMap
		- Adds a dataset (and therefore a new layer) to the map
		-  In geo-app, a dataset is added with features of a FeatureType, and the dataset's id is the name of the Feature Type
			- Because of this, one layer is created for each FeatureType on the map.
		- ```addDataToMap({dataset,options: {centerMap: true, readOnly: true}```
			- ***Remember*** ensure  ```dataset.id = featureTypeName```,
		- **Warning:**  Kepler seems to get confused when feature's have a field/attribute resembling 'lng' and 'lat' and creates a duplicate Pointlayer in addtion to the usual geoJSON layer. To get past this at the moment the fields containing the lng and lat values are named 'x' and  'y'
	- This was before switching from wkt to geoJson coordiates for feature geometry, so this behaviour may not occur.  Try again at your own risk, if you wish.



	- removeLayer
		- Removes a layer from the map
		- **Warning**: Also removes  all filters associated with the layer (featureType) from the map
	- LayerConfigurationActions
		- This isn't necessarily a Kepler action but it is my terminology for all Kepler actions that modify a layer in some way. Examples are layerConfigChange, layerVisConfigChange, layerVisualChannelConfigChange
		- Your best bet to know which to use is to manually use Kepler's side panel to do what you wish to do and see what actions are dispatched
		- These are often use multiple times for different purposes, depending on their parameters.

- Debugging tips
	-  Consider setting readonly in mapOptions to ```false```. Kepler's side-panel will now show up on the app. You can now go into the layers-tab. 
		- Can make changes manually see what actions are dispatched
			- ***Warning:*** When debugging this way, I noticed that the actions dispatched by my interaction with the side-panel contained a 'payload' field. While when I dispatched using the kepler's action creators in my code, objects had no 'payload' field.
				- This can lead to some errors. If you manually use the side-panel and the action doesn't seem to work, it is likely that a reducer case is intercepting it and throwing an error because the action was not in a format that it exepcted.
	- Consider navigating to ```keplerState.map.visState.layers``` and looking through the filter objects yourself.


## Geo-app Specifics and Overview

### Some Types Of Interest (Terminology and Explanation)

MapFeature
- The basic unit/object that is placed on the map as a FeatureCollection geojson

 - FeatureAttribute:
	 - These are the fields of the MapFeature that use for purposes such as filtering, displaying on map pop-up etc.

- MapFeatureAttributeState
	- Every attribute that is to be filtered has an attributeState
	- This state holds a filterIndex, the value of the filterIndex is the index of the filter on Kepler's filter list that the attribute is to be attached to.
	- The state also holds a range/value for filtering purposes.
	- This state is usually stored in a 'featuresByType' map to solve the problem of having features of different FeatureTypes having the same attributes.
		- E.g. Transmissions and Transmitters both have a 'frequency' attribute, but their ranges and filterIndexes must be kept seperate
### State Machine Pattern 
 - MapFeatureState 
	- Holds the states available for MapFeatures (regardless of their FeatureType)
	- States
		- LOADED
		- RENDERED
		- CLICKED
		- CLICKED_AND_LOADING
	- State-flow
		- Features generally follow the flow of LOADED -> RENDERED -> (CLICKED -> CLICKED_AND_LOADING -> RENDERED)
					![MapFeature state-florw](https://i.ibb.co/92P5nYn/Map-Feature-State-1.png)
	
- FeatureTypeState
	- Holds the states available for FeatureTypes
	- Actions taken as a result of these states affect all features of the relevant type
	- States 
		- ABSENT_ON_MAP
		- WAITING_FOR_LOAD 
		- NEEDS_FILTERS 
		- NEEDS_INITIAL_FILTER_SETTING
		- NEEDS_POPUP_CHANGE
		- NEEDS_LAYER_TYPE_CHANGE 
		- NEEDS_COLUMNS
		- NEEDS_3D_ENABLED
		- NEEDS_HEIGHT_ATTRIBUTE
			- ***Warning:*** At the moment of writing this, NEEDS_HEIGHT_ATTRIBUTE has been cut of the state-flow. If it were put back in, it would be between NEEDS_3D_ENABLED and NEEDS_LAYER_COLOR
		- NEEDS_LAYER_COLOR_CHANGE
		- FINISHED_SETUP

- State-flow
		- Much more complex but hopefully this diagram helps
		- ![enter image description here](https://i.ibb.co/QF4PtJk/Feature-Type-State.png)

### Strategy Pattern
- Geo-app makes use of the strategy pattern for two things: FeatureTypes and FeatureAttributes
	
- FeatureTypeStrategy pattern is used because some things are heavily dependent on the FeatureType involved. Examples:
	- When New York State (which has a FeatureType of 'State') is clicked, the query ran should only query for features of FeatureType County, MilitaryInstallation, and MetropolitanDivisions.
	- When a FeatureType is not expandable, no query should be ran when clicked	

- FeatureAttributeStrategy pattern is used to handle cases dependent on the FeatureAttribute used. Example:
		- Some FeatureAttributes can be considered 'strings' while others can be considered 'numeric'. Numeric attributes will want to have a range to filter by, while string attributes will want to have a list of values to filter by.




