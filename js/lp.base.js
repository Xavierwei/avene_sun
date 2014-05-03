/*
 * page base action
 */
LP.use(['jquery' ,'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader','isotope'] , function( $ , api ){
	'use strict'

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > 0;
	var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > 0;
	var isIe6 = navigator.userAgent.toLowerCase().indexOf('msie 6') > 0;
	var windWidth = $(window).width() - 90;
	var $loading = $('.list-loading');
	var isMobile;
    var isComplete = false;

	if(isIpad) {
		$('body').addClass('ipad');
	}

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:autgo!important}"
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

    $('.ft-item3').on('mouseenter',function(){
        $('.ft-weixin-pop').fadeIn();
    });

    $('.ft-item3').on('mouseleave',function(){
        $('.ft-weixin-pop').fadeOut();
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

    LP.action('open_gamerule', function(){
        LP.compile( 'gamerule-template' , {}, function( html ){
            $('body').append(html);
            $('.overlay').fadeIn();
            $('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
        });
    });

	LP.action('open_rule', function(){
		LP.compile( 'rule-template' , {}, function( html ){
			$('body').append(html);
			$('.overlay').fadeIn();
			$('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
		});
	});

	LP.action('pop-tester-list' , function(){
		LP.compile( 'tester-list-template' , {}, function( html ){
			$('body').append(html);
			$('.overlay').fadeIn();
			$('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
		});
	});

	LP.action('show-award' , function(){
		LP.compile( 'award-list-template' , {}, function( html ){
			$('body').append(html);
			$('.overlay').fadeIn();
			$('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
		});
	});

    LP.action('close_pop', function(){
        $('.overlay').fadeOut();
        $('.popup').fadeOut(
            function(){
                $('.overlay,.popup,.symj_popup_wrap').remove();
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
		if($('.game-box3').hasClass('submitting')) {
			return;
		}
		$('.game-box3').addClass('submitting');
		$('.game3-radio').removeClass('game3-radioed');
		$(this).find('.game3-radio').addClass('game3-radioed');
		api.ajax('answer', {answer:data.answer}, function(res){
			$('.game-box3').removeClass('submitting');
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
		$('.game-box7').fadeOut();
        $('.game-box5').fadeOut();
        $('.game-box1').fadeIn();
        if($('html').hasClass('touch')) {
            gameMgr.reset();
        }
    });

    LP.action('game_share', function(){
        $('.game-box4').fadeOut();
        $('.game-box6').fadeIn();

        ga('send', 'suncare', 'game', 'share', 'share');
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
		var tel_exp = /^1\d{10}$/;
		var tel2_exp = /^0\d{2,3}-?\d{7,8}$/;
		if(!tel_exp.test(tel) && !tel2_exp.test(tel)) {
            validate = false;
            $('.tester-error-tel').fadeIn();
        }

        if(!validate) {
            return;
        }

        ga('send', 'suncare', 'etrial', 'submit', 'submit');
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
        var address = $('#game-form input[name="address"]').val();
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
		var tel_exp = /^1\d{10}$/;
        if(!tel_exp.test(tel)) {
            validate = false;
            $('.game6-error-tel').fadeIn();
        }
        if(address == '') {
            validate = false;
            $('.game6-error-address').fadeIn();
        }
        if(!validate) {
            return;
        }

        ga('send', 'suncare', 'game', 'submit', 'submit');
		$(this).addClass('submitting');
        api.ajax('game', {name:name, email:email, tel:tel, address:address}, function(res){
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

            $('#photo_item_'+data.pid).find('.like_btn').addClass('liked');
            $('#photo_item_'+data.pid).find('.like_num').html(result.data);

            (function(){
                var nodes = $('#wall-list').data('nodes');
                if(nodes) {
                    var node = jQuery.grep(nodes, function (node) {
                        if(node.pid == data.pid) {
                            return node;
                        }
                    });
                    if(node.length > 0) {
                        node[0].like = result.data;
                        node[0].liked = true;
                    }
                }
            })();

			// add like status to cookie
			var liked = LP.getCookie('_led') || '';
			liked = liked ? liked.split(',') : [];
			liked.push( data.pid );
			LP.setCookie( '_led' , liked.join(',') , 86400 * 365 );
        });
    });


    $(window).resize(function(){
        var $symj_popup = $('.photo_item_pop');
        if($symj_popup.length == 0) return;
        var src = $('.photo_item_pop img').attr('src');
        var $img = $('.photo_item_pop img');
        var $imgload = $('#imgload');
        $imgload.attr('src',src);
        var imgWidth = $imgload.width();
        var imgHeight = $imgload.height();
        var ratio = imgWidth/imgHeight;
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        var maxHeight = winHeight - 250;
        var maxWidth = winWidth - 150;
        if(imgHeight > maxHeight) {
            imgHeight = maxHeight;
        }
        if(imgWidth > maxWidth) {
            imgWidth = maxWidth;
        }
        if(winWidth <= 640)
        {
            if(ratio >= 1) {
                imgHeight = imgWidth / ratio;
            }
            else {
                imgWidth = imgHeight * ratio;
            }
            $img.height(imgHeight).width(imgWidth);
            $symj_popup.css({width:imgWidth});
            var boxHeight = $symj_popup.height()+50;
            $symj_popup.css({'margin-top':-boxHeight/2, 'margin-left':-(imgWidth/2)-20});
        }
        else
        {
            imgWidth = imgHeight * ratio;
            $img.height(imgHeight).width(imgWidth);
            $symj_popup.css({width:imgWidth});
            var boxHeight = $symj_popup.height()+50;
            $symj_popup.css({'margin-top':-boxHeight/2, 'margin-left':-imgWidth/2});
        }
    });

	var _currentNodeIndex = 0;
	LP.action('node', function(){
        if($('.symj_popup_wrap').length > 0) {
            return;
        }
		_currentNodeIndex = $(this).prevAll().length;
		var nodes = $('#wall-list').data('nodes');
		var node = nodes[ _currentNodeIndex ];
		node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23');
		LP.compile( 'node-zoom-template' , node , function( html ){

			$('body').append(html);
            $('.overlay').fadeIn();
			var $symj_popup = $('.photo_item_pop').css('opacity',0);
			var $img = $('.photo_item_pop img');
			$img.ensureLoad(function(){
				$(window).trigger('resize');
				if(isIe6) {
					var top = $(window).scrollTop() +  $(window).height()/2;
				}
				else {
					top = '50%';
				}
				$symj_popup.fadeIn().animate({opacity:1,top:top},800,'easeOutQuart');
				$('.symj_popup_loading').fadeOut();
				preLoadImage(nodes);
			});
		});
	});

	LP.action('winner_node', function(){

		var node = $(this).parents('.winner-list').data('node')[0];
		node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23');
		LP.compile( 'node-zoom-template' , node , function( html ){

			$('body').append(html);
			$('.overlay').fadeIn();
			var $symj_popup = $('.photo_item_pop').css('opacity',0);
			var $img = $('.photo_item_pop img');
			$img.ensureLoad(function(){
				$(window).trigger('resize');
				if(isIe6) {
					var top = $(window).scrollTop() +  $(window).height()/2;
				}
				else {
					top = '50%';
				}
				$symj_popup.fadeIn().animate({opacity:1,top:top},800,'easeOutQuart');
				$('.symj_popup_loading').fadeOut();
				preLoadImage(nodes);
			});
		});
	});

	//for next action
	LP.action('next' , function( data ){
		_currentNodeIndex++;
		var nodes = $('#wall-list').data('nodes');
		var node = nodes[ _currentNodeIndex ];
		if( node ){
			$('.photo_item_pop').animate({left:'-50%'},400,'easeInQuart',function(){
				$(this).remove();
				node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23');
				LP.compile( 'node-zoom-template' , node , function( html ){
					$('.symj_popup_wrap').append($(html).find('.photo_item_pop'));
					$('.symj_popup_loading').fadeIn();
					var $symj_popup = $('.photo_item_pop').css({'top':'50%', 'left':'100%', 'opacity':0});
                    var $img = $('.photo_item_pop .symj_img img');
					$img.ensureLoad(function(){
						$(window).trigger('resize');
						$symj_popup.fadeIn().animate({opacity:1, left:'50%'},300,'easeOutQuart');
						$('.symj_popup_loading').fadeOut();
						preLoadImage(nodes);
					});
				});
			});
		}
	});

	//for prev action
	LP.action('prev' , function( data ){
		_currentNodeIndex--;
		var nodes = $('#wall-list').data('nodes');
		var node = nodes[ _currentNodeIndex ];
		if( node ){
			$('.photo_item_pop').animate({left:'150%'},400,'easeInQuart',function(){
				$(this).remove();
				node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23');
				LP.compile( 'node-zoom-template' , node , function( html ){
					$('.symj_popup_wrap').append($(html).find('.photo_item_pop'));
					$('.symj_popup_loading').fadeOut();
					var $symj_popup = $('.photo_item_pop').css({'top':'50%', 'left':'-50%', 'opacity':0});
					var $img = $('.photo_item_pop .symj_img img');
					$img.ensureLoad(function(){
						$(window).trigger('resize');
						$symj_popup.fadeIn().animate({opacity:1, left:'50%'},300,'easeOutQuart');
						$('.symj_popup_loading').fadeOut();
						preLoadImage(nodes);
					});
				});
			});
		}
	});

	var preLoadImage = function(nodes){
		for( var i = 0 ; i < 4 ; i++ ){
			if( nodes[ _currentNodeIndex - i ] ){
				$('<img/>').attr('src' , './api' + nodes[ _currentNodeIndex - i ].image);
			}
			if( nodes[ _currentNodeIndex + i ] ){
				$('<img/>').attr('src' , './api' + nodes[ _currentNodeIndex + i ].image);
			}
		}
	}

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
                var zDis = 400;
                var a = 0.0018 ;

                var wrapOff = $('.game-wrap').offset();
                // var a = ( ( tar.top - curr.top ) - vy * time ) * 2 / time / time ;

                var startTime = new Date();
                var $stars = $('.game-tar1,.game-tar2,.game-tar3');
                var centers = [];
                $stars.each( function(){
                    var off = $(this).offset();
                    var width = $(this).width();
                    centers.push( {top: off.top + width / 2 , left: off.left + width / 2} );
                });
                setTimeout(function animate(){
                    var d = new Date() - startTime;

                    //var p = d / time;
                    var w = curr.width - ( vz * d / zDis * 100 );
                    var status = {
                        width: w,
                        height: w,
                        zIndex: curr.zIndex - ( vz * d / zDis * 100 ) ,
                        left: curr.cx + vx * d - w / 2 ,
                        top: curr.cy - w / 2 +  vy * d + 1 / 2 * a * d * d
                    }
                    $ball.css( status );
                    if( vz * d >= zDis - 100 ){
                        //判断是否相交
                        var meetIndex = 0;
                        var meetDis = 0;
                        $.each( centers , function( i , pos ){
                            var dis = gameMgr.getDistance( pos , {left: wrapOff.left + status.left + status.width / 2 , top: wrapOff.top + status.top + status.height / 2} );

                            if( dis < ( 108 + w ) / 2 ){
                                meetDis = meetDis || dis;
                                if( meetDis >= dis ){
                                    meetDis = dis;
                                    meetIndex = i + 1;
                                }
                            }
                        });
                        if( meetIndex ){
                            $('.game-wrap').css('overflow' , 'hidden');
                            success && success( meetIndex );
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
                var speed = 1.2 * dis / 330;
                var angle = Math.atan( ( tarPos.top - strPos.top ) / ( tarPos.left - strPos.left ) );
                //var vy =
                var vx = ( tarPos.left > strPos.left ? 1 : -1 ) * speed * Math.abs( Math.cos( angle ) ) / 2.8;
                var vy = - speed * Math.abs( Math.sin( angle ) );
                return {
                    vx : vx ,
                    vy : vy ,
                    vz : 0.54 / Math.max( Math.pow( vy * vy , 2 / 3 ) , 1 ),
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

                    gameMgr.throwBall( gameMgr.prepareThrow( gameMgr.getBallCenter() , gameMgr.getEventCenter(ev) ) , function( index ){
                        throwBall = false;

                        // change code here
                        //====================================================

                        $('.game-tar'+(index)).fadeOut();
                        $('.game-ball').fadeOut();
                        setTimeout(function(){
                            $('.game3-radio').removeClass('game3-radioed');
                            $('.game-box1').fadeOut();
                            $('.game-box3').fadeIn();
                            $('.game3').hide();
							var rid = parseInt(Math.random()*3+1);
                            $('.game3-'+(rid)).show();
                            ga('send', 'event', 'game', 'played', 'played');
                        },1000);

                        $('.game-ball')
                            .animate( {
                                top: 264
                            } , 500 )
                            [0].style.cssText = 'top: 370px;';

                        //====================================================
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
        if(isComplete) return;
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
                    isComplete = true;
                }
            },
            onComplete : function(){
                complete();
            }
        });

        LP.use(['jscrollpane' , 'mousewheel'] , function(){
            $('.testerpop-tablelist').jScrollPane({autoReinitialise:true}).bind(
                'jsp-scroll-y',
                function(event, scrollPositionY, isAtTop, isAtBottom)
                {
                    
                }
            );
        });
    }



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
        ga('send', 'event', 'nav', 'nav1', 'nav1');
    });

    $('.nav2').bind('click',function(){
        ga('send', 'event', 'nav', 'nav2', 'nav2');
    });

    $('.nav3').bind('click',function(){
        ga('send', 'event', 'nav', 'nav3', 'nav3');
    });

    $('.nav4').bind('click',function(){
        ga('send', 'event', 'nav', 'nav4', 'nav4');
    });

    $('.nav5').bind('click',function(){
        ga('send', 'event', 'nav', 'nav5', 'nav5');
    });

    $('.nav6').bind('click',function(){
        ga('send', 'event', 'nav', 'nav6', 'nav6');
    });

    $('.nav7').bind('click',function(){
        ga('send', 'event', 'nav', 'nav7', 'nav7');
    });

    $('.home-vdbox').bind('click',function(){
        ga('send', 'event', 'home', 'video', 'video');
    });

    $('.home-vbtn1').bind('click',function(){
        ga('send', 'event', 'home', 'game', 'game');
    });

    $('.home-vbtn2').bind('click',function(){
        ga('send', 'event', 'home', 'etrial ', 'etrial ');
    });

    $('.ft-gw').bind('click',function(){
        ga('send', 'event', 'bottom', 'avene', 'avene');
    });

    $('.ft-btn1').bind('click',function(){
        ga('send', 'event', 'bottom', 'weibo', 'weibo');
    });

    $('.ft-btn2').bind('click',function(){
        ga('send', 'event', 'bottom', 'doctor', 'doctor');
    });

    $('.ft-submit').bind('click',function(){
        ga('send', 'event', 'bottom', 'newsletter', 'newsletter');
    });

    $('.page2video-demo').bind('click',function(){
        ga('send', 'event', 'reflexe', 'video', 'video');
    });

    $('.page2pro-link').bind('click',function(){
        ga('send', 'event', 'reflexe', 'award', 'award');
    });

    $('.page3-video').bind('click',function(){
        ga('send', 'event', 'family', 'video', 'video');
    });

    $('.page3-otherpro1 .page3intro-learnmore').bind('click',function(){
        ga('send', 'event', 'family', 'learnmore1', 'learnmore1');
    });

    $('.page3-otherpro2 .page3intro-learnmore').bind('click',function(){
        ga('send', 'event', 'family', 'learnmore2', 'learnmore2');
    });


    init();



    // test demo
    // if page 8 , need to get award users
    if( $('#winner-list').length ){
		// share winner
    	api.ajax('awardList', {pid: $('#winner-list1').data('pid')}, function( result ){
			$('#winner-list1').data('node', result.data);
    		$.each( result.data ,  function( i , node ){
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

				//
				node.is_share = true;
	    		LP.compile( "node-winner-template" , node , function( html ){
	    			$('#winner-list1').append( html );
	    		} );	
	    	});
        });

		// hot winner
		api.ajax('awardList', {pid: $('#winner-list2').data('pid')}, function( result ){
			$('#winner-list2').data('node', result.data);
			$.each( result.data ,  function( i , node ){
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

				//
				node.is_share = false;
				LP.compile( "node-winner-template" , node , function( html ){
					$('#winner-list2').append( html );
				} );
			});
		});
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
	var rid = parseInt(Math.random()*3+1);
	$('.game3-radio').removeClass('game3-radioed');
    $('.game-box1').fadeOut();
    $('.game-box3').fadeIn();
	$('.game3').hide();
	$('.game3-'+(rid)).show();
    ga('send', 'event', 'game', 'played', 'played');
}