// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)

// testeado
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

// testeado - quizás haya una forma más inteligente de obtener esto
function getClosestColor(color, factor)
{
	var intensities = getIntensities(factor);
	return intensities.reduce(function(previous, current) {
  		return (Math.abs(current - color) < Math.abs(previous - color) ? current : previous);
	});
}

// funcando bien
function dither(image, factor)
{
	var rowSize = image.height * 4;
	var columnSize = image.width * 4;

	for (var row = 0; row < rowSize; row++) {
		for (var column = 0; column < columnSize; column++) {

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
         		image.data[index + 4] += (rError*7)>>4;
	         	image.data[index + 5] += (gError*7)>>4;
				image.data[index + 6] += (bError*7)>>4;
         	} 

         	if(row+1==rowSize) continue;

         	// bottom left neighbour
         	if(column > 0){
         		image.data[index + columnSize - 4] += (rError*3)>>4;
         		image.data[index + columnSize - 3] += (gError*3)>>4;
         		image.data[index + columnSize - 2] += (bError*3)>>4;
         	} 

			// bottom neighbour
            image.data[index+columnSize    ] += (rError*5)>>4;
            image.data[index+columnSize + 1] += (gError*5)>>4;
            image.data[index+columnSize + 2] += (bError*5)>>4;

			// bottom right neighbour
         	if(column+1 < columnSize){
         	 	image.data[index+columnSize+4] += (rError*1)>>4;
         	 	image.data[index+columnSize+5] += (gError*1)>>4;
         	 	image.data[index+columnSize+6] += (bError*1)>>4;
         	}
		}
	}
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result)
{
	// testear bien esto - parece que anda?
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