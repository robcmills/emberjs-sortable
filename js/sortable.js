Sortable = Ember.Namespace.create();

Sortable.ListItemView = Ember.Mixin.create({
  attributeBindings: 'draggable',
  draggable: 'true',
  classNameBindings: [':sortable-list-item', 'controller.isDragging:dragging', 
    'controller.isDragHovering:drag-hovering'],

  dragStart: function(event) {
    var c = this.get('controller');
    c.set('isDragging', true);
    $(this.get('element')).addClass('dragging');
    
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Text', this.get('elementId'));
  },
  dragEnd: function(event) {
    this.get('controller.parentController').resetDrag();
  },
  drop: function(event) {
    var c = this.get('controller');
    var list = c.get('parentController');

    var targetIndex = list.get('content').indexOf(c.get('content'));
    list.addDragItem(event, targetIndex);
    list.resetDrag();

    event.preventDefault();
    return false;
  }, 
  dragEnter: function(event) {
    var c = this.get('controller');
    var list = c.get('parentController');
    list.incrementProperty('dragCount');
    var dragItem = list.findProperty('isDragging', true);
    var thisIndex;

    if(dragItem && !dragItem.get('isHidden')) { 
      $('.sortable-list-item.dragging').hide(); 
      dragItem.set('isHidden', true);
      dragItem.set('isDragHovering', false);

      thisIndex = list.get('content').indexOf(c.get('content'));
      var dragItemIndex = list.get('content').indexOf(dragItem.get('content'));
      if(dragItemIndex > thisIndex) {
        this.$('.drag-target').show();
        c.set('isDragHovering', true);
      }
      event.preventDefault();
      return false;
    }

    if(c.get('isDragHovering')) {
      event.preventDefault();
      return false;
    }

    $('.drag-target').hide();
    list.setEach('isDragHovering', false); 

    this.$('.drag-target').show();
    c.set('isDragHovering', true);

    event.preventDefault();
    return false;
  },
  dragLeave: function(event) {
    var c = this.get('controller');
    var list = c.get('parentController');
    list.decrementProperty('dragCount');

    if($(event.target).hasClass('drag-target')) {
      c.set('isDragHovering', false);
      this.$('.drag-target').hide();
    } 

    list.showDragItem();

    event.preventDefault();
    return false;
  },
  dragOver: function(event) {
    event.preventDefault();
    return false;
  },
});

Sortable.ListItemController = Ember.Mixin.create({
  isDragging: false,
  isDragHovering: false,
  isHidden: false,

  addItem: function() {
    // var list = this.get('parentControllers');
    // list.addItem(this.get('content'));
  },

  removeItem: function() {
    // var item = this.get('content');
    // var list = this.get('controllers.list');
    //if(this.get('controllers.list.isSaving')) { return; }
    // list.get('content').removeObject(item);

    // item.deleteRecord();
    // item.save();
    // list.save();
  },
});


Sortable.ListController = Ember.Mixin.create({
  dragCount: 0,

  addDragItem: function(event, targetIndex) {
    var dragItemId = event.originalEvent.dataTransfer.getData('Text');
    var dragItem = (Ember.View.views[dragItemId]).get('controller');

    targetIndex = typeof targetIndex !== 'undefined' ?
      targetIndex : this.get('length');

    var existsIndex = this.get('content').indexOf(dragItem.get('content'));
    if(existsIndex >= 0) {
      if(existsIndex === targetIndex - 1) { return; }
      this.get('content').removeAt(existsIndex);
      if(targetIndex >= existsIndex) { targetIndex--; }
    } 
    this.get('content').insertAt(targetIndex, dragItem.get('content'));
    return;
    //this.save();
  },

  showDragItem: function() {
    // show dragItem if leaving the list
    Ember.run.next(this, function() {
      if(this.get('dragCount') === 0) {
        var dragItem = this.findProperty('isDragging', true);
        if(dragItem) { 
          dragItem.set('isHidden', false); 
          $('.sortable-list-item.dragging').show();
        }
        $('.drag-target').hide();
        this.setEach('isDragHovering', false);
      }
    });
  },    

  resetDrag: function() {
    this.set('dragCount', 0);
    this.forEach(function(item){
      item.setProperties({
        'isHidden': false,
        'isDragging': false,
        'isDragHovering': false,
      });
    });
    this.set('isDragHovering', false);
    $('.drag-target').hide();
    $('.sortable-list-item.dragging').show();
    $('.sortable-list-item.dragging').removeClass('dragging');
  },
 });

Sortable.DropZoneView = Ember.Mixin.create({
  dragEnter: function(event) {
    var list = this.get('controller');
    list.set('isDragHovering', true);
    list.incrementProperty('dragCount');

    var dragItem = list.findProperty('isDragging', true);
    if(dragItem) { 
      $('.sortable-list-item.dragging').hide();
      dragItem.set('isHidden', true); 
      dragItem.set('isDragHovering', false);
    }

    $('.drag-target').hide();
    list.setEach('isDragHovering', false); 

    this.$('.drag-target').show();
    event.preventDefault();
    return false;
  },
  dragLeave: function(event) {
    var list = this.get('controller');
    list.decrementProperty('dragCount');
    list.set('isDragHovering', false);
    list.showDragItem();

    event.preventDefault();
    return false;
  },
  drop: function(event) {
    this.get('controller').addDragItem(event);
    this.get('controller').resetDrag();

    event.preventDefault();
    return false;   
  },
  dragOver: function(event) {
    event.preventDefault();
    return false;
  }, 
});
