class DrawingObjects {
	constructor(px, py, name) {
		if (this.constructor === DrawingObjects) {
			// Error Type 1. Abstract class can not be constructed.
			throw new TypeError('Can not construct abstract class.');
		}

		//else (called from child)
		// Check if all instance methods are implemented.
		if (this.draw === DrawingObjects.prototype.draw) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError('Please implement abstract method draw.');
		}

		if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
			// Error Type 4. Child has not implemented this abstract method.
			throw new TypeError('Please implement abstract method mouseOver.');
		}

		this.posx = px;
		this.posy = py;
		this.name = name;
		this.scale = 1;
	}

	draw(cnv) {
		// Error Type 6. The child has implemented this method but also called `super.foo()`.
		throw new TypeError('Do not call abstract method draw from child.');
	}

	mouseOver(mx, my) {
		// Error Type 6. The child has implemented this method but also called `super.foo()`.
		throw new TypeError('Do not call abstract method mouseOver from child.');
	}

	sqDist(px1, py1, px2, py2) {
		let xd = px1 - px2;
		let yd = py1 - py2;

		return xd * xd + yd * yd;
	}

	setPos(x, y) {
		this.posx = x;
		this.posy = y;
	}
	changeSize(scale) {
		this.scale = scale;
	}
}

class Rect extends DrawingObjects {
	constructor(px, py, w, h, c) {
		super(px, py, 'R');
		this.w = w;
		this.h = h;
		this.cor = c;
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d');

		ctx.fillStyle = this.cor;
		ctx.fillRect(this.posx, this.posy, this.w, this.h);
	}

	mouseOver(mx, my) {
		return mx >= this.posx && mx <= this.posx + this.w && my >= this.posy && my <= this.posy + this.h;
	}

	changeSize(scale) {
		super.changeSize(scale);
		this.w = this.w * scale;
		this.h = this.h * scale;
	}
}
class Picture extends DrawingObjects {
	constructor(px, py, w, h, impath) {
		super(px, py, 'P');
		this.w = w;
		this.h = h;
		this.impath = impath;
		this.imgobj = new Image();
		this.imgobj.src = this.impath;
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d');

		if (this.imgobj.complete) {
			ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
			console.log('Debug: N Time');
		} else {
			console.log('Debug: First Time');
			let self = this;
			this.imgobj.addEventListener(
				'load',
				function() {
					ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
				},
				false
			);
		}
	}

	mouseOver(mx, my) {
		return mx >= this.posx && mx <= this.posx + this.w && my >= this.posy && my <= this.posy + this.h;
	}
	changeSize(scale) {
		super.changeSize(scale);
		this.w = this.w * scale;
		this.h = this.h * scale;
	}
}

class Orange extends DrawingObjects {
	constructor(px, py, w, h, impath) {
		super(px, py, 'P');
		this.w = w;
		this.h = h;
		this.impath = impath;
		this.imgobj = new Image();
		this.imgobj.src = this.impath;
	}
	inside(cx, cy) {
		return (
			Math.sqrt((cx - this.posx - 35) * (cx - this.posx - 35) + (cy - this.posy - 35) * (cy - this.posy - 35)) <
			35
		);
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d');

		if (this.imgobj.complete) {
			ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
			console.log('Debug: N Time');
		} else {
			console.log('Debug: First Time');
			let self = this;
			this.imgobj.addEventListener(
				'load',
				function() {
					ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
				},
				false
			);
		}
	}

	mouseOver(mx, my) {
		//return mx >= this.posx && mx <= this.posx + this.w && my >= this.posy && my <= this.posy + this.h;
		if (this.inside(mx, my)) return true;
		else return false;
	}
	changeSize(scale) {
		super.changeSize(scale);
		this.w = this.w * scale;
		this.h = this.h * scale;
	}
}

class Oval extends DrawingObjects {
	constructor(px, py, r, hs, vs, c) {
		super(px, py, 'O');
		this.r = r;
		this.radsq = r * r;
		this.hor = hs;
		this.ver = vs;
		this.cor = c;
	}

