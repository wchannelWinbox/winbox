/* global $, moment */
var CONFIG = {}, ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var INFERIOR_ACTUAL="";
var LATERAL_ACTUAL="";
var NEWS="";
var MODAL = function( title, message, dismiss ) {
	$(".modal:not([id]) .modal-title b").html( title );
	$(".modal:not([id]) .modal-body").html( message );
	$(".modal:not([id])").off("hidden.bs.modal").on("hidden.bs.modal", function() { if( dismiss ) dismiss(); }).modal();
};

$(function() {
	var DATETIME_WIDGET = function() {
	  if( !("date_format" in CONFIG) || !("time_format" in CONFIG) ) { setTimeout(DATETIME_WIDGET, 1000); return; }
	  $("#status-datetime b").html("");

	  if(CONFIG.timezone != ''){
	  	var tz = CONFIG.timezone;
	  }else{
	  	var tz = 'America/Bogota';
	  }

	  if( CONFIG.date_format!="" ) {
	    $("#status-datetime b").append($("<span>").attr("id", "status-date").html( moment().tz(tz).format(CONFIG.date_format) ));
	    if( CONFIG.time_format!="" ) $("#status-datetime b").append("<br>");
	  }
	  if( CONFIG.time_format!="" ) {
	    $("#status-datetime b").append($("<span>").attr("id", "status-time").html( moment().tz(tz).format(CONFIG.time_format) ));
	  }

	  $.getJSON("data/news.json?0", function(news) {
	  	NEWS = news;
	  });

	  try{
	  	  
		  if ((CONFIG.channel.rss=='' && NEWS.length<=0) || CONFIG.channel.rss[0].enabled == false ){
		  	
		  	$("#status").removeClass('status_rss');
		  	$("#logo").removeClass('logo_rss');
		  	$("#weather").removeClass('weather_rss');

		  	$("#status").addClass('status_no_rss');
		  	$("#logo").addClass('logo_no_rss');
		  	$("#weather").addClass('weather_no_rss');
		  }else{
		  	$("#status").removeClass('status_no_rss');
		  	$("#logo").removeClass('logo_no_rss');
		  	$("#weather").removeClass('weather_no_rss');

		  	$("#status").addClass('status_rss');
		  	$("#logo").addClass('logo_rss');
		  	$("#weather").addClass('weather_rss');
		  }

		  if (CONFIG.time_format=="" && CONFIG.date_format=="" && ((CONFIG.channel.rss=='' && NEWS.length<=0) || CONFIG.channel.rss[0].enabled == false ) ){
		  	$("#status").removeClass('status_no_rss');
		  	$("#status").css('background','transparent');
		  }else{
		  	$("#status").css('background','white');
		  }

		  
		}catch(error){
			console.log(error);
		}

	}; DATETIME_WIDGET();
	
	$("#menu-area").hover(
		function() { $("#menu").animate({"left":"30px"}, 500); },
		function() { $("#menu").animate({"left":"0px"}, 500); }
	).find("#menu").click(function() { $("#modal-winbox").modal(); });
	
	while( (new Date).getMilliseconds()!=0 );
	setTimeout(function() { DATETIME_WIDGET(); setInterval(DATETIME_WIDGET, 60*1000); }, (60-(new Date).getSeconds())*1000);
	
	var INACTIVE = function() { $.getScript("js/winbox.inactive.js"); };
	var WBX_LOAD = function() {
		$("#modal-activation").remove();
		$.getScript("js/winbox.status.js"); $.getScript("js/winbox.rss.js");
		$.getScript("js/winbox.weather.js"); $.getScript("js/winbox.lateral.js");
		$.getScript("js/winbox.mensajes.js"); $.getScript("js/winbox.rss2.js");
	};
	
	$("#status-light").removeClass().addClass("undefined");

	$.getJSON("data/lateral.json", function(config) {
		LATERAL_ACTUAL = config.actual;
	});

	$.getJSON("data/inferior.json", function(config) {
		INFERIOR_ACTUAL = config.actual;
	});

	$.getJSON("data/config.json", function(config) {
		CONFIG = config; if( CONFIG.winbox.id==0 || CONFIG.winbox.license=="" ) { INACTIVE(); } else { WBX_LOAD(); }
	}).fail(function() { /*console.clear();*/ INACTIVE(); });
});
