/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader'] , function( $ , api ){
    'use strict'

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > 0;
	var windWidth = $(window).width() - 90;

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }
    
    $(window).bind('orientationchange', function() {
        var o = window.orientation;

        if (o != 90 && o != -90) {
            $('.turn_device').hide();
        } else {
            $('.turn_device').show();
        }
    });

	$('body').on('click', function(e){
		if(!$('html').hasClass('touch')) {
			return;
		}
		var $target = $(e.target);
		if($target.hasClass('navbtn')) {
			return;
		}
		else {
			$('.nav').fadeOut();
		}
	});

	LP.action('toggle_nav', function(){
		if(!$('.nav').is(':visible')) {
			$('.nav').fadeIn();
		}
		else {
			$('.nav').fadeOut();
		}
	});

    LP.action('close_popup', function(){
        $('.page2share').fadeOut();
        $('.page2pop').fadeOut();
    });

    LP.action('open_home_video', function(){
		var flash = true;
		if($('html').hasClass('touch')) {
			flash = false;
		}
        LP.compile( 'flash-player-template' , {flash: flash}, function( html ){
            $('body').append(html);
            $('.overlay').fadeIn();
            $('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
			if(flash) {
				$('.video-player').css({opacity:0});
			}
        });
    });

    LP.action('close_pop', function(){
        $('.overlay').fadeOut();
        $('.popup').fadeOut(
            function(){
                $('.overlay,.popup').remove();
            }
        );
    });

    LP.action('expand_video', function(){
		$(this).fadeOut(100);
		var flash = true;
		if($('html').hasClass('touch')) {
			flash = false;
		}
		if(flash) {
			$('.page3-video').animate({height:535}, 800, 'easeOutQuart');
		}
		else {
			$('.page3-video').animate({height:360}, 800, 'easeOutQuart');
		}
        LP.compile( 'flash-player-template' , {flash: flash} , function( html ){
            $('.page3-video').append(html);
            $('.page3-video .video-player').delay(800).fadeIn(500);
			if(flash) {
				$('.video-player').css({opacity:0});
			}
        });
    });

    $('#newsletter-email').on('keyup', function(e){
        if(e.keyCode == 13) {
            LP.triggerAction('newsletter_submit');
        }
    });

	LP.action('newsletter_m', function(){
		if($(window).width() <= 640) {
			$(this).css('background','none');
			$('#newsletter-email').show();
			$('.ft-submit').show();
		}

	});

    LP.action('newsletter_submit', function(){
        $('.ft-item4 .error').fadeOut();
        var email = $('#newsletter-email').val();
        var exp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\_|\.]?)*[a-zA-Z0-9]+\.(.*?)$/;
        if (!exp.test(email)) {
            $('.ft-item4 .error').fadeIn();
        }
        else
        {
            api.ajax('newsletter', {email:email}, function(res){
            }, function(){
            }, function(res){
                if(res == 'state0') {
                    var status = 'success';
                }
                else {
                    var status = 'failed';
                }
                LP.compile( 'newsletter-pop-template' , {status:status} , function( html ){
                    $('body').append(html);
                    $('.overlay').fadeIn();
                    $('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
                });
            });
        }
    });


    LP.action('game_answer', function(data){
		$('.game3-radio').removeClass('game3-radioed');
		$(this).find('.game3-radio').addClass('game3-radioed');
		api.ajax('answer', {answer:data.answer}, function(res){
			$('.game-box3').fadeOut();
			if(res == '1') {
				$('.game-box4').fadeIn();
			}
			else {
				$('.game-box5').fadeIn();
			}
		});

    });

    LP.action('game_again', function(){
        $('.game-box5').fadeOut();
        $('.game-box1').fadeIn();
        if($('html').hasClass('touch')) {
            gameMgr.reset();
        }
    });

    LP.action('game_share', function(){
        $('.game-box4').fadeOut();
        $('.game-box6').fadeIn();
    });

    LP.action('etrial_submit', function(){
        if($(this).hasClass('submitting')) {
            return;
        }
        var name = $('#etrial-form input[name="name"]').val();
        var address = $('#etrial-form input[name="address"]').val();
        var tel = $('#etrial-form input[name="tel"]').val();
        var validate = true;
        $('.page6-error').fadeOut();
        if(name == '') {
            validate = false;
            $('.page6-error-name').fadeIn();
        }
        if(address == '') {
            validate = false;
            $('.page6-error-address').fadeIn();
        }
        if(tel == '') {
            validate = false;
            $('.page6-error-tel').fadeIn();
        }

        if(!validate) {
            return;
        }

        $(this).addClass('submitting');
        api.ajax('trial', {name:name, address:address, tel:tel}, function(res){
            $(this).removeClass('submitting');
            if(res == '1') {

            }
        });
    });

    LP.action('game_submit', function(){
		if($(this).hasClass('submitting')) {
			return;
		}
        var name = $('#game-form input[name="name"]').val();
        var email = $('#game-form input[name="email"]').val();
        var tel = $('#game-form input[name="tel"]').val();
        var validate = true;
        $('.game6-error').fadeOut();
        if(name == '') {
            validate = false;
            $('.game6-error-name').fadeIn();
        }
        var exp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\_|\.]?)*[a-zA-Z0-9]+\.(.*?)$/;
        if(!exp.test(email)) {
            validate = false;
            $('.game6-error-email').fadeIn();
        }
        if(tel == '') {
            validate = false;
            $('.game6-error-tel').fadeIn();
        }

        if(!validate) {
            return;
        }

		$(this).addClass('submitting');
        api.ajax('game', {name:name, email:email, tel:tel}, function(res){
			$(this).removeClass('submitting');
            if(res == '1') {
				$('.game-box6').fadeOut();
				$('.game-box7').fadeIn();
			}
        });
    });


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
                // // run animate
                var $ball = $('.game-ball');

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
                    if( vz * d >= zDis + 50 && vz * d <= zDis + 170 ){
                        //判断是否相交
                        var isMeet = false;
                        var index;
                        $.each( centers , function( i , pos ){
                            var dis = gameMgr.getDistance( pos , {left: status.left + status.width / 2 , top: status.top + status.width / 2} );
                            if( dis < 100 ){
                                isMeet = true;
                                index = i;
                                return false;
                            }
                        });
                        if( isMeet ){
                            $('.game-wrap').css('overflow' , 'hidden');
                            success && success(index);
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

                    $ball.css( status );
                    if( status.top < $('.game-wrap').offset().top ){
                        $('.game-wrap').css('overflow' , 'visible');
                    } else {
                        $('.game-wrap').css('overflow' , 'hidden');
                    }
                    var r = "rotate(" + parseInt( curr.rotate + d / 1000 * 360 ) + 'deg)';
                    $ball[0].style['-webkit-transform'] = r;
                    $ball[0].style['-ms-transform'] = r;
                    $ball[0].style['-moz-transform'] = r;
                    $ball[0].style['-o-transform'] = r;
                    setTimeout( animate , 1000 / 60 );
                } , 1000 / 60);
            },


            getDistance: function( pos1 , pos2 ){
                return Math.sqrt( Math.pow( pos1.left - pos2.left , 2 ) + Math.pow( pos1.top - pos2.top , 2 ) );
            },
            getBallCenter: function(){
                var off = $('.game-ball').offset();
                var w = $('.game-ball').width();
                return { left: off.left + w / 2 , top: off.top + w / 2 };
            },
            getEventCenter: function( ev ){
                var px = isTouchSupport ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
                var py = isTouchSupport ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
                return {left: px , top: py};
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
        var throwBall = false;
        var minDis  = 100;
        var isTouchSupport = "createTouch" in document ;
        $wrap
            // drag to throw ball
            .on( isTouchSupport ? 'touchstart' : 'mousedown' , '.game-ball' , function( ev ){
                if( isGameStart ){
                    isMouseDown = true;
                }
            })
            .on( isTouchSupport ? 'touchmove' : 'mousemove.ball-drag' , function( ev ){
                if( !isMouseDown ) return;
                var dis = gameMgr.getDistance( gameMgr.getBallCenter() , gameMgr.getEventCenter(ev) );

                $('.game-power').html( 'power :' + ~~dis );
                return false;
            })
            .on( isTouchSupport ? 'touchend' : 'mouseup' , function( ev ){
                if( isMouseDown && !throwBall ){
                    var pdata = gameMgr.prepareThrow( gameMgr.getBallCenter() , gameMgr.getEventCenter(ev) );
                    if( pdata.dis < 150 ){ return ;}
                    throwBall = true;
                    gameMgr.stopFlicker();
                    $('.game-dir').stop( true , true )
                        .fadeOut();

                    gameMgr.throwBall( gameMgr.prepareThrow( gameMgr.getBallCenter() , gameMgr.getEventCenter(ev) ) , function(index){
                        throwBall = false;

                        $('.game-tar'+(index+1)).fadeOut();

                        $('.game3-radio').removeClass('game3-radioed');
                        $('.game-box1').fadeOut();
                        $('.game-box3').fadeIn();
                        $('.game3').hide();
                        $('.game3-'+(index+1)).show();

                        $('.game-ball')
                            .animate( {
                                top: 264
                            } , 500 )
                            [0].style.cssText = 'top: 370px;';
                        // $('.game-inner').fadeOut();
                        // $('.ques-inner').fadeIn();
                    } , function(){
                        throwBall = false;
                        $('.game-dir').fadeIn();
                    } );
                }
            });
        $(document)
            .on( isTouchSupport ? 'touchend' : 'mouseup' , function( ev ){
                isMouseDown = false;
            });

        return gameMgr;
    })();

    var init = function(){
        $(document.body).queryLoader2({
            onLoading : function( percentage ){
                var per = parseInt(percentage);
                $('.loading-percentage').html(per+'%');
                $('.loading-bar').css({'width':per+'%'});
            },
            onComplete : function(){
                $('.loading-wrap').fadeOut();

                /* for animation */
                var isUglyIe = $.browser.msie && $.browser.version <= 8;
                if(isUglyIe && $('#scheme').length > 0)
                    return;
                var ANIMATE_NAME = "data-animate";
                $('[' + ANIMATE_NAME + ']')
                    .each(function(){
                        var $dom = $(this);
                        var tar = $dom.data('animate');
                        var browser = $dom.data('browser');
                        var style = $dom.data('style');
                        var time = parseInt( $dom.data('time') );
                        var delay = $dom.data('delay') || 0;
                        var easing = $dom.data('easing');
                        var begin = $dom.data('begin');
                        tar = tar.split(';');
                        var tarCss = {} , tmp;
                        if(browser == 'uglyie' && isUglyIe) {
                            return;
                        }
                        for (var i = tar.length - 1; i >= 0; i--) {
                            tmp = tar[i].split(':');
                            if( tmp.length == 2 )
                                tarCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && tarCss.opacity !== undefined ){
                            delete tarCss.opacity;
                        }


                        style = style.split(';');
                        var styleCss = {} , tmp;
                        for (var i = style.length - 1; i >= 0; i--) {
                            tmp = style[i].split(':');
                            if( tmp.length == 2 )
                                styleCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && styleCss.opacity !== undefined ){
                            delete styleCss.opacity;
                        }
                        $dom.css(styleCss).delay( delay )
                            .animate( tarCss , time , easing );
                        if( begin ){
                            setTimeout(function(){
                                animation_begins[begin].call( $dom );
                            } , delay);
                        }
                    });

                var autoplay = getQueryString('autoplay');
                if(autoplay) {
                    LP.triggerAction('open_home_video');
                }

                var timeoffset = isUglyIe?0:0;
                setTimeout(function(){
					if($('html').hasClass('touch')) {
						return;
					}
                    var s = skrollr.init({
                        smoothScrollingDuration:200,
                        smoothScrolling:true,
                        forceHeight: false
                    });

                },timeoffset);
            }
        });
    }

	init();
    if($('html').hasClass('touch')) {
        gameMgr.start();
    }

	$('.header .logo img').ensureLoad(function(){
		$(this).fadeIn(1000);
	});


    jQuery.fn.extend({
        ensureLoad: function(handler) {
            return this.each(function() {
                if(this.complete) {
                    handler.call(this);
                } else {
                    $(this).load(handler);
                }
            });
        }
    });

    var getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

});

function play(){
	$('.video-player').delay(400).animate({opacity:1});
}


function playComplete(){
    LP.triggerAction('close_pop');
    $('.video-player').fadeOut();
    $('.page3-video').animate({height:139});
	$('.page3-video .video-img').fadeIn();
}


function hit(id){
	$('.game3-radio').removeClass('game3-radioed');
    $('.game-box1').fadeOut();
    $('.game-box3').fadeIn();
	$('.game3').hide();
	$('.game3-'+(id+1)).show();
}