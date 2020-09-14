
var height = 768;
var width = 2126;
var cloudWidth = width - height;
var logo = new Image();
logo.src = "img/cipherdogs.png";
var green = "#ffffff";
var blue = "#ffffff";

function cipherdogs() {
    logo.src = "img/cipherdogs.png"
    green = "#ffffff";
    blue = "#ffffff";
}

function monero() {
    logo.src = "img/monero.png";
    green = "#4c4c4c";
    blue = "#d26e2b";
}

function rust() {
    logo.src = "img/rust.png";
    blue = "#ffc832";
    green = "#000000";
}

function emacs() {
    logo.src = "img/emacs.png";
    green = "#7F5AB6";
    blue = "#3F3B3B";
}

function python() {
    logo.src = "img/python.png";
    blue = "#ffd343";
    green = "#2b5b84";
}

var randColor = function() {
    return Math.random() > 0.5 ? green : blue;
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
    var message = document.getElementById('message');
    var textareas = [words, message];
    function resize () {
        textareas.forEach(function(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight + 10) +'px';
        });
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    textareas.forEach(function(textarea) {
        observe(textarea, 'change',  resize);
        observe(textarea, 'cut',     delayedResize);
        observe(textarea, 'paste',   delayedResize);
        observe(textarea, 'drop',    delayedResize);
        observe(textarea, 'keydown', delayedResize); 
    });

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
    });
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

function drawLogoAndMessage(context) {
    var size = height;
    var logoX = (size - logo.width) / 2;
    var message = document.getElementById('message').value;
    var lines = message.length > 0 ? message.split("\n") : [];
    var lineHeight = 80;
    var mesHeight = lines.length * lineHeight;
    var topPadding = (size - logo.height - mesHeight) / (mesHeight > 0 ? 3 : 2);
    var logoY = topPadding;
    context.save();
    context.translate(width - height, 0);
    context.drawImage(logo, logoX, logoY);
    context.textAlign = "center";
    context.fillStyle = green;
    context.font = "80px Impact";
    lines.forEach(function(line, ind) {
        var y = topPadding * 2 + logo.height + (ind + 1) * lineHeight;
        context.fillText(line, size / 2, y);
    });
    context.restore();
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
    drawLogoAndMessage(context);
    d3.select("a").classed("hidden", false);
    d3.select("#template").classed("hidden", false);
}


