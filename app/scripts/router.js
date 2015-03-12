Dashboard.Router.map(function () {
    this.resource('dash', { path: '/dash/:dashID' }, function () {
        this.resource('annex', { path: '/annex/:annexID' }, function () {
            this.resource('page', { path: 'page/:pageID' });
        });
    });
});

Dashboard.Router.reopen({
    rootURL: '/',
    init: function () {
        // set rootURL using regex to extract appropriate
        // rootURL based on current window location
        var matchedURL = window.location.pathname.match('[^/]*/[^/]*');
        console.log('matched url = ' + matchedURL);
        if (matchedURL !== null && matchedURL.length > 0) {
            console.log('setting rootUrl to ' + matchedURL[0]);
            this.set('rootURL', matchedURL[0]);
        }
        this._super();
    }
});