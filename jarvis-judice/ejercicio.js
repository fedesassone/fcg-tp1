// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)

function getIntensities(factor)
{
	var offset = Math.round(255/factor);
	var result = [];
	for (var i = 0; i < factor; i++) {
		var toAdd = offset * i;
		result = [...result, toAdd];
	}
	return [...result, 255];
}

function getClosestColor(color, factor)
{
	var intensities = getIntensities(factor);
	var closest = intensities[0];
	var closestDiff = 256;
	for (var i = 0; i<intensities.length ; i++) {
		if(Math.abs(intensities[i] - color) < closestDiff){
			closest = intensities[i];
			closestDiff = Math.abs(intensities[i] - color);
		}
	}
	return closest;
}

function dither(image, factor)
{
	var rowSize = image.height;
	var columnSize = image.width * 4;

	for (var row = 0; row < rowSize; row++) {
		for (var column = 0; column < columnSize; column+= 4) {

			var index = row * columnSize + column;

			var rComponent = image.data[index];
			var gComponent = image.data[index + 1];
			var bComponent = image.data[index + 2];

			var rClosestColor = getClosestColor(rComponent, factor);
			var gClosestColor = getClosestColor(gComponent, factor);
			var bClosestColor = getClosestColor(bComponent, factor);

	        var rError = rComponent - rClosestColor;
	        var gError = gComponent - gClosestColor;
	        var bError = bComponent - bClosestColor;

			// saving real colors
	        image.data[index]     = rClosestColor;
	        image.data[index + 1] = gClosestColor;
			image.data[index + 2] = bClosestColor;

			// right neighbour
         	if(column+1 < columnSize){
         		image.data[index + 4] += Math.floor(rError*7/48);
	         	image.data[index + 5] += Math.floor(gError*7/48);
				image.data[index + 6] += Math.floor(bError*7/48);
         	}

			// right right neighbour
			if (column + 2 < columnSize){
				image.data[index + 8 ] += Math.floor(rError*5/48);
		     	image.data[index + 9 ] += Math.floor(gError*5/48);
				image.data[index + 10] += Math.floor(bError*5/48);
			}

         	// bottom left left neighbour
         	if(column > 2){
         		image.data[index + columnSize - 8] += Math.floor(rError*3/48);
         		image.data[index + columnSize - 7] += Math.floor(gError*3/48);
         		image.data[index + columnSize - 6] += Math.floor(bError*3/48);
         	}

			// bottom left neighbour
			if(column > 1){
	     		image.data[index + columnSize - 4] += Math.floor(rError*5/48);
	     		image.data[index + columnSize - 3] += Math.floor(gError*5/48);
	     		image.data[index + columnSize - 2] += Math.floor(bError*5/48);
         	}

			// bottom neighbour
            image.data[index+columnSize    ] += Math.floor(rError*7/48);
            image.data[index+columnSize + 1] += Math.floor(gError*7/48);
            image.data[index+columnSize + 2] += Math.floor(bError*7/48);

					// bottom right neighbour
         	if(column+1 < columnSize){
         	 	image.data[index+columnSize+4] += Math.floor(rError*5/48);
         	 	image.data[index+columnSize+5] += Math.floor(gError*5/48);
         	 	image.data[index+columnSize+6] += Math.floor(bError*5/48);
         	}

					//bottom righ right neighbour
			if(column+2 < columnSize){
				image.data[index+columnSize+8] += Math.floor(rError*3/48);
		 	 	image.data[index+columnSize+9] += Math.floor(gError*3/48);
		 	 	image.data[index+columnSize+10] += Math.floor(bError*3/48);
			}

					// if(row+2==rowSize) continue;

			//bottom bottom left left neighbour
			if(column > 2){
         		image.data[index + columnSize*2 - 8] += Math.floor(rError*1/48);
         		image.data[index + columnSize*2 - 7] += Math.floor(gError*1/48);
         		image.data[index + columnSize*2 - 6] += Math.floor(bError*1/48);
         	}

			// bottom bottom left neighbour
			if(column > 1){
         		image.data[index + columnSize*2 - 4] += Math.floor(rError*3/48);
         		image.data[index + columnSize*2 - 3] += Math.floor(gError*3/48);
         		image.data[index + columnSize*2 - 2] += Math.floor(bError*3/48);
         	}

			// bottom bottom neighbour
            image.data[index+columnSize*2    ] += Math.floor(rError*5/48);
            image.data[index+columnSize*2 + 1] += Math.floor(gError*5/48);
            image.data[index+columnSize*2 + 2] += Math.floor(bError*5/48);

					// bottom bottom right neighbour
         	if(column+1 < columnSize){
         	 	image.data[index+columnSize*2+4] += Math.floor(rError*3/48);
         	 	image.data[index+columnSize*2+5] += Math.floor(gError*3/48);
         	 	image.data[index+columnSize*2+6] += Math.floor(bError*3/48);
         	}

					//bottom bottom righ right neighbour
			if(column+2 < columnSize){
				image.data[index+columnSize*2+8 ] += Math.floor(rError*1/48);
         	 	image.data[index+columnSize*2+9 ] += Math.floor(gError*1/48);
         	 	image.data[index+columnSize*2+10] += Math.floor(bError*1/48);
			}
		}
	}
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result)
{
	var pixelSize = imageA.data.length;

	for (var i = pixelSize - 1; i >= 0; i--) {

		rComponent = imageA.data[i * 4]     - imageB.data[i * 4];
		gComponent = imageA.data[i * 4 + 1] - imageB.data[i * 4 + 1];
		bComponent = imageA.data[i * 4 + 2] - imageB.data[i * 4 + 2];

		result.data[i * 4]     = Math.abs(rComponent);
		result.data[i * 4 + 1] = Math.abs(gComponent);
		result.data[i * 4 + 2] = Math.abs(bComponent);
	}
}
