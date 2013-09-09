App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('index');
    this.render('colors', {
      into: 'index', outlet: 'left', controller: 'colors'
    });
  },
  setupController: function() {
    this.controllerFor('colors').set('content', [
      {color_name: 'Aquamarine', hex: '#7FFFD4'}, 
      {color_name: 'Beige', hex: '#F5F5DC'}, 
      {color_name: 'Coral', hex: '#FF7F50'}, 
      {color_name: 'DeepSkyBlue', hex: '#00BFFF'}, 
      {color_name: 'ForestGreen', hex: '#228B22'}, 
    ]);
  },
});


App.ColorView = Ember.View.extend(Sortable.ListItemView, {});

App.ColorController = Ember.Controller.extend(Sortable.ListItemController, {});

// App.ColorsView = Ember.View.extend(Sortable.ListView, {
// });

App.ColorsController = Ember.ArrayController.extend(Sortable.ListController, {
  itemController: 'color',
});

App.ColorsDropZoneView = Ember.View.extend(Sortable.DropZoneView, {});

App.ColorSampleView = Ember.View.extend({
  classNames: ['cell', 'color-sample'],
  attributeBindings: ['style'],
  style: function() {
    return 'background-color:' + this.get('controller.content.hex');
  }.property('content.hex'),
});
