var _rootpath   = '../../';
var _cache      = [];
var _cartData   = [];
var _logged     = false;
var _cartTpl    = '';
var _listingTpl = '';
var _detailsTpl = '';
var _reviewsTpl = '';
var _puchaseURL = '';

function goto (page) {
    var content = Ext.get('content');

    if (page == 5) { // open cart no need to hide current page
        openCart();
    } else {
        Ext.select('.links').each(function(e){
            e.setStyle({ display:'none' });
        });
    }

    if (page == 1) {
        Ext.select('div.shop', false, 'content').setStyle({ display:'block' });;
    } else if (page == 2) {
        if (Ext.fly('auction') == null) {
            var code = '<iframe id="auction" src="'+_rootpath+'ebay.php?ai='+eBayAId+'&query='+e_kerword1+'&eksize=1&num=12&minprice=100"' +
                       ' frameborder="0" allowtransparency="true" class="content links" style="display:none;"></iframe>';
            content.insertHtml('beforeEnd', code);
        }
        Ext.select('div.shop', false, 'content').setStyle({ display:'none' });
        showPage('auction');
    } else if (page == 3) {
        if (!Ext.fly('news')) {
            var para = Ext.urlEncode(n);
            var code = '<iframe id="news" src="http://www.feedzilla.com/tools/steppatch_nc_frame.asp?'+para+'"'+
                       ' frameborder="0" allowtransparency="true" class="content links" style="display:none;"></iframe>';
            content.insertHtml('beforeEnd', code);
        }
        Ext.select('div.shop', false, 'content').setStyle({ display:'none' });
        showPage('news');
    } else if (page == 4) {
        if (!Ext.fly('video')) {
            var code = '<embed id="video" class="links" src="http://www.blinkx.com/w?g_sApiQuery=%2Fapi3%2Fstart%2Ephp%3Faction%3Dquery%26databasematch%3Dmedia%26totalresults%3Dtrue%26text%3D'+v_keyword+'%26start%3D1%26maxresults%3D36%26sortby%3Drelevance%26removedredatabases%3DPodcast%26fieldtext%3D%26clientregion%3DHI%26characters%3D10000%26clientip%3D118%2E100%2E142%2E105g%5FiQueryOffset%3D0&g_StageWidth='+width+'&g_StageHeight='+height+'&g_ApiServer=www.blinkx.com&g_sImgServer=http://cdn-99.blinkx.com/store" width="'+width+'" height="'+height+'" quality="high" bgcolor="#000000" name="newwall" align="middle" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
           content.insertHtml('beforeEnd', code);
        }
        Ext.select('div.shop', false, 'content').setStyle({ display:'none' });
        showPage('video');
    }
} // goto

function showPage (page) {
    Ext.fly(page).fadeIn({
        easing: 'easeOut',
        duration: 2
    });
} // showPage

function generate_ebay (e) {
    var para = Ext.urlEncode(e);
    var code = '<iframe src="'+_rootpath+'ebay.php?ai='+eBayAId+'&'+para+'" frameborder="0" allowtransparency="true" class="ebay_sm"></iframe>';
    document.write(code);
} // generate_ebay

function openBrWindow (URL) {
    var popup = window.open(URL, 'PopupWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=540,height=530');
} // openBrWindow

function checkAuth () {
    if (Ext.get('popup') == null) {
        console.log('page not ready');
        return;
    }
    if (_logged) {
        Ext.get('settings').setStyle({ display:'block' });
        openPopup();
        return;
    }

    Ext.Ajax.request({
        url: _rootpath+'auth.php',
        method: 'GET',
        success: function(response, opts) {
            var stt = response.responseText;
            if (!stt || stt == '0' || stt === 0) {
                Ext.get('login').setStyle({ display:'block' });
                openPopup();
            } else { // logged
                showSetting(stt);
                setTimeout('openPopup()', 1000);
            }
        },
        failure: function(response, opts) {
            // what to do?
        }
    });
} // checkAuth

