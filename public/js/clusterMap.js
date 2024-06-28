maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.Streets,
    center: [90.4152,23.8041 ],
    zoom: 5
});

map.on('load', function () {
    map.addSource('spot', {
        type: 'geojson',
        data: spot,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'spot',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
            // with three steps to implement three types of circles:
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#26a1ed',
                5,  // 5/>5 then circle color will change
                '#33FF7D',
                10,
                '#01D05F'
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#0a0a0a',
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10, //circle px
                5,
                15, //circle px
                10, //spot limit
                20 // ,, ,,
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'spot',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'spot',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#f23f27',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#0a0a0a'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('spot').getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});