var gradientSwitch = 0, //so we only draw a gradient once per shape rollover
	pointerSwitch = 0,
    outerPoints = [], // outer points of each hexagon
    centerPoints = [], // center points of each hexagon
    center; // center of the whole figure

window.onload = function () {
    WebFont.load({
        google: {
            families: ['Vesper+Libre']
        },
        active: function () {
            $(document).ready(function () {

                initial();

            });
        }
    });
	
	var initial = function () {
		var canvas = document.getElementById("canvas");
		center = calcCenter();

		//set the shapes up and store their outer points and centers
		var allCoordinates = drawAll(canvas, center);
		outerPoints = allCoordinates.coordinates;
		centerPoints = allCoordinates.centers;
		
		var currentShape = {
			currentShapeInternal: 7, //assume we're not on a shape when the page loads
			currentShapeListener: function(val) {},
			set current(val) {
				if (this.currentShapeInternal != val) {
					this.currentShapeInternal = val;
					this.currentShapeListener(val);
					
				}
			}, 
			get current() {
				return this.currentShapeInternal;
			},
			registerListener: function(listener) {
				this.currentShapeListener = listener; 
			}			
		}
		
		currentShape.registerListener(function(val) {
			drawAll(canvas, center);			
			if (val < 7) {
				var centerX = centerPoints[val][0];
				var centerY = centerPoints[val][1];
				document.getElementById("canvas").style.cursor = "pointer";	
				drawGradient(canvas, centerX, centerY, center * 0.27631578947368421052631578947368);
				writeAllText(canvas, center, centerPoints);
				writeDescription(val);
			} else {
				drawAll(canvas, center);
				document.getElementById("canvas").style.cursor = "default";	
				writeDescription(val);
			}
		});

		// SET MOUSE EVENTS
		canvas.addEventListener('mousemove', mouseRollOver, false);
		canvas.addEventListener('click', mouseClick, false);

		// MOUSE EVENT FUNCTIONS

		function mouseRollOver (event) {
			var pos = getMousePos(canvas, event);
			var x = pos.x,
				y = pos.y;
			currentShape.current = closest([x, y], outerPoints);
			
		}

		function mouseClick(event) {
			 var pos = getMousePos(canvas, event);

			 var x = pos.x,
			 y = pos.y;

			 switch (closest([x, y], outerPoints)) {
				 case 0: // orange
				 break;
				 case 1:	// green
				 window.open("http://lapis-mercurii.org/resume/Luceno-resume.pdf","_self")
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
				 break;
				 case 6:	// blue
			 }
		 }
	}

}//end of onload

// RESIZING FUNCTIONS
window.onresize = function() {
    center = calcCenter();
    var canvas = document.getElementById("canvas");
    var allCoordinates = drawAll(canvas, center);
    outerPoints = allCoordinates.coordinates,
    centerPoints = allCoordinates.centers;
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//DRAWING FUNCTIONS

function clearAll(canvas){
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,960, 700);
}

function drawAll(canvas, center) {
    //draw 7 hexes in a hex configuration and get their coordinates and center points
    var coords = drawAllHexes(canvas, center);
    var coordinates = coords.coordinates,
        centerPoints = coords.centers;

    //draw gradients over them
    //drawAllGradients(canvas, center);

    //write labels over them
    writeAllText(canvas, center, centerPoints);

    //return the coordinates and center points
    return {
        coordinates: coordinates,
        centers: centerPoints
    };
}

function drawAllHexes(canvas, center) {
    clearAll(canvas);
    var outerSize = center * 0.52631578947368421052631578947368,
        xOuterCenter = center,
        yOuterCenter = center,
        innerSize = center * 0.27631578947368421052631578947368,
        innerXCenter = 0,
        innerYCenter = 0,
        allCoordinates = [], // holds outer points for this round of hexes
        centers = []; //holds centerpoints for all the hexes

    //draw the first hex and push its coordinates into the allCoordinate array and the centers array
    allCoordinates.push(drawHex(canvas, xOuterCenter, yOuterCenter, innerSize, getColor(0)));
    centers.push([xOuterCenter, yOuterCenter]);

    //now draw individual hexes around it in a hex configuration, saving the coordinates and centerpoints each time
    for (var i = 1; i <= 6; i += 1) {
        innerXCenter = xOuterCenter +  outerSize * Math.sin(i * 2 * Math.PI / 6);
        innerYCenter = yOuterCenter +  outerSize *  Math.cos(i * 2 * Math.PI / 6);
        centers.push([innerXCenter, innerYCenter]);
        allCoordinates.push(drawHex(canvas, innerXCenter, innerYCenter, innerSize, getColor(i)));
    }
    return {
        coordinates: allCoordinates,
        centers: centers
    };
}

