Dashboard.Router.map(function () {
    this.resource('dash', { path: '/dash/:dashID' }, function () {
        this.resource('annex', { path: '/annex/:annexID' }, function () {
            this.resource('page', { path: 'page/:pageID' });
        });
    });
});
