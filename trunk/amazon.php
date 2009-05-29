<?php
  require_once 'includes/tarzan.class.php';

  $searchIndex = isset($_POST['searchIndex']) ? $_POST['searchIndex'] : 'all';
  $keywords    = isset($_POST['keywords']) ? $_POST['keywords'] : 'all';
  $page        = isset($_POST['page']) ? $_POST['page'] : 1;

  $aaws = new AmazonAAWS('AKIAITRZR5LXLG4QILTA', '0Z/hDsa8nnvqP/wa+/ylHi5GI0NemY5lGf6X9J+7', 'ipowerhostcou-20');
  $opt  = array(
//      'Availability'  => 'Available',
      'ItemPage'      => $page,
      'Condition'     => 'New',
      'ResponseGroup' => 'OfferSummary,ItemAttributes,SalesRank,Images',
      'SearchIndex'   => $searchIndex
  );
  $get = $aaws->item_search($keywords, $opt);
  $i   = 0;

  foreach ($get->body->Items->Item as $item) {
      $lprice = (int) $item->ItemAttributes->ListPrice->Amount;
      $lowest = (int) $item->OfferSummary->LowestNewPrice->Amount;

      if (!$lowest && !$lprice) {
          continue;
      }

      if ($lprice > 0) { // item has listprice
          $d_price = number_format($lprice / 100, 2);
          $s_ccode = (string) $item->ItemAttributes->ListPrice->CurrencyCode;
      } else {
          $d_price = '';
          $s_ccode = (string) $item->OfferSummary->LowestNewPrice->CurrencyCode;
      }
      if ($lowest > 0) { // item has lowest price
          $d_lowest   = number_format($lowest / 100, 2);
          $i_discount = '';
          if ($lprice > 0) {
              $i_discount = ($lprice - $lowest) / $lprice;
              $i_discount = (int) ($i_discount * 100);
          }
      } else {
          $d_lowest = $i_discount = '';
      }

      $list[$i] = array(
          'ASIN'           => (string) $item->ASIN,
          'SalesRank'      => (int) $item->SalesRank,
          'Image'          => (string) $item->MediumImage->URL,
          'Brand'          => (string) $item->ItemAttributes->Brand,
          'Manufacturer'   => (string) $item->ItemAttributes->Manufacturer,
          'ProductGroup'   => (string) $item->ItemAttributes->ProductGroup,
          'Publisher'      => (string) $item->ItemAttributes->Publisher,
          'ReleaseDate'    => (string) $item->ItemAttributes->ReleaseDate,
          'Title'          => (string) $item->ItemAttributes->Title,
          'ListPrice'      => $d_price,
          'CurrencyCode'   => $s_ccode,
          'LowestNewPrice' => $d_lowest,
          'discount'       => $i_discount
      );

      $i++;
  }

  $pagination = array(
      'TotalResults' => (int) $get->body->Items->TotalResults,
      'TotalPages'   => (int) $get->body->Items->TotalPages,
      'CurrentPage'  => $page,
      'Time'         => time(),
      'Keywords'     => ucwords($keywords)
  );

  $json = array(
      'status'     => 1,
      'pagination' => $pagination,
      'items'      => $list
  );
  echo json_encode($json);
  exit;
?>
<pre><?php print_r($list); ?></pre>