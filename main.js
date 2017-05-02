var coordinates = []; //3-dimensional array holding pairs of coordinates defining each hex
var centers = [];   // array to track the center points of the hexes
var stopGradient=0; // switch for the gradient
var stopText = 0; //switch for the text

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var center = calcCenter();

    var innerSize = drawAllHexes(center);

    canvas.addEventListener('mousemove', function(event) {
        var pos = getMousePos(canvas, event);

        var x = pos.x,
            y = pos.y;
        var centerX, centerY;
        var closestHexIndex = closest([x, y], coordinates);
        if (closestHexIndex < 7) {
            centerX = centers[closestHexIndex][0];
            centerY = centers[closestHexIndex][1];
            drawGradient(centerX, centerY, center * 0.27631578947368421052631578947368);
            writeText(closestHexIndex, canvas, center, centerX, centerY);

        } else {
            center = calcCenter();
            drawAllHexes(center);
            stopGradient = 0;
            stopText = 0;
            document.getElementById("canvas").style.cursor = "default";
            writeQuote(7);
        }




    }, false);

    canvas.addEventListener('click', function(event) {
        //var center = calcCenter();
        //drawAllHexes(center);

        var pos = getMousePos(canvas, event);

        var x = pos.x,
            y = pos.y;

        switch (closest([x, y], coordinates)) {
            case 0: // orange
                writeQuote(0);
                break;
            case 1:	// green
                writeQuote(1);
                break;
            case 2:	// violet
                window.open("http://lapis-mercurii.org/qbl","_self")
                break;
            case 3:	// indigo
                window.open("http://luceno.org","_self")
                break;
            case 4:	// red
                window.open("http://lapis-mercurii.org/elements","_self")
                break;
            case 5: // yellow
                writeQuote(5);
                break;
            case 6:	// blue
                writeQuote(6);
        }


    }, false);


} //end of onload

window.onresize = function() {
    var center = calcCenter();
    drawAllHexes(center);
};


function calcCenter() {
    var canvas = document.getElementById("canvas");
    var container = $(canvas).parent();

    // Get the width of parent
    var maxWidth = container.width();
    // find max height
    var maxHeight = $(window).innerHeight();


    // try to maximize width first
    var canvasWidth = maxWidth;
    var canvasHeight = canvasWidth;

    // Determine if valid...
    if (canvasHeight > maxHeight) { // don't want it going off the screen
        // reverse it
        canvasHeight = maxHeight;

        // make it square
        canvasWidth = canvasHeight;
    }

    // Set width and height
    if ($(canvas).attr('width') != canvasWidth) { $(canvas).attr('width', canvasWidth); }
    if ($(canvas).attr('height') != canvasHeight) { $(canvas).attr('height', canvasHeight); }

    return (canvasHeight / 2);
}

function drawAllHexes(center) {
    clearAll();
    var outerSize = center * 0.52631578947368421052631578947368,
        xOuterCenter = center,
        yOuterCenter = center,
        innerSize = center * 0.27631578947368421052631578947368,
        colors = ["orange", "green", "violet", "indigo", "red", "yellow", "blue"],
        innerXCenter = 0,
        innerYCenter = 0;

    centers = []; //clear out the old coordinates
    coordinates = [];

    drawHex(xOuterCenter, yOuterCenter, innerSize, colors[0]);
    centers.push([xOuterCenter, yOuterCenter]);
    for (var i = 1; i <= 6; i += 1) {
        innerXCenter = xOuterCenter +  outerSize * Math.sin(i * 2 * Math.PI / 6);
        innerYCenter = yOuterCenter +  outerSize *  Math.cos(i * 2 * Math.PI / 6);
        centers.push([innerXCenter, innerYCenter]);
        drawHex(innerXCenter, innerYCenter, innerSize, colors[i]);
    }
    return innerSize;
}

function clearAll(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,960, 700);
}

function closest (point, shapes) {
    for (var i = 0; i < 7; i += 1) {
        if (inside(point, shapes[i])) {
            return i;
        }/* else {
            return 7;
        }*/
    }
}