	mouseOver(mx, my) {
		let x1 = 0;
		let y1 = 0;
		let x2 = (mx - this.posx) / this.hor;
		let y2 = (my - this.posy) / this.ver;

		return this.sqDist(x1, y1, x2, y2) <= this.radsq;
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d');

		ctx.save();
		ctx.translate(this.posx, this.posy);
		ctx.scale(this.hor * this.scale, this.ver * this.scale);
		ctx.fillStyle = this.cor;
		ctx.beginPath();
		ctx.arc(0, 0, this.r, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	changeSize(scale) {
		super.changeSize(scale);
		this.hor = this.hor * scale;
		this.ver = this.ver * scale;
	}
}

class Heart extends DrawingObjects {
	constructor(px, py, w, c) {
		super(px, py, 'H');
		this.h = w * 0.7;
		this.drx = w / 4;
		this.radsq = this.drx * this.drx;
		this.ang = 0.25 * Math.PI;
		this.cor = c;
	}

	outside(x, y, w, h, mx, my) {
		return mx < x || mx > x + w || my < y || my > y + h;
	}

	draw(cnv) {
		let leftctrx = this.posx - this.drx;
		let rightctrx = this.posx + this.drx;
		let cx = rightctrx + this.drx * Math.cos(this.ang);
		let cy = this.posy + this.drx * Math.sin(this.ang);
		let ctx = cnv.getContext('2d');

		ctx.fillStyle = this.cor;
		ctx.beginPath();
		ctx.scale(this.scale, this.scale);
		ctx.moveTo(this.posx, this.posy);
		ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
		ctx.lineTo(this.posx, this.posy + this.h);
		ctx.lineTo(cx, cy);
		ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}

	mouseOver(mx, my) {
		let leftctrx = this.posx - this.drx;
		let rightctrx = this.posx + this.drx;
		let qx = this.posx - 2 * this.drx;
		let qy = this.posy - this.drx;
		let qwidth = 4 * this.drx;
		let qheight = this.drx + this.h;

		let x2 = this.posx;
		let y2 = this.posy + this.h;
		let m = this.h / (2 * this.drx);

		//quick test if it is in bounding rectangle
		if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
			return false;
		}

		//compare to two centers
		if (this.sqDist(mx, my, leftctrx, this.posy) < this.radsq) return true;
		if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

		// if outside of circles AND less than equal to y, return false
		if (my <= this.posy) return false;

		// compare to each slope
		// left side
		if (mx <= this.posx) {
			return my < m * (mx - x2) + y2;
		} else {
			//right side
			m = -m;
			return my < m * (mx - x2) + y2;
		}
	}
	changeSize(scale) {
		super.changeSize(scale);
		this.h = this.h * scale;
		this.drx = this.drx * scale;
	}
}

class Bear extends DrawingObjects {
	constructor(px, py, r, corSkin, corOlhos, corOrelhas, corNariz, hor, ver) {
		super(px, py, 'urso');

		this.r = r;
		//this.radsq = r / 2 * (r / 2);
		this.corSkin = corSkin;
		this.corOlhos = corOlhos;
		this.corOrelhas = corOrelhas;
		this.corNariz = corNariz;
		this.corObj;
		this.hor = hor;
		this.ver = ver;

		this.cara = new Oval(this.posx, this.posy, this.r / 2, hor, ver, this.corSkin);

		this.olhoEsquerdo = new Olho(
			Math.floor(this.posx - this.r / 5), //posx
			Math.floor(this.posy - this.r / 7), //posy
			Math.floor(this.r / 10), //raio
			this.corOlhos,
			0.3,
			-3, //Alterar os offsets das pupilas, por a variar em relacao ao tamanho do olho
			-3,
			this.corNariz
		);

		this.olhoDireito = new Olho(
			Math.floor(this.posx + this.r / 5), //posx
			Math.floor(this.posy - this.r / 7), //posy
			Math.floor(this.r / 10), //raio
			this.corOlhos,
			0.3, // TamanhoPupila
			-3, //Alterar os offsets das pupilas, por a variar em relacao ao tamanho do olho
			-3,
			this.corNariz
		);

		this.orelhaEsquerda = new Olho(
			this.posx - r / 2.5,
			this.posy - r / 3,
			this.r / 5,
			this.corSkin,
			0.5,
			0,
			0,
			this.corOrelhas
		);

		this.orelhaDireita = new Olho(
			this.posx + r / 2.5,
			this.posy - r / 3,
			this.r / 5,
			this.corSkin,
			0.5,
			0,
			0,
			this.corOrelhas
		);

		this.nariz1 = new Oval(this.posx, this.posy + r / 10, this.r / 10, 1.5, 1, this.corOlhos);
		this.nariz2 = new Oval(this.posx - r / 10, this.posy + r / 15, this.r / 35, 1, 1, this.corNariz);
	}

