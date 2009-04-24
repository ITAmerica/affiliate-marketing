<?php // This is Auxiliary file be called/included to implement tasks without use any components //

	// Set the error reporting to minimal.
	@error_reporting(E_ERROR | E_WARNING | E_PARSE);

    $filePath  = getParam('file');
	$expires   = 3600 * 24 * 10; // Cache for 10 days in browser cache
	$encodings = array();
	$enc       = '';


	// Headers
	header('Content-type: text/javascript');
	header('Vary: Accept-Encoding'); // handle proxies..
	header('Expires: '.gmdate('D, d M Y H:i:s', time()+$expires).' GMT');

	if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])) { // Check if it supports gzip
        $encodings = explode(',', strtolower(preg_replace("/\s+/", '', $_SERVER['HTTP_ACCEPT_ENCODING'])));
    }
	if ((in_array('gzip', $encodings) || in_array('x-gzip', $encodings) || isset($_SERVER['---------------']))) {
		$enc = in_array('x-gzip', $encodings) ? 'x-gzip' : 'gzip';
	}

	if ($enc && file_exists($filePath).'.js.gz') {
        header('Content-Encoding: '.$enc);
        echo getFileContents($filePath.'.js.gz');
        exit;
	} else if (file_exists($filePath).'.js') {
        echo getFileContents($filePath.'.js');
        exit;
    }

    exit;



    //
    // private functions
    //
	function getParam ($name, $def=false) {
		if (!isset($_GET[$name])) {
            return $def;
        }
		return preg_replace("/[^0-9a-z\-_,\/]+/i", '', $_GET[$name]); // Remove anything but 0-9,a-z,-_
	} // getParam


	function getFileContents ($path) {
		$path = realpath($path);

		if (!$path || !@is_file($path)) {
            return '';
        }
		if (function_exists('file_get_contents')) {
            return @file_get_contents($path);
        }

		$content = '';
		$fp      = @fopen($path, 'r');

		if (!$fp) {
            return '';
        }
		while (!feof($fp)) {
            $content .= fgets($fp);
        }

		fclose($fp);

		return $content;
	} // getFileContents

?>