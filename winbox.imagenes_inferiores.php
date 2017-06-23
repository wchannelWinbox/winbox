<?php $imagenesI = json_decode(file_get_contents("data/inferior.json"), true); ?>
<?php


		if ($_POST["aumentar"]=="no") {
			$imagenesI["actual"]=0;
		}else{
			$imagenesI["actual"]++;

		}

		file_put_contents("data/inferior.json", json_encode($imagenesI));
		echo "ok";
	

?>