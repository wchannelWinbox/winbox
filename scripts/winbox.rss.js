/* global $, CONFIG */
(function() {
	var RSS  = {"data":[], "next":[], "index":-1, "timeout":null}, NEWS = {"data":[], "next":[], "index":-1, "timeout":null};
	
	/** RSS FUNCTIONS **/
	RSS.REFRESH = function() {
		/*console.clear();*/ $.getJSON("data/rss.json?0", function(rss) {
			if( rss.length>0 ) {
				RSS.next = rss; clearTimeout(NEWS.timeout); $("#rss [id^=news]").remove(); $("#rss").show();
				if( !$("#rss [id^=rss]").length ) { RSS.NEXT(); }
			}
		}).fail(function() { /*console.clear();*/ $("#rss [id^=news], #rss [id^=rss]").remove(); $("#rss").hide(); });
	};
	RSS.NEXT = function() {
		if( RSS.next.length>0 ) { RSS.data = RSS.next; RSS.next = []; RSS.index = -1; }
		if( RSS.index==-1 && RSS.data.length==0 ) { RSS.NEXT(); }
		else if( RSS.data.length>RSS.index+1 ) { RSS.index++; }
		else { RSS.index = 0; }
		
		if( $("#rss-" + RSS.index).length ) { $("#rss-" + RSS.index).attr("id", "rss-" + RSS.index + "-1"); }
		$("#rss").prepend("<div id=\"rss-" + RSS.index + "\" style=\"top:80px;\">" + RSS.data[RSS.index] + "</div>");
		$("#rss [id^=rss]").animate({"top":"-=80px"}, 1000, function() {
			if( $(this).attr("id")!="rss-"+RSS.index ) { $(this).remove(); }
			else {
				if( parseInt($("#rss #rss-" + RSS.index).css("top"), 10)+$("#rss #rss-" + RSS.index).height()>80 ) {
					RSS.timeout = setTimeout(RSS.STEP, CONFIG.times.rss_scroll*1000);
				} else { RSS.timeout = setTimeout(RSS.NEXT, CONFIG.times.rss_scroll*1000); }
			}
		});
	};
	RSS.STEP = function() {
		$("#rss [id^=rss]").animate({"top":"-=80px"}, 1000, function() {
			if( parseInt($("#rss #rss-" + RSS.index).css("top"), 10)+$("#rss #rss-" + RSS.index).height()>80 ) {
				RSS.timeout = setTimeout(RSS.STEP, CONFIG.times.rss_scroll*1000);
			} else { RSS.timeout = setTimeout(RSS.NEXT, CONFIG.times.rss_scroll*1000); }
		});
	};
	
	/** NEWS FUNCTIONS **/
	NEWS.REFRESH = function() {
		if( !CONFIG.channel.rss[0].enabled ) { $("#rss [id^=rss]").remove(); }
		if( (parseInt(Date.now()/1000, 10) % (60*CONFIG.times.rss_interval))==0 || (NEWS.index==-1 && RSS.index==-1) ) {
			/*console.clear();*/ $.getJSON("data/news.json?0", function(news) {
				if( news.length>0 ) {
					NEWS.next = news; clearTimeout(RSS.timeout); $("#rss [id^=rss]").remove(); $("#rss").show();
					if( !$("#rss [id^=news]").length ) { NEWS.NEXT(); }
				} else if( CONFIG.channel.rss[0].enabled ) { RSS.REFRESH(); }
			}).fail(function() { /*console.clear();*/ if( CONFIG.channel.rss[0].enabled ) { RSS.REFRESH(); } });
		}
	};
	NEWS.NEXT = function() {
		if( NEWS.next.length>0 ) { NEWS.data = NEWS.next; NEWS.next = []; NEWS.index = -1; }
		if( NEWS.index==-1 && NEWS.data.length==0 ) { NEWS.NEXT(); }
		else if( NEWS.data.length>NEWS.index+1 ) { NEWS.index++; }
		else { NEWS.index = 0; }
		
		var string = "<span class=\"news-title\">" + NEWS.data[NEWS.index].title + "</span> : " + NEWS.data[NEWS.index].description;
		if( $("#news-" + NEWS.index).length ) { $("#news-" + NEWS.index).attr("id", "news-" + NEWS.index + "-1"); }
		$("#rss").prepend("<div id=\"news-" + NEWS.index + "\" style=\"top:80px;\">" + string + "</div>");
		$("#rss [id^=news]").animate({"top":"-=80px"}, 1000, function() {
			if( $(this).attr("id")!="news-"+NEWS.index ) { $(this).remove(); }
			else {
				if( parseInt($("#rss #news-" + NEWS.index).css("top"), 10)+$("#rss #news-" + NEWS.index).height()>80 ) {
					NEWS.timeout = setTimeout(NEWS.STEP, CONFIG.times.rss_scroll*1000);
				} else { NEWS.timeout = setTimeout(NEWS.NEXT, CONFIG.times.rss_scroll*1000); }
			}
		});
	};
	NEWS.STEP = function() {
		$("#rss [id^=news]").animate({"top":"-=80px"}, 1000, function() {
			if( parseInt($("#rss #news-" + NEWS.index).css("top"), 10)+$("#rss #news-" + NEWS.index).height()>80 ) {
				NEWS.timeout = setTimeout(NEWS.STEP, CONFIG.times.rss_scroll*1000);
			} else { NEWS.timeout = setTimeout(NEWS.NEXT, CONFIG.times.rss_scroll*1000); }
		});
	};
	
	while( (new Date).getMilliseconds()!=0 );
	setTimeout(function() { setInterval(NEWS.REFRESH, 60*1000); }, (60-(new Date).getSeconds())*1000);
})();
