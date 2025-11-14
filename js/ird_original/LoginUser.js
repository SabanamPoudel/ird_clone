Ext.define('MyApp.store.LoginUser', {
    extend: 'Ext.data.Store',

    requires: [
        'MyApp.model.LoginUser'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            storeId: 'LoginUser',
            model: 'MyApp.model.LoginUser',
            proxy: {
                type: 'sessionstorage',
                id: 'UserKey'
            }
        }, cfg)]);
    }
});