function overlay (closeCallback) {
    if (!Ext.get('overlay')) {
        Ext.DomHelper.append(document.body, {
            id: 'overlay',
            style: 'position:absolute; top:0; left:0; background-color:#fff; display:none;'
        });
    }
    Ext.fly('overlay').removeAllListeners().on('click', closeCallback);

    var el = Ext.get('overlay');
    el.setHeight(Ext.getBody().getHeight());
    el.setWidth(Ext.getBody().getWidth());
    el.fadeIn({
        easing: 'easeOut',
        endOpacity: .6,
        duration: .5
    });
} // overlay

function removeOverlay () {
    Ext.fly('overlay').fadeOut({
        easing: 'easeOut',
        duration: .5,
        useDisplay: true
    });
} // removeOverlay

function scrollTop () {
    var speed     = 100;
    var scrollTop = Ext.fly('loader').getY() - 5;

    if (Ext.isSafari || Ext.isChrome) {
        var curScroll = document.body.scrollTop;
    } else {
        var curScroll = document.documentElement.scrollTop;
    }

    if (Ext.isIE || Ext.isSafari) {
        speed = 60;
    } else if (Ext.isChrome) {
        speed = 1;
    }

    while (curScroll > scrollTop) {
        curScroll -= speed;
        if (curScroll < scrollTop) {
            curScroll = scrollTop;
        }
        if (Ext.isSafari || Ext.isChrome) {
            document.body.scrollTop = curScroll;
        } else {
            document.documentElement.scrollTop = curScroll;
        }
    }
} // scrollTop

function showLoader () {
    Ext.get('loader').slideIn('t', {
        easing: 'easeOut'
    });
} // showLoader

function hideLoader () {
    Ext.get('loader').stopFx().slideOut('t', {
        easing: 'easeIn'
    });
} // hideLoader

function openCart () {
    if (!_cartTpl) { // steady man, DOM not ready..
        return false;
    }

    var el = Ext.get('shoppingcart'); // element
    var bw = Ext.lib.Dom.getViewportWidth(); // body width
    var bh = Ext.lib.Dom.getViewportHeight(); // body height
    var sw = el.getWidth(); // shoppingcart width
    var sh = el.getHeight(); // shopping height
    var lt = Math.round((bw - sw) / 2); // left
    var tp = Math.round((bh - sh) / 2); // top
    var sl = Ext.getBody().getScroll(); // scroll position

    overlay(closeCart);
    el.setLeft(lt);
    el.setTop(sh-(sh*2));
    el.show();
    el.moveTo(lt, sl.top+tp, {
        easing: 'easeOut',
        duration: 1
    });
} // openCart

function closeCart () {
    var el = Ext.get('shoppingcart'); // element
    var sl = el.getLeft(); // shoppingcart left
    var sh = el.getHeight(); // shopping height
    var tp = sh - (sh * 2); // top

    removeOverlay();
    el.moveTo(sl, tp, {
        easing: 'easeIn',
        duration: 1
    });
} // closeCart

function openPopup () {
    var dwidth  = document.documentElement.clientWidth;
    var dheight = document.documentElement.clientHeight;
    var popup   = Ext.get('popup');
    var eheight = popup.getHeight();
    var scroll  = Ext.getBody().getScroll();

    var left = Math.round((dwidth - popup.getWidth()) / 2);
    var top  = Math.round((dheight - eheight) / 2);
    var top2 = top + scroll.top;

    overlay(closePopup);
    popup.setLeft(left);
    popup.setTop(scroll.top-eheight);
    popup.show();
    popup.moveTo(left, top2, {
        easing: 'easeOut',
        duration: 1,
        callback: function() {
            popup.setStyle({ position:'fixed', top:top+'px', left:left+'px' });
        }
    });
} // openPopup

function closePopup () {
    var el = Ext.get('popup');
    var h  = el.getHeight();
    var s  = Ext.getBody().getScroll().top;
    var y  = s - h;
    var x  = el.getX();
    var ct = Math.round((document.documentElement.clientHeight - h) / 2) + s;

    removeOverlay();
    el.setStyle({ position:'absolute', top:ct+'px' });
    el.moveTo(x, y, {
        easing: 'easeIn',
        duration: 1,
        callback: function() {
            //el.setStyle({ top:'-'+h+'px', left:x+'px' });
            el.hide();
            Ext.get('settings').setStyle({ display:'none' });
            Ext.get('login').setStyle({ display:'none' });
        }
    });
} // closePopup

