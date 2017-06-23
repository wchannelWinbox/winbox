/* global $, moment, CONFIG */
(function() {
	var REFRESH_WEATHER = function() {
		if( !("weather" in CONFIG) || CONFIG.weather.id==0 ) {
			$("#rss").width( $(window).width() - 260 + "px" ); $("#weather").hide();
			$("#forecast img").attr("src", "pictures/weather/25.png"); setTimeout(REFRESH_WEATHER, 60*1000); return;
		}
		var q = "select * from weather.forecast where woeid%3D" + CONFIG.weather.id + " and u%3D'c'";
		$.get("https://query.yahooapis.com/v1/public/yql?q=" + q.replace(" ", "%20") + "&format=json", function(response) {
			var status = response.query.results.channel.item;
			
			// WEATHER WIDGET UPDATE
			$("#weather img").attr("src", "pictures/weather/" + status.condition.code + ".gif");
			$("#weather b").data("value", status.condition.temp);
			
			for( var i=1; i<=3; i++ ) {
				var item = ".item:nth-child(" + i + ")";
				$("#forecast " + item + " img").attr("src", "pictures/weather/" + status.forecast[i].code + ".gif");
				$("#forecast " + item + " b.day").html( moment(status.forecast[i].date).format("dddd").toUpperCase() );
				$("#forecast " + item + " b.text-primary").data("value", status.forecast[i].low);
				$("#forecast " + item + " b.text-danger").data("value", status.forecast[i].high);
			} REFRESH_TEMPERATURE();
			
			$("#weather").css("display", "table"); $("#rss").width( $(window).width() - 360 + "px" );
		}).fail(function() {
			/*console.clear()*/; $("#rss").width( $(window).width() - 260 + "px" ); $("#weather").hide();
			$("#forecast img").attr("src", "pictures/weather/25.png");
		});
	};
	
	var REFRESH_TEMPERATURE = function() {
		if( $("#weather b").data("value")!="" ) {
			var temperature = parseInt($("#weather b").data("value"), 10);
			if( CONFIG.weather.unit=="F" ) { temperature = parseInt(Math.round(9*temperature/5), 10) + 32; }
			$("#weather b").html( temperature + "°" + CONFIG.weather.unit );
		} else { $("#weather").hide(); $("#rss").width( $(window).width() - 260 + "px" ); }
		for( var i=1; i<=3; i++ ) {
			var item = ".item:nth-child(" + i + ")";
			if( $("#forecast " + item + " b.text-primary").data("value")=="" ) continue;
			if( $("#forecast " + item + " b.text-danger").data("value")=="" ) continue;
			var min = parseInt($("#forecast " + item + " b.text-primary").data("value"), 10);
			var max = parseInt($("#forecast " + item + " b.text-danger").data("value"), 10);
			if( CONFIG.weather.unit=="F" ) {
				min = parseInt(Math.round(9*min/5), 10) + 32; max = parseInt(Math.round(9*max/5), 10) + 32;
			}
			$("#forecast " + item + " b.text-primary").html( min + "°" + CONFIG.weather.unit );
			$("#forecast " + item + " b.text-danger").html( max + "°" + CONFIG.weather.unit );
		}
	};
	
	var SHOW_FORECAST = function() {
		if( (("lateral" in CONFIG.channel) && CONFIG.channel.lateral.enabled) || !("forecast_interval" in CONFIG.weather) ) {
			setTimeout(SHOW_FORECAST, (CONFIG.weather.forecast_interval || 1)*1000); return;
		}
		var pictures = $("#forecast img").map(function() { return $(this).attr("src"); }).get();
		if( CONFIG.weather.forecast_interval==0 || !pictures.every(function(img) { return img!="pictures/weather/25.png"; }) ) {
			setTimeout(SHOW_FORECAST, (CONFIG.weather.forecast_interval || 1)*1000); return;
		}
		$("#forecast").height($(window).height()-320 + "px").width($("#forecast").height()/3 + "px");
		$("#forecast .item").width($("#forecast").width()-5 + "px").height($("#forecast").width()-5 + "px");
		for( var i=1; i<4; i++ ) { $("#forecast .item:nth-child(" + i + ")").css("top", (i-1)*$("#forecast").width() + "px"); }
		
		$("#forecast").animate({"left":"-="+$("#forecast").width()+"px"}, 1000, function() {
			setTimeout(HIDE_FORECAST, CONFIG.weather.forecast_duration*1000);
		});
	};
	var HIDE_FORECAST = function() {
		$("#forecast").animate({"left":$(window).width()+"px"}, 1000, function() {
			setTimeout(SHOW_FORECAST, (CONFIG.weather.forecast_interval || 1)*1000);
		});
	};
	
	$("#rss").width( $(window).width() - 260 + "px" ); while( (new Date).getMilliseconds()!=0 );
	setTimeout(SHOW_FORECAST, (60-(new Date).getSeconds())*1000);
	setTimeout(function() {
		REFRESH_WEATHER(); setTimeout(function() {
			REFRESH_WEATHER(); setInterval(REFRESH_TEMPERATURE, 60*1000);
			setTimeout(function() {
				REFRESH_WEATHER(); setInterval(REFRESH_WEATHER, 60*60*1000);
			}, (60-(new Date).getMinutes())*60*1000);
		}, (60-(new Date).getSeconds())*1000);
	}, 5*1000);
})();
