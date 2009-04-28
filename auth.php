<?php
  session_start();
  function config () {
      include('data/config.php');
      $json = array();

      foreach ($config as $key=>$val) {
          $json[] = array(
              'k' => $key,
              'v' => $val
          );
      }
      return json_encode($json);
  } // config

  if (isset($_POST['password']) && $_POST['password']) { // attempt login
      include('data/config.php');
//sleep(1);
      if ($_POST['password'] == $config['pwd']) {
          $_SESSION['logged'] = true;
          $json = config();
          exit($json);
      }
      exit('0');
  }
  if (empty($_SESSION['logged'])) {
      exit('0');
  }

  $json = config();
  exit($json);
?>