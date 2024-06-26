document.addEventListener('DOMContentLoaded', function () {
    maptilersdk.config.apiKey = maptilerApiKey;

    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.Streets,
        center: spot.geometry.coordinates,
        zoom: 7
    });

    new maptilersdk.Marker()
        .setLngLat(spot.geometry.coordinates)
        .setPopup(
            new maptilersdk.Popup({ offset: 25 })
                .setHTML(
                    `<h3>${spot.title}</h3><p>${spot.location}</p>`
                )
        )
        .addTo(map);
});