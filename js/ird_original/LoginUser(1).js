Ext.define('MyApp.model.LoginUser', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'loggedIn',
            type: 'boolean'
        }
    ]
});