function login () {
    var el  = Ext.get('login');
    var msg = Ext.get('message');
    var pwd = Ext.get('password').getValue();

    if (!pwd) {
        Ext.getDom('message').innerHTML = 'Please enter password';
        msg.dom.className = 'error';
        if (!msg.hasActiveFx()) {
            msg.slideIn('t').pause(5).slideOut('t', { useDisplay:true });
        }
        return false;
    }

    el.slideOut('l', {
        easing: 'easeOut',
        useDisplay: true,
        callback: function() {
            checkLogin();
        }
    });

    return false;
} // login

function checkLogin () {
    var msg = Ext.get('message');

    msg.dom.innerHTML = 'verifying..';
    msg.dom.className = 'loading';
    msg.slideIn('l', {
        easing:'easeOut'
    });

    Ext.Ajax.request({
        url: _rootpath+'auth.php',
        method: 'POST',
        success: function(response, opts) {
            msg.slideOut('l', {
                easing: 'easeOut',
                useDisplay: true,
                callback: function() {
                    showSetting(response.responseText);
                }
            });
        },
        failure: function(response, opts) {
            // what to do?
            msg.slideOut('l', {
                easing: 'easeOut',
                useDisplay: true
            });
        },
        params: 'password='+Ext.fly('password').getValue()
    });
} // checkLogin

function showSetting (stt) {
    var el  = Ext.get('settings');
    var msg = Ext.get('message');

    if (!stt || stt == '0' || stt === 0) {
        Ext.getDom('message').innerHTML = 'Enter wrong password';
        Ext.fly('password').dom.value   = '';
        msg.dom.className = 'error';
        msg.slideIn('l').pause(5).slideOut('t', { useDisplay:true });
        Ext.fly('login').slideIn('l', {
            easing: 'easeOut'
        });
    } else {
        var obj = eval('('+stt+')');
        _logged = true;

        Ext.each(obj, function(o){
            Ext.fly(o.k).dom.value = o.v;
        });
        el.slideIn('l', {
            easing: 'easeOut'
        });
    }
} // showSetting

function save () {
    var msg = Ext.get('message');
    Ext.Ajax.request({
        url: _rootpath+'save.php',
        form: 'settingsForm',
        success: function(response, opts) {
            var res = response.responseText;
            if (res) {
                Ext.getDom('message').innerHTML = 'Settings saved successfully!';
                msg.dom.className = 'notice';
                msg.slideIn('l').pause(2).fadeOut({ useDisplay:true });

                var close = this.closePopup;
                setTimeout(function(){ close(); }, 1000);
            }
        }
    });

    return false;
} // save

function loadDom () {
    Ext.Ajax.request({
        url: _rootpath+'popup.inc.html',
        success: function(response, opts) {
            var html = response.responseText;
            if (html) {
                Ext.getBody().insertHtml('beforeEnd', html);
            }
        }
    });

    if (Ext.get('shoppingcart') == null) { // use default shopping cart template
        Ext.Ajax.request({
            url: _rootpath+'shoppingcart.inc.html',
            success: function(response, opts) {
                var html = response.responseText;
                if (html) {
                    Ext.getBody().insertHtml('beforeEnd', html);
                    initCart();
                }
            }
        });
    } else { // custom shopping cart template found
        initCart();
    }

    if (Ext.get('listing') == null) {
        Ext.Ajax.request({
            url: _rootpath+'listing.inc.html',
            success: function(response, opts) {
                var html = response.responseText;
                if (html) {
                    Ext.fly('content').down('div').insertHtml('beforeEnd', html);
                    initListing();
                }
            }
        });
    } else {
        initListing();
    }

    if (Ext.get('details') == null) {
        Ext.Ajax.request({
            url: _rootpath+'details.inc.html',
            success: function(response, opts) {
                var html = response.responseText;
                if (html) {
                    Ext.fly('content').down('div').insertHtml('beforeEnd', html);
                    initDetails();
                }
            }
        });
    } else {
        initDetails();
    }
} // loadDom

