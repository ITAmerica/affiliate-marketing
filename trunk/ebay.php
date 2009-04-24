<?php
    $setting = array(
        'bdrcolor' => 'ffffff',
        'cid'      => 0,
        'eksize'   => 10,
        'encode'   => 'UTF-8',
        'endcolor' => 'ff0000',
        'endtime'  => 'n',
        'fbgcolor' => 'ffffff',
        'fntcolor' => '000000',
        'fs'       => 0,
        'hdrcolor' => 'ffffff',
        'hdrimage' => 1,
        'hdrsrch'  => 'n',
        'img'      => 'y',
        'lnkcolor' => 'A43907',
        'logo'     => 3,
        'num'      => 50,
        'numbid'   => 'n',
        'paypal'   => 'n',
        'popup'    => 'y',
        'bin'      => 'n',
        'prvd'     => 9,
        'r0'       => 3,
        'query'    => '',
        'shipcost' => 'n',
        'siteid'   => 0,
        'sort'     => 'MetaEndSort',
        'sortby'   => 'endtime',
        'sortdir'  => 'asc',
        'srchdesc' => 'n',
        'tbgcolor' => 'ffffff',
        'tlecolor' => 'ffffff',
        'tlefs'    => 0,
        'tlfcolor' => '000000',
        'toolid'   => 10004,
        'track'    => 5336046499,
        'width'    => 748
    );
    $params  = array_merge($setting, $_GET);
    $request = 'http://lapi.ebay.com/ws/eBayISAPI.dll?EKServer';

    foreach ($params as $k=>$v) {
        $request .= '&'.$k.'='.urlencode($v);
    }
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="content-language" content="en">
<title>eBay</title>
<style type="text/css">
body {
    margin: 0;
    padding: 0;
    background-color: transparent;
}
</style>
</head>
<body>
<script language="JavaScript" src="<?php echo $request; ?>"></script>
</body>
</html>