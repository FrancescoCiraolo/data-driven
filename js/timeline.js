$(document).ready(() => {
    $.ajax("data/timeline.json").done((json) => {
        let timeline_ul = $("#italy-history ul");
        for (let i = 0; i < json.length; i++) {
            let content = $("<div class='content'></div>")
                .append($("<h3></h3>").text(json[i].title))
                .append($("<p></p>").text(json[i].description));
            let date = $("<div class='date'></div>")
                .append($("<h4></h4>").text(json[i].date));

            let event = $("<li><div class=\"point\"></div></li>")
                .prepend(content)
                .append(date);

            timeline_ul.append(event);
        }
    });
});