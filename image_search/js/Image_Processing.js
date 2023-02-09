class Picture {
	constructor(px, py, w, h, impath, cat) {
		this.posx = px;
		this.posy = py;
		this.w = w;
		this.h = h;
		this.impath = impath;
		this.imgobj = new Image();
		this.imgobj.src = this.impath;
		this.original_w = this.imgobj.width;
		this.original_h = this.imgobj.height;
		this.category = cat;
		this.hist = [];
		this.color_moments = [];
		this.manhattanDist = [];
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

	//method to apply the algorithms to the image.
	//Because the image have to loaded from the server, the same strategy used in the method draw()
	//is used here to access the image pixels. We do not exactly when the image in loaded and computed.
	//For this reason the event "processed_picture" was created to alert the application (ISearchEngine)
	computation(cnv, histcol, colorMom, eventP) {
		let ctx = cnv.getContext('2d');

		if (this.imgobj.complete) {
			console.log('Debug: N Time');
			ctx.drawImage(this.imgobj, 0, 0, this.imgobj.width, this.imgobj.height);
			let pixels = ctx.getImageData(0, 0, this.imgobj.width, this.imgobj.height);
			//let pixels = Generate_Image(cnv);
			this.hist = histcol.count_Pixels(pixels);
			this.build_Color_Rect(cnv, this.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
			this.color_moments = colorMom.moments(this.imgobj, cnv);
			document.dispatchEvent(eventP);
		} else {
			console.log('Debug: First Time');
			let self = this;
			this.imgobj.addEventListener(
				'load',
				function() {
					ctx.drawImage(self.imgobj, 0, 0, self.imgobj.width, self.imgobj.height);
					let pixels = ctx.getImageData(0, 0, self.imgobj.width, self.imgobj.height);
					//let pixels = Generate_Image(cnv);
					self.hist = histcol.count_Pixels(pixels);
					self.build_Color_Rect(cnv, self.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
					self.color_moments = colorMom.moments(self.imgobj, cnv);
					document.dispatchEvent(eventP);
				},
				false
			);
		}

		// this method should be completed by the students
	}

	//method used for debug. It shows the color and the correspondent number of pixels obtained by
	//the colorHistogram algorithm
	build_Color_Rect(canvas, hist, redColor, greenColor, blueColor) {
		let ctx = canvas.getContext('2d');
		let text_y = 390;
		let rect_y = 400;
		let hor_space = 80;

		ctx.font = '12px Arial';
		for (let c = 0; c < redColor.length; c++) {
			ctx.fillStyle = 'rgb(' + redColor[c] + ',' + greenColor[c] + ',' + blueColor[c] + ')';
			ctx.fillRect(c * hor_space, rect_y, 50, 50);
			if (c === 8) {
				ctx.fillStyle = 'black';
			}
			ctx.fillText(hist[c], c * hor_space, text_y);
		}
	}

	setPosition(px, py) {
		this.posx = px;
		this.posy = py;
	}

	mouseOver(mx, my) {
		if (mx >= this.posx && mx <= this.posx + this.w && my >= this.posy && my <= this.posy + this.h) {
			return true;
		}
		return false;
	}
}

//Class to compute the Color Histogram algorithm. It receives the colors and computes the histogram
//through the method count_Pixels()
class ColorHistogram {
	constructor(redColor, greenColor, blueColor) {
		this.redColor = redColor;
		this.greenColor = greenColor;
		this.blueColor = blueColor;

		this.numColors = Math.max(this.redColor.length, this.greenColor.length, this.blueColor.length);
		// this method should be completed by the students
	}

	count_Pixels(pixels) {
		//fazer um for para cada pixel
		//para cada pixel calcular a distancia do pixel a cada uma das cores, se tiver incrementar
		let hist = Array(this.numColors).fill(0);

		let data = pixels.data;

		for (let index = 0; index < data.length; index += 4) {
			//so até 3, o alfa nao importa
			let pixel = data.slice(index, index + 3);

			for (let k = 0; k < this.numColors; k++) {
				let cor = [ this.redColor[k], this.greenColor[k], this.blueColor[k] ];
				let disRed = Math.abs(cor[0] - pixel[0]);
				let disGreen = Math.abs(cor[1] - pixel[1]);
				let disBlue = Math.abs(cor[2] - pixel[2]);

				let dis = disRed + disGreen + disBlue;
				if (disRed < 60 && disBlue < 70 && disGreen < 60 && dis < 160) {
					hist[k] += 1;
				}
			}
		}
		return hist;

		// TODO
	}
}

//Class to compute the Color Moments algorithm. It computes the statistics moments
//through the method moments(). The moments are computed in the HSV color space. The method rgdToHsv is used
//to translate the pixel into the HSV color space
class ColorMoments {
	constructor() {
		this.h_block = 3;
		this.v_block = 3;
	}

	rgbToHsv(rc, gc, bc) {
		let r = rc / 255;
		let g = gc / 255;
		let b = bc / 255;

		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);
		let h = null,
			s = null,
			v = max;

		let dif = max - min;
		s = max == 0 ? 0 : dif / max;

		if (max == min) {
			h = 0;
		} else {
			switch (max) {
				case r:
					h = (g - b) / dif + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / dif + 2;
					break;
				case b:
					h = (r - g) / dif + 4;
					break;
			}
			h /= 6;
		}
		return [ h, s, v ];
	}

	moments(imgobj, cnv) {
		let wBlock = Math.floor(imgobj.width / this.h_block);
		let hBlock = Math.floor(imgobj.height / this.v_block);
		let n = wBlock * hBlock;
		let descriptor = [];

		let ctx = cnv.getContext('2d');
		ctx.drawImage(imgobj, 0, 0);

		for (let i = 0; i < this.h_block; i++) {
			for (let j = 0; j < this.v_block; j++) {
				let pixeis = ctx.getImageData(i * wBlock, j * hBlock, wBlock, hBlock);

				let h = 0,
					s = 0,
					v = 0;
				let H = [],
					S = [],
					V = [];
				let h_contador = 0,
					s_contador = 0,
					v_contador = 0;

				for (let k = 0; k < pixeis.data.length; k += 4) {
					[ h, s, v ] = this.rgbToHsv(pixeis.data[k], pixeis.data[k + 1], pixeis.data[k + 2]);

					H.push(h);
					S.push(s);
					V.push(v);

					h_contador += h;
					s_contador += s;
					v_contador += v;
				}

				let media_h = h_contador / n;
				let media_s = s_contador / n;
				let media_v = v_contador / n;

				h_contador = 0;
				s_contador = 0;
				v_contador = 0;

				for (let k = 0; k < n; k++) {
					h_contador += Math.pow(H[k] - media_h, 2);
					s_contador += Math.pow(S[k] - media_s, 2);
					v_contador += Math.pow(V[k] - media_v, 2);
				}

				let variancia_h = h_contador / n;
				let variancia_s = s_contador / n;
				let variancia_v = v_contador / n;

				descriptor.push(media_h);
				descriptor.push(media_s);
				descriptor.push(media_v);
				descriptor.push(variancia_h);
				descriptor.push(variancia_s);
				descriptor.push(variancia_v);
			}
		}
		return descriptor.slice();
	}
}
