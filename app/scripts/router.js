Dashboard.Router.map(function () {
    this.resource('dash', { path: '/dash/:dashID' }, function () {
        this.resource('annex', { path: '/annex/:annexID' }, function () {
            this.resource('page', { path: 'page/:pageID' });
        });
    });
});

//App.Router.map(function () {
//    this.resource('albums', { path: '/albums' }, function () {
//        this.resource('album', { path: ':album_id' }, function () {
//            this.resource('tracks', { path: 'tracks' }, function () {
//                this.resource('track', { path: ':track_id' });
//            });
//        });
//    });
//});
