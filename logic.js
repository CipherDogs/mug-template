
var height = 768;
var width = 2126;
var cloudWidth = width - height + 30;
var logo = new Image();
logo.src = "clojure-logo.png";

var randColor = function() {
    return Math.random() > 0.5 ? "#63b132" : "#5881d8";
};

if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
} else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

function onLoad() {
    var words = document.getElementById('words');
    function resize () {
        words.style.height = 'auto';
        words.style.height = words.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(words, 'change',  resize);
    observe(words, 'cut',     delayedResize);
    observe(words, 'paste',   delayedResize);
    observe(words, 'drop',    delayedResize);
    observe(words, 'keydown', delayedResize);

    words.value = allWordsToString();
    resize();
}

function generate() {
    d3.layout.cloud().size([cloudWidth, height])
        .words(getWords().map(function(d) {
            return {text: d, size: 40 + Math.random() * 40};
        }))
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
}

function getWords() {
    var lines = document.getElementById("words")
        .value
        .split("\n")
        .map(function(line) { return line.trim(); });
    var words = [];
    lines.forEach(function(line) {
        if (line[0] === ";" || line.length === 0) {
            return;
        }
        var parts = line.split(" ");
        var filtered = parts.filter(function (word) { return word.length > 0; });
        words = words.concat(filtered);
    })
    return words;
}

function drawWordCloud(words, context) {
    context.save();
    context.translate(cloudWidth >> 1, height >> 1);
    words.forEach(function(word, i) {
        context.save();
        context.translate(word.x, word.y);
        context.rotate(word.rotate * Math.PI / 180);
        context.textAlign = "center";
        context.fillStyle = randColor();
        context.font = word.size + "px " + word.font;
        context.fillText(word.text, 0, 0);
        context.restore();
    });
    context.restore();
}

function allWordsToString() {
    return "; Misc\n"
        + wordsMisc.join(" ")
        + "\n\n"
        + "; Libraries\n"
        + wordsLibs.join(" ")
        + "\n\n"
        + "; Functions\n"
        + wordsFns.join(" ");
}

function drawLogo(context) {
    var padding = (height - logo.width) / 2;
    var x = width - height + padding;
    var y = padding;
    context.drawImage(logo, x, y);
}

function downloadPNG() {
    var canvas = document.getElementById("template");
    var dataUrl = canvas.toDataURL("image/png");
    d3.select("a").attr("href", dataUrl);
}


function draw(words) {
    var canvas = document.getElementById("template");
    var context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    drawWordCloud(words, context);
    drawLogo(context);
    d3.select("a").classed("hidden", false);
    d3.select("#template").classed("hidden", false);
}


