return {
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 1000,
    columns: 12, // the width of the grid, in columns
    colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: '82', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 10], // the pixel distance between each widget
    defaultSizeX: 2, // the default width of a gridster item, if not specifed
    defaultSizeY: 1, // the default height of a gridster item, if not specified
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    resizable: {
      enabled: false,
      start: function (event, uiWidget, $element) { }, // optional callback fired when resize is started,
      resize: function (event, uiWidget, $element) { }, // optional callback fired when item is resized,
      stop: function (event, uiWidget, $element) { } // optional callback fired when item is finished resizing
    },
    draggable: {
      enabled: true, // whether dragging items is supported
      handle: '.title-header', // optional selector for resize handle
      start: function (event, uiWidget, $element) { }, // optional callback fired when drag is started,
      drag: function (event, uiWidget, $element) { }, // optional callback fired when item is moved,
      stop: function (event, uiWidget, $element) { } // optional callback fired when item is finished dragging
    }
  }