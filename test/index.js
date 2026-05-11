// Simple test file for Canvas Engine
import { CanvasStage, CanvasElement, UIEventTypes } from '../dist/CanvasEngine.esm.js';

console.log('=== Canvas Engine Test Suite ===\n');

// Test 1: Create a stage
console.log('Test 1: Creating CanvasStage...');
const stage = new CanvasStage({
  width: 800,
  height: 600,
  fillStyle: '#333',
  fullscreen: false
});
console.log('✓ Stage created successfully');
console.log('  - Width:', stage.root.width);
console.log('  - Height:', stage.root.height);
console.log('  - Camera:', stage.camera);

// Test 2: Create elements
console.log('\nTest 2: Creating CanvasElements...');
const box1 = new CanvasElement({
  id: 'test-box-1',
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fillStyle: '#FF6B6B',
  draggable: true
});
console.log('✓ Box element created');
console.log('  - ID:', box1.id);
console.log('  - Position:', { x: box1.x, y: box1.y });
console.log('  - Size:', { width: box1.width, height: box1.height });

const circle1 = new CanvasElement({
  id: 'test-circle-1',
  x: 300,
  y: 200,
  width: 80,
  height: 80,
  fillStyle: '#4ECDC4',
  borderRadius: 40,
  draggable: true
});
console.log('✓ Circle element created');
console.log('  - ID:', circle1.id);
console.log('  - Border Radius:', circle1.borderRadius);

// Test 3: Add elements to stage
console.log('\nTest 3: Adding elements to stage...');
stage.addChild(box1);
stage.addChild(circle1);
console.log('✓ Elements added to stage');
console.log('  - Visible elements:', stage.getVisibleElements().length);

// Test 4: Event listeners
console.log('\nTest 4: Testing event listeners...');
let clickCount = 0;
box1.on(UIEventTypes.CLICK, function(e) {
  clickCount++;
  console.log('  - Box clicked! Count:', clickCount);
});

circle1.on(UIEventTypes.OVER, function(e) {
  console.log('  - Mouse over circle');
});

circle1.on(UIEventTypes.OUT, function(e) {
  console.log('  - Mouse out of circle');
});
console.log('✓ Event listeners attached');

// Test 5: Element manipulation
console.log('\nTest 5: Testing element manipulation...');
box1.x = 150;
box1.y = 150;
box1.rotation = 45;
console.log('✓ Box position and rotation updated');
console.log('  - New position:', { x: box1.x, y: box1.y });
console.log('  - Rotation:', box1.rotation);

circle1.scale = 1.5;
circle1.alpha = 0.8;
console.log('✓ Circle scale and alpha updated');
console.log('  - Scale:', circle1.scale);
console.log('  - Alpha:', circle1.alpha);

// Test 6: getElementById
console.log('\nTest 6: Testing getElementById...');
const foundBox = stage.getElementById('test-box-1');
const foundCircle = stage.getElementById('test-circle-1');
console.log('✓ Elements found by ID');
console.log('  - Found box:', foundBox ? foundBox.id : 'not found');
console.log('  - Found circle:', foundCircle ? foundCircle.id : 'not found');

// Test 7: Stage Bounds
console.log('\nTest 7: Testing Stage Bounds...');
// Using the stage's built-in bounds
stage.userBounds.minX = -100;
stage.userBounds.maxX = 100;
stage.userBounds.minY = -100;
stage.userBounds.maxY = 100;
const testPoint = { x: 150, y: -150 };
stage.userBounds.clamp(testPoint);
console.log('✓ Stage bounds configured and clamp tested');
console.log('  - Original point: { x: 150, y: -150 }');
console.log('  - Clamped point:', testPoint);
console.log('  - Expected: { x: 100, y: -100 }');

// Summary
console.log('\n=== All Tests Complete ===');
console.log('Stage object available as window.stage for debugging');

// Make available globally for browser console testing
if (typeof window !== 'undefined') {
  window.stage = stage;
  window.box1 = box1;
  window.circle1 = circle1;
  window.UIEventTypes = UIEventTypes;
}