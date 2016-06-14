var d3Obj = d3.select('#d3Container')

var options = {}

options.filename = 'uploaded3.svg',
options.gs       = [],
options.width    = 730;
options.height   = 730;
options.reps     = 8;
options.scale    = 0.5;
options.rotation = 0;
options.offsetX  = 0;
options.offsetY  = 0;


init();



function init() {

	initD3();
	initControls();

}


function initD3 () {

	options.svg = d3Obj.append('svg')
		.attr('width', options.width)
		.attr('height', options.height);

		d3.xml(options.filename, function(error, documentFragment) {
		        if (error) { console.log(error); return; }
		        options.svgNode = documentFragment.getElementsByTagName("svg")[0];
		        applySVG(options.svgNode);
		});
}


function initControls () {

	var contronsContainer = document.getElementById('controlsContainer');
	
	var inputReps = document.createElement('input');
	inputReps.value = options.reps;
	inputReps.setAttribute('type', 'reps');
	inputReps.addEventListener('blur', blur);
	inputReps.onkeypress = keypress;
	inputReps.addEventListener('keydown', keydown);
	controlsContainer.appendChild(inputReps);	
	
	var inputScale = document.createElement('input');
	inputScale.value = options.scale;
	inputScale.setAttribute('type', 'scale');
	inputScale.addEventListener('blur', blur);
	inputScale.onkeypress = keypress;
	inputScale.addEventListener('keydown', keydown);
	controlsContainer.appendChild(inputScale);

	var inputOffsetX = document.createElement('input');
	inputOffsetX.value = options.offsetX;
	inputOffsetX.setAttribute('type', 'offsetX');
	inputOffsetX.addEventListener('blur', blur);
	inputOffsetX.onkeypress = keypress;
	inputOffsetX.addEventListener('keydown', keydown);
	controlsContainer.appendChild(inputOffsetX);

	var inputOffsetY = document.createElement('input');
	inputOffsetY.value = options.offsetY;
	inputOffsetY.setAttribute('type', 'offsetY');
	inputOffsetY.addEventListener('blur', blur);
	inputOffsetY.onkeypress = keypress;
	inputOffsetY.addEventListener('keydown', keydown);
	controlsContainer.appendChild(inputOffsetY);

}


function blur (e) {

	return;

	var type = e.target.getAttribute('type');
	var val = e.target.value;

	if ( !val ) return;

	if ( type == 'reps')	 options.reps = val;
	if ( type == 'scale' )	 options.scale = val;
	if ( type == 'offsetX' ) options.offsetX = val;
	if ( type == 'offsetY' ) options.offsetY = val;

	update();
	
}

function keypress (e) {

	var key = e.keyCode;
	return key >= 45 && key <= 57 && key != 47 && key != 38 && key != 40;

}


function keydown (e) {

	var type = e.target.getAttribute('type');
	var key = e.keyCode;
	var val = parseFloat(e.target.value);


	var dir = 0;
	if ( key == 38 ) dir=1;
	if ( key == 40 ) dir=-1;

	if ( type == 'reps') {
		var v = val+dir;
		if ( v <= 0 || !v ) return;
		e.target.value = v;
		options.reps = v;
		applySVG();
	}

	if ( type == 'scale') {
		var v = val+(dir/100);
		if ( v <= 0 || !v ) return;

		var _v = Math.round(v * 100) / 100;

		e.target.value = _v;
		options.scale = _v;
		update();
	}

	if ( type == 'offsetX') {
		var v = val+dir;
		e.target.value = v;
		options.offsetX = v;
		update();
	}

	if ( type == 'offsetY') {
		var v = val+dir;
		e.target.value = v;
		options.offsetY = v;
		update();
	}	

	

}


function applySVG() {

	options.gs.forEach(function(g) {
		g.remove();
	})


	// Calculate x and y position
	var xPos = options.width/2  - (410*options.scale) + options.offsetX;
 	var yPos = options.height/2 - (800*options.scale) + options.offsetY;

 	// Create group for drawings
	for ( var i = 0; i<options.reps; i++ ) {

		var g = options.svg.append('g')
		        .attr('transform', function (d) {	    
		        	var deg = (360/options.reps)*i;
		        	var trans = 'rotate(' + deg + ',' + options.width/2 + ',' + options.height/2 + ') ';
		        	    trans += 'translate(' + xPos + ',' + yPos + ') ';
		        	    trans += 'scale(' + options.scale + ')';
		        	return trans;
		        });

		// Clone
		var clone = options.svgNode.cloneNode(true);

		// Append
		g.node().appendChild(clone);
		
		// Store the SVG's
		options.gs.push(g);
	}
}


function update() {


	var xPos = options.width/2 - (410*options.scale) + options.offsetX;
 	var yPos = options.height/2 - (800*options.scale) + options.offsetY;


	options.gs.forEach(function (g, i) {

	        g.attr('transform', function (d) {	    
	        	var deg = (360/options.reps)*i;
	        	var trans = 'rotate(' + deg + ',' + (options.width/2) + ',' + (options.height/2) + ') ';
	        	    trans += 'translate(' + xPos + ',' + yPos + ') ';
	        	    trans += 'scale(' + options.scale + ')';

	        	return trans;
	        });

	})
}


