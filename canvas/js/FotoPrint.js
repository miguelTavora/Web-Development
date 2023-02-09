'use strict';

class FotoPrint {
	constructor() {
		this.thingInMotion = null;
		this.offsetx = null;
		this.offsety = null;
		this.shpinDrawing = new Pool(100);

		this.topCanvasPool = new Pool(10);
		this.newitems = null;
	}

	init() {
		let r = new Rect(25, 50, 50, 50, 'red');
		this.topCanvasPool.insert(r);

		let o = new Oval(150, 75, 50, 1, 1, 'blue');
		this.topCanvasPool.insert(o);

		let h = new Heart(250, 75, 80, 'pink');
		this.topCanvasPool.insert(h);

		let dad = new Orange(300, 50, 70, 70, 'imgs/laranja.png');
		this.topCanvasPool.insert(dad);

		let urso = new Bear(430, 90, 85, 'grey', 'black', 'pink', 'white', 1, 1);
		this.topCanvasPool.insert(urso);

		let ghost = new Ghost(500, 130, 'black');
		this.topCanvasPool.insert(ghost);

		let raio = new Eletric(630, 50, 'yellow');
		this.topCanvasPool.insert(raio);
	}

	drawObj(cnv) {
		for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
			this.shpinDrawing.stuff[i].draw(cnv);
		}
	}

	drawTopCnv(cnv) {
		for (let i = 0; i < this.topCanvasPool.stuff.length; i++) {
			const element = this.topCanvasPool.stuff[i];
			element.draw(cnv);
		}
	}

	dragObj(mx, my) {
		let endpt = this.shpinDrawing.stuff.length - 1;

		for (let i = endpt; i >= 0; i--) {
			if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
				this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
				this.offsety = my - this.shpinDrawing.stuff[i].posy;

				let item = this.shpinDrawing.stuff[i];
				this.thingInMotion = this.shpinDrawing.stuff.length - 1;
				this.shpinDrawing.stuff.splice(i, 1);
				this.shpinDrawing.stuff.push(item);
				return true;
			}
		}
		return false;
	}

	moveObj(mx, my) {
		let obj = this.shpinDrawing.stuff[this.thingInMotion];
		obj.setPos(mx - this.offsetx, my - this.offsety);
	}

	removeObj() {
		this.shpinDrawing.remove();
	}

	insertObj(mx, my) {
		let item = null;
		let endpt = this.shpinDrawing.stuff.length - 1;

		for (let i = endpt; i >= 0; i--) {
			if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
				item = this.cloneObj(this.shpinDrawing.stuff[i], 20, 20);

				item.setPos(mx, my);
				this.shpinDrawing.insert(item);
				return item;
			}
		}
		return false;
	}
	changeObjSize(size) {
		let endpt = this.shpinDrawing.stuff.length - 1;
		this.shpinDrawing.stuff[endpt].changeSize(size);
	}
	selectObj(mx, my) {
		let item = null;

		let endpt = this.topCanvasPool.stuff.length - 1;
		for (let i = endpt; i >= 0; i--) {
			if (this.topCanvasPool.stuff[i].mouseOver(mx, my)) {
				item = this.cloneObj(this.topCanvasPool.stuff[i]);
				return item;
			}
		}
		return null;
	}
	save_object_selected(mx, my) {
		let selIT = this.topCanvasPool.stuff.length - 1;
		for (let i = selIT; i >= 0; i--) {
			if (this.topCanvasPool.stuff[i].mouseOver(mx, my)) {
				this.newitems = this.cloneObj(this.topCanvasPool.stuff[i]);
				this.newitems.setPos(mx, my);
				console.log(this.newitems.name);
				return this.newitems;
			}
		}
		return null;
	}
	insertObjSelected(mx, my) {
		console.log(JSON.stringify(this.newitems));
		if (this.newitems != null) {
			this.newitems.setPos(mx, my);
			this.shpinDrawing.insert(this.cloneObj(this.newitems));
			this.newitems = null;
			return true;
		}
		return false;
	}

	cloneObj(obj) {
		let item = {};
		let color = document.getElementById('cor').value;
		let offsetx = 20;
		let offsety = 20;

		switch (obj.name) {
			case 'R':
				item = new Rect(obj.posx + offsetx - 40, obj.posy + offsety - 40, obj.w, obj.h, color);
				break;
			case 'P':
				item = new Orange(obj.posx + offsetx - 50, obj.posy + offsety - 58, obj.w, obj.h, obj.impath);
				break;
			case 'O':
				item = new Oval(obj.posx + offsetx - 20, obj.posy + offsety - 20, obj.r, obj.hor, obj.ver, color);
				break;
			case 'H':
				item = new Heart(obj.posx + offsetx - 30, obj.posy + offsety - 30, obj.drx * 4, color);
				break;
			case 'urso':
				item = new Bear(
					obj.posx + offsetx - 15,
					obj.posy + offsety - 15,
					obj.r,
					color,
					obj.corOlhos,
					obj.corOrelhas,
					obj.corNariz,
					obj.hor,
					obj.ver
				);
				break;
			case 'ghost':
				item = new Ghost(obj.posx + offsetx - 55, obj.posy + offsety + 10, color);
				break;
			case 'olho':
				item = new Olho(
					obj.posx + offsetx,
					obj.posy + offsety,
					obj.raio,
					obj.corOlho,
					obj.tamanhoPupila,
					obj.pupilaOffsetX,
					obj.pupilaOffsetY,
					obj.corPupila
				);
				break;
			case 'electric':
				item = new Eletric(obj.posx + offsetx - 20, obj.posy + offsety - 55, color);
				break;
			default:
				console.log('FAIL..... ' + JSON.stringify(item));
				throw new TypeError('Can not clone this type of object');
		}
		return item;
	}

	setTextObj(cnv, text) {
		let color = document.getElementById('cor').value;
		let item = new DrawingPanel(cnv.width / 2, cnv.height / 2, text, color);

		this.shpinDrawing.insert(item);
	}

	setPicturesObj(cnv, altura, largura, picture) {
		let item = new Picture(cnv.width / 2, cnv.height / 2, altura, largura, picture);

		this.shpinDrawing.insert(item);
	}
}

class Pool {
	constructor(maxSize) {
		this.size = maxSize;
		this.stuff = [];
	}

	insert(obj) {
		if (this.stuff.length < this.size) {
			this.stuff.push(obj);
		} else {
			alert("The application is full: there isn't more memory space to include objects");
		}
	}

	remove() {
		if (this.stuff.length !== 0) {
			this.stuff.pop();
		} else {
			alert("There aren't objects in the application to delete");
		}
	}
}
