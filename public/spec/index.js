describe('app', function() {
    describe('bind', function() {
        describe('address', function() {
            beforeEach(function() {
                helper.createPageRequestForm('stage');
                app.bind();
            });

            it('should call loadPageRequest on submit', function() {
                runs(function() {
                    spyOn(app, 'loadPageRequest');
                    helper.submit('page-request-form');
                });
                waitsFor(function() {
                    return (app.loadPageRequest.calls.length > 0);
                }, 'loadPageRequest should be called once', 500);
                runs(function() {
                    expect(app.loadPageRequest).toHaveBeenCalled();
                });
            });

            it('should pass the page address to load', function() {
                runs(function() {
                    spyOn(app, 'loadPageRequest');
                    helper.id('page-request-address').value = 'http://cordova.io?q=s';
                    helper.submit('page-request-form');
                });
                waitsFor(function() {
                    return (app.loadPageRequest.calls.length > 0);
                }, 'loadPageRequest should be called once', 500);
                runs(function() {
                    expect(app.loadPageRequest).toHaveBeenCalledWith('http://cordova.io?q=s');
                });
            });
        });
    });

    describe('load', function() {
        it('should load a warning when a warning exists', function() {
            spyOn(app, 'hasWarnings').andReturn(true);
            spyOn(app, 'loadWarnings');
            app.load();
            expect(app.loadWarnings).toHaveBeenCalled();
        });

        it('should load API on API request', function() {
            spyOn(app, 'hasWarnings').andReturn(false);
            spyOn(app, 'hasApiRequest').andReturn(true);
            spyOn(app, 'loadApiRequest');
            app.load();
            expect(app.loadApiRequest).toHaveBeenCalled();
        });

        it('should load search page on page request', function() {
            spyOn(app, 'hasWarnings').andReturn(false);
            spyOn(app, 'hasApiRequest').andReturn(false);
            spyOn(app, 'loadPageRequest');
            app.load();
            expect(app.loadPageRequest).toHaveBeenCalled();
        });
    });

    describe('hasWarnings', function() {
        it('should be false when there are no warnings', function() {
            spyOn(app, 'hasRipplez').andReturn(true);
            spyOn(app, 'isBrowserSupported').andReturn(true);
            expect(app.hasWarnings()).toEqual(false);
        });

        it('should be true when missing Ripple', function() {
            spyOn(app, 'hasRipplez').andReturn(false);
            spyOn(app, 'isBrowserSupported').andReturn(true);
            expect(app.hasWarnings()).toEqual(true);
        });

        it('should be true when missing Chrome', function() {
            spyOn(app, 'hasRipplez').andReturn(true);
            spyOn(app, 'isBrowserSupported').andReturn(false);
            expect(app.hasWarnings()).toEqual(true);
        });

        it('should be true when missing Ripple and Chrome', function() {
            spyOn(app, 'hasRipplez').andReturn(false);
            spyOn(app, 'isBrowserSupported').andReturn(false);
            expect(app.hasWarnings()).toEqual(true);
        });
    });

    describe('loadWarnings', function() {
        it('should show no warnings when dependencies exist', function() {
            spyOn(app, 'hasRipplez').andReturn(true);
            spyOn(app, 'isBrowserSupported').andReturn(true);
            spyOn(app, 'show');
            app.loadWarnings();
            expect(app.show).not.toHaveBeenCalled();
        });

        it('should show browser warning', function() {
            spyOn(app, 'hasRipplez').andReturn(true);
            spyOn(app, 'isBrowserSupported').andReturn(false);
            spyOn(app, 'show');
            app.loadWarnings();
            expect(app.show).toHaveBeenCalledWith('browser-warning');
        });

        it('should show Ripple warning', function() {
            spyOn(app, 'hasRipplez').andReturn(false);
            spyOn(app, 'isBrowserSupported').andReturn(true);
            spyOn(app, 'show');
            app.loadWarnings();
            expect(app.show).toHaveBeenCalledWith('ripple-warning');
        });
    });

    describe('isBrowserSupported', function() {
        var _chrome = window.chrome;

        afterEach(function() {
            window.chrome = _chrome;
        });

        it('should be true when using the Chrome browser', function() {
            window.chrome = {};
            expect(app.isBrowserSupported()).toBe(true);
        });

        it('should be false when not using the Chrome browser', function() {
            window.chrome = undefined;
            expect(app.isBrowserSupported()).toBe(false);
        });
    });

    describe('hasRipplez', function() {
        it('should be true when Ripple is installed', function() {
            helper.id('stage').innerHTML = '<script id="tinyhippos-injected"></script>';
            expect(app.hasRipplez()).toBe(true);
        });

        it('should be false when Ripple is missing', function() {
            var el = helper.id('tinyhippos-injected');
            helper.remove('tinyhippos-injected');
            expect(app.hasRipplez()).toBe(false);
            if (el) document.body.appendChild(el);
        });
    });

    describe('hasApiRequest', function() {
        it('should be false when qs is empty', function() {
            spyOn(app, 'queryString').andReturn('');
            expect(app.hasApiRequest()).toBe(false);
        });

        it('should be false when the url qs is missing', function() {
            spyOn(app, 'queryString').andReturn('?platform=cordova&foo=bar');
            expect(app.hasApiRequest()).toBe(false);
        });

        it('should be true when the url qs exists', function() {
            spyOn(app, 'queryString').andReturn('?url=cordova.io');
            expect(app.hasApiRequest()).toBe(true);
        });
    });

    describe('loadApiRequest', function() {
        it('should goto "url" in qs', function() {
            spyOn(app, 'goto');
            spyOn(app, 'queryString').andReturn('?url=cordova.io');
            app.loadApiRequest();
            expect(app.goto).toHaveBeenCalledWith('cordova.io');
        });

        it('should goto "url" in qs and unescape any args', function() {
            spyOn(app, 'goto');
            spyOn(app, 'queryString').andReturn('?url=cordova.io%3Fq%3Dvalue');
            app.loadApiRequest();
            expect(app.goto).toHaveBeenCalledWith('cordova.io?q=value');
        });
    });

    describe('loadPageRequest', function() {
        describe('with no args', function() {
            it('should show the page content', function() {
                spyOn(app, 'show');
                app.loadPageRequest();
                expect(app.show).toHaveBeenCalledWith('content');
            });
        });

        describe('with args', function() {
            it('should goto requested page', function() {
                spyOn(app, 'goto');
                app.loadPageRequest('http://cordova.io?q=s');
                expect(app.goto).toHaveBeenCalledWith('http://cordova.io?q=s');
            });
        });
    });

    describe('goto', function() {
        it('should redirect the browser', function() {
            spyOn(app, 'redirect');
            app.goto('cordova.io');
            expect(app.redirect.mostRecentCall.args[0]).toMatch('cordova.io');
        });

        describe('platform parameter', function() {
            it('should be renamed to "enableripple"', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io?platform=cordova');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?enableripple=cordova');
            });

            it('should be appended as "?enableripple" when no params exist', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?enableripple=cordova');
            });

            it('should be appended as "&enableripple" when params exist', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io?q=s');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?q=s&enableripple=cordova');
            });

            it('should support the format platform=<name>-<version>', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io?platform=cordova-2.0.0');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?enableripple=cordova-2.0.0');
            });
        });

        describe('protocol', function() {
            it('should add missing http:// to the url', function() {
                spyOn(app, 'redirect');
                app.goto('cordova.io');
                expect(app.redirect.mostRecentCall.args[0]).toMatch('^http://cordova.io');
            });

            it('should preserve existing http://', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io');
                expect(app.redirect.mostRecentCall.args[0]).toMatch('^http://cordova.io');
            });

            it('should preserve existing https://', function() {
                spyOn(app, 'redirect');
                app.goto('https://cordova.io');
                expect(app.redirect.mostRecentCall.args[0]).toMatch('^https://cordova.io');
            });
        });

        describe('enableripple parameter', function() {
            it('should add "?enableripple=cordova" if missing', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?enableripple=cordova');
            });

            it('should add "&enableripple=cordova" if missing', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io?q=s');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?q=s&enableripple=cordova');
            });

            it('should preserve "enableripple=cordova" if available', function() {
                spyOn(app, 'redirect');
                app.goto('http://cordova.io?enableripple=cordova');
                expect(app.redirect).toHaveBeenCalledWith('http://cordova.io?enableripple=cordova');
            });
        });
    });

    describe('showLoading', function() {
        beforeEach(function() {
            spyOn(app, 'show');
            spyOn(app, 'hide');
        });

        it('should show loading state', function() {
            app.showLoading(true);
            expect(app.show).toHaveBeenCalledWith('loading');
            expect(app.hide).not.toHaveBeenCalled();
        });

        it('should not show loading state', function() {
            app.showLoading(false);
            expect(app.show).not.toHaveBeenCalled();
            expect(app.hide).toHaveBeenCalledWith('loading');
        });
    });
});
