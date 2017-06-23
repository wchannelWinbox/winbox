<?php $imagenesL = json_decode(file_get_contents("data/lateral.json"), true); ?>
<?php



		if ($_POST["aumentar"]=="no") {
			$imagenesL["actual"]=0;
		}else{
			$imagenesL["actual"]++;

		}

		file_put_contents("data/lateral.json", json_encode($imagenesL));
		echo "ok";
	

?>