	mouseOver(mx, my) {
		return (
			this.cara.mouseOver(mx, my) || this.orelhaEsquerda.mouseOver(mx, my) || this.orelhaDireita.mouseOver(mx, my)
		);
	}
	setPos(x, y) {
		super.setPos(x, y);

		this.cara.setPos(this.posx, this.posy);

		this.olhoDireito.setPos(
			Math.floor(this.posx + this.r / 5), //posx
			Math.floor(this.posy - this.r / 7)
		);
		this.olhoEsquerdo.setPos(
			Math.floor(this.posx - this.r / 5), //posx
			Math.floor(this.posy - this.r / 7)
		);

		this.orelhaDireita.setPos(this.posx + this.r / 2.5, this.posy - this.r / 3);
		this.orelhaEsquerda.setPos(this.posx - this.r / 2.5, this.posy - this.r / 3);

		this.nariz1.setPos(this.posx, this.posy + this.r / 10);
		this.nariz2.setPos(this.posx - this.r / 10, this.posy + this.r / 15);
	}
	changeSize(scale) {
		super.changeSize(scale);

		this.r = this.r * scale;
		this.cara.changeSize(scale);
		this.olhoDireito.changeSize(scale);
		this.olhoEsquerdo.changeSize(scale);
		this.orelhaDireita.changeSize(scale);
		this.orelhaEsquerda.changeSize(scale);
		this.nariz1.changeSize(scale);
		this.nariz2.changeSize(scale);
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d');
		this.orelhaDireita.draw(cnv);
		this.orelhaEsquerda.draw(cnv);
		this.cara.draw(cnv);
		this.olhoEsquerdo.draw(cnv);
		this.olhoDireito.draw(cnv);
		this.nariz1.draw(cnv);
		this.nariz2.draw(cnv);

		ctx.save();
		ctx.fillStyle = this.corOrelhas;

		//Bigode direito
		ctx.beginPath();

		ctx.arc(this.posx + this.r / 10, this.posy + this.r / 5, this.r / 10, 0, Math.PI, false);
		ctx.stroke();
		//Bigode esquerdo
		ctx.beginPath();
		ctx.arc(this.posx - this.r / 10, this.posy + this.r / 5, this.r / 10, Math.PI, 0, true);
		ctx.stroke();

		ctx.restore();
	}
}

class Ghost extends DrawingObjects {
	constructor(px, py, c) {
		super(px, py, 'ghost');
		this.color = c;
		this.scale = 1;
		this.olhoEsquerdo = new Olho(
			this.posx + 20 * this.scale,
			this.posy - 55 * this.scale,
			12 * this.scale,
			'white',
			1 / 4 * this.scale,
			0,
			0,
			'black'
		);
		this.olhoDireito = new Olho(
			this.posx + 60 * this.scale,
			this.posy - 55 * this.scale,
			12 * this.scale,
			'white',
			1 / 4 * this.scale,
			0,
			0,
			'black'
		);
	}
	outside(cx, cy) {
		return (
			Math.sqrt(
				(cx - this.posx - 40 * this.scale) * (cx - this.posx - 40 * this.scale) +
					(cy - this.posy + 50 * this.scale) * (cy - this.posy + 50 * this.scale)
			) <
			40 * this.scale
		);
	}

	mouseOver(mx, my) {
		if (this.outside(mx, my)) {
			return true;
		}
		return mx >= this.posx && my <= this.posy && mx <= this.posx + 80 && my >= this.posy + -70;
	}

	setPos(x, y) {
		super.setPos(x, y);

		this.olhoEsquerdo.setPos(this.posx + 20, this.posy - 55);
		this.olhoDireito.setPos(this.posx + 60, this.posy - 55);
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d'); //Objeto para desenhar em 2d

		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();

		//	ctx.translate(this.posx, this.posy);
		ctx.moveTo(this.posx, this.posy - 60);
		ctx.bezierCurveTo(this.posx, this.posy - 100, this.posx + 80, this.posy - 100, this.posx + 80, this.posy - 50);
		ctx.lineTo(this.posx + 80, this.posy + 0); //linha até posição (80,0)

		//linhas na parte inferior
		ctx.lineTo(this.posx + 70 * this.scale, this.posy - 10 * this.scale);
		ctx.lineTo(this.posx + 60 * this.scale, this.posy);
		ctx.lineTo(this.posx + 50 * this.scale, this.posy - 10 * this.scale);
		ctx.lineTo(this.posx + 40 * this.scale, this.posy);
		ctx.lineTo(this.posx + 30 * this.scale, this.posy - 10 * this.scale);
		ctx.lineTo(this.posx + 20 * this.scale, this.posy);
		ctx.lineTo(this.posx + 10 * this.scale, this.posy - 10 * this.scale);
		ctx.lineTo(this.posx, this.posy);
		ctx.lineTo(this.posx, this.posy - 60 * this.scale);
		ctx.stroke();
		ctx.scale(this.scale, this.scale);

		ctx.closePath();
		ctx.fill();
		ctx.restore();

		this.olhoDireito.draw(cnv);
		this.olhoEsquerdo.draw(cnv);
	}

