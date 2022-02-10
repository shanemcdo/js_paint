let prev_mouse = null;
const els = {
    'brush_color': document.querySelector('#brush-color'),
    'erase_color': document.querySelector('#erase-color'),
    'brush_shape': document.querySelector('#brush-shape'),
    'brush_size': document.querySelector('#brush-size'),
    'canvas': null,
};
let brush = {};

function setup(){
    els.canvas = createCanvas(windowWidth, windowHeight);
    update_brush();
    els.brush_color.addEventListener('change', update_brush);
    els.erase_color.addEventListener('change', update_brush);
    els.brush_shape.addEventListener('change', update_brush);
    els.brush_size.addEventListener('change', update_brush);
    reset();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){}

function mousePressed(event){
    if(event.target !== canvas)
        return;
    let pos = createVector(mouseX, mouseY);
    draw_point(pos);
    prev_mouse = pos;
}

function mouseDragged(event){
    if(event.target !== canvas)
        return;
    let pos = createVector(mouseX, mouseY);
    if(prev_mouse !== null){
        draw_line(prev_mouse, pos);
    }
    prev_mouse = pos;
}

function keyPressed(){
    switch (key) {
        case 'R':
        case 'r':
            reset();
            break;
        case 'S':
        case 's':
            swap_colors();
            break;
        default:
            console.log(keyCode);
    }
}

function draw_point(pos){
    push()
    stroke(brush.fg_color);
    fill(brush.fg_color);
    strokeWeight(brush.radius);
    point(pos);
    pop();
}

function draw_line(start, end){
    push()
    stroke(brush.fg_color);
    fill(brush.fg_color);
    strokeWeight(brush.radius);
    line(start.x, start.y, end.x, end.y);
    pop();
}

function update_brush(){
    brush = {
        'fg_color': els.brush_color.value,
        'bg_color': els.erase_color.value,
        'shape': els.brush_shape.value,
        'radius': parseFloat(els.brush_size.value),
    }
}

function reset(){
    background(brush.bg_color);
}

function swap_colors(){
    let temp = els.brush_color.value;
    els.brush_color.value = els.erase_color.value;
    els.erase_color.value = temp;
    update_brush();
}