function getYear () {
    var date = new Date();
    return date.getFullYear();
} // getYear

function itemSearch (page) {
    var page = typeof(page) == 'undefined' ? 1 : page;
    var id   = '';

    if (!_listingTpl) {
        return false;
    }

    scrollTop();

    Ext.each(_cache, function(e){
        if (e.search == page && e.id) {
            id = e.id;
        }
    });
    if (id) {
        switchBanner(id);
        Ext.each(Ext.select('div.itemsShowing', false, 'listing'), function(e){
            e.setStyle({ display:'none' });
        });
        Ext.get(id).fadeIn();
        return;
    }

    showLoader();
    Ext.each(Ext.select('div.itemsShowing', false, 'listing'), function(e){
        e.fadeOut({ endOpacity: .4 });
    });
    Ext.Ajax.request({
        url: _rootpath+'amazon.php',
        method: 'POST',
        success: function(response, opts) {
            hideLoader();
            displayItems(response);
        },
        failure: function(response, opts) {
            // what to do?
            hideLoader();
        },
        params: 'searchIndex='+searchIdx+'&keywords='+e_kerword1+'&page='+page
    });
} // itemSearch

function displayItems (response) {
    var obj = eval('('+response.responseText+')');
    var total  = obj.pagination.TotalResults;
    var pages  = obj.pagination.TotalPages;
    var page   = obj.pagination.CurrentPage;
    var time   = 'p'+obj.pagination.Time;
    var ititle = obj.pagination.Keywords;
    var paging = '';
    var range  = 3;
    var start  = (page * 10) - 9;
    var end    = (start+9 > total) ? total : start+9;
    var recset = start+' - '+end;

    var tmp   = pages - page - 3;
    var prev  = (tmp < 0) ? tmp : 0;
    var navig = page - 3 + prev;
    var nsize = range * 2 + 1;
    var count = 1;

    switchBanner(time);

    while (count <= nsize) {
        if (navig > 0) { // page has to be positive number
            if (navig > pages) { // reached total pages
                break;
            } else if (navig == page) { // current page
                paging += '<span class="currentPage">['+navig+']</span>';
            } else {
                paging += '<span class="page" onclick="itemSearch('+navig+')">'+navig+'</span>';
            }
            count++;
        }
        navig++;
    }

    var titleHTML      = _listingTpl.title.apply({ title:ititle });
    var navigationHTML = _listingTpl.nav.apply({
        recordset: recset,
        total: total,
        pagination: paging
    });

    var bodyTpl  = _listingTpl.items;
    var bodyHTML = '<div class="itemsBody">';
    Ext.each(obj.items, function(o){
        var title = o.Title.substr(0, 50)+'...';
        var price = (o.LowestNewPrice) ? o.LowestNewPrice : o.ListPrice;
        var sumry = '';

        if (o.LowestNewPrice) {
            if (o.ListPrice) {
                sumry += 'List Price: <span class="listprice">$'+o.ListPrice+'</span><br />';
            }
            sumry += 'Our Price: <span class="ourprice">$'+o.LowestNewPrice+'</span><br />';
        } else if (o.ListPrice) {
            sumry += 'Our Price: <span class="ourprice">$'+o.ListPrice+'</span><br />';
        }
        if (o.Manufacturer) {
            sumry += 'Manufacturer: '+o.Manufacturer;
        } else if (o.Publisher) {
            sumry += 'Publisher: '+o.Publisher;
        }

        bodyHTML += '<div class="itemBlk left">'+bodyTpl.apply({
            title: o.Title,
            asin: o.ASIN,
            offerId: o.OfferListingId,
            stitle: title,
            summary: sumry,
            thumbnail: o.Image,
            details: 'Details',
            addCart: 'Add',
            price: '$'+price
        })+'</div>';
    });
    bodyHTML += '<div class="clear"></div></div>';
    fullHTML  = '<div id="'+time+'" class="itemsShowing" style="display:none;">'+titleHTML+navigationHTML+bodyHTML+navigationHTML+'</div>';

    _cache.push({ search:page, id:time });

    Ext.each(Ext.select('div.itemsShowing', false, 'listing'), function(e){
        e.setStyle({ display:'none' });
    });
    Ext.fly('listing').insertHtml('beforeEnd', fullHTML);
    Ext.fly(time).fadeIn();
} // displayItems

