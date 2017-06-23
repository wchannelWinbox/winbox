/* global $, MODAL, ANIMATION_END */
$(function() {
	$("#status-light").removeClass().addClass("inactive"); $("#player, #weather").hide();
	
	$("#modal-activation").on("shown.bs.modal", function() {		
		$(this).find("#modal-server .dropdown-menu a").click(function() {
			$(this).parents("#modal-server").find(".dropdown-toggle span:not(.caret)").html( $(this).html() );
			switch( $(this).html() ) {
				case "Producción": $(this).parents("#modal-server").find("input").val( "http://windowschannel.net" ); break;
				case "Desarrollo": $(this).parents("#modal-server").find("input").val( "http://wchannel.windowschannelfactory.com" ); break;
				default: break;
			}
		});
		
		$(this).find(".modal-footer button").click(function() {
			if( $("#modal-license input").val().length<$("#modal-license input").attr("maxlength") ) {
				$("#modal-license input").parent().addClass("shake has-error").on(ANIMATION_END, function() {
					$("#modal-license input").parent().removeClass("shake has-error");
				}); return;
			}
			
			$("#modal-activation .modal-footer button").html( $("<i>").addClass("fa fa-spinner fa-spin") );
			$("#modal-activation input, #modal-activation button").attr("disabled", "disabled");
			
			var LICENSE = $("#modal-license input").val().toUpperCase();
			$.post($("#modal-server input").val() + "/winbox/activar", {"licencia":LICENSE, "version":"12.0.1-20170623"}, function(response) {
				if( response.success ) {
					var winbox = {"id":response.result.id, "license":LICENSE};
					$.post("winbox.activation.php", {"host":$("#modal-server input").val(), "winbox":winbox}, function(response) {
						$("#status-light").removeClass().addClass("updating"); $("#modal-activation").modal("hide");
						var msg = function() {
							MODAL("Mensaje", "El winbox ha sido activado.<br>Espere un momento mientras termina la configuración.", msg);
						}; msg();
						setTimeout(function() { window.location.reload( true ); }, 15*1000);
					});
				} else {
					switch( response.code ) {
						case 1: response.message = "El número de licencia es inválido!"; break;
						case 2: response.message = "El winbox ya ha sido activado!"; break;
						default: response.message = "Se ha producido un error al activar el winbox.<br>Vuelva a intentarlo."; break;
					}
					MODAL("Error", response.message); $("#modal-activation .modal-footer button").html( "<b>Activar</b>" );
					$("#modal-activation input, #modal-activation button").removeAttr("disabled"); $("#modal-server input").attr("disabled", "disabled");
				}
			}).fail(function() {
				$("#modal-activation .modal-footer button").html( "<b>Activar</b>" );
				$("#modal-activation input, #modal-activation button").removeAttr("disabled"); $("#modal-server input").attr("disabled", "disabled");
				MODAL("Error", "Se ha producido un error al activar el winbox.<br>Vuelva a intentarlo.");
			});
		});
	}).modal();
});
