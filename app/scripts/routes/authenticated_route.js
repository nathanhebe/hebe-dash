Dashboard.AuthenticatedRoute = Ember.Route.extend({

    hasPermission: false,

    model: function () {
        if (ignoreAuth !== true && !this.get('hasPermission')) {
            // isLoggedIn will be set to true in index.html if in ckan environment and has valid user object
            if (isLoggedIn == null || isLoggedIn === false) {
                // display error message and instructions to login
                this.transitionTo('login');
            } else {
                var obj = this;
                // make a request to https://data.england.nhs.uk/api/action/resource_show?id=56879843-edf2-4b66-a8e1-f27a91befb7a
                // if response code is unauth 
                // display error message and instructions to ask for permissions
                Ember.$.ajax({
                    //type:'post',
                    url: 'https://data.england.nhs.uk/api/action/resource_show?id=56879843-edf2-4b66-a8e1-f27a91befb7a',
                    //xhrFields: {
                    //    withCredentials: true
                    //}
                })
                .error(function (response) {
                    if (response.status === 403) {
                        //console.log('MADE REQUEST - NO PERMISSION');
                        obj.set('hasPermission', false)
                        obj.transitionTo('permissions');
                    } else {
                        obj.set('hasPermission', 'true');
                        //console.log('MADE REQUEST - HAS PERMISSION');
                        return true;
                    }
                })
                .success(function () {
                    obj.set('hasPermission', 'true');
                    //console.log('MADE REQUEST - HAS PERMISSION');
                    return true;
                })
            }
            return true;
        } else {
            console.log('HAS PERMISSION');
            return true;
        }
    }
});