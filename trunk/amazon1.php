<?php
  session_start();
  require_once 'includes/tarzan.class.php';

  function format_number ($num) {
      return number_format($num/100, 2);
  } // format_number

  $item_id = $_POST['asin'];

  $aaws = new AmazonAAWS('AKIAITRZR5LXLG4QILTA', '0Z/hDsa8nnvqP/wa+/ylHi5GI0NemY5lGf6X9J+7', 'ipowerhostcou-20');
  $opt  = array(
      'Condition'     => 'New',
      'ResponseGroup' => 'EditorialReview,OfferSummary,ItemAttributes,SalesRank,Images,OfferListings,Offers,Reviews'
  );
  $get = $aaws->item_lookup($item_id, $opt);
  $i   = 0;

  $item = $get->body->Items->Item;
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

      $itemOfferId = '';
      $averagePR   = (float) $item->CustomerReviews->AverageRating;
      $description = '';
      $imagesets   = $features  = $detail = $customerReviews = array();
      $salesrank   = (int) $item->SalesRank;
      $binding     = (string) $item->ItemAttributes->Binding;
      $color       = (string) $item->ItemAttributes->Color;
      $brand       = (string) $item->ItemAttributes->Brand;
      $model       = (string) $item->ItemAttributes->Model;
      $release     = (string) $item->ItemAttributes->ReleaseDate;
      $numItems    = (int) $item->ItemAttributes->NumberOfItems;
      $dimension   = $item->ItemAttributes->ItemDimensions;

      if (is_object($item->ImageSets->ImageSet)) {
          foreach ($item->ImageSets->ImageSet as $imageset) {
              $imagesets[] = array(
                  'thumb' => (string) $imageset->SwatchImage->URL,
                  'large' => (string) $imageset->LargeImage->URL
              );
          }
      }
      if ($averagePR > 0) {
          $averagePR = $averagePR * 10;
      }
      if ($salesrank) {
          $detail[] = 'Amazon Sales Rank: #'.$salesrank.' in '.$binding;
      }
      if ($color) {
          $detail[] = 'Color: '.$color;
      }
      if ($brand) {
          $detail[] = 'Brand: '.$brand;
      }
      if ($model) {
          $detail[] = 'Model: '.$model;
      }
      if ($release) {
          $detail[] = 'Released on: '.$release;
      }
      if ($numItems) {
          $detail[] = 'Number of items: '.$numItems;
      }
      if (is_object($item->Offers->Offer->OfferListing)) {
          $description = (string) $item->Offers->Offer->OfferListing->OfferListingId;
      }
      if (is_object($item->EditorialReviews->EditorialReview)) {
          $description = (string) $item->EditorialReviews->EditorialReview->Content;
      }
      if (is_object($dimension)) {
          $detail[] = 'Dimensions: '.format_number($dimension->Height).'" h x ' .
                      format_number($dimension->Width).'" w x ' .
                      format_number($dimension->Length).'" l, ' .
                      format_number($dimension->Weight).' pounds';
      }
      if (is_object($item->ItemAttributes->Feature)) {
          foreach ($item->ItemAttributes->Feature as $feature) {
              $features[] = (string) $feature;
          }
      }
      if (is_object($item->CustomerReviews->Review)) {
          foreach ($item->CustomerReviews->Review as $review) {
              $customerReviews[] = array(
                  'Summary' => (string) $review->Summary,
                  'Rating'  => ((float) $review->Rating) * 10,
                  'Content' => (string) $review->Content
              );
          }
      }
      if (is_object($item->Offers->Offer->OfferListing)) {
          $available = (string) $item->Offers->Offer->OfferListing->Availability;
      } else {
          $available = '';
      }

      $details = array(
          'ASIN'            => (string) $item->ASIN,
          'OfferListingId'  => $itemOfferId,
          'SalesRank'       => $salesrank,
          'Image'           => (string) $item->MediumImage->URL,
          'ImageSets'       => $imagesets,
          'Brand'           => (string) $item->ItemAttributes->Brand,
          'Manufacturer'    => (string) $item->ItemAttributes->Manufacturer,
          'ProductGroup'    => (string) $item->ItemAttributes->ProductGroup,
          'Publisher'       => (string) $item->ItemAttributes->Publisher,
          'ReleaseDate'     => $release,
          'Title'           => (string) $item->ItemAttributes->Title,
          'ListPrice'       => $d_price,
          'CurrencyCode'    => $s_ccode,
          'LowestNewPrice'  => $d_lowest,
          'discount'        => $i_discount,
          'Availability'    => $available,
          'AverageRating'   => $averagePR,
          'Content'         => $description,
          'ProductDetails'  => $detail,
          'Features'        => $features,
          'CustomerReviews' => $customerReviews
      );

  $json = array(
      'status'  => 1,
      'details' => $details
  );
  echo json_encode($json);
  $_SESSION['json'] = $json;
  exit;
?>
<pre><?php print_r($details); ?></pre>