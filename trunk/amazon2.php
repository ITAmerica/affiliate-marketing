<?php
  session_start();

  require_once 'includes/tarzan.class.php';

  $item_id  = $_POST['asin'];
  $offer_id = $_POST['offerId'];

  if (!$offer_id) { // without offer id? no problem, use ASIN
      $opt = array(
          'Item.1.ASIN'     => $item_id,
          'Item.1.Quantity' => 1
      );
  } else {
      $opt = null;
  }

  /*$opt  = array(
      'ResponseGroup' => 'CartSimilarities'
  );*/

  $aaws = new AmazonAAWS('AKIAITRZR5LXLG4QILTA', '0Z/hDsa8nnvqP/wa+/ylHi5GI0NemY5lGf6X9J+7', 'ipowerhostcou-20');

  if (empty($_SESSION['cartId'])) { // create new cart
      $get  = $aaws->cart_create($offer_id, $opt);
      $cart = $get->body->Cart;
      $_SESSION['cartId'] = (string) $cart->CartId;
      $_SESSION['hmac']   = (string) $cart->HMAC;
  } else if (isset($_POST['itemId'])) {
      $get  = $aaws->cart_modify($_SESSION['cartId'], $_SESSION['hmac'], $offer_id, $opt);
      $cart = $get->body->Cart;
  } else {
      $get  = $aaws->cart_add($_SESSION['cartId'], $_SESSION['hmac'], $offer_id, $opt);
      $cart = $get->body->Cart;
  }

  $subtotal = (int) $cart->SubTotal->Amount;
  $json = array(
      'status'   => 1,
      'currency' => (string) $cart->SubTotal->CurrencyCode,
      'subtotal' => number_format($subtotal/100, 2),
  );

  if (is_object($cart->CartItems->CartItem)) {
      foreach ($cart->CartItems->CartItem as $item) {
          $price = (int) $item->Price->Amount;
          $total = (int) $item->ItemTotal->Amount;

          $items[] = array(
              'itemId' => (string) $item->CartItemId,
              'asin'   => (string) $item->ASIN,
              'title'  => (string) $item->Title,
              'qty'    => (string) $item->Quantity,
              'price'  => number_format($price/100, 2),
              'total'  => number_format($total/100, 2)
          );
      }
      $json['items'] = $items;
  }

  echo json_encode($json);
  exit;
?>
<pre><?php print_r($get->body); ?></pre>