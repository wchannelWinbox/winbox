/* global $, CONFIG */
$(function() {

	var SHOW_LATERAL = function() {
		try{
			if( !("lateral" in CONFIG.channel) || !CONFIG.channel.lateral.enabled || CONFIG.channel.imagenesLaterales.length <= 0 || CONFIG.channel.lateral.interval==0 ) {
				setTimeout(SHOW_LATERAL, 1000); return;
			}


			if(!CONFIG.channel.lateral.overlay){
				$("#forecast").animate({"left":$(window).width()+"px"}, 1000, function() {
					var css = "body>#player { width:100vw; height:100vh; } #bottom { width:100vw; height:0px; }";
					$("<style></style>").attr("id", "lateral-css").html(css).appendTo("head");
					$("#lateral").animate({"left":"-="+$("#lateral").width()+"px"}, {
						"duration":1000,
						"progress":function() {
							var pWidth = parseFloat( $("#lateral").css("left") ); var pHeight = pWidth*9/16; var bHeight = $(window).height() - pHeight;
							css  = "body>#player { width:" + pWidth + "px; height:" + pHeight + "px; }";
							css += "#bottom { width:" + pWidth + "px; height:" + bHeight + "px; background-size:" + pWidth + "px " + bHeight + "px; }";
							$("#lateral-css").html(css);
						},
						"complete":function() { setTimeout(HIDE_LATERAL, CONFIG.channel.lateral.duration*1000); }
					});
				});
			}else{
				$("#forecast").animate({"left":$(window).width()+"px"}, 1000, function() {
					var css = "body>#player { width:100vw; height:100vh; } #bottom { width:100vw; height:0px; }";
					$("<style></style>").attr("id", "lateral-css").html(css).appendTo("head");
					$("#lateral").animate({"left":"-="+$("#lateral").width()+"px"}, {
						"duration":1000,
						"progress":function() {
							var pWidth = parseFloat( $("#lateral").css("left") ); var pHeight = pWidth*9/16; var bHeight = $(window).height() - pHeight;
							//css  = "body>#player { width:" + pWidth + "px; height:" + pHeight + "px; }";
							if(CONFIG.channel.lateral.bottom_enabled && CONFIG.channel.imagenesInferiores.length > 0){
								css += "#bottom { width:" + pWidth + "px; height:" + bHeight + "px; background-size:" + pWidth + "px " + bHeight + "px; }";
							}
							$("#lateral-css").html(css);
						},
						"complete":function() { setTimeout(HIDE_LATERAL, CONFIG.channel.lateral.duration*1000); }
					});
				});
			}
		}catch(error){
			console.log(error);
		}
	};
	
	var HIDE_LATERAL = function() {
		if(!CONFIG.channel.lateral.overlay){
			$("#lateral").animate({"left":$(window).width()+"px"}, {
				"duration":1000,
				"progress":function() {
					var pWidth = parseFloat( $("#lateral").css("left") ); var pHeight = pWidth*9/16; var bHeight = $(window).height() - pHeight;
					//var css ="";
					var css  = "body>#player { width:" + pWidth + "px; height:" + pHeight + "px; }";
					css += "#bottom { width:" + pWidth + "px; height:" + bHeight + "px; background-size:" + pWidth + "px " + bHeight + "px; }";
					$("#lateral-css").html(css);
				},
				"complete":function() { CHANGE_LATERAL(); CHANGE_INFERIOR(); $("#lateral-css").remove(); setTimeout(SHOW_LATERAL, CONFIG.channel.lateral.interval*1000); }
			});
		}else{
			$("#lateral").animate({"left":$(window).width()+"px"}, {
				"duration":1000,
				"progress":function() {
					var pWidth = parseFloat( $("#lateral").css("left") ); var pHeight = pWidth*9/16; var bHeight = $(window).height() - pHeight;
					var css ="";
					//var css  = "body>#player { width:" + pWidth + "px; height:" + pHeight + "px; }";
					if(CONFIG.channel.lateral.bottom_enabled && CONFIG.channel.imagenesInferiores.length > 0){
						css += "#bottom { width:" + pWidth + "px; height:" + bHeight + "px; background-size:" + pWidth + "px " + bHeight + "px; }";
					}
					$("#lateral-css").html(css);
				},
				"complete":function() { CHANGE_LATERAL(); CHANGE_INFERIOR(); $("#lateral-css").remove(); setTimeout(SHOW_LATERAL, CONFIG.channel.lateral.interval*1000); }
			});
		}


	};

	var CHANGE_LATERAL = function() {
		if("lateral" in CONFIG.channel && CONFIG.channel.imagenesLaterales.length > 0) {
			var imagePath = "";
			$.getJSON("data/lateral.json", function(config) {

				var lateralActual = config.actual;
				$.getJSON("data/config.json", function(config) {
					try{
						CONFIG = config;
						var Ilaterales = config.channel.imagenesLaterales.length;
						imagePath = "../data/media/laterales/"+config.channel.imagenesLaterales[lateralActual].id+"-"+config.channel.imagenesLaterales[lateralActual].file;
						$("#lateral").attr("src",imagePath);

						maximoLaterales = Ilaterales - 1;

						if(lateralActual == maximoLaterales){
							aumentar = "no";
						}else{
							aumentar = "si";
						}

						$.post("../winbox.imagenes_laterales.php", {imagen:"1",tipo:"lateral",aumentar:aumentar}, function(response){
							
						});
					}catch(err){
						
						aumentar = "no";

						$.post("../winbox.imagenes_laterales.php", {imagen:"1",tipo:"lateral",aumentar:aumentar}, function(response){
							
						});
					}

				});
			});
		}else{
			$("#lateral").attr("src","");
		}
	};
	
	var CHANGE_INFERIOR = function() {
		var imagePath = "";
		if(CONFIG.channel.lateral.bottom_enabled && CONFIG.channel.imagenesInferiores.length > 0){
			
			$.getJSON("data/inferior.json", function(config) {

				var inferiorActual = config.actual;
				$.getJSON("data/config.json", function(config) {
					try{
						CONFIG = config;
						var Iinferiores = config.channel.imagenesInferiores.length;
						imagePath = "../data/media/inferiores/"+config.channel.imagenesInferiores[inferiorActual].id+"-"+config.channel.imagenesInferiores[inferiorActual].file;
						//$("#bottom").attr("src",imagePath);
						
						$("#bottom").css("background-image",'url("'+ imagePath + '")');

						maximoInferiores = Iinferiores - 1;

						if(inferiorActual == maximoInferiores){
							aumentar = "no";
						}else{
							aumentar = "si";
						}

						$.post("../winbox.imagenes_inferiores.php", {imagen:"1",tipo:"inferior",aumentar:aumentar}, function(response){
							
						});
					}catch(err){
						
						aumentar = "no";

						$.post("../winbox.imagenes_inferiores.php", {imagen:"1",tipo:"inferior",aumentar:aumentar}, function(response){
							
						});
					}

				});
			});
		}else{
			
			$("#bottom").css("background-image","");
		}
	};

	setTimeout(SHOW_LATERAL, (60-(new Date).getSeconds())*1000);
});
