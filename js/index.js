/******************************

PRE-LOAD THESE PUPPIES 

*******************************/
_addToManifest(manifest, {
	firefly: "sprites/firefly.json"
});

/******************************

CONSTANTS-ISH
(they're not really constants, w/e)

*******************************/

var NUM_FIREFLIES,
	FLY_LOOP,
	FLY_SWERVE,
	SHOW_CLOCKS,
	FLY_CLOCK_SPEED,
	FLY_RADIUS,
	FLY_PULL,
	FLY_PULL_LEADER,
	FLY_SYNC,
	MOUSE_RADIUS,
	FOLLOW_LEADER,
	FOLLOW_CLOCK,
	LEADER_RADIUS,
	CHAOS_ON;

var boxwidth, boxheight, marginwidth, marginheight, elapsedTime, prevflashingFF, flashingFF;

var _resetConstants = function () {
	NUM_FIREFLIES = 250;
	FLY_LOOP = 50;
	FLY_SWERVE = 0.1;
	SHOW_CLOCKS = false;
	FLY_CLOCK_SPEED = 0.3;
	FLY_RADIUS = 200;
	FLY_PULL = 0.035;
	FLY_PULL_LEADER = 0.035;
	FLY_SYNC = false;
	FOLLOW_LEADER = false;
	FOLLOW_CLOCK = false;
	CHAOS_ON = false;
	LEADER_RADIUS = 200;
	MOUSE_RADIUS = 200;
	flashingFF = 0;
	prevflashingFF = 0;
	
};

let arrayHeader = ["Name","Country","Email"];
let arrayData  = []  
    arrayData[0] = { name : "Sigit", country : "Indonesia", email : "sigit@gmail.com"};
    arrayData[1] = { name : "Joana", country : "Brazil", email : "Joana@gmail.com"};
    arrayData[2] = { name : "Albert", country : "Mexico", email : "albert@gmail.com"};
    arrayData[3] = { name : "Nuuna", country : "South Korea", email : "Nuuna@gmail.com"};
    arrayData[4] = { name : "Aroon", country : "Irlandia", email : "aroon@gmail.com"};


_resetConstants();

/******************************

THE MAIN GAME CODE

*******************************/

var app;
var fireflies = [];
var leaders = [];
var timeContainer;

var listHelpButton = ["helpLeader", "helpClock", "helpDecentralized"];

var flashingFF = 0, 
	prevflashingFF = 0;

window.onload = function () {
	writeFile('','testing.csv',export_csv(arrayHeader,arrayData,',',"testing.csv"));

	elapsedTime = 0;
	flashingFF = 0;
	prevflashingFF = 0;
	// Create app!
	app = new PIXI.Application(document.body.clientWidth, document.body.clientHeight, { autoResize: true, backgroundColor: 0x000000 });

	$("#game").appendChild(app.view);

	// Mouse
	Mouse.init($("#game"));

	// When loaded all assets...
	_loadAssets(manifest, function () {

		// Add fireflies!
		_addFireflies(NUM_FIREFLIES);

		// Add Leaders 
		_addLeaders(1);

		timeContainer = new TimeText();
		app.stage.addChild(timeContainer.graphics);

		_setHelpBoxes()


		// Animation loop 
		app.ticker.add(function (delta) {
			prevflashingFF = flashingFF;
			flashingFF = 0;
			for (var i = 0; i < leaders.length; i++) {
				leaders[i].update(delta);
			}
			for (var i = 0; i < fireflies.length; i++) {
				fireflies[i].update(delta);
				if (fireflies[i].clock == 0) flashingFF += 1;
			}
			flashingFF = Math.max(flashingFF, prevflashingFF);
			timeContainer.update(delta);
			//elapsedTime = app.ticker.lastTime/1000;
		});

		// Synchronize 'em!
		_syncConstants();
		resize();

	});

	// Play bg music whenever
	// var bg_loop = new Howl({
	// 	src: "sounds/forest.mp3",
	// 	volume: 0.8,
	// 	loop: true
	// });
	// bg_loop.play();

	// Set up widgets!
	Widgets.convert($("#words"));
	Widgets.convert($("#strategies"));
};