	changeSize(scale) {
		this.scale = scale;
		this.olhoDireito.changeSize(scale);
		this.olhoEsquerdo.changeSize(scale);
	}
}

class Olho extends DrawingObjects {
	constructor(posX, posy, raio, corOlho, tamanhoPupila, pupilaOffsetX, pupilaOffsetY, corPupila) {
		if (tamanhoPupila > 1 || tamanhoPupila < 0) {
			console.log('Erro no tamanho pupila');
			throw new TypeError('Tamanho da pupila, em relacao ao olho, deve ser entre 0 e 1, inclusive');
		}
		super(posX, posy, 'olho');
		this.raio = raio;
		this.corOlho = corOlho;
		this.tamanhoPupila = tamanhoPupila;
		this.pupilaOffsetX = pupilaOffsetX;
		this.pupilaOffsetY = pupilaOffsetY;
		this.corPupila = corPupila;
		this.olho = new Oval(this.posx, this.posy, raio, 1, 1, corOlho);
		this.pupila = new Oval(
			this.posx + pupilaOffsetX,
			this.posy + pupilaOffsetY,
			raio * tamanhoPupila,
			1,
			1,
			corPupila
		);
	}
	mouseOver(mx, my) {
		return this.olho.mouseOver(mx, my) || this.pupila.mouseOver(mx, my);
	}

	draw(cnv) {
		this.olho.draw(cnv);
		this.pupila.draw(cnv);
	}

	setPos(x, y) {
		super.setPos(x, y);

		this.olho.posx = this.posx;
		this.olho.posy = this.posy;
		this.pupila.posx = x + this.pupilaOffsetX;
		this.pupila.posy = y + this.pupilaOffsetY;
	}

	changeSize(scale) {
		super.changeSize(scale);
		this.raio = this.raio * scale;
		this.olho.changeSize(scale);
		this.pupila.changeSize(scale);
	}
}

class Eletric extends DrawingObjects {
	constructor(px, py, c) {
		super(px, py, 'electric');
		this.color = c;
		this.box = new Rect(this.posx - 27, this.posy, 57, 92, 'white');
	}
	inside(cx, cy) {}

	mouseOver(mx, my) {
		//return this.box.mouseOver(mx, my);
		return mx >= this.posx - 27 && mx <= this.posx + 35 && my <= this.posy + 100 && my >= this.posy;
	}

	draw(cnv) {
		let ctx = cnv.getContext('2d'); //Objeto para desenhar em 2d
		//this.box.draw(cnv);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.posx, this.posy);
		ctx.lineTo(this.posx + 25 * this.scale, this.posy);
		ctx.lineTo(this.posx + 7 * this.scale, this.posy + 30 * this.scale);
		ctx.lineTo(this.posx + 30 * this.scale, this.posy + 30 * this.scale);
		ctx.lineTo(this.posx - 25 * this.scale, this.posy + 90 * this.scale);
		ctx.lineTo(this.posx, this.posy + 40 * this.scale);
		ctx.lineTo(this.posx - 20 * this.scale, this.posy + 40 * this.scale);
		ctx.lineTo(this.posx, this.posy);
		ctx.scale(this.scale, this.scale);

		ctx.stroke();
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	setPos(x, y) {
		super.setPos(x, y);
	}
	changeSize(scale) {
		this.scale = scale;
	}
}
class DrawingPanel extends DrawingObjects {
	constructor(px, py, text, color) {
		super(px, py, 'T');
		this.text = text;
		this.color = color;
		this.width = null;
		this.height = 30;
	}

	mouseOver(mx, my) {
		let c = document.getElementById('canvas');
		let ctx = c.getContext('2d');
		this.width = ctx.measureText(this.text).width;
		if (
			mx >= this.posx - this.width * 0.02 &&
			mx <= this.posx + this.width &&
			my >= this.posy - this.height * 0.7 &&
			my <= this.posy + this.height * 0.07
		) {
			return true;
		} else return false;
	}
	draw(cnv) {
		let ctx = cnv.getContext('2d');

		this.width = ctx.measureText(this.text).width;

		ctx.font = this.height + 'px Consolas';
		ctx.fillStyle = this.color;

		ctx.fillText(this.text, this.posx, this.posy);
	}
	setPos(mx, my) {
		super.setPos(mx, my);
	}
}
