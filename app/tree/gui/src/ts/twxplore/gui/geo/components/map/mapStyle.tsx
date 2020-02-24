export const mapStyles = [
  {
    id: 'my_dark_map',
    label: 'Dark Streets 9',
    url: 'mapbox://styles/mapbox/dark-v9',

    layerGroups: [
      {
        // adding this will keep the 3d building option
        slug: '3d building',
        filter: () => false,
        defaultVisibility: false
      }
    ]
  }
];