var _setHelpBoxes = function () {
	for (var i = 0; i < listHelpButton.length; i++) {
		// Initialize the boxes, but they are not displayed
		buttonName = listHelpButton[i]

		const image = document.querySelector("#" + buttonName);
		const pixiHelpContainer = createHelpBox(content = textContent[buttonName]['content'], title = textContent[buttonName]['title'])

		image.addEventListener("click", clickHelpCallback)
		image.helpTextBox = new helpTextBox(pixiTxtBox = pixiHelpContainer)
	}
}

function createHelpBox(content, title) {
	var helpContainer = new PIXI.Container()

	//Create text container
	const txtBox = new PIXI.Text();
	txtBox.setText(content)
	txtBox.style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 24,
		fill: "white",
		align: 'center',
		wordWrap: true,
		wordWrapWidth: 600,
		lineJoin: 'round',
	});

	//Create titile container
	var titleText = new PIXI.Text(title,
		{
			fontFamily: 'Arial bold',
			fontSize: 30,
			fill: "white",
			align: 'center'

		});

	
	// Fill help container's background
	var boxBG = new PIXI.Graphics();
	boxBG.beginFill(0x666666, 0.5);
	boxBG.drawRect(0, 0, txtBox.width, txtBox.height + titleText.height);
	boxBG.endFill();

	// Set title position
	titleText.position.x = boxBG.width / 2 - titleText.width / 2

	// Set text box position
	txtBox.x = 0
	txtBox.y = titleText.height
	
	// Set close button
	let closeButton = PIXI.Sprite.from('help/close.png');
	closeButton.interactive = true;
	closeButton.buttonMode = true;
	closeButton.on('click', onClick);

	function onClick() {
		app.stage.removeChild(helpContainer)
	}

	closeButton.height = 30
	closeButton.width = 30

	closeButton.position.y = 0
	closeButton.position.x = boxBG.width - closeButton.width

	// Add everything
	helpContainer.addChild(boxBG)
	helpContainer.addChild(closeButton);
	helpContainer.addChild(txtBox)
	helpContainer.addChild(titleText)
	return helpContainer;
}

var clickHelpCallback = function (event) {
	if (!event.currentTarget.clicked) {

		//Get position of the help button
		var imageRect = event.currentTarget.getBoundingClientRect();

		//Get position of the strategies div
		strategiesRect = document.querySelector("#strategies").getBoundingClientRect();
		var box = event.currentTarget.helpTextBox.pixiHelpContainer;

		// Set help box position, checking bottom limit
		if (box.height + imageRect.top < app.renderer.height) {
			box.y = imageRect.top;
		} else {
			box.y = app.renderer.height - box.height;
		}
		box.x = strategiesRect.left - box.width;

		//Can be deactivated by clicking again on it
		event.currentTarget.clicked = true;
		app.stage.addChild(box);
	}
	else {
		app.stage.removeChild(event.currentTarget.helpTextBox.pixiHelpContainer);
		event.currentTarget.clicked = false;
	}

}


let helpTextBox = class helpTextBox {
	constructor(pixiHelpContainer) {
		this.clicked = false
		this.pixiHelpContainer = pixiHelpContainer
	}
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number;
}

var _addFireflies = function (num) {
	for (var i = 0; i < num; i++) {
		var ff = new Firefly();
		fireflies.push(ff);
		app.stage.addChild(ff.graphics);
	}
};

var _addLeaders = function (num) {
	for (var i = 0; i < num; i++) {
		var ff = new Leader();
		leaders.push(ff);
		app.stage.addChild(ff.graphics);
	}
}

var _removeFireflies = function (num) {
	for (var i = 0; i < num; i++) {
		var ff = fireflies.pop();
		app.stage.removeChild(ff.graphics);
	}
};

var _resetFireflies = function () {
	for (var i = 0; i < fireflies.length; i++) {
		var ff = fireflies[i];
		ff.clock = Math.random();
	}
};

