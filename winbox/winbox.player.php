<?php $CONFIG = json_decode(file_get_contents("data/config.json"), true); ?>
<?php $COMUNICADOS = json_decode(file_get_contents("data/comunicado.json"), true); ?>
<?php $URL = json_decode(file_get_contents("data/url.json"), true); ?>
<?php $PLAYER = json_decode(file_get_contents("data/player.json"), true); ?>
<style type="text/css">.media { width:100vw; height:100vh; margin:0px; padding:0px; background:white; border:none; position:absolute; top:0px; right:0px; bottom:0px; left:0px; overflow:hidden; }</style>
<script type="text/javascript" src="js/jquery-2.2.3.min.js"></script>
<?php
	$COLOSO=0;
	foreach($COMUNICADOS as $clave => $comunicado){
		//$hora_comunicado = $comunicado["reproducido"]
		if($comunicado["reproducido"]=="no" and $comunicado["type"]=="streaming"){
			$COMUNICADOS[$clave]["reproducido"]="si";
			file_put_contents("data/comunicado.json", json_encode($COMUNICADOS));
			$COLOSO=1;
			$MEDIA=$comunicado;
			break;
		}
	}

	if(isset($URL[0]['url']) and $URL[0]['reproducido'] == 'no' and $URL[0]['duracion_url'] != '0' and $COLOSO==0 ){
		$URL[0]["reproducido"]="si";
		file_put_contents("data/url.json", json_encode($URL));
		$COLOSO=1;
		$MEDIA=$URL[0];
	}

	/** URL EMBED **/  
	if( isset($CONFIG["channel"]["url"]) and $CONFIG["channel"]["url"]["enabled"] and $CONFIG["channel"]["url"]["value"]!="" and ($CONFIG["channel"]["url"]["duracion_url"] == '0' or $COLOSO == 1)) { 

	    $connected = @fsockopen("www.google.com", 80); 
	                                        //website, port  (try 80 or 443)
	    if ($connected){
	        $is_conn = true; //action when connected
	        fclose($connected);
	    }else{
	        $is_conn = false; //action in connection failure
	    }
	    

		?>

		<?php if ($is_conn){ ?>
			<iframe src="<?=$CONFIG["channel"]["url"]["value"]?>" class="media" onerror="window.location.reload(true);"></iframe>
			<script type="text/javascript">
				var CHECK_EMBED = function() {
					$.getJSON("data/config.json", function(config) {
						if( ("url" in config.channel) && (!config.channel.url.enabled || config.channel.url.value=="") ) {
							window.location.reload(true);
						} else { setTimeout(CHECK_EMBED, 1000); }
					}).fail(function() { console.clear(); setTimeout(CHECK_EMBED, 1000); });
				}; CHECK_EMBED();

				if (<?=$CONFIG["channel"]["url"]["duracion_url"]?> != 0){
					setTimeout(function(){ location.reload(true); }, <?=$CONFIG["channel"]["url"]["duracion_url"]?>*1000);
				}


			</script>
		<?php }else{ ?>
			<script type="text/javascript">
				window.location.reload(true);
			</script>
		<?php } ?>
	<?php exit(); }
?>
<?php
	/** MEDIA PLAYER **/
	
	foreach($COMUNICADOS as $clave => $comunicado){
		//$hora_comunicado = $comunicado["reproducido"]
		if($comunicado["reproducido"]=="no" and  $comunicado["type"]!="streaming"){
			$COMUNICADOS[$clave]["reproducido"]="si";
			file_put_contents("data/comunicado.json", json_encode($COMUNICADOS));
			$COLOSO=1;
			$MEDIA=$comunicado;
			$FILE  = "data/media/comunicados/".$MEDIA["id"]."-".explode("/", $MEDIA["value"])[3];
			if( file_exists($FILE)) { $FOUND = true; }
			break;
		}
	}
