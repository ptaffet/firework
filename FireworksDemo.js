window.onload = function () {

	var fireParticlesCount = 4000;

	// read the parameters of the page, update fireParticlesCount if ?#number# is found ( expl: ?500 )
	if (location.search) {
		var newPartCount = parseInt(location.search.substring(1));
		if (newPartCount) { fireParticlesCount = Math.max(8000, newPartCount); }
	};

	// *** Setup Canvas // Context2d	
	var starCanvas = ga.CanvasLib.insertMainCanvas();
	var ScreenCssWidth = starCanvas.width;
	var ScreenCssHeight = starCanvas.height;
	var ctx = starCanvas.getContext('2d');
	var canvas2 = ga.CanvasLib.insertMainCanvas();
	var ctx2 = canvas2.getContext('2d');

	// **** Setup the particle engine																					           
	var firewEngine = new ga.JSparkle(ga.particles.Fireworks, fireParticlesCount, ctx, null);
	var rocketEngine = new ga.JSparkle(ga.particles.Rocket, 50, ctx2, null);

	var users = {};
	document.cookie = document.cookie | 0;
	$("#score").text("Score: " + document.cookie);

    // start a run loop with this particle engine
	//  -- preDraw erase with a low opacity to make a trail effect.
	var myTextDrawer = new ga.utility.FadingText(4000, 2000, '🎆.ml: Tap or left click to launch a firework.', '#FFF', ctx);

	   // User's info
	var startX = 0 | (Math.random() * ScreenCssWidth);
	var userColor = window.hsl2rgbHex(Math.random(), .5, .5);

	var fwPreDraw = function (ctx) {
		ctx.globalAlpha = 0.10;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ScreenCssWidth, ScreenCssHeight);
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;
		myTextDrawer.draw(100, 20);
	};
	var rkPreDraw = function (ctx) {
		ctx.clearRect(0, 0, ScreenCssWidth, ScreenCssHeight);
		ctx.globalAlpha = 1;
		ctx.lineWidth = 4;
		for (var property in users) {
			if (users.hasOwnProperty(property)) {
				var user = users[property];

				ctx.fillStyle = user.Item3;
				ctx.fillRect(0|(user.Item1 * ScreenCssWidth - 10), ScreenCssHeight - 20, 20, 20);

			}
		}
	};

	firewEngine.startRunLoop(fwPreDraw);
	rocketEngine.startRunLoop(rkPreDraw);

	// *** listen to some mouse events  	
	var displayInfo = false;
	/*addEventListener('mousedown', function (e) {
		if (e.button == 2) {
			displayInfo = !displayInfo;
			firewEngine.setStatisticsDisplay(displayInfo);
		}
	});
	addEventListener('click', function (e) {
		var x = e.clientX, y = e.clientY;
		$.connection.broadcast.server.shootFirework(startX * 1.0 / ScreenCssWidth, 1.0, x * 1.0 / ScreenCssWidth, y * 1.0 / ScreenCssHeight, userColor);
		//rocketEngine.spawn(1, startX, ScreenCssHeight, x, y, firewEngine);
		//                                   firewEngine.spawn( 0 | (400 + Math.random() * 300), x ,y , 5+ 10*Math.random())      		 	  
	});
	*/
	canvas2.addEventListener("mousedown", function (e) {
		var x = e.clientX, y = e.clientY;
		$.connection.broadcast.server.shootFirework(startX * 1.0 / ScreenCssWidth, 1.0, x * 1.0 / ScreenCssWidth, y * 1.0 / ScreenCssHeight, userColor);
	});


    addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); }, false)

	var handleMouseWheel = function (e) {
		var delta = 0;
		if (e.deltaY) { delta = - e.deltaY }  // webKit = Chrome + Safari
		if (e.wheelDeltaY) { delta = e.wheelDeltaY } // FF + ( ? IE ) 	    
		if (delta > 1) {
			if (fireParticlesCount > 20000) { return }
			fireParticlesCount += 50;
			firewEngine.resize(fireParticlesCount);
		}
		if (delta < 1) {
			if (fireParticlesCount < 200) { return }
			fireParticlesCount -= 50;
			firewEngine.resize(fireParticlesCount);
		}
		console.log(fireParticlesCount);

		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	//var addEventListener = addEventListener ? addEventListener : attachEvent ;        
	addEventListener('mousewheel', handleMouseWheel, false);    // Chrome + Safari		
	addEventListener('wheel', handleMouseWheel, false);    // ff 



	var broadcast = $.connection.broadcast;
	$.extend(broadcast.client, {
		fireworkLaunched: function () {
			rocketEngine.spawn(1, 0 | (ScreenCssWidth * arguments[0]), ScreenCssHeight, 0 | (ScreenCssWidth * arguments[2]), 0 | (ScreenCssHeight * arguments[3]), firewEngine, arguments[4], arguments[5]);
			console.log("Fw launched!" + arguments);
		},
		updateUsers: function (dictionary) {
			users = dictionary;
		}
	});

	$.connection.hub.url = "http://fireworkml.azurewebsites.net/signalr";
	//$.connection.hub.url = "http://localhost:38578/signalr"
	$.connection.hub.logging = true;
	$.connection.hub.start({ withCredentials: false })
		.then(
		function () {
			console.log("Connected");
			broadcast.server.register(startX * 1.0 / ScreenCssWidth, 1.0, userColor);
		})
		.fail(
		function () { console.log("Failed"); }
		);

};
