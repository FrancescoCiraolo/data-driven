$(document).ready(function () {
    let map = L.map('fallout-map').setView([45.5, 12.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let falloutData = [
        [1000000, '#FFEE00', 'µSv/h >= 43'],
        [500000, '#FBB806', 'µSv/h >= 1030'],
        [100000, '#F6830C', 'µSv/h >= 13400'],
        [50000, '#F24D11', 'µSv/h >= 69000'],
        [20000, '#ED1717', 'µSv/h >= 145000'],
    ];

    let circles = L.featureGroup();
    for (let i = 0; i < falloutData.length; i++) {
        L.circle([0, 0], {
            color: falloutData[i][1],
            fillColor: falloutData[i][1],
            fillOpacity: 0.5,
            radius: falloutData[i][0]
        }).addTo(circles).bindPopup(falloutData[i][2]);
    }

    let coordinates = [
        [47.510534, 2.8761864],
        [45.255833, -0.693056],
        [45.798333, 5.270833],
        [49.4158, 6.2181],
        [47.230556, 0.170556],
        [50.09, 4.789444],
        [46.456667, 0.652778],
        [44.633056, 4.756667],
        [47.7336808, 2.5172853],
        [47.9032247, 7.5623059],
        [49.536389, -1.881667],
        [44.1067, 0.8453],
        [51.015278, 2.136111],
        [48.515278, 3.517778],
        [49.858056, 0.635556],
        [49.858056, 0.635556],
        [49.858056, 0.635556],
        [47.72, 1.5775],
        [44.329722, 4.732222]
    ]
    for (let i = 0; i < coordinates.length; i++) {
        L.marker(coordinates[i]).addTo(map).on("click", () => {
            map.removeLayer(circles);
            circles.eachLayer((c) => {
                c.setLatLng(coordinates[i]);
            })
            circles.addTo(map);
        });
    }

    map.on("click", () => {map.removeLayer(circles)});
})