var _resetTimer = function () {
	elapsedTime = app.ticker.lastTime / 1000;
}

function resize() {
	//Resize the renderer
	const parent = document.body;
	app.renderer.resize(parent.clientWidth, parent.clientHeight);

	boxwidth = app.renderer.width;
	boxheight = app.renderer.height;
	marginwidth = 0.1 * boxwidth;
	marginheight = 0.1 * boxheight;

	for (var i = 0; i < fireflies.length; i++) {
		var ff = fireflies[i];
		ff.x = Math.random() * (boxwidth - marginwidth) + marginwidth;
		ff.y = Math.random() * (boxheight - marginheight) + marginheight;
	}

	for (var i = 0; i < leaders.length; i++) {
		var l = leaders[i];
		l.x = (boxwidth - marginwidth) / 2 + marginwidth;
		l.y = marginheight;
	}
}


/****************
 * Text
 ***************/

function TimeText() {
	var self = this;
	self.graphics = new PIXI.Graphics();
	self.time = elapsedTime;

	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 30,
		fontStyle: 'italic',
		//fontWeight: 'bold',
		fill: '#FFFFFF', // gradient
		stroke: '#000000',
		strokeThickness: 5,
		dropShadow: false,
		dropShadowColor: '#000000',
		dropShadowBlur: 0,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: app.renderer.width / 2,
		lineJoin: 'round',
	});

	var timeText = new PIXI.Text(pad2(parseInt(self.time / 60)) + ':' + pad2(parseInt(self.time % 60)), style);
	timeText.x = app.renderer.width / 2 - timeText.width/2 ;
	
	timeText.y = 0;
	timeText.color = 0;
	self.graphics.addChild(timeText);
	self.update = function (delta) {
		self.time = app.ticker.lastTime / 1000 - elapsedTime;
		timeText.text = 'Time:  ' + pad2(parseInt(self.time / 60)) + ':' + pad2(parseInt(self.time % 60)) + ', Maximum flashing fireflies together:  ' + parseInt(100 * (flashingFF / fireflies.length)) + ' % ';
		timeText.x = app.renderer.width / 2 - timeText.width/2 ;
		style.wordWrapWidth = app.renderer.width / 2
	}
}

// Listen for window resize events
window.addEventListener('resize', resize);
/******************************

THE FIREFLY CODE

*******************************/

