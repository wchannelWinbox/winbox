
/* global $, CONFIG */
(function() {
	var RSS  = {"data":[], "lateral":[], "next":[], "index":-1, "timeout":null}, NEWS = {"data":[], "lateral":[], "next":[], "index":-1, "timeout":null};
	
	/** RSS FUNCTIONS **/
	RSS.REFRESH = function() {
		
		/*console.clear();*/ $.getJSON("data/rss2.json?0", function(rss) {
			if( rss.length>0 && CONFIG.channel.rss2[0].enabled != false) {
				console.log('5 rss');
				NEWS.index = -1;
				RSS.next = rss; $("#rss2 [id^=news]").remove(); $("#rss2").show();
				if( !$("#rss2 [id^=rss]").length ) { RSS.NEXT(); }
			}else{
				$("#rss2 [id^=news], #rss2 [id^=rss]").remove(); $("#rss2").hide();
			}
		}).fail(function() { /*console.clear();*/ $("#rss2 [id^=news], #rss2 [id^=rss]").remove(); $("#rss2").hide(); });
	};
	RSS.NEXT = function() {
		if( RSS.next.length>0 ) { RSS.data = RSS.next; RSS.next = []; RSS.index = -1; }
		if( RSS.index==-1 && RSS.data.length==0 ) { RSS.NEXT(); }
		else if( RSS.data.length>RSS.index+1 ) { RSS.index++; }
		else { RSS.index = 0; }
		
		if( $("#rss-" + RSS.index).length ) { $("#rss-" + RSS.index).attr("id", "rss-" + RSS.index + "-1"); }
		$("#rss2").prepend("<div id=\"rss-" + RSS.index + "\" style=\"width:95%;top:60px;\">" + RSS.data[RSS.index] + "</div>");
		$("#rss2 [id^=rss]").animate({"top":"-=60px"}, 1000, function() {
			if( $(this).attr("id")!="rss-"+RSS.index ) { $(this).remove(); }
			else {
				if( parseInt($("#rss2 #rss-" + RSS.index).css("top"), 10)+$("#rss2 #rss-" + RSS.index).height()>60 ) {
					RSS.timeout = setTimeout(RSS.STEP, CONFIG.times.rss_scroll*1000);
				} else { RSS.timeout = setTimeout(RSS.NEXT, CONFIG.times.rss_scroll*1000); }
			}
		});
	};
	RSS.STEP = function() {
		$("#rss2 [id^=rss]").animate({"top":"-=60px"}, 1000, function() {
			if( parseInt($("#rss2 #rss-" + RSS.index).css("top"), 10)+$("#rss2 #rss-" + RSS.index).height()>60 ) {
				RSS.timeout = setTimeout(RSS.STEP, CONFIG.times.rss_scroll*1000);
			} else { RSS.timeout = setTimeout(RSS.NEXT, CONFIG.times.rss_scroll*1000); }
		});
	};

	RSS.LATERAL = function() {
		
		/*console.clear();*/ $.getJSON("data/rss_string2.json?0", function(rss) {
			if(RSS.lateral != rss){
				RSS.lateral = rss;
				coloso = 0;
			}else{
				coloso = 1;
			}
			console.log('7 rss');
			if( RSS.lateral != '' && CONFIG.channel.rss2[0].enabled != false ) {
				
				if (coloso == 0 || !$("#rss2").is(":visible") || $("#rss2 [id^=rss-]").length) {
					$("#rss2 [id^=rss]").remove()
					$("#rss2").prepend("<div id=\"rssstring-" + 1 + "\" style=\"width:95%;top:0px;\"><marquee>" + RSS.lateral + "</marquee></div>");
				}
				
				$("#rss2 [id^=news]").remove(); $("#rss2").show();
				
			}else{

				$("#rss2 [id^=news-], #rss2 [id^=rss-]").remove(); $("#rss2").hide();
			}
		}).fail(function() { /*console.clear();*/ $("#rss2 [id^=news], #rss2 [id^=rss]").remove(); $("#rss").hide(); });
	};
	
	/** NEWS FUNCTIONS **/
	NEWS.REFRESH = function() {
		if (CONFIG.channel.rss2 != "") {

			$("#rss2").css("background-color",'#'+CONFIG.channel.rss2[0].color);
			$("#rss2 #top-mask").css("background-color",'#'+CONFIG.channel.rss2[0].color);
			$("#rss2 #bottom-mask").css("background-color",'#'+CONFIG.channel.rss2[0].color);
			$("#rss2 #left-mask").css("background-color",'#'+CONFIG.channel.rss2[0].color);
			$("#rss2 #right-mask").css("background-color",'#'+CONFIG.channel.rss2[0].color);
			$("#rss2").css("color",'#'+CONFIG.channel.rss2[0].color_font);
		}

	try{
		
		if (CONFIG.channel.rss2 != "" && CONFIG.channel.rss2[0].dir == 'horizontal') {
			
			clearTimeout(NEWS.timeout);
			clearTimeout(RSS.timeout);
			RSS.index = -1;
			NEWS.index = -1;
			NEWS.LATERAL();

		}else{
			
			$("#rss2 [id^=newsstring], #rss2 [id^=rssstring]").remove();
			RSS.REFRESH();
		}

		}catch(error){
			console.log(error);
		}
	};


	NEWS.LATERAL = function() {
		RSS.LATERAL();
	};
	
	while( (new Date).getMilliseconds()!=0 );
	setTimeout(function() { setInterval(NEWS.REFRESH, 60*1000); }, (60-(new Date).getSeconds())*1000);
})();
