/* global $, CONFIG */
(function() {
	var UPDATE_WINBOX  = function() {
		$.get("winbox.update.php", function() {
			$("#status-light").removeClass().addClass("updating"); setTimeout(REFRESH_STATUS, 5*1000);
		}).fail(function() { /*console.clear()*/; REFRESH_STATUS(); });
	};
	var REFRESH_STATUS = function() {
		$.getJSON("data/status.json", function(config) {

			var STATUS  = config;
			$.getJSON("data/config.json", function(config) {
				var CONFIG  = config;

				$.post(CONFIG.host+"/winbox/espacio_disco/",
					{id: CONFIG.winbox.id,
						licencia:CONFIG.winbox.license,
						espacio_disco:STATUS.hdd.current,
						total_disco:STATUS.hdd.total}, 
					function(result){
			        console.log(result);
			    });

			});
		});
		$.getJSON("data/config.json", function(config) {
			CONFIG = config;

			// SET CHANNEL LATERAL IMAGE
			/*if( ("lateral" in CONFIG.channel) && CONFIG.channel.lateral.picture!="" ) {

				$("#lateral").attr("src", "data/media/laterales/"+CONFIG.channel.imagenesLaterales[LATERAL_ACTUAL].id + "-" + CONFIG.channel.imagenesLaterales[LATERAL_ACTUAL].file.split("/").slice(-1)[0]);
				if( CONFIG.channel.lateral.bottom_enabled && CONFIG.channel.lateral.bottom!="" ) {
					$("#bottom").css("background-image", 'url("/data/media/inferiores/'+CONFIG.channel.imagenesInferiores[INFERIOR_ACTUAL].id + "-" + CONFIG.channel.imagenesInferiores[INFERIOR_ACTUAL].file.split("/").slice(-1)[0] + '")');
					//$("#bottom").css("background-image", 'url(/data/lateral-best_buddies.jpg)');

				} else { console.log('inactivo');$("#bottom").css("background-image", ""); }
			} else { $("#lateral").attr("src", ""); $("#bottom").css("background-image", ""); }*/
			try{
				if( CONFIG.winbox.refresh == true ) {
					window.location.reload();
				}		
			}catch(error){
				console.log(error);
			}

			try{
				if( CONFIG.imagenw == "N" && CONFIG.weather.id == 0 ) {
					console.log("hide border");
					$("#right-border").css("display","none");
				} else { $("#right-border").css("display","inherit"); }			
			}catch(error){
				console.log(error);
			}

			// SET LOGO WINDOWSCHANNEL
			try{
				if( CONFIG.imagenw == "N" ) {
					$("#logo_wchannel").css("display","none");
				} else { $("#logo_wchannel").css("display","inherit"); }
			}catch(error){
				console.log(error);
			}

			// SET CHANNEL BACKGROUND
			try{
				if( ("background" in CONFIG.channel) && CONFIG.channel.background.enabled && CONFIG.channel.background.value!="" ) {
					$("#channel-background").attr("src", "data/channel_background-" + CONFIG.channel.background.value.split("/").slice(-1)[0]).show();
				} else { $("#channel-background").attr("src", "").hide(); }
			}catch(error){
				console.log(error);
			}

			// SET CHANNEL LOGO
			try{
				if( ("logo" in CONFIG.channel) ) {
					if( CONFIG.channel.logo.type=="image" ) {
						$("#channel-logo span").html("").hide();
						$("#channel-logo img").attr("src", "data/channel_logo-" + CONFIG.channel.logo.value.split("/").slice(-1)[0]).show();
					} else if( CONFIG.channel.logo.type=="text" ) {
						$("#channel-logo img").attr("src", "").hide();
						$("#channel-logo span").html( CONFIG.channel.logo.value ).css("display", "table-cell");
					} else { $("#channel-logo img").attr("src", "").hide(); $("#channel-logo span").html("").hide(); }
				} else { $("#channel-logo img").attr("src", "").hide(); $("#channel-logo span").html("").hide(); }
			}catch(error){
				console.log(error);
			}

			// SET CLIENT LOGO
			try{
				if( ("client_logo" in CONFIG) ) {
					if( CONFIG.client_logo.type=="image" ) {
						$("#client-logo span").html("").hide();
						$("#client-logo img").attr("src", "data/client_logo-" + CONFIG.client_logo.value.split("/").slice(-1)[0]).show();
					} else if( CONFIG.client_logo.type=="text" ) {
						$("#client-logo img").attr("src", "").hide();
						$("#client-logo span").html( CONFIG.client_logo.value ).css("display", "table-cell");
					} else { $("#client-logo img").attr("src", "").hide(); $("#client-logo span").html("").hide(); }
				} else { $("#client-logo img").attr("src", "").hide(); $("#client-logo span").html("").hide(); }
			}catch(error){
				console.log(error);
			}

			// CHECK CONNECTION STATUS
			$.get(CONFIG.host, function() { $("#status-light").removeClass().addClass("connected"); })
			.fail(function() { /*console.clear()*/; $("#status-light").removeClass().addClass("disconnected"); });
		}).fail(function() { /*console.clear()*/; $("#status-light").removeClass().addClass("undefined"); REFRESH_STATUS(); });
	};
	
	while( (new Date).getMilliseconds()!=0 );
	setTimeout(function() {
		UPDATE_WINBOX(); setTimeout(function() {
			UPDATE_WINBOX(); setInterval(UPDATE_WINBOX, 60*1000);
		}, (60-(new Date).getSeconds())*1000);
	}, 5*1000);
})();
