<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title>Winbox</title>
	<link rel="icon" type="image/x-icon" href="pictures/favicon.ico">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

	<!-- FRAMEWORK JS AND CSS -->
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.6.min.css">
	<link rel="stylesheet" type="text/css" href="css/font-awesome-4.6.3.min.css">
	<link rel="stylesheet" type="text/css" href="css/animate-3.5.1.min.css">
	<link rel="stylesheet" type="text/css" href="css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/onScreenKeyboard.css">
	<script type="text/javascript" src="js/jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-3.3.6.min.js"></script>
	<script type="text/javascript" src="js/moment-2.13.0.min.js"></script>
	<script type="text/javascript" src="js/moment-es.js"></script>
	<script type="text/javascript" src="js/moment-timezone-with-data.js"></script>
	<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
	<script type="text/javascript" src="js/jquery.onScreenKeyboard.js"></script>



	<!-- CUSTOM JS AND CSS -->
	<link rel="stylesheet" type="text/css" href="css/style.css?0">
	<script type="text/javascript" src="js/script.js?0"></script>

</head>
<body oncontextmenu="return false;">
	<!-- MESSAGES -->
	<div id="MESSAGES" style="display: none;"></div>
	<audio id="audio_msg" src="pictures/coins.mp3"></audio>

	<!-- WINBOX MENU -->
	<div id="menu-area"><div class="text-center" id="menu"><b>MENU</b></div></div>
	
	<!-- MEDIA PLAYER -->
	<iframe id="player" src="winbox.player.php"></iframe>
	<div id="player-mask"></div>

	<!-- BOTTOM WIDGET -->
	<div id="bottom"></div>
	
	<!-- LATERAL IMAGE -->
	<img id="lateral" onerror="this.src = ''">
	
	<!-- CHANNEL IMAGES -->
	<img id="channel-background" onerror="this.src = ''">
	<div id="channel-logo" class="text-right">
		<img onerror="this.src = ''"><span></span>
	</div>
	<div id="client-logo" class="text-left">
		<img onerror="this.src = ''"><span></span>
	</div>
	
	<!-- WINBOX LOGO -->
	<div id="logo" style="padding-top: 5px; padding-left: 5px;">
		<img id="logo_wchannel" src="pictures/logo.png" style="display:none; width: 55px; height: 55px;">	
	</div>
	
	
	<!-- FORECAST WIDGET -->
	<div id="forecast" style="border-radius: 15px 0px 0px 15px;">

		<div class="item text-center" style="margin-top: 15px;">
			<b class="day">-</b> <img src="pictures/weather/25.png" style="max-height: 70px !important;">
			<b class="text-primaryy">-</b>&nbsp;-&nbsp;<b class="text-dangerr">-</b>
		</div>
		<div class="item text-center" style="margin-top: 15px;">
			<b class="day">-</b><img src="pictures/weather/25.png" style="max-height: 70px !important;">
			<b class="text-primaryy">-</b>&nbsp;-&nbsp;<b class="text-dangerr">-</b>
		</div>
		<div class="item text-center" style="margin-top: 15px;">
			<b class="day">-</b><img src="pictures/weather/25.png" style="max-height: 70px !important;">
			<b class="text-primaryy">-</b>&nbsp;-&nbsp;<b class="text-dangerr">-</b>
		</div>
	</div>

	<div id="rss2" style="display: none;">
		<div id="top-mask"></div>
		<div id="bottom-mask"></div>
		<div id="left-border"></div>
		<div id="right-border"></div>
	</div>

	<!-- WEATHER WIDGET -->
	<div id="weather" class="text-center">
		<img src="pictures/weather/25.png"><b>-</b>
	</div>
	
	<!-- RSS WIDGET -->
	<div id="rss">
		<div id="top-mask"></div>
		<div id="bottom-mask"></div>
		<div id="left-border"></div>
		<div id="right-border"></div>
	</div>
	
	<!-- STATUS WIDGET -->
	<div id="status">
		<div id="status-light"></div>
		<div id="status-datetime" class="text-center"><b></b></div>
	</div>

	<!-- ACTIVATION MODAL -->
	<?=file_get_contents("/home/winbox/winbox/templates/modal-activation.html")?>
	
	<!-- WINBOX MODAL -->
	<?=file_get_contents("/home/winbox/winbox/templates/modal-winbox.html")?>
	
	<!-- GENERAL MODAL -->
	<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title text-left"><b>TITLE</b></h4>
				</div>
				<div class="modal-body text-left">BODY</div>
				<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Aceptar</button></div>
			</div>
		</div>
	</div>
<script type="text/javascript">

$.post("winbox.imagenes_laterales.php", {imagen:"1",tipo:"lateral",aumentar:'no'}, function(response){
	
});

$.post("winbox.imagenes_inferiores.php", {imagen:"1",tipo:"lateral",aumentar:'no'}, function(response){
	
});

</script>
</body>
</html>
