!!(function(){
	// game mgr 
	var gameMgr = (function(){
    	var gameMgr = {
    		_html : $('.game-inner').html(),
    		start: function(){
    			$('.game-inner').find('[data-animate]')
		            .each(function(){
		                var $dom = $(this);
		                var tar = $dom.data('animate');
		                var time = parseInt( $dom.data('time') );
		                var delay = $dom.data('delay') || 0;
		                var easing = $dom.data('easing');
		                var begin = $dom.data('begin');
		                tar = tar.split(';');
		                var tarCss = {} , tmp;
		                for (var i = tar.length - 1; i >= 0; i--) {
		                    tmp = tar[i].split(':');
		                    if( tmp.length == 2 )
		                        tarCss[ tmp[0] ] = $.trim(tmp[1]);
		                }
		                $dom.delay( delay )
		                    .animate( tarCss , time , easing );
		                
		            });
    		},
    		reset: function(){
    			$('.game-inner').html( gameMgr._html )
    				.fadeIn();
    			$('.ques-inner').fadeOut();
    			throwBall = false;
    			gameMgr.start();
    		},
    		stopFlicker: function(){
    			clearTimeout( gameMgr._timer );
    		},
    		flicker: function( $dom ){
    			var times = 0;
    			!function caller(){
    				if( ++times > 7 ) return;
    				$dom[$dom.is(':visible') ? 'fadeOut' : 'fadeIn']( 250 );
    				gameMgr._timer = setTimeout(function(){
    					caller( $dom );
    				} , 280)
    			}();
    		},
    		throwBall: function( $tar , cb ){
    			var top = parseInt( $tar.css('top') );
        		var left = parseInt( $tar.css('left') );
        		var center = {top: top + 108 / 2 , left: left + 108/2 };

        		// run animate
        		var $ball = $('.game-ball');
        		var tar = {
        			width: 50,
        			height: 50,
        			zIndex: 1,
        			left: center.left - 25,
        			top: center.top - 25,
        			rotate: 140 + ~~( 240 * Math.random() )
        		}


        		var curr = {
        			width: $ball.width(),
        			height: $ball.height(),
        			zIndex: 100,
        			left: parseInt( $ball.css('left') ),
        			top:  parseInt( $ball.css('top') ),
        			rotate: 0
        		}

        		var time = 1000;
        		var vy = -1.2;
        		var a = ( ( tar.top - curr.top ) - vy * time ) * 2 / time / time ;

        		var startTime = new Date();
        		setTimeout(function animate(){
        			var d = new Date() - startTime;
        			if( d > time ){
        				$ball.css(tar);
        				cb && cb();
        				return;
        			}

        			var p = d / time;
        			var status = {
        				width: curr.width + ( - curr.width + tar.width ) * p,
        				height: curr.height + ( - curr.height + tar.height ) * p,
        				zIndex: curr.zIndex + ( - curr.zIndex + tar.zIndex ) * p,
        				left: curr.left + ( tar.left - curr.left ) * p,
        				top: curr.top + vy * d + 1 / 2 * a * d * d 
        			}

        			// fix overflow
        			if( d / time > 0.3 ){
        				$wrap.css('overflow' , 'visible');
        			}

        			$ball.css( status );
        			var r = "rotate(" + parseInt( curr.rotate + ( tar.rotate - curr.rotate ) * p ) + 'deg)';
        			$ball[0].style['-webkit-transform'] = r;
        			$ball[0].style['-ms-transform'] = r;
        			$ball[0].style['-moz-transform'] = r;
        			$ball[0].style['-o-transform'] = r;
        			setTimeout( animate , 1000 / 60 );
        		} , 1000/60);
    		}
    	}
        

        var $wrap = $('.game-wrap');
        $wrap.on( 'click'  , '.game-btn' , function(){
        		$wrap.find('.game-g1')
        			.animate({left: 700} , 500  , function(){$(this).hide()})

        			.end()
        			.find('.game-btn')
        			.delay(300)
        			.animate({top: -90} , 500 , function(){$(this).hide()})

        			.end()
        			.find('.game-w')
        			.animate({height:155} , 500)

        			.end()
        			.find('.game-g2')
        			.show()
        			.delay(200)
        			.animate({left:20} , 500)

        			.end()
        			.find('.game-g3')
        			.delay(800)
        			.animate({left:577} , 500)

        			.end()
        			.find('.game-g4')
        			.delay( 400 )
        			.animate({left:615} , 500);


        			//Flicker dir
        		gameMgr.flicker($wrap.find('.game-dir'));

        		$wrap.find('.game-tar1,.game-tar2,.game-tar3,.game-tip')
        			.fadeIn( 1000 );
        	});

        var isMouseDown = false;
        var startPos = null;

        $(document)
            // drag to throw ball
            .on('mousedown' , '.game-ball' , function( ev ){
                isMouseDown = true;
                startPos = { left: ev.pageX , top: ev.pageY };
            })
            .on('mousemove' , function(){
                if( !isMouseDown ) return;
                //TODO：： 可以显示 一个蓄力的
            })
            .on('mouseup' , function(){
                if( isMouseDown ){
                    //  计算位置和方向
                    
                }
                isMouseDown = false;
            });

        var throwBall = false;
        $wrap.on( 'click' , '.game-tar1,.game-tar2,.game-tar3' , function(){
        		if( throwBall ) return;
        		throwBall = true;

        		gameMgr.stopFlicker();
        		$('.game-dir').stop( true , true )
        			.fadeOut();
        		gameMgr.throwBall( $(this) , function(){
        			//throwBall = false;

        			$('.game-inner').fadeOut();
        			$('.ques-inner').fadeIn();
        		} );
        	});

        return gameMgr;
    })();


    gameMgr.start();
})();