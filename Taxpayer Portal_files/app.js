Ext.application({
    name: 'MyApp',
    launch: function () {
        Ext.create('MyApp.view.Viewport', {
            renderTo: Ext.getBody()
        });
    }
});
