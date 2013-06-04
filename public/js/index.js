var app = {
    initialize: function() {
        this.bind();
        this.run();
    },
    bind: function() {
        var self = this;
        document.getElementById("page-request-form").addEventListener('submit', function(e) {
            var address = document.getElementById("page-request-address");
            self.loadPageRequest(address.value);
            return false;
        });
    },
    run: function() {
        this.showLoading(true);
        this.load();
        this.showLoading(false);
    },
    load: function() {
        if (this.hasWarnings()) {
            this.loadWarnings();
        }
        else if (this.hasApiRequest()) {
            this.loadApiRequest();
        }
        else {
            this.loadPageRequest();
        }
    },
    hasWarnings: function() {
        return !(this.isBrowserSupported() && this.hasRipplez());
    },
    loadWarnings: function() {
        if (!this.isBrowserSupported()) {
            this.show('browser-warning');
        }
        else if (!this.hasRipplez()) {
            this.show('ripple-warning');
        }
    },
    isBrowserSupported: function() {
        return !!window.chrome;
    },
    hasRipplez: function () {
        // we do not use window.chrome.isInstalled(id)
        // because Ripple has two IDs (hosted and Chrome Store)
        // and local dev installations have unique IDs.
        return !!document.getElementById("tinyhippos-injected");
    },
    hasApiRequest: function() {
        return !!this.queryString().match(/url=/);
    },
    loadApiRequest: function() {
        var uri = this.queryString().match(/url=([^&]*)/)[1];
        uri = decodeURIComponent(uri);
        this.goto(uri);
    },
    loadPageRequest: function(uri) {
        if (uri) {
            this.goto(uri);
        }
        else {
            this.show('content');
        }
    },
    goto: function (uri) {
        uri = uri.replace('platform=', 'enableripple=');

        if (!uri.match(/enableripple=/)) {
            uri += uri.match(/\?/) ? "&" : "?";
            uri += 'enableripple=cordova';
        }

        if (!uri.match(/^http[s]?:\/\//)) {
            uri = "http://" + uri;
        }

        this.redirect(uri);
    },
    redirect: function(uri) {
        window.location.href = uri;
    },
    show: function (id) {
        document.getElementById(id).setAttribute("style", "");
    },
    hide: function (id) {
        document.getElementById(id).setAttribute("style", "display: none");
    },
    visible: function(id) {
        return (document.getElementById(id).style.display === '');
    },
    queryString: function() {
        return window.location.search;
    },
    showLoading: function(loading) {
        if (loading) {
           this.show('loading');
        }
        else {
            this.hide('loading');
        }
    }
};

var page = {
    initialize: function() {
        document.body.addEventListener('click', function(e) {
            var el = e.target;
            if (el.href && el.href.match(/#$/)) {
                e.preventDefault();
                if (el.text.match(/^emulate\./)) {
                    app.redirect(el.text);
                }
                else {
                    app.goto(el.text);
                }
            }
        });
    }
};
