
var height = 768;
var width = 2126;
var cloudWidth = width - height + 30;
var logoSize = 500;

var randColor = function() {
    return Math.random() > 0.5 ? "#63b132" : "#5881d8";
};

function generate() {
    d3.layout.cloud().size([cloudWidth, height])
        .words(words.map(function(d) {
            return {text: d, size: 40 + Math.random() * 40};
        }))
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
}

function drawWordCloud(words, c) {
    c.save();
    var minX = 0;
    words.forEach(function(word) { minX = Math.min(minX, word.x); })
    c.translate(-minX, height >> 1);
    words.forEach(function(word, i) {
        c.save();
        c.translate(word.x, word.y);
        c.rotate(word.rotate * Math.PI / 180);
        c.textAlign = "center";
        c.fillStyle = randColor();
        c.font = word.size + "px " + word.font;
        c.fillText(word.text, 0, 0);
        c.restore();
    });
    c.restore();
}

function drawLogo(c) {
    var img = new Image();
    img.src = "clojure-logo.png";
    var padding = (height - logoSize) / 2;
    var x = width - height + padding;
    var y = padding;
    c.drawImage(img, x, y);
}


function draw(words) {
    var canvas = document.getElementById("template");
    var c = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    drawWordCloud(words, c);
    drawLogo(c);
    var dataUrl = canvas.toDataURL("image/png");
    d3.select("a")
        .attr("href", dataUrl)
        .classed("hidden", false);
    d3.select("#template").classed("hidden", false);
}

