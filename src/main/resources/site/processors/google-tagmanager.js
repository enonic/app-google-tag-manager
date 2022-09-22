var portal = require('/lib/xp/portal');

exports.responseProcessor = function (req, res) {
    if (req.mode !== 'live') return res; // Only add snippet if in live mode

    var siteConfig = portal.getSiteConfig();
    var containerIDs = [].concat(siteConfig['googleTagManagerContainerIDs'] || []);
    var containerID = siteConfig['googleTagManagerContainerID'];

    if (containerID) {
        containerIDs.push({ googleTagManagerContainerID: containerID });
    }

    if (!containerIDs.length) return res;

    var headEnd = res.pageContributions.headEnd;
    var bodyBegin = res.pageContributions.bodyBegin;

    if (!headEnd) {
        res.pageContributions.headEnd = [];
    }
    else if (typeof (headEnd) == 'string') {
        res.pageContributions.headEnd = [headEnd];
    }

    if (!bodyBegin) {
        res.pageContributions.bodyBegin = [];
    }
    else if (typeof (bodyBegin) == 'string') {
        res.pageContributions.bodyBegin = [bodyBegin];
    }

    for (var i = 0; i < containerIDs.length; i++) {
        var headSnippet = '<!-- Google Tag Manager -->';
        headSnippet += '<script>dataLayer = [];</script>';
        headSnippet += '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':';
        headSnippet += 'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],';
        headSnippet += 'j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=';
        headSnippet += '\'//www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);';
        headSnippet += '})(window,document,\'script\',\'dataLayer\',\'' + containerIDs[i].googleTagManagerContainerID + '\');</script>';
        headSnippet += '<!-- End Google Tag Manager -->';

        var bodySnippet = '<!-- Google Tag Manager (noscript) -->';
        bodySnippet += '<noscript><iframe name="Google Tag Manager" src="//www.googletagmanager.com/ns.html?id=' + containerIDs[i].googleTagManagerContainerID + '" ';
        bodySnippet += 'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';
        bodySnippet += '<!-- End Google Tag Manager (noscript) -->';

        res.pageContributions.headEnd.push(headSnippet);
        res.pageContributions.bodyBegin.push(bodySnippet);
    }
    return res;
};