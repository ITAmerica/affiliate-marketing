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

  $aaws = new AmazonAAWS('AKIAITRZR5LXLG4QILTA', '0Z/hDsa8nnvqP/wa+/ylHi5GI0NemY5lGf6X9J+7', 'ipowerhostcou-20');

  if (empty($_SESSION['cartId'])) {
      /*$opt  = array(
          'Condition'     => 'New',
          'ResponseGroup' => 'EditorialReview,OfferSummary,ItemAttributes,SalesRank,Images,Offers,Reviews'
      );*/
      $get  = $aaws->cart_create($offer_id, $opt);
      $cart = $get->body->Cart;

      $_SESSION['cartId'] = (string) $cart->CartId;
      $_SESSION['hmac']   = (string) $cart->HMAC;

      $subtotal = (int) $cart->SubTotal->Amount;
      $price    = (int) $cart->CartItems->CartItem->Price->Amount;

      $json = array(
          'status'   => 1,
          'currency' => (string) $cart->SubTotal->CurrencyCode,
          'subtotal' => number_format($subtotal/100, 2),
          'title'    => (string) $cart->CartItems->CartItem->Title,
          'qty'      => (int) $cart->CartItems->CartItem->Quantity,
          'price'    => number_format($price/100, 2)
      );
  }

  $get = $aaws->cart_add($_SESSION['cartId'], $_SESSION['hmac'], $offer_id, $opt);

  //echo json_encode($json);
  //exit;
?>
<pre><?php print_r($get); ?></pre>