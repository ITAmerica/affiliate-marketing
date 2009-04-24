var _rootpath = '../../';

function goto (page) {
    var content = Ext.get('content');

    Ext.select('.links').each(function(e){
        e.setStyle({ display:'none' });
    });

    if (page == 1) {
        showPage('shop');
    } else if (page == 2) {
        if (Ext.fly('auction') == null) {
            var code = '<iframe id="auction" src="'+_rootpath+'ebay.php?ai='+eBayAId+'&query='+e_kerword1+'&eksize=1&num=12&minprice=100"' +
                       ' frameborder="0" allowtransparency="true" class="content links" style="display:none;"></iframe>';
            content.insertHtml('beforeEnd', code);
        }
        showPage('auction');
    } else if (page == 3) {
        if (!Ext.fly('news')) {
            var para = Ext.urlEncode(n);
            var code = '<iframe id="news" src="http://www.feedzilla.com/tools/steppatch_nc_frame.asp?'+para+'"'+
                       ' frameborder="0" allowtransparency="true" class="content links" style="display:none;"></iframe>';
            content.insertHtml('beforeEnd', code);
        }
        showPage('news');
    } else if (page == 4) {
        if (!Ext.fly('video')) {
            var code = '<embed id="video" class="links" src="http://www.blinkx.com/w?g_sApiQuery=%2Fapi3%2Fstart%2Ephp%3Faction%3Dquery%26databasematch%3Dmedia%26totalresults%3Dtrue%26text%3D'+v_keyword+'%26start%3D1%26maxresults%3D36%26sortby%3Drelevance%26removedredatabases%3DPodcast%26fieldtext%3D%26clientregion%3DHI%26characters%3D10000%26clientip%3D118%2E100%2E142%2E105g%5FiQueryOffset%3D0&g_StageWidth='+width+'&g_StageHeight='+height+'&g_ApiServer=www.blinkx.com&g_sImgServer=http://cdn-99.blinkx.com/store" width="'+width+'" height="'+height+'" quality="high" bgcolor="#000000" name="newwall" align="middle" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
           content.insertHtml('beforeEnd', code);
        }
        showPage('video');
    } else if (page == 5) {
        if (!Ext.fly('account')) {
            var code = '<iframe id="account" src="http://astore.amazon.com/'+amazonAId+'/cart/"' +
                       ' frameborder="0" allowtransparency="true" class="content links" style="display:none;"></iframe>';
            content.insertHtml('beforeEnd', code);
        }
        showPage('account');
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

function checkAuth () {
    Ext.Ajax.request({
        url: _rootpath+'auth.php',
        method: 'POST',
        success: function(response, opts) {
            if (response.responseText == 1) { // logged
                Ext.get('settings').setStyle({ display:'block' });
            } else {
                Ext.get('login').setStyle({ display:'block' });
            }
            openPopup();
        },
        failure: function(response, opts) {
            // what to do?
        }
    });
} // checkAuth

function openPopup () {
    if (!Ext.get('overlay')) {
        Ext.DomHelper.append(document.body, {
            id: 'overlay',
            style: 'position:absolute; top:0; left:0; background-color:#fff; display:none;'
        });
        Ext.fly('overlay').on('click', closePopup);
    }

    var el = Ext.get('overlay');
    el.setHeight(Ext.getBody().getHeight());
    el.setWidth(Ext.getBody().getWidth());
    el.fadeIn({
        easing: 'easeOut',
        endOpacity: .6,
        duration: .5
    });


    var dwidth  = document.documentElement.clientWidth;
    var dheight = document.documentElement.clientHeight;
    var popup   = Ext.get('popup');
    var eheight = popup.getHeight();
    var scroll  = Ext.getBody().getScroll();

    var left = Math.round((dwidth - popup.getWidth()) / 2);
    var top  = Math.round((dheight - eheight) / 2);
    var top2 = top + scroll.top;

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
} // settings

function closePopup () {
    var el = Ext.get('popup');
    var h  = el.getHeight();
    var s  = Ext.getBody().getScroll().top;
    var y  = s - h;
    var x  = el.getX();
    var ct = Math.round((document.documentElement.clientHeight - h) / 2) + s;

    Ext.fly('overlay').fadeOut({
        easing: 'easeOut',
        duration: .5,
        useDisplay: true
    });
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

    if (stt == 1) {
        el.slideIn('l', {
            easing: 'easeOut'
        });
    } else {
        Ext.getDom('message').innerHTML = 'Enter wrong password';
        msg.dom.className = 'error';
        msg.slideIn('l').pause(5).slideOut('t', { useDisplay:true });
        Ext.fly('login').slideIn('l', {
            easing: 'easeOut'
        });
    }
} // showSetting

Ext.onReady(function() {
    var code = '<iframe id="shop" src="http://astore.amazon.com/'+amazonAId+'" frameborder="0" allowtransparency="true" class="content links"></iframe>';
    Ext.fly('content').insertHtml('beforeEnd', code);
});