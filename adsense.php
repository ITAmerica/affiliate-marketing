<?php
  session_start();
  include('data/config.php');

  function array2str ($data) {
      $html = '';
      if (is_array($data)) {
          foreach ($data as $k=>$v) {
              if (is_array($v)) {
                  $html .= '<hr size="1" />'.array2str($v);
              } else {
                  if (is_int($k)) {
                      $html .= '<li>'.$v.'</li>';
                  } else {
                      $html .= '<div><b>'.$k.':</b> '.$v.'</div>';
                  }
              }
          }
          return $html;
      }
      return $data;
  } // array2str
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="content-language" content="en">
<title><?php echo $config['sitename']; ?></title>
<style type="text/css">
body {
    margin: 0;
    padding: 0;
    font-family: Verdana;
    font-size: 12px;
    background-color: transparent;
}
</style>
</head>
<body>

<div style="width:160px; height:600px;">
<script type="text/javascript">
<!--
google_ad_client    = '<?php echo $config['adsenseId']; ?>';
google_ad_width     = 160;
google_ad_height    = 600;
google_ad_format    = "160x600_as";
google_ad_type      = "text";
google_ad_channel   = '<?php /*echo $config['adChannel'];*/ ?>';
//-->
</script>
<script type="text/javascript" src="templates/<?php echo $config['template']; ?>/adsense.js"></script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
</div>

<div id="content" style="width:900px; margin:10px;">
<?php
    echo '<div><b>Keywords:</b> '.$config['e_kerword1'].', '.$config['e_kerword2']."</div>";
    echo array2str($_SESSION['json']);
?>
</div>

</body>
</html>