function drawAllGradients(canvas, center) {
    var outerSize = center * 0.52631578947368421052631578947368, //it just looks right
        xOuterCenter = center,
        yOuterCenter = center,
        innerSize = center * 0.27631578947368421052631578947368, //it just looks right
        innerXCenter = 0,
        innerYCenter = 0;

    drawGradient(canvas, xOuterCenter, yOuterCenter, innerSize);

    for (var i = 1; i <= 6; i += 1) {
        innerXCenter = xOuterCenter +  outerSize * Math.sin(i * 2 * Math.PI / 6);
        innerYCenter = yOuterCenter +  outerSize *  Math.cos(i * 2 * Math.PI / 6);
        drawGradient(canvas, innerXCenter, innerYCenter, innerSize);
    }
}

function drawHex (canvas, X, Y, s, c) {
    var Xcenter = X,
        Ycenter = Y,
        size = s,
        numberOfSides = 6,
        xCoord,
        yCoord,
        temp = [], //stores point pair
        shapeCoordinates = [], //stores all coordinates for this particular shape
        ctx = canvas.getContext('2d');

    ctx.beginPath();
    xCoord = Xcenter +  size * Math.cos(0);
    yCoord = Ycenter +  size *  Math.sin(0);
    ctx.moveTo (xCoord, yCoord);
    temp = [xCoord, yCoord];
    shapeCoordinates.push(temp);

    for (var i = 1; i <= numberOfSides - 1;i += 1) {
        xCoord = Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
        yCoord = Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
        ctx.lineTo (xCoord, yCoord);
        temp = [xCoord, yCoord];
        shapeCoordinates.push(temp);
    }
    ctx.closePath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.fill();

    return shapeCoordinates;
}

function drawGradient (canvas, x, y, radius) {
    var Xcenter = x,
        Ycenter = y,
        size = radius,
        xCoord,
        yCoord,
        numberOfSides = 6,
        ctx = canvas.getContext('2d');
    // set transparency value
    ctx.globalAlpha = 0.4;
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
    gradientSwitch = 1;
}

function getColor(i) {
    var colors = ["orange", "green", "violet", "indigo", "red", "yellow", "blue"];
    return colors[i];
}

// WRITING FUNCTIONS
function writeAllText(canvas, center, centerPoints){
    for (var i = 0; i < 7; i++) {
        var centerX = centerPoints[i][0];
        var centerY = centerPoints[i][1];
        if (i == 3 || i == 6) {
            writeText(i, canvas, center, centerX, centerY, 1); // write in white for contrast
        } else {
            writeText(i, canvas, center, centerX, centerY, 0); // write in black
        }
    }
}

function writeText(closestHexIndex, canvas, center, centerX, centerY, white) {
    var ctx = canvas.getContext('2d');
    ctx.font = center / 12 + "px 'Vesper Libre'";
    ctx.fillStyle = "black";
    if (white) { ctx.fillStyle = "white"; }
    ctx.textAlign = "center";

    if (closestHexIndex == 4 || closestHexIndex == 5) { //since vertical alignment is a function of centerX
        var verticalAlignment = 15
    } else if (closestHexIndex == 0 || closestHexIndex == 3 || closestHexIndex == 6) {
        var verticalAlignment = 30
    } else if (closestHexIndex == 1 || closestHexIndex == 2) {
        var verticalAlignment = 50
    }

    if (white) {
        ctx.fillText(innerHexText(closestHexIndex), centerX, centerY + (centerX / verticalAlignment));
    } else {
        for (var i = 0; i < 6; i++) { //make the text dark enough to read
            ctx.fillText(innerHexText(closestHexIndex), centerX, centerY + (centerX / verticalAlignment));
        }
    }

    
}


function innerHexText(index) {
    switch (index) {
        case 0:
            return "About";
            break;
        case 1:
            return "Aspiration";
            break;
        case 2:
            return "Q B L";
            break;
        case 3:
            return "Memory";
            break;
        case 4:
            return "Action";
            break;
        case 5:
            return "Words";
            break;
        case 6:
            return "Reflection";
    }
}

function writeDescription(hex) {
	switch (hex) {
		case 0:
			document.getElementById("output").innerHTML = "The Lapis Mercurii hexagon menu combines my interest in the Hermetic tradition and JavaScript. Each hexagon represents one of the planetary sephira on the Tree of Life. Each brings you to a different project when you click on it.";
			break;
		case 1:
			document.getElementById("output").innerHTML = "My résumé.";
			break;
		case 2:
			document.getElementById("output").innerHTML = "QBL is an interactive Tree of Life website created with jQuery.";
			break;
		case 3:
			document.getElementById("output").innerHTML = "The Luceno Origins Project is my genealogy website on a custom WordPress template.";
			break;
		case 4:
			document.getElementById("output").innerHTML = "Elements is an interactive page utilizing jQuery and HTML canvas.";
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

// RAY CASTING/WHERE AM I? FUNCTIONS

function closest (point, shapes) {
    for (var i = 0; i < 7; i += 1) {
        if (inside(point, shapes[i])) {
            return i; //returns the index of the shape it's inside of
        }
    }
	return 7;
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
