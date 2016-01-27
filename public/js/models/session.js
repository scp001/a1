"use strict";

var splat = splat || {};

splat.SessionModel = Backbone.Model.extend({

        idAttribute: "_id",

        defaults: {
            logged_in: false
        },

        initialize: function () {
            this.user = new splat.UserModel({});
        },

        updateSessionUser: function (userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults)));
        },

        checkAuth: function (callback, args) {
            var self = this;
            this.fetch({
                success: function (mod, res) {
                    if (!res.error && res.user) {
                        self.updateSessionUser(res.user);
                        self.set({logged_in: true});
                        if ('success' in callback) callback.success(mod, res);
                    } else {
                        self.set({logged_in: false});
                        if ('error' in callback) callback.error(mod, res);
                    }
                }, error: function (mod, res) {
                    self.set({logged_in: false});
                    if ('error' in callback) callback.error(mod, res);
                }
            }).complete(function () {
                if ('complete' in callback) callback.complete();
            });
        },

        putAuth: function (opts, callback) {
            var self = this;
            $.ajax({
                url: '/' + opts.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'PUT',
                beforeSend: function (xhr) {
                    // Set the CSRF Token in the header for security
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if (token) xhr.setRequestHeader('X-CSRF-Token', token);
                },
                data: JSON.stringify(_.omit(opts, 'method')),
                success: function (res) {
                    if (!res.error) {
                            self.updateSessionUser(res.user || {});
                            self.set({logged_in: true});

                        if (callback && 'success' in callback) callback.success(res);
                    } else {
                        if (callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function (res) {
                    if (callback && 'error' in callback) callback.error(res);
                }
            }).complete(function (res) {
                if (callback && 'complete' in callback) callback.complete(res);
            });
        },

        signin: function (opts, callback) {
            this.putAuth(_.extend(opts, {method: 'auth'}), callback);
        },

        signout: function (opts, callback) {
            //this.putAuth(_.extend(opts, {method: 'signout'}), callback);
        }
});