function Firefly() {

	var self = this;
	// Graphics
	self.graphics = new PIXI.Container();
	var g = self.graphics;
	g.scale.set(0.15);

	// Random spot
	self.x = Math.random() * (boxwidth - marginwidth) + marginwidth;
	self.y = Math.random() * (boxheight - marginheight) + marginheight;
	self.angle = Math.random() * Math.TAU;
	self.speed = 0.5 + Math.random() * 1;
	self.swerve = (Math.random() - 0.5) * FLY_SWERVE;

	// Clock! From 0 to 1
	self.clock = Math.random();

	// Flash
	var flash = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	flash.gotoAndStop(2);
	flash.alpha = 0;
	g.addChild(flash);

	// Body
	var body = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	body.gotoAndStop(0);
	g.addChild(body);

	// Body2
	var body2 = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	body2.gotoAndStop(1);
	body2.alpha = 0;
	g.addChild(body2);

	// Wings
	var wings = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	wings.gotoAndStop((Math.random() < 0.5) ? 3 : 4);
	g.addChild(wings);

	// Clock
	var clock = new PIXI.Container();
	clock.visible = false;
	g.addChild(clock);

	// Dark Clock
	var darkClock = new PIXI.Container();
	clock.addChild(darkClock);
	var darkClockBody = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	darkClockBody.gotoAndStop(7);
	darkClock.addChild(darkClockBody);
	var darkClockHand = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	darkClockHand.gotoAndStop(8);
	darkClock.addChild(darkClockHand);

	// Light Clock
	var lightClock = new PIXI.Container();
	lightClock.alpha = 0;
	clock.addChild(lightClock);
	var lightClockBody = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	lightClockBody.gotoAndStop(5);
	lightClock.addChild(lightClockBody);
	var lightClockHand = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	lightClockHand.gotoAndStop(6);
	lightClock.addChild(lightClockHand);

	self.color = 16777215;
	self.leaderShowClock = false;

	// Mouse LAST pressed... a little decay...
	var _chaos = 0;

	// Update
	self.update = function (delta) {
		body.tint = self.color;
		body2.tint = self.color;
		wings.tint = self.color;

		clock.tint = self.color;
		lightClock.tint = self.color;
		darkClock.tint = self.color;
		flash.tint = self.color;


		//////////////////////
		// Position & Angle //
		//////////////////////

		// Update position
		self.x += self.speed * delta * Math.cos(self.angle);
		self.y += self.speed * delta * Math.sin(self.angle);

		// Loop around
		if (self.x < marginwidth - FLY_LOOP) self.x = boxwidth + FLY_LOOP;
		if (self.x > boxwidth + FLY_LOOP) self.x = marginwidth - FLY_LOOP;

		if (self.y < marginheight - FLY_LOOP) self.y = boxheight + FLY_LOOP;
		if (self.y > boxheight + FLY_LOOP) self.y = marginheight - FLY_LOOP;

		// Swerve
		self.angle += self.swerve;
		if (Math.random() < 0.05) self.swerve = (Math.random() - 0.5) * FLY_SWERVE;

		////////////////////////
		// Cycling & Flashing //
		////////////////////////

		// Increment cycle
		flash.alpha *= 0.9;
		self.clock += (delta / 60) * FLY_CLOCK_SPEED;

		// If near mouse, get chaotic, and fast!
		if (Mouse.pressed && CHAOS_ON) {
			flashingFF = 0;
			prevflashingFF = 0;
			_resetTimer();
			_chaos = 1;
		}
		if (_chaos > 0.01 && closeEnough(self, Mouse, MOUSE_RADIUS)) {
			self.clock += Math.random() * 0.15;
		}
		_chaos *= 0.8;

		// Flashed?
		if (self.clock > 1) {

			// Flash!
			flash.alpha = 1;
			self.clock = 0;

			// Bring nearby fireflies up.
			if (FLY_SYNC) {
				for (var i = 0; i < fireflies.length; i++) {
					var ff = fireflies[i];
					if (ff == self) continue; // is self? forget it
					if (closeEnough(self, ff, FLY_RADIUS)) { // is close enough?
						var pull = (ff.clock / 1); // to prevent double-pulling
						ff.clock += pull * FLY_PULL;
						if (ff.clock > 1) ff.clock = 1;
					}
				}
			}
			else if (FOLLOW_LEADER && self.leaderShowClock) {
				for (var i = 0; i < fireflies.length; i++) {
					var ff = fireflies[i];
					if (closeEnough(self, ff, 10000)) { // is close enough?
						var pull = (ff.clock / 1); // to prevent double-pulling
						ff.clock += pull * FLY_PULL;
						if (ff.clock > 1) ff.clock = 1;
					}
				}

			}
		}
		body2.alpha = flash.alpha;
		lightClock.alpha = flash.alpha;

		//////////////
		// Graphics //
		//////////////

		// Position
		g.x = self.x;
		g.y = self.y;
		g.rotation = self.angle + Math.TAU / 4;

		// Flap wings
		wings.gotoAndStop((wings.currentFrame == 3) ? 4 : 3);

		// Clocks!
		clock.rotation = -g.rotation;
		if (self.leaderShowClock) clock.visible = self.leaderShowClock;
		else clock.visible = SHOW_CLOCKS;
		darkClockHand.rotation = lightClockHand.rotation = self.clock * Math.TAU;

	};
	self.update(0);

}

