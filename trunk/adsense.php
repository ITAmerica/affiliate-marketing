<?php
  session_start();
  include('data/config.php');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="content-language" content="en">
<title><?php echo $$config['sitename']; ?></title>
<style type="text/css">
body {
    margin: 0;
    padding: 0;
    background-color: transparent;
}
</style>
</head>
<body>

<div style="display:none;">
<?php
    echo $config['e_kerword1'].' '.$config['e_kerword2']."\r\n";
?>
</div>
<script type="text/javascript">
<!--
google_ad_client    = '<?php echo $config['adsenseId']; ?>';
google_ad_width     = 160;
google_ad_height    = 600;
google_ad_format    = "160x600_as";
google_ad_type      = "text";
google_ad_channel   = '<?php /*echo $config['adChannel'];*/ ?>';
google_color_border = "E15100";
google_color_bg     = "E15100";
google_color_link   = "000000";
google_color_text   = "000000";
google_color_url    = "000000";
google_ui_features  = "rc:0";
//-->
</script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>

</body>
</html>