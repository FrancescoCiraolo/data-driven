$(document).ready(() => {
    let map = L.map('cover-map').setView([43.5, 13.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let data = {
        "italy": 293081.067,
        "sicily": 25711,
        "photovoltaic": 89.5,
        "wind": 18,
        "nuclear": 35000,
    }
    let cells = [];
    let last = 0;

    function init(data) {
        for (let i = 0; i < data.features.length; i++)
            cells.push(L.geoJSON(data.features[i], {
                style: {
                    fillColor: 'black',
                    weight: 2,
                    opacity: 1,
                    color: 'black',
                    // dashArray: '3',
                    fillOpacity: 0.5
                }
            }));

        $("#c-wind").on("click", function (e) {
            e.preventDefault();

            update('wind', e.target);
        }).click();
        $("#c-solar").on("click", function (e) {
            e.preventDefault();

            update('photovoltaic', e.target);
        });
        $("#c-nuclear").on("click", function (e) {
            e.preventDefault();

            update('nuclear', e.target);
        });
    }

    function update(source, target) {
        let x = data.italy / data[source];
        x =  x / data.sicily * 50;
        x = Math.ceil(x);

        let i = last;
        for (; i < x; i++) cells[i].addTo(map);
        for (i = x; i < last; i++) map.removeLayer(cells[i]);
        last = x;

        target = $(target)
        target.parent().find(".button").removeClass("active").removeClass("alt_color").addClass("main_color");
        target.addClass("active").addClass("alt_color").removeClass("main_color");
    }

    $.ajax({
        url: "data/sicily.geojson",
        dataType: "json",
        success: init,
    });

});