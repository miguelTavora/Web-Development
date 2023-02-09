//Declaring a global variable which will be created in main function
let app = null;

function main() {
	let canvas = document.querySelector('canvas');

	//Creating the instance of the application
	app = new ISearchEngine('XML/Image_database.xml');

	// Initializing the app
	app.init(canvas);
}

//Function that generates an artificial image and draw it in canvas
//Useful to test the image processing algorithms
function Generate_Image(canvas) {
	var ctx = canvas.getContext('2d');
	var imgData = ctx.createImageData(100, 100);

	for (var i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i + 0] = 204;
		imgData.data[i + 1] = 0;
		imgData.data[i + 2] = 0;
		imgData.data[i + 3] = 255;
		if (
			(i >= 8000 && i < 8400) ||
			(i >= 16000 && i < 16400) ||
			(i >= 24000 && i < 24400) ||
			(i >= 32000 && i < 32400)
		)
			imgData.data[i + 1] = 200;
	}
	ctx.putImageData(imgData, 150, 0);
	return imgData;
}
