/* global $, CONFIG */
$(function() {
	var SHOW_MESSAGES = function(duracion, mensaje, color) {

		if ( $('#MESSAGES').text().length == 0 ){
			if(mensaje.length > 50){
				$("#MESSAGES").css('line-height','75px');
			}else{
				$("#MESSAGES").css('line-height','150px');
			}
			$("#MESSAGES").css("background-color",color);
			$("#MESSAGES").append("<img  class='msg-img' src='pictures/info.png'>"+mensaje.toUpperCase());

			$("#MESSAGES").show("slow");

			var coins = document.getElementById("audio_msg");
			coins.play();

			
			setTimeout(function(){ 

					$.getJSON("data/config.json", function(config) {
						var CONFIG  = config;

						$.post(CONFIG.host+"/mensajes/borrar_mensaje",
							{id: CONFIG.winbox.id}, 
							function(result){
								
					        	
					    });

					});

				$("#MESSAGES").hide("slow");
				$("#MESSAGES").empty();
				MESSAGES();
			 }, duracion * 1000);
		}

	};

	
	var CHECK_MESSAGES = function() {

		$.getJSON("data/config.json", function(config) {
			var CONFIG  = config;

			$.post(CONFIG.host+"/mensajes/recibir_mensaje",
				{id: CONFIG.winbox.id}, 
				function(result){
					if(result.success){
						clearInterval(interval);
						SHOW_MESSAGES(result.duracion,result.mensaje,result.color);
					}
		        	
		    });

		});

	};

	
	var MESSAGES = function() {

		interval = setInterval(function(){ CHECK_MESSAGES(); }, 60000);

	};
	
	MESSAGES();
});