function viewDetail (asin) {
    var el = Ext.get(asin);

    if (!_detailsTpl) {
        return false;
    }

    scrollTop();

    if (el) { // already loaded, just display it! fast enough :)
        switchBanner(asin);
        el.show();
        switchLeft();
        return;
    }

    showLoader();
    Ext.select('div.itemsShowing', false, 'listing').fadeOut({ endOpacity: .4 });
    Ext.Ajax.request({
        url: _rootpath+'amazon1.php',
        method: 'POST',
        success: function(response, opts){
            hideLoader();
            displayDetails(response);
        },
        failure: function(response, opts) { // what to do?
            hideLoader();
            Ext.select('div.itemsShowing', false, 'listing').setOpacity(1);
        },
        params: 'asin='+asin
    });
} // viewDetail

function displayDetails (response) {
    var o = eval('('+response.responseText+')');
    var d = o.details;
    var t = '<div id="'+d.ASIN+'" class="detailsWrap">'+_detailsTpl+'</div>';
    var t = new Ext.Template(t);
    var v = {
        img: d.Image,
        title: d.Title,
        asin: d.ASIN,
        offerId: d.OfferListingId,
        avgRating: d.AverageRating,
        description: d.Content,
        sessionId: ''
    };

    switchBanner(d.ASIN);

    if (Ext.isArray(d.ImageSets) && d.ImageSets.length > 0) {
        var imgcnt  = 1;
        v.imageSets = '';
        Ext.each(d.ImageSets, function(e){
            var imageId  = d.ASIN+'-'+imgcnt;
            if (Ext.isIE7) { // ya ya, fucking IE7 again..
                v.imageSets += '<div onclick="openBrWindow(\''+e.large+'\')" class="imageset click" style="background-image:url('+e.thumb+');"></div>';
            } else {
                v.imageSets += '<a href="#'+imageId+'" id="'+imageId+'_link">' +
                                 '<div class="imageset" style="background-image:url('+e.thumb+');"></div>' +
                               '</a><div id="'+imageId+'" style="display:none;"><img src="'+e.large+'" /></div>';
            }
            imgcnt++;
        });
    }
    if (d.ListPrice) {
        v.listprice = d.ListPrice;
    }
    if (d.LowestNewPrice) {
        v.offerprice = d.LowestNewPrice;
    }
    if (d.discount) {
        v.saver = ', this means <span style="color:red;">'+d.discount+'%</span> off!';
    }
    if (d.Availability) {
        v.availability = d.Availability;
    }
    if (Ext.isArray(d.ProductDetails) && d.ProductDetails.length > 0) {
        v.details = '';
        Ext.each(d.ProductDetails, function(e){
            v.details += '<li>'+e+'</li>';
        });
    }
    if (Ext.isArray(d.Features) && d.Features.length > 0) {
        v.features = '';
        Ext.each(d.Features, function(e){
            v.features += '<li>'+e+'</li>';
        });
    }
    if (_reviewsTpl && Ext.isArray(d.CustomerReviews) && d.CustomerReviews.length > 0) {
        var cusReviewsHTML = '';
        Ext.each(d.CustomerReviews, function(e){
            cusReviewsHTML += _reviewsTpl.apply({
                reviewSummary: e.Summary,
                reviewRank: e.Rating,
                review: e.Content
            });
        });
        v.customerReviews = cusReviewsHTML;
    }

    t.append('details', v);
    var el = Ext.get(d.ASIN);

    if (Ext.isArray(d.ImageSets) && d.ImageSets.length > 0) {
        var imgcnt = 1;
        var option = { closeOnClick:true, directory:_rootpath+'js/fancyzoom/images/' };
        Ext.each(d.ImageSets, function(e){
            $('#'+d.ASIN+'-'+imgcnt+'_link').fancyZoom(option);
            imgcnt++;
        });
    }
    if (!d.ListPrice) {
        Ext.select('tr.detailListPrice', false, d.ASIN).remove();
    }
    if (!d.LowestNewPrice) {
        Ext.select('tr.detailOfferPrice', false, d.ASIN).remove();
    }
    if (!d.Availability) {
        Ext.select('div.availability', false, d.ASIN).remove();
    }
    if (!d.AverageRating) {
        Ext.select('div.avgReviewStars', false, d.ASIN).remove();
    }
    if (!d.Content) {
        Ext.select('div.productDescription', false, d.ASIN).remove();
    }
    if (d.ProductDetails.length == 0 && d.Features.length == 0) {
        Ext.select('div.productDetails', false, d.ASIN).remove();
    } else {
        if (d.ProductDetails.length == 0) {
            Ext.select('div.productDetails h2', false, d.ASIN).remove();
        }
        if (d.Features.length == 0) {
            Ext.select('div.productDetails h3', false, d.ASIN).remove();
        }
    }
    if (d.CustomerReviews.length == 0) {
        Ext.select('div.customerReviews', false, d.ASIN).remove();
    }

    Ext.select('div.itemsShowing', false, 'listing').setOpacity(1);
    switchLeft();
} // displayDetails

