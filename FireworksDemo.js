window.onload = function() {

	var fireParticlesCount = 4000;
	
		// read the parameters of the page, update fireParticlesCount if ?#number# is found ( expl: ?500 )
	if (location.search) { 
		var newPartCount = parseInt (location.search.substring(1));
		if (newPartCount) { fireParticlesCount = Math.max(8000,newPartCount); }
	};
	
	// *** Setup Canvas // Context2d	
	var starCanvas 		= ga.CanvasLib.insertMainCanvas() ;
	var ScreenCssWidth  = starCanvas.width   ;    
	var ScreenCssHeight = starCanvas.height  ;
	var ctx  		    = starCanvas.getContext('2d');
		
	// **** Setup the particle engine																					           
	var firewEngine = new ga.JSparkle(ga.particles.Fireworks, fireParticlesCount, ctx, null );
	var rocketEngine = new ga.JSparkle(ga.particles.Rocket, 50, ctx, null );
	

    // start a run loop with this particle engine
       //  -- preDraw erase with a low opacity to make a trail effect.
       var myTextDrawer = new ga.utility.FadingText(4000, 2000, ' FireWorks Demo of JSpakle.   Mouse wheel up/down to resize buffer. Left click to spawn. Right click to display stats. ', '#FFF', ctx);

       var fwPreDraw  = function (ctx) {     ctx.globalAlpha = 0.10;
							              ctx.fillStyle = '#000';
							              ctx.fillRect(0,0, ScreenCssWidth, ScreenCssHeight);
							              ctx.globalAlpha = 1;
							              ctx.lineWidth = 2; 		
							              myTextDrawer.draw(100,20);						};
	
	firewEngine.startRunLoop( fwPreDraw );
	rocketEngine.startRunLoop();

	
	// *** listen to some mouse events  	
	var displayInfo = false;
	addEventListener('mousedown', function (e) { if (e.button == 2) { 
                                     					displayInfo = !displayInfo; 
                                     					firewEngine.setStatisticsDisplay(displayInfo); } 
                                     		 	 if (e.button == 0) {
                                         		 	  var x=e.clientX, y=e.clientY;
														rocketEngine.spawn(1, 0|(ScreenCssWidth/2), ScreenCssHeight, x, y, firewEngine);
//                                   firewEngine.spawn( 0 | (400 + Math.random() * 300), x ,y , 5+ 10*Math.random())      		 	  
                                         		  }  }		) ;
                                         		  
    addEventListener('contextmenu', function (e) {  e.preventDefault();     e.stopPropagation(); }, false)                                    				   
                                      					
	var handleMouseWheel = function(e) {
	        var delta = 0;
		  	if (e.deltaY)      { delta = - e.deltaY  }  // webKit = Chrome + Safari
		    if (e.wheelDeltaY) { delta = e.wheelDeltaY } // FF + ( ? IE ) 	    
	        if (delta>1) {   if (fireParticlesCount>20000) { return }  
	        				 fireParticlesCount+=50;
							 firewEngine.resize(fireParticlesCount); }
	        if (delta<1) {   if (fireParticlesCount<200)   { return }  
	        				 fireParticlesCount-=50; 
							 firewEngine.resize(fireParticlesCount);     }
	        console.log(fireParticlesCount);
	        
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	}        
	//var addEventListener = addEventListener ? addEventListener : attachEvent ;        
	addEventListener('mousewheel',handleMouseWheel, false);    // Chrome + Safari		
	addEventListener('wheel'     ,handleMouseWheel, false);    // ff 

};
