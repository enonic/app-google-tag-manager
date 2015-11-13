var portal = require('/lib/xp/portal');

exports.responseFilter = function (req, res) {

    var siteConfig =  portal.getSiteConfig();
    var containerID = siteConfig['googleTagManagerContainerID'] || '';

    log.info('UTIL log %s', JSON.stringify(siteConfig, null, 4));

    var snippet = '<!-- Google Tag Manager -->';
    snippet += '<script>dataLayer = [];</script>';
    snippet += '<noscript><iframe src="//www.googletagmanager.com/ns.html?id=' + containerID + '" ';
    snippet += 'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';
    snippet += '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':';
    snippet += 'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],';
    snippet += 'j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=';
    snippet += '\'//www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);';
    snippet += '})(window,document,\'script\',\'dataLayer\',\'' + containerID + '\');</script>';
    snippet += '<!-- End Google Tag Manager -->';

    // Only add snippet if in live mode and containerID is set
    if (req.mode === 'live' && containerID !== '') {
        if (!res.pageContributions.bodyBegin) {
            res.pageContributions.bodyBegin = [];
        }
        res.pageContributions.bodyBegin.push(snippet);
    }

    return res;
};