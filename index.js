const LINE_DENSITY = 500;
let prev_mouse = null;
const els = {
    'brush_color': document.querySelector('#brush-color'),
    'erase_color': document.querySelector('#erase-color'),
    'brush_shape': document.querySelector('#brush-shape'),
    'brush_size': document.querySelector('#brush-size'),
    'canvas': null,
};
let brush = {};

const POINT_FUNCS = {
    'circle': draw_point,
    'square': draw_square,
};

const LINE_FUNCS = {
    'circle': draw_line,
    'square': draw_square_line,
};


function setup(){
    els.canvas = createCanvas(windowWidth, windowHeight);
    update_brush();
    els.brush_color.addEventListener('input', update_brush);
    els.erase_color.addEventListener('input', update_brush);
    els.brush_shape.addEventListener('change', update_brush);
    els.brush_size.addEventListener('change', update_brush);
    rectMode(CENTER);
    angleMode(DEGREES);
    reset();
}

function draw(){}

function windowResized(){
    let buffer = createGraphics(windowWidth, windowHeight);
    buffer.copy(
        els.canvas,
        0, 0,
        windowWidth, windowHeight,
        0, 0,
        windowWidth, windowHeight,
    );
    resizeCanvas(windowWidth, windowHeight);
    background(brush.bg_color);
    copy(
        buffer,
        0, 0,
        windowWidth, windowHeight,
        0, 0,
        windowWidth, windowHeight,
    );
}

function mousePressed(event){
    if(event.target !== canvas)
        return;
    let pos = createVector(mouseX, mouseY);
    POINT_FUNCS[brush.shape](pos);
    prev_mouse = pos;
}

function mouseDragged(event){
    if(event.target !== canvas)
        return;
    let pos = createVector(mouseX, mouseY);
    if(prev_mouse !== null){
        LINE_FUNCS[brush.shape](prev_mouse, pos);
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
    }
}

function draw_point(pos){
    push()
    stroke(brush.fg_color);
    fill(brush.fg_color);
    strokeWeight(brush.size);
    point(pos);
    pop();
}

function draw_square(pos){
    push()
    stroke(brush.fg_color);
    fill(brush.fg_color);
    square(pos.x, pos.y, brush.size);
    pop();
}

function draw_line(start, end){
    push()
    stroke(brush.fg_color);
    fill(brush.fg_color);
    strokeWeight(brush.size);
    line(start.x, start.y, end.x, end.y);
    pop();
}

function draw_square_line(start, end){
    push();
    stroke(brush.fg_color);
    fill(brush.fg_color);
    let heading = end.copy().sub(start).heading();
    for(let i = 0; i < LINE_DENSITY; i++){
        let r = i / LINE_DENSITY * start.dist(end);
        square(
            cos(heading) * r + start.x,
            sin(heading) * r + start.y,
            brush.size,
        );
    }
    pop();
}

function update_brush(){
    brush = {
        'fg_color': els.brush_color.value,
        'bg_color': els.erase_color.value,
        'shape': els.brush_shape.value,
        'size': parseFloat(els.brush_size.value),
    }
}

function reset(){
    resizeCanvas(windowWidth, windowHeight);
    background(brush.bg_color);
}

function swap_colors(){
    let temp = els.brush_color.value;
    els.brush_color.value = els.erase_color.value;
    els.erase_color.value = temp;
    update_brush();
}