// @ts-check
function Leader() {

	var self = this;
	// Graphics
	self.graphics = new PIXI.Container();
	var g = self.graphics;
	g.scale.set(0.4);

	//Radius of sync
	c1 = new Circle(0, 0, LEADER_RADIUS);
	c1.lineStyle(3, 0xFFFF00);
	c1.drawCircle(0, 0, 2 * c1.radius);
	g.addChild(c1);

	// Clock
	var clock = new PIXI.Container();
	clock.visible = true;
	g.addChild(clock);


	// Flash
	var flash = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	flash.gotoAndStop(2);
	flash.alpha = 0;
	g.addChild(flash)

	// Dark Clock
	var darkClock = new PIXI.Container();
	clock.addChild(darkClock);
	var darkClockBody = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	darkClockBody.gotoAndStop(7);
	darkClock.addChild(darkClockBody);
	var darkClockHand = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	darkClockHand.gotoAndStop(8);
	darkClock.addChild(darkClockHand);

	// Light Clock
	var lightClock = new PIXI.Container();
	lightClock.alpha = 0;
	clock.addChild(lightClock);
	var lightClockBody = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	lightClockBody.gotoAndStop(5);
	lightClock.addChild(lightClockBody);
	var lightClockHand = _makeMovieClip("firefly", { anchorX: 0.5, anchorY: 0.5 });
	lightClockHand.gotoAndStop(6);
	lightClock.addChild(lightClockHand);

	self.x = app.renderer.width / 2;
	self.y = 0.15 * app.renderer.height;
	self.angle = 0;
	self.clock = 0;

	self.update = function (delta) {
		g.visible = FOLLOW_CLOCK;
		if (!FOLLOW_CLOCK) return;

		if (c1.radius != LEADER_RADIUS) {
			c1.radius = LEADER_RADIUS;
			c1.clear();
			c1.lineStyle(3, 0xFFFF00);
			c1.drawCircle(0, 0, 2 * c1.radius);
		}
		// Position
		g.x = self.x;
		g.y = self.y;
		g.rotation = self.angle + Math.TAU / 4;
		// Increment cycle

		flash.alpha *= 0.9;
		self.clock += (delta / 60) * FLY_CLOCK_SPEED;

		if (Mouse.pressed) {
			if (closeEnough(self, Mouse, 50)) {
				self.x = Mouse.x;
				self.y = Mouse.y;
			}
		}

		if (self.clock > 1) {

			// Flash!
			flash.alpha = 1;
			self.clock = 0;

			if (FOLLOW_CLOCK) {
				for (var i = 0; i < fireflies.length; i++) {
					var ff = fireflies[i];
					if (closeEnough(self, ff, c1.radius)) {
						ff.clock = 1.1;
					}
				}
			}
		}
		lightClock.alpha = flash.alpha;

		// Clocks!
		clock.rotation = -g.rotation;
		clock.visible = true;
		darkClockHand.rotation = lightClockHand.rotation = self.clock * Math.TAU;
	}
	self.update(0);
}

/******************************

UI CODE: Resize, make widgets, etc...

*******************************/

subscribe("mousedown", function () {
	$("#words").className = "no-select";
});
subscribe("mouseup", function () {
	$("#words").className = "";
});

window.onresize = function () {
	if (app) app.renderer.resize(document.body.clientWidth, document.body.clientHeight);
};

/******************************

WIDGET CODE: Modifying "Constants"

*******************************/

// Synchronize with the UI
var _syncConstants = function () {

	publish("slider/numFireflies", [NUM_FIREFLIES]);

	publish("toggle/showClocks", [SHOW_CLOCKS]);
	publish("slider/clockSpeed", [FLY_CLOCK_SPEED]);

	publish("toggle/neighborNudgeRule", [FLY_SYNC]);
	publish("slider/nudgeAmount", [FLY_PULL]);
	publish("slider/neighborRadius", [FLY_RADIUS]);
	publish("slider/changeSwerve", [FLY_SWERVE]);

	publish("toggle/followLeader", [FOLLOW_LEADER]);
	publish("slider/nudgeAmountLeader", [FLY_PULL_LEADER]);
	publish("toggle/followClock", [FOLLOW_CLOCK]);
	publish("toggle/chaosON", [CHAOS_ON]);

	publish("slider/leaderRadius", [LEADER_RADIUS]);

};

