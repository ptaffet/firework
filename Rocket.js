
(function() {

// Game Alchemist Workspace.
window.ga = window.ga || {};

ga.particles = ga.particles || {} ; 

var numberOfCachedColors = 512;
		
ga.particles.Rocket = function( x, y, speed ) {	
    this.x = 0;
    this.y = 0;
    this.deathTime = 0;
    this.birthTime = 0;
    this.rocketLength = 12.0;
    this.speed = 2;
};

ga.particles.Rocket.prototype = {
  dt            : 0        , // current time-step value (ms). reserved for the engine
  currentTime   : 0        , // current time (ms). reserved for the engine
  drawContext   : null     , // current drawing context. reserved for the engine

 update : function () {
   	    var dt = this.dt;
   	    this.oldX  = this.x      ;      this.oldY = this.y ;
       // this.vy   +=  this.gravity*dt ;
        this.x    += this.vx*dt  ;      this.y  +=  this.vy*dt;
 },
   draw: function () {
   	    var ctx = this.drawContext ;
        ctx.strokeStyle = "#F00";
        ctx.beginPath();
	    ctx.moveTo ( Math.round(this.x)    , Math.round(this.y)    );
        var distInLastTick = Math.sqrt((this.x-this.oldX) * (this.x - this.oldX) + (this.y - this.oldY) * (this.y - this.oldY));
        var endX = this.x + (this.oldX - this.x) * (this.rocketLength / distInLastTick),
            endY = this.y + (this.oldY - this.y) * (this.rocketLength / distInLastTick);
        ctx.lineTo ( Math.round(endX) , Math.round(endY) );
		ctx.stroke ();   	
   },

   spawn : function (particleLoopBuffer, firstIndex, cnt, currentTime, startX, startY, targetX, targetY) {
	   var index    = firstIndex            ;
	   var length   = particleLoopBuffer.length ;
	   var particle = null                  ;
       while (count--) {	
			particle = particleLoopBuffer[index];
			
			particle.x = startX;
			particle.y = startY;
            var dist = Math.sqrt((targetX - startX)*(targetX - startX) + (targetY - startY) * (targetY - startY));
            particle.vx = (targetX - startX) * particle.speed/dist; 
            particle.vy = (targetY - startY) * particle.speed/dist; 

            particle.birthTime = currentTime + 1;
            particle.deathTime = particle.birthTime + dist/particle.speed;
			
			// _____ end of initialisation _____
			index++; if (index == length ) index = 0;   // iterate / loop
		}
   }
};
})();