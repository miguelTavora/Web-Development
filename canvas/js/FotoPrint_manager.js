'use strict';

let app = null;

function main() {
	let cnv = document.getElementById('canvas');
	let cnv2 = document.getElementById('myCanvas');
	app = new FotoPrint();
	drawCanvasRect(cnv2);
	drawCanvasRect(cnv);

	app.init();
	app.drawTopCnv(cnv2);
	app.drawObj(cnv);

	cnv2.addEventListener('click', get_object, false);
	cnv.addEventListener('mousedown', set_object, false);
	cnv.addEventListener('mousedown', drag, false);

	cnv.addEventListener('dblclick', makenewitem, false);
}

function increaseSize() {
	app.changeObjSize(1.1);
	let cnv = document.getElementById('canvas');
	drawCanvasRect(cnv);
	app.drawObj(cnv);
}
function decreaseSize() {
	app.changeObjSize(0.9);
	let cnv = document.getElementById('canvas');
	drawCanvasRect(cnv);
	app.drawObj(cnv);
}
function get_object(ev) {
	let mx = null;
	let my = null;
	let newitem = null;
	let cnv2 = document.getElementById('myCanvas');

	let xPos = 0;
	let yPos = 0;

	[ xPos, yPos ] = getMouseCoord(cnv2);

	mx = ev.x - xPos;
	my = ev.y - yPos;

	newitem = app.save_object_selected(mx, my);
}

function set_object(ev) {
	let mx = null;
	let my = null;
	let xPos = 0;
	let yPos = 0;

	let cnv = document.getElementById('canvas');

	[ xPos, yPos ] = getMouseCoord(cnv);
	mx = ev.x - xPos;
	my = ev.y - yPos;

	if (app.insertObjSelected(mx, my)) {
		drawCanvasRect(cnv);
		app.drawObj(cnv);
	}
}
function drawCanvasRect(cnv) {
	let ctx = cnv.getContext('2d');

	ctx.clearRect(0, 0, cnv.width, cnv.height);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

//Drag & Drop operation
//drag
function drag(ev) {
	let mx = null;
	let my = null;
	let cnv = document.getElementById('canvas');

	let xPos = 0;
	let yPos = 0;
	[ xPos, yPos ] = getMouseCoord(cnv);
	mx = ev.x - xPos;
	my = ev.y - yPos;

	if (app.dragObj(mx, my)) {
		cnv.style.cursor = 'pointer';
		cnv.addEventListener('mousemove', move, false);
		cnv.addEventListener('mouseup', drop, false);
	}
}

//Drag & Drop operation
//move
function move(ev) {
	let mx = null;
	let my = null;
	let cnv = document.getElementById('canvas');

	let xPos = 0;
	let yPos = 0;
	[ xPos, yPos ] = getMouseCoord(cnv);
	mx = ev.x - xPos;
	my = ev.y - yPos;

	app.moveObj(mx, my);
	drawCanvasRect(cnv);
	app.drawObj(cnv);
}

//Drag & Drop operation
//drop
function drop() {
	let cnv = document.getElementById('canvas');

	cnv.removeEventListener('mousemove', move, false);
	cnv.removeEventListener('mouseup', drop, false);
	cnv.style.cursor = 'crosshair';
}

function makenewitem(ev) {
	let mx = null;
	let my = null;
	let cnv = document.getElementById('canvas');

	let xPos = 0;
	let yPos = 0;
	[ xPos, yPos ] = getMouseCoord(cnv);
	mx = ev.x - xPos;
	my = ev.y - yPos;

	if (app.insertObj(mx, my)) {
		drawCanvasRect(cnv);
		app.drawObj(cnv);
	} else if (icon !== null) {
		let newIcon = app.cloneObj(icon);
		console.log(newIcon);
		newIcon.setPos(mx, my);
		app.addObj(newIcon);
		drawCanvasRect(cnv);
		app.drawObj(cnv);
	}
}

//Delete button
//Onclick Event
function remove() {
	let cnv = document.getElementById('canvas');

	app.removeObj();
	drawCanvasRect(cnv);
	app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
	//Adicionar cor de fundo.
	//Ver: https://stackoverflow.com/questions/50104437/set-background-color-to-save-canvas-chart

	let canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
	context.save();
	context.globalCompositeOperation = 'destination-over';
	context.fillStyle = canvas.style.backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.restore();

	try {
		let link = document.createElement('a');
		link.download = 'imagecanvas.png';
		let canvas = document.getElementById('canvas');
		link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet- stream');
		link.click();
	} catch (err) {
		alert('You need to change browsers OR upload the file to a server.');
	}
}

//Mouse Coordinates for all browsers
function getMouseCoord(el) {
	let xPos = 0;
	let yPos = 0;

	while (el) {
		if (el.tagName === 'BODY') {
			// deal with browser quirks with body/window/document and page scroll
			let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			let yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += el.offsetLeft - xScroll + el.clientLeft;
			yPos += el.offsetTop - yScroll + el.clientTop;
		} else {
			// for all other non-BODY elements
			xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
			yPos += el.offsetTop - el.scrollTop + el.clientTop;
		}

		el = el.offsetParent;
	}
	return [ xPos, yPos ];
}

function getImg(e) {
	let cnv = document.getElementById('canvas');
	let file = e.files[0];
	let a = new Picture(150, 150, 70, 70, URL.createObjectURL(file));

	app.shpinDrawing.insert(a);
	app.drawObj(cnv);
}

/*function setPictures() {
	let idCanvas = document.getElementById('canvas');
	let idImages = document.getElementById('images');
	const fileURL = window.URL.createObjectURL(idImages.files[0]);
	app.setPicturesObj(idCanvas, 150, 150, fileURL);
	app.drawObj(idCanvas);
}*/
function changeBackgroundColor() {
	let elem = document.getElementById('cor');
	let cor = elem.value;

	document.getElementById('canvas').setAttribute('style', 'background-color:' + cor + ';');
}
function setText(ev) {
	let idText = document.getElementById('canvas');
	let writeText = prompt('Escreva aqui o que prentende representar no fotoPrint:');

	if (writeText !== null) {
		app.setTextObj(idText, writeText);
		drawCanvasRect(idText);
		app.drawObj(idText);
	}
}
