<?php
header("Content-Type: application/json"); $WINBOX = "/home/winbox/winbox"; $LOGS = [];
foreach( scandir("$WINBOX/data/logs", SCANDIR_SORT_DESCENDING) as $file ) {
	if( array_search( $file, [".", "..", ".gitignore", "access.log", "error.log"] ) ) { continue; }
	if( count($LOGS)>=25 ) { break; }
	$logs = @file("$WINBOX/data/logs/$file");
	foreach( array_reverse($logs) as $log ) {
		if( count($LOGS)>=25 ) { break; }
		$LOGS[] = str_replace("\n", "", $log);
	}
}
echo json_encode( array_reverse($LOGS) );