function inside (point, shape) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = shape.length - 1; i < shape.length; j = i++) {
        var xi = shape[i][0], yi = shape[i][1];
        var xj = shape[j][0], yj = shape[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function drawHex (X, Y, s, c) {
    var Xcenter = X,
        Ycenter = Y,
        size = s,
        numberOfSides = 6,
        color = c,
        xCoord,
        yCoord,
        temp = [], //stores point pair
        temp2 = [], //stores all coordinates for this particular shape
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext('2d');

    ctx.beginPath();
    xCoord = Xcenter +  size * Math.cos(0);
    yCoord = Ycenter +  size *  Math.sin(0);
    ctx.moveTo (xCoord, yCoord);
    temp = [xCoord, yCoord];
    temp2.push(temp);

    for (var i = 1; i <= numberOfSides - 1;i += 1) {
        xCoord = Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
        yCoord = Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
        ctx.lineTo (xCoord, yCoord);
        temp = [xCoord, yCoord];
        temp2.push(temp);
    }
    ctx.closePath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();

    coordinates.push(temp2); //push coordinates for this shape into master coordinate array

}

function drawGradient (x, y, radius) {
    var Xcenter = x,
        Ycenter = y,
        size = radius,
        xCoord,
        yCoord,
        numberOfSides = 6,
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext('2d');
    if (stopGradient == 0) {
        // set transparency value
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#FFF';

        ctx.beginPath();
        xCoord = Xcenter + size * Math.cos(0);
        yCoord = Ycenter + size * Math.sin(0);
        ctx.moveTo(xCoord, yCoord);

        for (var i = 1; i <= numberOfSides - 1; i += 1) {
            var xCoord = Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
            var yCoord = Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
            ctx.lineTo(xCoord, yCoord);
        }
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        /*ctx.stroke();*/
        ctx.fill();
    }
    stopGradient = 1;
}

function writeText(closestHexIndex, canvas, center, centerX, centerY) {
    if (stopText == 0) {
        var ctx = canvas.getContext('2d');
        ctx.font = center / 12 + "px 'Vesper Libre'";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        if (closestHexIndex == 4 || closestHexIndex == 5) { //since vertical alignment is a function of centerX
            var verticalAlignment = 15
        } else if (closestHexIndex == 0 || closestHexIndex == 3 || closestHexIndex == 6) {
            var verticalAlignment = 30
        } else if (closestHexIndex == 1 || closestHexIndex == 2) {
            var verticalAlignment = 50
        }

        for (var i = 0; i < 6; i++) { //make the text dark enough to read
            ctx.fillText(innerHexText(closestHexIndex), centerX, centerY + (centerX / verticalAlignment));
        }

        document.getElementById("canvas").style.cursor = "pointer";
        writeQuote(closestHexIndex);
    }
    stopText = 1;
}

function writeQuote (shape) {
    switch (shape) {
        case 0:
            document.getElementById("output").innerHTML = "Coming soon...";
            break;
        case 1:
            document.getElementById("output").innerHTML = "Coming soon...";
            break;
        case 2:
            document.getElementById("output").innerHTML = "Interactive Tree of Life application.";
            break;
        case 3:
            document.getElementById("output").innerHTML = "My genealogy page.";
            break;
        case 4:
            document.getElementById("output").innerHTML = "An interactive representation of magical rituals.";
            break;
        case 5:
            document.getElementById("output").innerHTML = "Coming soon...";
            break;
        case 6:
            document.getElementById("output").innerHTML = "Coming soon...";
            break;
        case 7:
            document.getElementById("output").innerHTML = "";
    }
}

function innerHexText(index) {
    switch (index) {
        case 0:
            return "About";
            break;
        case 1:
            return "Aspirations";
            break;
        case 2:
            return "Q B L";
            break;
        case 3:
            return "Memory";
            break;
        case 4:
            return "Ritual";
            break;
        case 5:
            return "Words";
            break;
        case 6:
            return "Reflection";
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
