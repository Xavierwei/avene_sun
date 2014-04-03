/*
 * page base action
 */
LP.use(['jquery', 'isotope', 'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader'] , function( $ , api ){
    'use strict'



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