function switchLeft () {
    var l = Ext.get('listing');
    var d = Ext.get('details');
    var w = Ext.get('content').getWidth();

    d.setTop(0);
    Ext.get('details').setLeft(w);
    var x = Ext.get('details').getX() - w;
    var y = d.getY();

    l.slideOut('l',{
        duration: .5,
        easing: 'easeOut',
        useDisplay: true
    });
    d.moveTo(x, y, {
        duration: .5,
        easing: 'easeOut'
    }).fadeIn();
} // switchLeft

function switchRight () {
    var l = Ext.get('listing');
    var d = Ext.get('details');
    var w = Ext.get('content').getWidth();

    scrollTop();

    d.setLeft(0);
    var x = d.getX() + w;
    var y = d.getY();

    d.moveTo(x, y, {
        duration: .5,
        easing: 'easeOut'
    }).fadeOut({
        callback: function(){
            Ext.select('div.detailsWrap', false, 'details').setStyle({ display:'none' });
        }
    });

    if (Ext.isIE7) { // yes, fucking IE7 again..
        l.fadeIn();
    } else {
        l.slideIn('l',{
            duration: .5,
            easing: 'easeOut'
        });
    }
} // switchRight

function switchBanner (unique_id) {
    var selector = Ext.select('div.adv_'+unique_id);

    Ext.select('div.ads').fadeOut({
        concurrent: true
    });

    if (selector.elements.length == 0) {
        var adsense = '<div class="ads adv_'+unique_id+' adv160x600">' +
                        '<iframe src="'+_rootpath+'adsense.php" frameborder="0" allowtransparency="true" class="adv160x600"></iframe>'+
                      '</div>';
        Ext.select('div.adsense').insertHtml('beforeEnd', adsense);
        Ext.select('div.adv_'+unique_id).fadeIn();
    } else {
        Ext.select('div.adv_'+unique_id).pause(1).fadeIn();
    }
} // switchBanner

function addtocart (asin, offerId) {
    openCart();

    var msg  = Ext.get('message');
    var load = Ext.get('cartLoading');
    var act  = Ext.select('div.cartAction', false, 'shoppingcart');
    var item = Ext.get('cartItems');

    load.fadeIn();
    act.hide();
    Ext.Ajax.request({
        url: _rootpath+'amazon2.php',
        method: 'POST',
        success: function(response, opts) {
            updateCart(response, 1);
            load.fadeOut();
            act.show();
        },
        failure: function(response, opts) {
            load.fadeOut();
            act.show();
        },
        params: 'asin='+asin+'&offerId='+offerId
    });

    return false;
} // addtocart

