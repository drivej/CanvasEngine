# Canvas Engine Tests

This directory contains test files for the Canvas Engine library.

## Files

### `index.html`
An interactive browser-based test that demonstrates the Canvas Engine functionality.

**Features:**
- Visual canvas stage with interactive elements
- Add boxes and circles dynamically
- Drag and drop elements
- Mouse wheel zoom
- Event handling demonstrations (click, hover, drag)
- Real-time element counter

**How to run:**
1. Build the project: `npm run build`
2. Open `test/index.html` in a web browser
3. Use the control panel to add/remove elements
4. Interact with elements on the canvas

### `index.js`
A programmatic test suite that runs a series of tests on the Canvas Engine.

**Tests included:**
1. CanvasStage creation
2. CanvasElement creation (boxes and circles)
3. Adding elements to stage
4. Event listener attachment
5. Element manipulation (position, rotation, scale, alpha)
6. getElementById functionality
7. CanvasBounds and clamping

**How to run:**
1. Build the project: `npm run build`
2. Include this file as a module in an HTML page or run with Node.js (with appropriate DOM polyfills)
3. Check the console for test results

## Quick Start

```bash
# Install dependencies
npm install

# Build and run the dev server with live reload (recommended)
npm run dev

# Or build separately
npm run build

# Then serve (without live reload)
npm run serve
```

The dev server will automatically:
- Build the TypeScript and ESM bundle
- Start a local server on an available port (default: 3000+)
- **Watch for file changes** and auto-rebuild
- **Automatically refresh your browser** when files change
- Monitor changes in: `src/`, `test/`, and `index.js`

## What to Test

### Basic Functionality
- [ ] Stage creation and initialization
- [ ] Element creation (boxes, circles, custom shapes)
- [ ] Adding/removing elements
- [ ] Element positioning and transforms

### Interactivity
- [ ] Mouse events (click, hover, drag)
- [ ] Draggable elements
- [ ] Event bubbling and propagation
- [ ] Mouse wheel zoom

### Rendering
- [ ] Canvas rendering
- [ ] Alpha transparency
- [ ] Rotation and scaling
- [ ] Border radius (for circles)
- [ ] Fill styles and colors

### Camera
- [ ] Camera positioning
- [ ] Zoom functionality
- [ ] Camera bounds

### Performance
- [ ] Multiple elements rendering
- [ ] Start/stop render loop
- [ ] Element updates

## Browser Console Testing

When you load `index.html`, the following objects are available in the browser console:

```javascript
// Access the stage
window.stage

// Get all visible elements
window.stage.getVisibleElements()

// Find element by ID
window.stage.getElementById('box-0')

// Add a new element programmatically
const newBox = new CanvasElement({
  x: 200,
  y: 200,
  width: 50,
  height: 50,
  fillStyle: '#FF0000',
  draggable: true
});
window.stage.addChild(newBox);
```

## Debugging Tips

1. **Check the console** - All events and actions are logged
2. **Use window.stage** - Inspect the stage object in browser dev tools
3. **Element count** - The UI shows how many elements are on stage
4. **Stop/Start render** - Use the button to pause rendering and inspect state
5. **Live reload** - Look for "✨ Live reload enabled" in the browser console
6. **Watch the terminal** - See file changes and rebuild messages in real-time

## Testing Live Reload

To test that live reload is working:

1. Run `npm run dev`
2. Open the URL shown in your browser
3. Make a change to any file in `src/` or `test/`
4. Save the file
5. Watch the terminal for rebuild messages
6. Browser should automatically refresh!

Example: Change a color in `test/index.html` or modify `src/CanvasUtils.js`

## Known Issues

- Ensure your browser supports ES6 modules
- Some features require a modern browser with canvas support
- CORS restrictions may apply if not served from a local server
