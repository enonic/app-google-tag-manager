var portal = require('/lib/xp/portal');

exports.responseFilter = function (req, res) {

    var siteConfig =  portal.getSiteConfig();
    var containerID = siteConfig['googleTagManagerContainerID'] || '';

    var headSnippet = '<!-- Google Tag Manager -->';
    headSnippet += '<script>dataLayer = [];</script>';
    headSnippet += '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':';
    headSnippet += 'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],';
    headSnippet += 'j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=';
    headSnippet += '\'//www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);';
    headSnippet += '})(window,document,\'script\',\'dataLayer\',\'' + containerID + '\');</script>';
    headSnippet += '<!-- End Google Tag Manager -->';

    var bodySnippet = '<!-- Google Tag Manager (noscript) -->';
    bodySnippet += '<noscript><iframe src="//www.googletagmanager.com/ns.html?id=' + containerID + '" ';
    bodySnippet += 'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';
    bodySnippet += '<!-- End Google Tag Manager (noscript) -->';

    // Only add snippet if in live mode and containerID is set
    if (req.mode === 'live' && containerID !== '') {

        if (!res.pageContributions.headEnd) {
            res.pageContributions.headEnd = [];
        }
        res.pageContributions.headEnd.push(headSnippet);

        if (!res.pageContributions.bodyBegin) {
            res.pageContributions.bodyBegin = [];
        }
        res.pageContributions.bodyBegin.push(bodySnippet);
    }

    return res;
};