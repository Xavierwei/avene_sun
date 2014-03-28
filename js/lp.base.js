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

	var sideDirection;
    if($('html').hasClass('touch')) {
        $('body').hammer()
            .on("release dragleft dragright swipeleft swiperight", function(ev) {
                switch(ev.type) {
                    case 'swipeleft':
                        break;
                    case 'dragleft':
                        sideDirection = 'right';
                        $('body').bind('touchmove', function(e){e.preventDefault()});
                        break;
                    case 'swiperight':
                        break;
                    case 'dragright':
                        sideDirection = 'left';
                        $('body').bind('touchmove', function(e){e.preventDefault()});
                        break;
                    case 'release':
                        $('body').unbind('touchmove');
                        if(sideDirection && !$('.inner').is(':visible') || sideDirection == 'right' && !$('.side').hasClass('closed')) {
                            if(Math.abs(ev.gesture.deltaX) < 160 && sideDirection == 'left') {
                                return;
                            }
                            LP.triggerAction('toggle_side_bar', sideDirection);
                            sideDirection = '';
                        }
                        break;
                    default:
                        sideDirection = '';
                }
            }
        );
    }


    $('body').delegate('video','click',function(){
        $(this)[0].pause();
    });




  	$('.mobile_nav a').on('click', function(e){
		e.preventDefault();
        if($(this).hasClass('mshare')) return;
		LP.triggerAction('toggle_side_bar', 'left');
		var _this = $(this);
		setTimeout(function(){
			var href = _this.attr('href');
			window.location = href;
		}, 700);

	});


    if($('body').hasClass('video-page')) {
        if($('html').hasClass('video') && !isFirefox) {
            LP.compile( 'html5-player-template' , {} , function( html ){
                $('.page1video').html(html);
                if($(window).width() <= 640) {
                    $('.page1video video').attr('poster', './imgMobile/page1video.jpg');
					if(isIphone) {
						$('.page1video video').width(640).height(360);
					}
                }
                else {
                    LP.use('video-js' , function(){
                        videojs( "inner-video" , {}, function(){
                            if(getQueryString('video')) {
                                $('video').attr('autoplay','autoplay');
                            }
                            $('.vjs-big-play-button').on('click',function(){
                                $('video').attr('poster','');
                            });

                            $('video').on('ended', function(){
                                $('.vjs-poster').show();
                                $(window).trigger('resize');
                            });
                        });
                    });
                }
            });
        }
        else {
            if(getQueryString('video')) {
                LP.compile( 'flash-player-auto-template' , {} , function( html ){
                    $('.page1video').html(html);
                    var height = $(window).width()*0.9 / (1280/720);
                    $('.page1video').height(height);
                });
            }
            else {
                LP.compile( 'flash-player-template' , {} , function( html ){
                    $('.page1video').html(html);
                    var height = $(window).width()*0.9 / (1280/720);
                    $('.page1video').height(height);
                });
            }

        }
    }


    $(window).resize(function(){
        var height = $(window).width()*0.9 / (1280/720);
        $('.page1video, .vjs-poster').height(height);
    });


	LP.action('toggle_side_bar', function(type){
		var $side = $('.mobile_options');
		var $wrap = $('.wrap');
		if($side.hasClass('moving')) return;
		$side.addClass('moving');
		setTimeout(function(){
			$side.removeClass('moving');
		}, 800);
		if(typeof type == 'string') {
			if(type == 'right') {
				if(!$side.hasClass('closed')) return;
				$side.css({x:windWidth+3}).show().removeClass('closed').transit({x:0}, 500);
				$wrap.transit({x:-windWidth}, 500);
			}
			else {
				$side.addClass('closed').transit({x:windWidth+3}, 500);
				$wrap.transit({x:0}, 500);
			}
		}
		else {
			if($side.hasClass('closed')) {
				$side.css({x:windWidth+3}).show().removeClass('closed').transit({x:0}, 500);
				$wrap.transit({x:-windWidth}, 500);
			}
			else {
				$side.addClass('closed').transit({x:windWidth+3}, 500);
				$wrap.transit({x:0}, 500);
			}
		}
	});

	LP.action('toggle_share', function(){
		$('.mobile_share').fadeIn();
	});

    LP.action('open_more_info', function(){
        $('.page2share').fadeIn();
        $('.pop-rule').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 500, 'easeOutQuart');
    });

    LP.action('share_weixin', function(){
        $('.page2share').fadeIn();
        $('.pop-weixin').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 500, 'easeOutQuart');
    });

    LP.action('close_popup', function(){
        $('.page2share').fadeOut();
        $('.page2pop').fadeOut();
    });



    var init = function(){
        $(document.body).queryLoader2({
            onLoading : function( percentage ){
                var per = parseInt(percentage);
                $('.loading-percentage').html(per+'%');
                $('.loading-line').css({'width':per+'%'});
            },
            onComplete : function(){
                $('.hide-bar').hide();
                $('.page3-background-cover').delay(400).fadeOut();
                $('.page-wrap').fadeIn(600);
                $('.nav').fadeIn(600);
                $('.share').fadeIn(600);
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

                var timeoffset = isUglyIe?0:0;
                setTimeout(function(){
                    var s = skrollr.init({
                        smoothScrollingDuration:200,
                        smoothScrolling:true
                    });

                },timeoffset);
            }
        });
    }

    if(!$('html').hasClass('touch')) {
        init();
        $('.header .logo img').ensureLoad(function(){
            $(this).fadeIn(1000);
        });
    }


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


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }



});


