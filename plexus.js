/*
 * AuroraAI - Plexus Canvas Optimisé
 * Version: 1.0
 * Identité visuelle PRÉSERVÉE à 100%
 * Optimisations invisibles : particules adaptatives, pause auto
 */
(function(){
    // Empêcher chargement multiple
    if(window.AuroraPlexusLoaded)return;
    window.AuroraPlexusLoaded=true;

    var canvas=document.getElementById('plexusCanvas');
    if(!canvas)return;
    var ctx=canvas.getContext('2d');
    var particles=[];
    var animId=null;
    var isPaused=false;
    var isMobile=window.innerWidth<=768;
    var PARTICLE_COUNT=isMobile?25:40;
    var CONNECT_DIST=200;
    var SPEED=0.3;
    var LINE_WIDTH=1.7;
    var DOT_COLOR='rgba(212,175,55,0.5)';

    function resize(){
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    }

    function initParticles(){
        particles=[];
        for(var i=0;i<PARTICLE_COUNT;i++){
            particles.push({
                x:Math.random()*canvas.width,
                y:Math.random()*canvas.height,
                vx:(Math.random()-0.5)*SPEED*2,
                vy:(Math.random()-0.5)*SPEED*2,
                r:Math.random()*2+1
            });
        }
    }

    function draw(){
        if(isPaused){animId=requestAnimationFrame(draw);return;}
        ctx.fillStyle='#000';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(var i=0;i<particles.length;i++){
            var p=particles[i];
            p.x+=p.vx;
            p.y+=p.vy;            if(p.x<0||p.x>canvas.width)p.vx*=-1;
            if(p.y<0||p.y>canvas.height)p.vy*=-1;
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=DOT_COLOR;
            ctx.fill();
            for(var j=i+1;j<particles.length;j++){
                var p2=particles[j];
                var dx=p.x-p2.x;
                var dy=p.y-p2.y;
                var d=Math.sqrt(dx*dx+dy*dy);
                if(d<CONNECT_DIST){
                    var alpha=(1-d/CONNECT_DIST)*0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x,p.y);
                    ctx.lineTo(p2.x,p2.y);
                    ctx.strokeStyle='rgba(212,175,55,'+alpha+')';
                    ctx.lineWidth=LINE_WIDTH;
                    ctx.stroke();
                }
            }
        }
        animId=requestAnimationFrame(draw);
    }

    // Pause quand onglet caché
    document.addEventListener('visibilitychange',function(){
        if(document.hidden){
            isPaused=true;
        }else{
            isPaused=false;
        }
    });

    // Pause quand canvas hors vue
    if('IntersectionObserver' in window){
        var observer=new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                isPaused=!entry.isIntersecting;
            });
        },{threshold:0});
        observer.observe(canvas);
    }

    // Redimensionnement + adaptation mobile/desktop
    window.addEventListener('resize',function(){
        resize();
        var wasMobile=isMobile;
        isMobile=window.innerWidth<=768;
        if(wasMobile!==isMobile){            PARTICLE_COUNT=isMobile?25:40;
            initParticles();
        }
    });

    // Lancer
    resize();
    initParticles();
    draw();
})();
