Dashboard.Router.map(function () {
    this.resource('dash', { path: '/:dashID' });
    this.resource('page', { path: '/:dashID/:annexID/:pageID' });
    this.route('permissions');
    this.route('login');
});

Dashboard.Router.reopen({
    rootURL: '/',
    init: function () {
        // set rootURL using regex to extract appropriate
        // rootURL based on current window location
        var matchedURL = window.location.pathname.match('[^/]*/[^/]*');
        //console.log('matched url = ' + matchedURL);
        if (matchedURL !== null && matchedURL.length > 0) {
            //console.log('setting rootUrl to ' + matchedURL[0]);
            this.set('rootURL', matchedURL[0]);
        }
        this._super();
    }
});