<?php
if( $_SERVER["REQUEST_METHOD"]!="POST" ) { header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404); echo "<h1>404 Not Found</h1>"; exit(); }

$WINBOX = "/home/winbox/winbox"; file_put_contents("$WINBOX/data/config.json", json_encode($_POST));
file_put_contents("$WINBOX/data/logs/".date("Y-m-d").".log", date("[Y-m-d H:i:s]")." [INFO]  Winbox license is now ACTIVE!
", FILE_APPEND);
unlink(__FILE__);