$(document).ready(() => {
    let chernobyl = $("#chernobyl-slope");
    let fukushima = $("#fukushima-slope");

    let chernobylB = $('#a-chernobyl');
    let fukushimaB = $('#a-fukushima');

    chernobylB.on("click", () => {
        console.log("A£")
        chernobylB.addClass("active");
        fukushimaB.removeClass("active");
        chernobyl.removeClass("hidden");
        fukushima.addClass("hidden");
    });
    fukushimaB.on("click", () => {
        console.log("B¢")
        fukushimaB.addClass("active");
        chernobylB.removeClass("active");
        fukushima.removeClass("hidden");
        chernobyl.addClass("hidden");
    });

    window.setTimeout(() => {
        chernobylB.click()
        fukushima.removeClass("loading");
    }, 1500)
});