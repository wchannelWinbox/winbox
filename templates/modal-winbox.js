/* global $, CONFIG */
$(function() {
	var REFRESH_STATUS = function() {}, REFRESH_LOGS = function() {};
	
	$("#modal-winbox").on("show.bs.modal", function() {
		REFRESH_STATUS = function() {
			$.getJSON("data/status.json?0", function(status) {
				// SET HARD DISK DRIVE
				var hdd  = parseInt(100*status.hdd.current/status.hdd.total, 10);
				status.hdd.current = (status.hdd.current/1024).toFixed(2); status.hdd.total = (status.hdd.total/1024).toFixed(2);
				var hdd_text = status.hdd.current + "GB / " + status.hdd.total + "GB";
				$("#estado #hdd .progress-bar").attr("aria-valuenow", hdd).width(hdd + "%").html("<span>" + hdd_text + "</span>");
				if( hdd<50 ) { $("#estado #hdd .progress-bar").removeClass().addClass("progress-bar progress-bar-success"); }
				else if( hdd<75 ) { $("#estado #hdd .progress-bar").removeClass().addClass("progress-bar progress-bar-warning"); }
				else { $("#estado #hdd .progress-bar").removeClass().addClass("progress-bar progress-bar-danger"); }
				
				// SET RAM MEMORY
				var ram  = parseInt(100*status.ram.current/status.ram.total, 10);
				var ram_text = status.ram.current + "MB / " + status.ram.total + "MB";
				$("#estado #ram .progress-bar").attr("aria-valuenow", ram).width(ram + "%").html("<span>" + ram_text + "</span>");
				if( ram<75 ) { $("#estado #ram .progress-bar").removeClass().addClass("progress-bar progress-bar-success"); }
				else if( ram<90 ) { $("#estado #ram .progress-bar").removeClass().addClass("progress-bar progress-bar-warning"); }
				else { $("#estado #ram .progress-bar").removeClass().addClass("progress-bar progress-bar-danger"); }
				
				// SET NETWORK STATUS
				$("#estado #network").removeClass().addClass("label label-" + (status.network.status=="connected" ? "success" : "danger"))
					.html(status.network.status=="connected" ? "Conectado" : "Desconectado");
				$("#estado #ip").html( status.network.ip ? status.network.ip : "&nbsp;" );
				$("#estado #mac").html( status.network.mac ? status.network.mac.toUpperCase() : "&nbsp;" );
				
				// SET CLIENT INFORMATION
				$("#estado #license").html( CONFIG.winbox.license.replace(/-/g, " - ") );
				$("#estado #version").html( CONFIG.winbox.version ); $("#estado #server").html( CONFIG.host );
				
				// CALL REFRESH AGAIN AFTER 15 SECONDS
				setTimeout(function() { if( REFRESH_STATUS!=null ) REFRESH_STATUS(); }, 15*1000);
			}).fail(function() { console.clear(); setTimeout(function() { if( REFRESH_STATUS!=null ) REFRESH_STATUS(); }, 60*1000); });
		}; REFRESH_STATUS();
		
		var LOGS = []; $("#logs pre").html(""); REFRESH_LOGS = function() {
			$.get("winbox.logs.php", function(response) {
				response.forEach(function(value) {
					if( LOGS.indexOf(value)!=-1 ) { return; }
					LOGS.push( value ); $("#logs pre").append( value + "\n" );
					$("#logs pre").scrollTop( $("#logs pre")[0].scrollHeight );
				});
				if( REFRESH_LOGS!=null ) setTimeout(REFRESH_LOGS, 1*1000);
			});
		}; REFRESH_LOGS();
	}).on("hidden.bs.modal", function() { REFRESH_STATUS = null; REFRESH_LOGS = null; });
});