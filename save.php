<?php
  $phpfile = 'data/config.php';
  $jsfile  = 'data/config.js';
  include($phpfile);

  $config = array_merge($config, $_POST); // merge settings
  $phpStr = '';
  $jsStr  = file_get_contents('config.inc.js', true);
  $jsKey  = $jsValue = array();


  foreach ($config as $k=>$v) {
      $v       = str_replace("'", "\'", $v);
      $phpStr .= "'".$k."'=>'".$v."',";

      $jsKey[]   = '{'.$k.'}';
      $jsValue[] = $v;
  }
  $phpStr = substr($phpStr, 0, -1);

  $php = '<?php $config = array('.$phpStr.'); ?>';
  $js  = str_replace($jsKey, $jsValue, $jsStr);
  $fp1 = fopen($phpfile, 'w');
  $fp2 = fopen($jsfile, 'w');

  if ($fp1 && $fp2) {
      $fw1 = fwrite($fp1, $php);
      $fw2 = fwrite($fp2, $js);
      if ($fw1 && $fw2) {
          fclose($fp1);
          fclose($fp2);
          exit('1');
      }
  }

  exit('0');
?>
