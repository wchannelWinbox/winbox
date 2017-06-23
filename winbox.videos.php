<?php

	$directorio = "data/media/";
	$archivos = scandir($directorio);
	$files = "";
	foreach ($archivos as $key => $value) {
		$es_video = stripos($value, '.MP4');
		$es_video_2 = stripos($value, '.mp4');
		if($es_video || $es_video_2){
			$files[]=$value;
		}
		

	}

	echo json_encode($files);
	

?>
