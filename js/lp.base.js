/*
 * page base action
 */
LP.use(['jquery' ,'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader','isotope'] , function( $ , api ){
	'use strict'

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > 0;
	var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > 0;
	var windWidth = $(window).width() - 90;
	var $loading = $('.list-loading');
	var isMobile;

	if(isIpad) {
		$('body').addClass('ipad');
	}

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

	$(window).bind('resize', function() {
		if($(window).width() <= 640) {
			isMobile = true;
			$('.photo_item img').width(297).height('auto');
		}
		else {
			$('.photo_item img').width(225).height('auto');
		}
	});
	$(window).trigger('resize');
    
    $(window).bind('orientationchange', function() {
        var o = window.orientation;
		if(!isIpad) {
			if (o != 90 && o != -90) {
				$('.turn_device').hide();
			} else {
				$('.turn_device').show();
			}
		}
		else{
			if (o != 90 && o != -90) {
				$('meta[name=viewport]').attr('content','width=1000, minimum-scale=0.77, maximum-scale=0.77, target-densityDpi=290,user-scalable=no');
			} else {
				$('meta[name=viewport]').attr('content','width=1000, minimum-scale=1, maximum-scale=1, target-densityDpi=290,user-scalable=no');
			}
		}
    });
	$(window).trigger('orientationchange');

	$('body').on('click', function(e){
		if(!$('html').hasClass('touch') || isIpad) {
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

	LP.action('open_rule', function(){
		LP.compile( 'rule-template' , {}, function( html ){
			$('body').append(html);
			$('.overlay').fadeIn();
			$('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
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

	$('#etrial-form input[name="address"]').on('keyup', function(e){
		if(e.keyCode == 13) {
			LP.triggerAction('etrial_submit');
		}
	});

    LP.action('etrial_submit', function(){
        if($(this).hasClass('submitting')) {
            return;
        }
        var name = $('#etrial-form input[name="name"]').val();
        var address = $('#etrial-form input[name="address"]').val();
        var tel = $('#etrial-form input[name="tel"]').val();
        var validate = true;
        $('.tester-error').fadeOut();
        if(name == '') {
            validate = false;
            $('.tester-error-name').fadeIn();
        }
        if(address == '') {
            validate = false;
            $('.tester-error-address').fadeIn();
        }
        if(tel == '') {
            validate = false;
            $('.tester-error-tel').fadeIn();
        }

        if(!validate) {
            return;
        }

        $(this).addClass('submitting');
        api.ajax('trial', {name:name, address:address, tel:tel}, function(res){
            $(this).removeClass('submitting');
            if(res == '1') {
				$('.testerform-step1').fadeOut();
				$('.testerform-step2').fadeIn();
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

	LP.action('load_more', function(){
		$loading.fadeIn();
		var pageParam = $('#wall-list').data('param');
		pageParam.page ++;
		$('#symj_list').data('param',pageParam);
		api.ajax('list', pageParam, function( result ){
			$loading.fadeOut();
			nodeActions.inserNode( $('#wall-list') , result.data );
		});
	});

    LP.action('like', function(data) {
		var $this = $(this);
		if($this.hasClass('liked')) {
			return;
		}
        api.ajax('like', {pid: data.pid}, function( result ){
			$this.addClass('liked');
			$this.nextAll('.like_num').html(result.data);

			// add like status to cookie
			var liked = LP.getCookie('_led') || '';
			liked = liked ? liked.split(',') : [];
			liked.push( data.pid );
			LP.setCookie( '_led' , liked.join(',') , 86400 * 365 );
        });
    });


	var nodeActions = {
		prependNode: function( $dom , nodes ){
			var aHtml = [];
			var lastDate = null;
			//var pageParm = $main.data('param'); //TODO:  pageParm.orderby == 'like' || pageParm.orderby == 'random' 此时不显示日历
			nodes = nodes || [];

			// save nodes to cache
			var cache = $dom.data('nodes') || [];
			var lastPid = cache[0].pid;
			var lastNode = getObjectIndex(nodes, 'pid', lastPid);
			var newNodes = nodes.splice(0,lastNode);
			var count = cache.length - newNodes.length;
			cache = cache.splice(0, count);
			for(var i = 0; i < newNodes.length; i++ ) {
				var $items = $dom.find('.photo_item');
				$items.eq($items.length-1).remove();
			}
			$dom.data('nodes' , newNodes.concat( cache ) );
			$.each( newNodes , function( index , node ){
				node.thumb = node.image.replace('.jpg','_thumb.jpg');
				node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23')
				if(node.content.length > 100) {
					node.shortcontent = node.content.substring(0,100)+'...';
				}
				LP.compile( 'node-item-template' ,
					node ,
					function( html ){
						aHtml.push( html );
						if( index == newNodes.length - 1 ){
							// render html
							$dom.prepend(aHtml.join(''));
							$dom.find('.photo_item:not(.reversal)').css({'opacity':0});
							//nodeActions.setItemWidth( $dom );
							nodeActions.setItemReversal( $dom );
						}
					});
			} );
		},

		inserNode: function( $dom , nodes ){
			var aHtml = [];
			var $aHtml = [];
			var lastDate = null;
			//var pageParm = $main.data('param'); //TODO:  pageParm.orderby == 'like' || pageParm.orderby == 'random' 此时不显示日历
			nodes = nodes || [];

			// fix nodes like status
			var cookieLikeStatus = LP.getCookie('_led');
			if( cookieLikeStatus && nodes.length ){
				cookieLikeStatus = cookieLikeStatus.split(',');
				$.each( nodes , function( i , node ){
					if( $.inArray( node.pid , cookieLikeStatus ) !== -1 ){
						node.liked = true;
					}
				} );
			}

			// save nodes to cache
			var cache = $dom.data('nodes') || [];
			$dom.data('nodes' , cache.concat( nodes ) );

			$.each( nodes , function( index , node ){
				node.thumb = node.image.replace('.jpg','_thumb.jpg');
                node.thumb_height = 225 * node.thumb_ratio;
				node.m_thumb_height = 297 * node.thumb_ratio;
				node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23');
				node.shortcontent = linkify(node.content);
				if(node.content.length > 100) {
					node.shortcontent = node.content.substring(0,100)+'...';
				}
				if(isMobile) {
					node.mobile = true;
				}
				LP.compile( 'node-item-template' ,
					node ,
					function( html ){
						aHtml.push( html );
						$aHtml.push( $(html) );
						if( index == nodes.length - 1 ){
							// render html
							//$dom.find('.photo_item:not(.reversal)').css({'opacity':0});
							//nodeActions.setItemWidth( $dom );
							//nodeActions.setItemReversal( $dom );
							if($dom.data('isotope')) {
								$('#wall-list-prepend').append(aHtml);
								var $elems = $('#wall-list-prepend').find('.photo_item');
								$dom.append($elems).isotope('appended', $elems);
							}
							else {
								$dom.append($aHtml);
								$dom.isotope({
									// options
									itemSelector: '.photo_item'
								});
							}

						}
					} );

			} );
		},
		// start pic reversal animation
		setItemReversal: function( $dom ){
			// fix all the items , set position: relative
			$dom.children()
				.css('position' , 'relative');
			// get first time item , which is not opend
			// wait for it's items prepared ( load images )
			// run the animate

			// if has time items, it means it needs to reversal from last node-item element
			// which is not be resersaled
			var $nodes = $dom.find('.photo_item:not(.reversal)');

			var startAnimate = function( $node ){
				$node.css({opacity:0}).addClass('reversal').animate({opacity:1}, 1000);
				setTimeout(function(){
					nodeActions.setItemReversal( $dom );
				} , 100);
			}
			// if esist node , which is not reversaled , do the animation
			if( $nodes.length ){
				startAnimate( $nodes.eq(0) );
			}
		}
	}

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
                var a = 0.00102 ;
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
                    var w = curr.width - ( vz * d / zDis * 80 );
                    var status = {
                        width: w,
                        height: w,
                        zIndex: curr.zIndex - ( vz * d / zDis * 80 ) ,
                        left: curr.cx + vx * d - w / 2 ,
                        top: curr.cy + vy * d - w / 2 + 1 / 2 * a * d * d
                    }
                    if( vz * d >= zDis - 100   && vz * d <= zDis + 400 ){
						//console.log(vz * d);
                        //判断是否相交
                        var isMeet = false;
                        var index;
                        $.each( centers , function( i , pos ){
                            var dis = gameMgr.getDistance( pos , {left: status.left + status.width / 2 , top: status.top + status.width / 2} );
							if( dis < 200 ){
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
                    vx : vx * 0.5,
                    vy : vy * 0.5 ,
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
                    if( pdata.dis < 100 ){ return ;}
                    throwBall = true;
                    gameMgr.stopFlicker();
                    $('.game-dir').stop( true , true )
                        .fadeOut();

                    gameMgr.throwBall( gameMgr.prepareThrow( gameMgr.getBallCenter() , gameMgr.getEventCenter(ev) ) , function(index){
                        throwBall = false;

                        $('.game-tar'+(index+1)).fadeOut();
						$('.game-ball').fadeOut();
						setTimeout(function(){
							$('.game3-radio').removeClass('game3-radioed');
							$('.game-box1').fadeOut();
							$('.game-box3').fadeIn();
							$('.game3').hide();
							$('.game3-'+(index+1)).show();
						},1000);



//                        $('.game-ball')
//                            .animate( {
//                                top: 264
//                            } , 500 )
//                            [0].style.cssText = 'top: 370px;';
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

    var complete = function(){
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


        //photowall
        if($('.page7').length > 0) {
            var pageParam = {page:1,pagenum:12};
            $('#wall-list').data('param',pageParam);
            api.ajax('list', pageParam, function( result ){
                nodeActions.inserNode( $('#wall-list') , result.data );
            });
        }
    }

    var init = function(){
        $(document.body).queryLoader2({
            onLoading : function( percentage ){
                var per = parseInt(percentage);
                $('.loading-percentage').html(per+'%');
                $('.loading-bar').css({'width':per+'%'});
                if(per == 100) {
                    complete();
                }
            },
            onComplete : function(){
                complete();
            }
        });
    }

	init();


    if($('html').hasClass('touch')) {
        gameMgr.start();
    }


    if($('.page7').length > 0) {
        var _scrollTimer = null;
        $(window).scroll(function(){
            // if scroll to the botton of the window
            // ajax the next datas
            var st = $(window).scrollTop();
            var docHeight = $(document).height();
            var winHeight = $(window).height();
            if( docHeight - winHeight - st < 180 ){
                clearTimeout( _scrollTimer );
                _scrollTimer = setTimeout(function(){
                    LP.triggerAction('load_more');
                } , 200);
            }
        });
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

	var linkify = function(inputText) {
		var replacedText, replacePattern1, replacePattern2, replacePattern3;
		var originalText = inputText;

		//URLs starting with http://, https://, file:// or ftp://
		replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/f])(www\.[\S]+(\b|$))/gim;

		replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

		//Change email addresses to mailto:: links.
		replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

		//If there are hrefs in the original text, let's split
		// the text up and only work on the parts that don't have urls yet.
		var count = originalText.match(/<a href/g) || [];

		if(count.length > 0){
			var combinedReplacedText;
			//Keep delimiter when splitting
			var splitInput = originalText.split(/(<\/a>)/g);

			for (i = 0 ; i < splitInput.length ; i++){
				if(splitInput[i].match(/<a href/g) == null){
					splitInput[i] = splitInput[i].replace(replacePattern1, '<a href="$1" target="_blank">$1</a>').replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>').replace(replacePattern3, '<a href="mailto:$1">$1</a>');
				}
			}
			combinedReplacedText = splitInput.join('');
			return combinedReplacedText;
		} else {
			return replacedText;
		}
	}


    // GA Event Tracking
    $('.nav1').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav1', 'nav1');
    });

    $('.nav2').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav2', 'nav2');
    });

    $('.nav3').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav3', 'nav3');
    });

    $('.nav4').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav4', 'nav4');
    });

    $('.nav5').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav5', 'nav5');
    });

    $('.nav6').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav6', 'nav6');
    });

    $('.nav7').bind('click',function(){
        ga('send', 'suncare', 'nav', 'nav7', 'nav7');
    });

    $('.home-vdbox').bind('click',function(){
        ga('send', 'suncare', 'home', 'video', 'video');
    });

    $('.home-vbtn1').bind('click',function(){
        ga('send', 'suncare', 'home', 'game', 'game');
    });

    $('.home-vbtn2').bind('click',function(){
        ga('send', 'suncare', 'home', 'etrial ', 'etrial ');
    });

    $('.ft-gw').bind('click',function(){
        ga('send', 'suncare', 'bottom', 'avene', 'avene');
    });

    $('.ft-btn1').bind('click',function(){
        ga('send', 'suncare', 'bottom', 'weibo', 'weibo');
    });

    $('.ft-btn2').bind('click',function(){
        ga('send', 'suncare', 'bottom', 'doctor', 'doctor');
    });

    $('.ft-submit').bind('click',function(){
        ga('send', 'suncare', 'bottom', 'newsletter', 'newsletter');
    });

    $('.page2video-demo').bind('click',function(){
        ga('send', 'suncare', 'reflexe', 'video', 'video');
    });

    $('.page2pro-link').bind('click',function(){
        ga('send', 'suncare', 'reflexe', 'award', 'award');
    });

    $('.page3-video').bind('click',function(){
        ga('send', 'suncare', 'family', 'video', 'video');
    });

    $('.page3-otherpro1 .page3intro-learnmore').bind('click',function(){
        ga('send', 'suncare', 'family', 'learnmore1', 'learnmore1');
    });

    $('.page3-otherpro2 .page3intro-learnmore').bind('click',function(){
        ga('send', 'suncare', 'family', 'learnmore2', 'learnmore2');
    });

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