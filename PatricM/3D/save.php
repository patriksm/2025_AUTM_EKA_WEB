<?php
	if(!empty($_POST['data'])){
		$data = $_POST['data'];
		$fname = "bullets.txt";
		
		$file = fopen("upload/".$fname, 'a');
		fwrite($file, $data);
		fclose($file);
	}
?>