?>
<?php
	if ($COLOSO!=0 and $MEDIA["type"] == 'streaming') { 

	    $connected = @fsockopen("www.google.com", 80); 
	                                        //website, port  (try 80 or 443)
	    if ($connected){
	        $is_conn = true; //action when connected
	        fclose($connected);
	    }else{
	        $is_conn = false; //action in connection failure
	    }

	?>
		<?php if ($is_conn){ ?>
			<iframe src="<?=$MEDIA["value"]?>" class="media" onerror="window.location.reload(true);"></iframe>
			<script type="text/javascript">

				setTimeout(function(){ location.reload(true); }, <?=$MEDIA["duration"]?>*1000);
				
			</script>
		<?php }else{ ?>
			<script type="text/javascript">
				window.location.reload(true);
			</script>
		<?php } ?>

		<?php exit(); 

	}

	if($COLOSO==0){
		$MAX   = array_sum(array_map(function($value) { return count($value["media"]); }, $CONFIG["channel"]["blocks"]));

		$INDEX = 0; $FOUND = false;
		while( $INDEX<$MAX and !$FOUND ) {
			if( isset($CONFIG["channel"]["blocks"]) and count($CONFIG["channel"]["blocks"]) ) {
				if( $PLAYER["idxBloque"]==-1 and $PLAYER["idxMedia"]==-1 ) {
					if( count($CONFIG["channel"]["blocks"][0]["media"]) ) { $PLAYER["idxBloque"] = 0; $PLAYER["idxMedia"] = 0; }
					else { $INDEX++; continue; }
				} else {
					if( count($CONFIG["channel"]["blocks"][$PLAYER["idxBloque"]]["media"])>($PLAYER["idxMedia"]+1) ) { $PLAYER["idxMedia"]++; }
					else if( count($CONFIG["channel"]["blocks"])>($PLAYER["idxBloque"]+1) and count($CONFIG["channel"]["blocks"][$PLAYER["idxBloque"]+1]["media"]) ) {
						$PLAYER["idxBloque"]++; $PLAYER["idxMedia"] = 0;
					} else { $PLAYER["idxBloque"] = 0; $PLAYER["idxMedia"] = 0; }
				}
			} else { $INDEX++; continue; }
			
			$MEDIA = $CONFIG["channel"]["blocks"][$PLAYER["idxBloque"]]["media"][$PLAYER["idxMedia"]];
			$FILE  = "data/media/".$MEDIA["id"]."-".explode("/", $MEDIA["value"])[3];
			if( !file_exists($FILE)  && $MEDIA["type"]!="text" && $MEDIA["type"]!="streaming") { $INDEX++; continue; }
			else { $FOUND = true; file_put_contents("data/player.json", json_encode($PLAYER)); }
		}
	}
	
	if( !$FOUND && $MEDIA["type"]!="text" && $MEDIA["type"]!="streaming") { ?><script type="text/javascript">window.location.reload(true);</script><?php } 
	{ ?> 
	<input type="hidden" id="loop_video" value="0">
	<input type="hidden" id="type_content" value="<?php echo $MEDIA["type"] ?>">
	<input type="hidden" id="text_content" value="<?php echo $MEDIA["text"] ?>">
	<?php }
	if( $MEDIA["type"]=="image" ) { ?>
		
		<?php if($MEDIA["text"] != "SIN-TEXTO"): ?>
			<div id="contenedor_image" class="media contenedor_image" style="background:black;">
				<img style="width:50vw !important; height:50vh !important; top:22% !important;" src="<?=$FILE?>" class="media" onerror="window.location.reload(true);">
				<div style="margin-top:22vh; display:table; font-family:'Arial', sans-serif; width:50vw !important; height:50vh !important; color:white;  float:right !important; text-align:center;">
					<div class="child" style="display:table-cell; vertical-align:middle;" >
						<?php echo $MEDIA["text"]; ?>
					</div>

				</div>
			</div>	
		<?php else: ?>
			<img id="contenedor_image" src="<?=$FILE?>" class="media contenedor_image" onerror="window.location.reload(true);">
		<?php endif; ?>
		<script type="text/javascript">

			var myVar;

			myVar = setTimeout(function() { 
			
				window.location.reload(true); 

			}, <?=$MEDIA["duration"]?>*1000);

			function myStopFunction() {
			    clearTimeout(myVar);
			}

		</script>

	<?php } else if( $MEDIA["type"]=="video" ) { ?>
		<script type="text/javascript">
		 var time = 0;
			setInterval(function(){

				 var vid = document.getElementById("video");
				 if(vid.currentTime <= time){
				 	window.location.reload(true);
				 }else{
				 	time = vid.currentTime;
				 }

			}, 1000);

		</script>
		<?php if($MEDIA["text"] != "SIN-TEXTO"): ?>
			<div class="media contenedor_image" style="background:black;">
				<video id="video" style="width:50vw !important; height:50vh !important; top:22% !important;" src="<?=$FILE?>" class="media" onerror="window.location.reload(true);" autoplay></video>
				<div style="margin-top:22vh; display:table; font-family:'Arial', sans-serif; width:50vw !important; height:50vh !important; color:white; float:right !important; text-align:center;">
					
					<div class="child" style="display:table-cell; vertical-align:middle;" >
						<?php echo $MEDIA["text"]; ?>
					</div>

				</div>
			</div>	
		<?php else: ?>
			<video id="video" src="<?=$FILE?>" class="media" onerror="window.location.reload(true);" autoplay></video>
		<?php endif; ?>
		<script type="text/javascript">
			
			var myVideo = document.getElementById('video');

			myVideo.addEventListener('ended', function () {   
				var loop = $("#loop_video").val(); 
				console.log(loop);
				if(loop == 0){
					window.location.reload(true);
				}else{
					loop = loop -1;
					$("#loop_video").val(loop);
					var t = document.getElementById('video');
					t.play();
				}   

			}, false);

		 </script>
			}
	<?php } else if( $MEDIA["type"]=="text" ) { ?>
	
		<div id="rss" class="media contenedor_image" style="display:table; color:white; font-size:0.82em; font-family:'Arial', sans-serif; background:black; text-align:center;">
			<div class="child" style="display:table-cell; vertical-align:middle;" >
				<?php echo $MEDIA["value"]; ?>
			</div>
		</div>
		<script type="text/javascript">

			var myVar;

			myVar = setTimeout(function() { 
			
				window.location.reload(true); 

			}, <?=$MEDIA["duration"]?>*1000);

			function myStopFunction() {
			    clearTimeout(myVar);
			}

		</script>
	<?php } else if( $MEDIA["type"]=="streaming" ) { 

		    $connected = @fsockopen("www.google.com", 80); 
		                                        //website, port  (try 80 or 443)
		    if ($connected){
		        $is_conn = true; //action when connected
		        fclose($connected);
		    }else{
		        $is_conn = false; //action in connection failure
		    }

		?>
		<?php if ($is_conn){ ?>
			<iframe src="<?=$MEDIA["value"]?>" class="media" onerror="window.location.reload(true);"></iframe>
			<script type="text/javascript">

				setTimeout(function(){ location.reload(true); }, <?=$MEDIA["duration"]?>*1000);
				
			</script>
		<?php }else{ ?>
			<script type="text/javascript">
				window.location.reload(true);
			</script>
		<?php } ?>
	<?php } ?>


