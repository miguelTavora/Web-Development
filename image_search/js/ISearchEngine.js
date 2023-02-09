'use strict';

class ISearchEngine {
	constructor(dbase) {
		//Array of color to be used in image processing algorithms
		this.colors = [
			'red',
			'orange',
			'yellow',
			'green',
			'Blue-green',
			'blue',
			'purple',
			'pink',
			'white',
			'grey',
			'black',
			'brown'
		];

		// Red component of each color
		this.redColor = [ 204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136 ];
		// Green component of each color
		this.greenColor = [ 0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84 ];
		// Blue component of each color
		this.blueColor = [ 0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24 ];

		//List of categories available in the image database
		this.categories = [
			'beach',
			'birthday',
			'face',
			'indoor',
			'manmade/artificial',
			'manmade/manmade',
			'manmade/urban',
			'marriage',
			'nature',
			'no_people',
			'outdoor',
			'party',
			'people',
			'snow'
		];

		//Name of the XML file with the information related to the images
		this.XML_file = dbase;

		// Instance of the XML_Database class to manage the information in the XML file
		this.XML_db = new XML_Database();

		// Instance of the LocalStorageXML class to manage the information in the LocalStorage
		this.LS_db = new LocalStorageXML();

		//Number of images per category for image processing
		this.num_Images = 300;

		//Number of images to show in canvas as a search result
		this.numshownpic = 35;

		//Width of image in canvas
		this.imgWidth = 190;
		//Height of image in canvas
		this.imgHeight = 140;

		//Pool to include all the objects (mainly pictures) drawn in canvas
		this.allpictures = new Pool(this.num_Images * this.categories.length);
	}

	//Method to initialize the canvas. First stage it is used to process all the images
	init(cnv) {
		this.databaseProcessing(cnv);
	}

	// method to build the database which is composed by all the pictures organized by the XML_Database file
	// At this initial stage, in order to evaluate the image algorithms, the method only compute one image.
	// However, after the initial stage the method must compute all the images in the XML file

	databaseProcessing(cnv) {
		//Images processing classes
		let h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
		let colmoments = new ColorMoments();
		this.categories.forEach((category) => {
			let path = 'Images/' + category + '/img_';
			for (let i = 1; i < this.num_Images + 1; i++) {
				let img = new Picture(0, 0, 100, 100, path + i + '.jpg', category);

				//Creating an event that will be used to understand when image is already processed
				let eventname = 'processed_picture_' + img.impath;
				let eventP = new Event(eventname);
				let self = this;
				document.addEventListener(
					eventname,
					function() {
						self.imageProcessed(img, eventname);
					},
					false
				);

				img.computation(cnv, h12color, colmoments, eventP);
			}
		});
	}

	//When the event "processed_picture_" is enabled this method is called to check if all the images are
	//already processed. When all the images are processed, a database organized in XML is saved in the localStorage
	//to answer the queries related to Color and Image Example
	imageProcessed(img, eventname) {
		this.allpictures.insert(img);
		console.log('image processed ' + this.allpictures.stuff.length + eventname);
		if (this.allpictures.stuff.length === this.num_Images * this.categories.length) {
			this.createXMLColordatabaseLS();
			this.createXMLIExampledatabaseLS();
		}
	}

	//Method to create the XML database in the localStorage for color queries
	createXMLColordatabaseLS() {
		let valToSave = '<images>\n';

		for (let i = 0; i < this.colors.length; i++) {
			let redComponent = this.redColor[i];
			let greenComponent = this.greenColor[i];
			let blueComponent = this.blueColor[i];
			const cor = { redComponent, greenComponent, blueComponent };

			let imgPath = 'Images/';

			valToSave += '<image class=&quot' + this.colors[i] + '&quot>\n<path>&quot';
			valToSave += imgPath + '&quot</path>\n</image>';
			// resultado : <image class='<nomeCor/>'\n
			//				<path>'<imgPath/>'</path>
			//os &quot escrevem as aspas ("")
		}
		valToSave += '</images>';
		LS_db.saveLS_XML('categoria', valToSave);
	}

	//Method to create the XML database in the localStorage for Image Example queries
	createXMLIExampledatabaseLS() {
		let list_images = new Pool(this.allpictures.stuff.length);
		this.zscoreNormalization();

		// this method should be completed by the students
	}

	//A good normalization of the data is very important to look for similar images. This method applies the
	// zscore normalization to the data
	zscoreNormalization() {
		let overall_mean = [];
		let overall_std = [];

		// Inicialization
		for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
			overall_mean.push(0);
			overall_std.push(0);
		}

		// Mean computation I
		for (let i = 0; i < this.allpictures.stuff.length; i++) {
			for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
				overall_mean[j] += this.allpictures.stuff[i].color_moments[j];
			}
		}

		// Mean computation II
		for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
			overall_mean[i] /= this.allpictures.stuff.length;
		}

		// STD computation I
		for (let i = 0; i < this.allpictures.stuff.length; i++) {
			for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
				overall_std[j] += Math.pow(this.allpictures.stuff[i].color_moments[j] - overall_mean[j], 2);
			}
		}

		// STD computation II
		for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
			overall_std[i] = Math.sqrt(overall_std[i] / this.allpictures.stuff.length);
		}

		// zscore normalization
		for (let i = 0; i < this.allpictures.stuff.length; i++) {
			for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
				this.allpictures.stuff[i].color_moments[j] =
					(this.allpictures.stuff[i].color_moments[j] - overall_mean[j]) / overall_std[j];
			}
		}
	}

	//Method to search images based on a selected color
	searchColor(category, color) {
		// this method should be completed by the students
	}

	//Method to search images based on keywords
	searchKeywords(category) {
		// this method should be completed by the students
	}

	//Method to search images based on Image similarities
	searchISimilarity(IExample, dist) {
		// this method should be completed by the students
	}

	//Method to compute the Manhattan difference between 2 images which is one way of measure the similarity
	//between images.
	calcManhattanDist(img1, img2) {
		let manhattan = 0;

		for (let i = 0; i < img1.color_moments.length; i++) {
			manhattan += Math.abs(img1.color_moments[i] - img2.color_moments[i]);
		}
		manhattan /= img1.color_moments.length;
		return manhattan;
	}

	//Method to sort images according to the Manhattan distance measure
	sortbyManhattanDist(idxdist, list) {
		// this method should be completed by the students
	}

	//Method to sort images according to the number of pixels of a selected color
	sortbyColor(idxColor, list) {
		list.sort(function(a, b) {
			return b.hist[idxColor] - a.hist[idxColor];
		});
	}

	//Method to visualize images in canvas organized in columns and rows
	gridView(canvas) {
		// this method should be completed by the students
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

	empty_Pool() {
		while (this.stuff.length > 0) {
			this.remove();
		}
	}
}