//Add Random Leader
var _addRandomLeader = function () {
	var i = Math.floor(Math.random() * (fireflies.length));
	var ff = fireflies[i];
	ff.color = 16711680;
	ff.leaderShowClock = true;
}

// Num of Fireflies

subscribe("slider/numFireflies", function (value) {

	// Settle the difference...
	if (value > fireflies.length) {
		_addFireflies(value - fireflies.length);
	}
	if (value < fireflies.length) {
		_removeFireflies(fireflies.length - value);
	}
	// Then make that the new constant.
	NUM_FIREFLIES = value;
});


// Internal Clock

subscribe("toggle/showClocks", function (value) {
	SHOW_CLOCKS = value;
});
subscribe("slider/clockSpeed", function (value) {
	FLY_CLOCK_SPEED = value
});

subscribe("slider/leaderRadius", function (value) {
	LEADER_RADIUS = value;
});

// Neighbor Nudge Rule
subscribe("toggle/neighborNudgeRule", function (value) {
	FLY_SYNC = value;
	flySyncDependencies();
});

subscribe("slider/nudgeAmount", function (value) {
	FLY_PULL = value;
});

subscribe("slider/neighborRadius", function (value) {
	FLY_RADIUS = value;
});

// Increase Speed 
subscribe("slider/changeSwerve", function (value) {
	FLY_SWERVE = value;
});

// Chaos on or off
subscribe("toggle/chaosON", function (value) {
	CHAOS_ON = value;
});

// Reset Fireflies
subscribe("button/resetFireflies", function () {
	_resetFireflies();
	flashingFF = 0;
	prevflashingFF = 0;
	_resetTimer();

	
});

//Reset everything 
subscribe("button/resetEverything", function () {
	_resetConstants();
	_syncConstants();
	_resetFireflies();
	_resetTimer();
});

subscribe("button/addLeader", function () {
	_addRandomLeader();
}
);

subscribe("button/addLeaderClock", function () {
	_addLeaders(1);
}
);

subscribe("toggle/followLeader", function (value) {
	FOLLOW_LEADER = value;
	followLeaderDependencies();
});

subscribe("toggle/followClock", function (value) {
	FOLLOW_CLOCK = value;
	followClockDependencies();
});

subscribe("slider/nudgeAmountLeader", function (value) {
	FLY_PULL_LEADER = value;
});

var followLeaderDependencies = function () {
	if (FOLLOW_LEADER) {
		$("#nudgeAmountLeader").removeAttribute("inactive");
		$("#addLeader").removeAttribute("inactive");
		FOLLOW_CLOCK = false;
		FLY_SYNC = false;
		publish("toggle/neighborNudgeRule", [FLY_SYNC]);
		publish("toggle/followClock", [FOLLOW_CLOCK]);
	}
	else {
		$("#nudgeAmountLeader").setAttribute("inactive", "yes");
		$("#addLeader").setAttribute("inactive", "yes");
		for (var i = 0; i < fireflies.length; i++) {
			var ff = fireflies[i];
			ff.leaderShowClock = false;
			ff.color = 16777215;
		}
	}
}

var followClockDependencies = function () {
	if (FOLLOW_CLOCK) {
		$("#leaderRadius").removeAttribute("inactive");
		FOLLOW_LEADER = false;
		FLY_SYNC = false;
		publish("toggle/neighborNudgeRule", [FLY_SYNC]);
		publish("toggle/followLeader", [FOLLOW_LEADER]);
	}
	else
		$("#leaderRadius").setAttribute("inactive", "yes");
}

var flySyncDependencies = function () {
	if (FLY_SYNC) {
		$("#nudgeAmount").removeAttribute("inactive");
		$("#neighborRadius").removeAttribute("inactive");
		FOLLOW_CLOCK = false;
		FOLLOW_LEADER = false;
		publish("toggle/followLeader", [FOLLOW_LEADER]);
		publish("toggle/followClock", [FOLLOW_CLOCK]);
	} else {
		$("#nudgeAmount").setAttribute("inactive", "yes");
		$("#neighborRadius").setAttribute("inactive", "yes");
	}
}