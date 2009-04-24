<?php
  session_start();
  if ($_POST['password']) {
sleep(3);
      if ($_POST['password'] == 'abc123') {
          exit('1');
      }
      exit('0');
  }
  if (empty($_SESSION['logged'])) {
      exit('0');
  }
  echo 1;
?>