function updateItem (itemId) {
    var load = Ext.get('cartLoading');
    var act  = Ext.select('div.cartAction', false, 'shoppingcart');
    var para = '';

    if (typeof itemId != 'undefined') {
        Ext.fly(itemId).fadeOut({ useDisplay:true });
    } else {
        itemId = null;
    }

    Ext.each(_cartData, function(e){
        if (!itemId) { // update
            var qty = Ext.fly(e.itemId).down('td input.itemQty').getValue();
        } else if (itemId == e.itemId) { // delete
            var qty = 0;
        }
        para += 'items['+e.itemId+']='+qty+'&';
    });

    load.fadeIn();
    act.hide();
    Ext.Ajax.request({
        url: _rootpath+'amazon2.php',
        method: 'POST',
        success: function(response, opts) {
            updateCart(response, 0);
            load.fadeOut();
            act.show();
        },
        failure: function(response, opts) {
            if (typeof itemId != 'undefined') {
                Ext.fly(itemId).fadeIn();
            }
            load.fadeOut();
            act.show();
        },
        params: para
    });

    return false;
} // updateItem

function updateCart (response, addnew) {
    var obj  = eval('('+response.responseText+')');
    var cur  = obj.currency;
    var item = Ext.get('cartItems');
    var upd  = [];

    Ext.fly('subtotal').update(cur+obj.subtotal);
    Ext.fly('subtotal').highlight("ffff9c", {
        attr: 'background-color',
        easing: 'easeIn',
        duration: 3
    });

    if (!_puchaseURL) {
        _puchaseURL = obj.purchaseURL;
        Ext.fly('checkoutform').set({ action:_puchaseURL });
    }

    if (_cartTpl && Ext.isArray(obj.items) && obj.items.length > 0) {
        var itemsHTML = '';

        Ext.select('tr', false, 'cartItems').remove();
        Ext.each(obj.items, function(e){
            itemsHTML = _cartTpl.apply({
                itemId: e.itemId,
                asin: e.asin,
                title: e.title,
                qty: '<input type="text" value="'+e.qty+'" class="itemQty" />',
                total: cur+e.total
            });

            item.insertHtml('beforeEnd', itemsHTML); // update cart items HTML

            Ext.each(_cartData, function(e2){ // see which item updated
                if (e2.itemId == e.itemId && e2.qty != e.qty) { // qty changed
                    //console.log(e.itemId+': '+e.qty);
                    upd.push(e.itemId);
                }
            });
        });

        _cartData = obj.items; // update cache data

        if (addnew) { // highlight new add item in first row
            item.down('tr').fadeIn().highlight();
        }
        Ext.each(upd, function(e){
            if (addnew) {
                Ext.fly(e).down('td input.itemQty').pause(1).frame();
                Ext.fly(e).down('td span.total').pause(1).highlight();
            } else {
                Ext.fly(e).down('td input.itemQty').frame();
                Ext.fly(e).down('td span.total').highlight();
            }
        });
    } else if (_cartTpl && Ext.isArray(obj.items) && obj.items.length == 0) {
        Ext.select('tr', false, 'cartItems').remove();
        _cartData = [];
    }
} // updateCart

function initCart () {
    if (!_cartTpl) { // get cart html fragment template first
        _cartTpl = new Ext.Template.from('cartItems');
        Ext.fly('cartItems').down('tr').remove();
    }
    Ext.Ajax.request({
        url: _rootpath+'amazon2.php',
        method: 'POST',
        success: function(response, opts) {
            if (response.responseText != '0') {
                updateCart(response, 0);
            }
        },
        params: 'getcart=1'
    });
} // initCart

function initDetails () {
    _reviewsTpl = new Ext.Template.from('customerReviews'); // get customerReviews html fragment template first
    Ext.fly('customerReviews').remove();
    _detailsTpl = Ext.getDom('detailsTpl').innerHTML;
    Ext.fly('detailsTpl').remove();
} // initDetails

function initListing () {
    _listingTpl = {
        title: new Ext.Template.from('itemsTitleTpl'),
        nav: new Ext.Template.from('itemsNavigationTpl'),
        items: new Ext.Template.from('itemsListingTpl')
    };
    Ext.fly('itemsTitleTpl').remove();
    Ext.fly('itemsNavigationTpl').remove();
    Ext.fly('itemsListingTpl').remove();
    itemSearch();
} // initListing

Ext.onReady(function() {
    loadDom();
});