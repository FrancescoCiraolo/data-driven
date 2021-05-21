// Key variables:
const strength = -0.10;         // default repulsion
const centeringStrength = 0.01; // power of centering force for two clusters
const velocityDecay = 0.15;     // velocity decay: higher value, less overshooting
const n = 500;		          // number of initial nodes
const cycles = 300;	          // number of ticks before stopping.

let canvas;
let width;
let height;
let context;

let centerMessage;
let outerRadius;
let innerRadius;
let clusterDistance;
let startCenter;

let sources;
let nodes;

let simulation;
let tick = 0;
let init = true;
let direction = false;
let sPoint = tick;

{
    function load() {
        canvas = d3.select("#italy-energy canvas");
        width = +canvas.attr("width");
        height = +canvas.attr("height");
        context = canvas.node().getContext('2d');

        outerRadius = 250;        // new nodes within this radius
        innerRadius = 100;        // new nodes outside this radius, initial nodes within.
        clusterDistance = width / 8 * 3;
        startCenter = [width / 2, width / 2];  // new nodes/initial nodes center point

        $("#s-consumption").on("click", function (e) {
            e.preventDefault();

            update(false, e.target);
        })

        $("#s-sources").on("click", function (e) {
            e.preventDefault();

            update(true, e.target);
        })

        console.log(n);
        $.ajax("data/italy_energy.json").done(parseData);
    }

    function parseData(data) {
        sources = [];
        nodes = [];

        let points = [];
        for (let i = 0; i < data.production.sources.length; i++) {
            let angle = (360 * i / data.production.sources.length) * Math.PI / 180;

            let dx = clusterDistance * Math.sin(angle);
            let dy = -clusterDistance * Math.cos(angle);

            points.push([startCenter[0] + dx, startCenter[1] + dy]);
        }

        for (let i = 0; i < data.production.sources.length; i++) {
            let p = data.production.sources[i].value / data.production.total;
            let quantity = Math.ceil(p * n);

            let source = {
                len: quantity,
                perc: Math.round(p * 10000) / 100,
                slice: Math.ceil(quantity / cycles),
                label: data.production.sources[i].label,
                center: points[i],
                nodes: []
            }

            for (; quantity > 0; quantity--) {
                let angle = Math.random() * Math.PI * 2;
                let distance = Math.random() * (outerRadius - innerRadius) + innerRadius;
                let x = Math.cos(angle) * distance + startCenter[0];
                let y = Math.sin(angle) * distance + startCenter[1];

                let dot = {
                    x: x,
                    x1: startCenter[0],
                    y: y,
                    y1: startCenter[1],
                    strength: strength,
                    color: data.production.sources[i].color
                }
                source.nodes.push(dot);
            }

            sources.push(source);
            nodes = nodes.concat(source.nodes);
        }

        centerMessage = data.consumption + "GWh";

        simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(function (d) {
                return d.strength;
            }))
            .force("x1", d3.forceX().x(function (d) {
                return d.x1
            }).strength(centeringStrength))
            .force("y1", d3.forceY().y(function (d) {
                return d.y1
            }).strength(centeringStrength))
            .alphaDecay(0)
            .velocityDecay(velocityDecay)
            .nodes(nodes);

        simulation.on("tick", step);
    }

    function step() {
        context.clearRect(0, 0, width, height);
        simulation.nodes(nodes);

        // if (!init)
        sources.forEach(function (source) {
            let dst = direction ? source.center : startCenter;
            let lower = Math.abs(tick - sPoint);
            let upper = source.slice * (lower + 1);
            lower = source.slice * lower;
            upper = Math.min(upper, source.len);

            for (let i = lower; i < upper; i++) {
                source.nodes[i].x1 = dst[0];
                source.nodes[i].y1 = dst[1];
            }
        })

        nodes.forEach(function (d) {
            context.beginPath();
            context.fillStyle = d.color;
            context.arc(d.x, d.y, 3, 0, Math.PI * 2);
            context.fill();
        })

        if (tick < 150) {
            showText(centerMessage, startCenter[0], startCenter[1] + 100, 20);
        }

        if (tick > cycles + 50) {
            sources.forEach(function (source) {
                let dy = Math.log(source.len) * 12;
                let correction = (source.center[1] - startCenter[1]) / clusterDistance * 0.3;

                let y = source.center[1] + (dy * (1. + correction));
                y = showText(source.label, source.center[0], y, 15);
                showText(source.perc + "%", source.center[0], y, 15);
            })
        }

        tick += direction || init ? 1 : -1;

        if ((init && tick === 100) || tick === 0 || tick === cycles + 200) simulation.stop();
        init &= tick !== 100;
    }

    function showText(text, x, y, size) {
        context.fillStyle = "black";
        context.font = size + 'px Verdana';
        let rows = text.split("\n");
        for (let i = 0; i < rows.length; i++) {
            let tx = x - (startCenter[0] - x) / 50;
            let tWidth = context.measureText(rows[i]).width;
            tx = tx - tWidth / 2;
            context.fillText(rows[i], tx, y);
            y += size;
        }
        return y;
    }

    function update(dir, target) {
        simulation.stop();

        tick = dir ? Math.max(100, tick) : Math.min(cycles + 100, tick);
        sPoint = tick;
        init = false;
        direction = dir;

        // simulation.on("tick", step);
        simulation.restart();

        target = $(target)
        if (!target.hasClass("button"))
            target = target.parent(".button")
        target.parent(".buttons").find(".button").removeClass("active");
        target.addClass("active");
    }

    $(document).ready(load);
}