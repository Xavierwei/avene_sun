!!(function(){
	// game mgr 
	var gameMgr = (function(){
    	var gameMgr = {
    		_html : $('.game-inner').html(),
    		start: function(){
                isGameStart = false;
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
            isMeet: function( pos1 , pos2 , r ){
                var dis = gameMgr.getDistance( pos1 , pos2 );
            },
            throwBall: function( info , success , failure ){
                // var top = parseInt( $tar.css('top') );
                // var left = parseInt( $tar.css('left') );
                // var center = { top: top + 108 / 2 , left: left + 108 / 2 };

                // // run animate
                var $ball = $('.game-ball');
                // var tar = {
                //     width: 50,
                //     height: 50,
                //     zIndex: 1,
                //     left: center.left - 25,
                //     top: center.top - 25,
                //     rotate: 140 + ~~( 240 * Math.random() )
                // }


                var curr = {
                    width: $ball.width(),
                    height: $ball.height(),
                    zIndex: 1000,
                    left: parseInt( $ball.css('left') ),
                    top:  parseInt( $ball.css('top') ),
                    rotate: 0
                }
                curr.cx = curr.left + curr.width / 2;
                curr.cy = curr.top + curr.height / 2;
                //var time = 1000;
                var vy = info.vy;
                var vx = info.vx;
                var vz = info.vz;//2.5;
                var zDis = 500;
                var a = 0.00202 ;
                // var a = ( ( tar.top - curr.top ) - vy * time ) * 2 / time / time ;

                var startTime = new Date();
                var $stars = $('.game-tar1,.game-tar2,.game-tar3');
                var centers = [];
                $stars.each( function(){
                      centers.push( $(this).offset() );
                });
                setTimeout(function animate(){
                    var d = new Date() - startTime;
                    
                    //var p = d / time;
                    var w = curr.width - ( vz * d / zDis * 150 );
                    var status = {
                        width: w,
                        height: w,
                        zIndex: curr.zIndex - ( vz * d / zDis * 150 ) ,
                        left: curr.cx + vx * d - w / 2 ,
                        top: curr.cy + vy * d - w / 2 + 1 / 2 * a * d * d 
                    }
                    if( vz * d >= zDis - 50 && vz * d <= zDis + 50 ){
                        //判断是否相交 
                        var isMeet = false;
                        $.each( centers , function( i , pos ){
                            var dis = gameMgr.getDistance( pos , {left: status.left + status.width / 2 , top: status.top + status.width / 2} );
                            if( dis < 80 ){
                                isMeet = true;
                                return false;
                            }
                        });
                        if( isMeet ){
                            success && success();
                            return;
                        }
                    }
                    if( status.zIndex <= 0 || status.left < 0 || status.left > 1000 || status.top > 1000 ){
                        $('.game-ball')
                            .animate( {
                                top: 264
                            } , 500 )
                            [0].style.cssText = 'top: 370px;';
                        failure && failure();
                        return ;
                    }
                    console.log( status.zIndex )

                    // // fix overflow
                    // if( d / time > 0.3 ){
                    //     $wrap.css('overflow' , 'visible');
                    // }

                    $ball.css( status );
                    var r = "rotate(" + parseInt( curr.rotate + d / 1000 * 360 ) + 'deg)';
                    $ball[0].style['-webkit-transform'] = r;
                    $ball[0].style['-ms-transform'] = r;
                    $ball[0].style['-moz-transform'] = r;
                    $ball[0].style['-o-transform'] = r;
                    setTimeout( animate , 1000 / 60 );
                } , 1000 / 60);
            },
    		// throwBall: function( $tar , cb ){
    		// 	var top = parseInt( $tar.css('top') );
      //   		var left = parseInt( $tar.css('left') );
      //   		var center = {top: top + 108 / 2 , left: left + 108/2 };

      //   		// run animate
      //   		var $ball = $('.game-ball');
      //   		var tar = {
      //   			width: 50,
      //   			height: 50,
      //   			zIndex: 1,
      //   			left: center.left - 25,
      //   			top: center.top - 25,
      //   			rotate: 140 + ~~( 240 * Math.random() )
      //   		}


      //   		var curr = {
      //   			width: $ball.width(),
      //   			height: $ball.height(),
      //   			zIndex: 100,
      //   			left: parseInt( $ball.css('left') ),
      //   			top:  parseInt( $ball.css('top') ),
      //   			rotate: 0
      //   		}

      //   		var time = 1000;
      //   		var vy = -1.2;
      //   		var a = ( ( tar.top - curr.top ) - vy * time ) * 2 / time / time ;
      //           console.log( a );
      //   		var startTime = new Date();
      //   		setTimeout(function animate(){
      //   			var d = new Date() - startTime;
      //   			if( d > time ){
      //   				$ball.css(tar);
      //   				cb && cb();
      //   				return;
      //   			}

      //   			var p = d / time;
      //   			var status = {
      //   				width: curr.width + ( - curr.width + tar.width ) * p,
      //   				height: curr.height + ( - curr.height + tar.height ) * p,
      //   				zIndex: curr.zIndex + ( - curr.zIndex + tar.zIndex ) * p,
      //   				left: curr.left + ( tar.left - curr.left ) * p,
      //   				top: curr.top + vy * d + 1 / 2 * a * d * d 
      //   			}

      //   			// fix overflow
      //   			if( d / time > 0.3 ){
      //   				$wrap.css('overflow' , 'visible');
      //   			}

      //   			$ball.css( status );
      //   			var r = "rotate(" + parseInt( curr.rotate + ( tar.rotate - curr.rotate ) * p ) + 'deg)';
      //   			$ball[0].style['-webkit-transform'] = r;
      //   			$ball[0].style['-ms-transform'] = r;
      //   			$ball[0].style['-moz-transform'] = r;
      //   			$ball[0].style['-o-transform'] = r;
      //   			setTimeout( animate , 1000 / 60 );
      //   		} , 1000/60);
    		// },

            getDistance: function( pos1 , pos2 ){
                return Math.sqrt( Math.pow( pos1.left - pos2.left , 2 ) + Math.pow( pos1.top - pos2.top , 2 ) );
            },

            prepareThrow: function( strPos , tarPos ){
                var dis = gameMgr.getDistance( strPos , tarPos );
                // 距离与速度的关系
                var speed = 1.2 * dis / 300;
                var angle = Math.atan( ( tarPos.top - strPos.top ) / ( tarPos.left - strPos.left ) );
                //var vy = 
                var vx = ( tarPos.left > strPos.left ? 1 : -1 ) * speed * Math.abs( Math.cos( angle ) ) / 3.5;
                var vy = - speed * Math.abs( Math.sin( angle ) );
                return {
                    vx : vx ,
                    vy : vy ,
                    vz : 0.5 ,//+ Math.abs(  3 * vx ),
                    dis: dis
                }
            }
    	}
        

        var $wrap = $('.game-wrap');
        var isGameStart = false;
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
                isGameStart = true;

        	});

        var isMouseDown = false;
        var startPos = null;
        var throwBall = false;
        var minDis  = 100;
        $wrap
            // drag to throw ball
            .on('mousedown' , '.game-ball' , function( ev ){
                if( isGameStart ){
                    isMouseDown = true;
                }
            })
            .on('mousemove.ball-drag' , function( ev ){
                if( !isMouseDown ) return;
                //TODO：： 可以显示 一个蓄力的
            })
            .on('mouseup' , function( ev ){
                if( isMouseDown && !throwBall ){
                    throwBall = true;

                    gameMgr.stopFlicker();
                    $('.game-dir').stop( true , true )
                        .fadeOut();

                    var off = $('.game-ball').offset();
                    var w = $('.game-ball').width();
                    startPos = { left: off.left + w / 2 , top: off.top + w / 2 };
                    gameMgr.throwBall( gameMgr.prepareThrow( startPos , {left: ev.pageX , top: ev.pageY} ) , function(){
                        throwBall = false;
                        $('.game-inner').fadeOut();
                        $('.ques-inner').fadeIn();
                    } , function(){
                        throwBall = false;
                        $('.game-dir').fadeIn();
                    } );
                }
            });
        $(document)
            .on('mouseup' , function( ev ){
                isMouseDown = false;
            });
        
        return gameMgr;
    })();


    gameMgr.start();
})();