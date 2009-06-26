<?php
    $setting = array(
        'ai'       => 'ny{ze|yq!',
        'bdrcolor' => 'FFCC00', // Border color
        'bin'      => 'n',      // Show Buy It Now items only
        'catid'    => '',       // Items in these categories (use + to join categories eg. 11450+382)
        'cid'      => '0', // ??? no idea what is this ??? //
        'eksize'   => '10', /* Banner Size
                                1 = Custom Display
                                2 = Leaderboard (728 x 90),
                                3 = Full Banner (468 x 60)
                                4 = Half Banner (234 x 60)
                                5 = Medium Rectangle (300 x 250)
                                6 = Rectangle (180 x 150)
                                7 = Square Pop-up (250 x 250)
                                8 = Square Button (125 x 125)
                                9 = Wide Skyscraper (160 x 600)
                                10 = Wide Skyscraper (160 x 600)
                                11 = Skyscraper (120 x 600) */
        'encode'   => 'UTF-8',
        'endcolor' => 'FF0000', // Auction Time Left color
        'endtime'  => 'y',      // show Auction Time Left
        'fbgcolor' => 'FFFFFF', // Footer Background color
        'fntcolor' => '000000', // Body Text color
        'fs'       => '3',      /* Body Font
                                     0 = Arial Medium
                                     1 = Verdana Medium
                                     2 = Times Medium
                                     3 = Verdana Small
                                     4 = Times Small */
        'hdrcolor' => 'FFFFFF', // Header color
        'hdrimage' => '1',
        'hdrsrch'  => 'n',      // Show a search box in the Editor Kit header
        'height'   => '',       // Minimum height in pixels
        'img'      => 'y',      // Gallery Image (If no image a camera icon will appear)
        'lnkcolor' => '0000FF', // Link color
        'logo'     => '3',      /* Logo Size
                                     1 = Large(144x59)
                                     2 = Medium (108x45)
                                     3 = Small(85x35) */
        'maxprice' => '',       // Maximum Price
        'minprice' => '',       // Minimum Price
        'num'      => '50',     // items displayed at a time (Height will adjust to the number of items)
        'numbid'   => 'n',      // show Number of Bids
        'paypal'   => 'n',      // Show PayPal icon
        'popup'    => 'y',      // Open links in a new browser window
        'prvd'     => '9',      /* Provider
                                     0 = Not an affiliate
                                     5 = Mediaplex
                                     9 = eBay Partner Network */
        'query'    => '',       // Search keywords (Use -keyword to exclude result)
        'r0'       => '4',      /* When Editor Kit returns no search results
                                     1 = Show Editor Kit with no results
                                     2 = Don't show Editor Kit at all
                                     3 = Show a dynamically sized search box inside the Editor Kit for users to search eBay listings
                                     4 = Show Most Watched Items in the (sacategoryin) category  */
        'sacategoryin' => '',   // same with catid
        'shipcost' => 'y',      // Shipping Cost (Mouseover will appear over the item price)
        'si'       => '',       // Items from these sellers ID (Enter up to 10 User IDs separated by commas)
        'sid'      => '',       // Custom ID (use in ePN transaction download reporting)
        'siteid'   => '0', // ??? no idea what is this ??? //
        'sort'     => 'MetaEndSort', /* Sort By
                                          MetaEndSort          = Items ending first
                                          MetaNewSort          = Newly-listed items first
                                          MetaLowestPriceSort  = Lowest prices first
                                          MetaHighestPriceSort = Highest prices first */
        'sortby'   => 'endtime',
        'sortdir'  => 'desc',   // asc | desc
        'srchdesc' => 'y',      // Search title and description to find more items
        'tbgcolor' => 'FFFFFF', // Body Background color
        'title'    => '',       // Title
        'tlecolor' => 'FFCE63', // Title Background color
        'tlefs'    => '0',      /* Title Font
                                     0 = Arial Medium
                                     1 = Verdana Medium
                                     2 = Times Medium
                                     3 = Verdana Small
                                     4 = Times Small */
        'tlfcolor' => '333333', // Title Text color
        'toolid'   => '10004',//### DON'T CHANGE THIS ###//
        'track'    => '',       // Campaign ID
        'watchcat' => '',       /* Category IDs: Show Most Watched Items if no search results found
                                   (leave this field blank to indicate All Category) */
        'width'    => '746'     // Width in pixels
    );

    $params  = array_merge($setting, $_GET);
    $request = 'http://lapi.ebay.com/ws/eBayISAPI.dll?EKServer';

    foreach ($params as $k=>$v) {
        if ($v || $v == '0') {
            $request .= '&'.$k.'='.urlencode($v);
        }
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