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


function dither(image, factor)
{
	var rowSize = image.height;
	var columnSize = image.width;

	for (var row = 0; row + 4 < rowSize; row=row + 4) {
		for (var column = 0; column + 4 < columnSize; column = column + 4) {
			var index = row * columnSize + column;
			var rComponent = image.data[index];
    

			var closestColor = getClosestColor(rComponent, factor);

         	var error = Math.abs(closestColor - rComponent);

         	image.data[index] = rComponent;                  // saving real color

         	if(column+4<columnSize) image.data[index+4] += (error*7)>>4;  // if right neighbour exists
         	if(row+4==rowSize) continue;   // if we are in the last line
         	if(column  >0) image.data[index+columnSize-4] += (error*3)>>4;  // bottom left neighbour
                      image.data[index+columnSize  ] += (error*5)>>4;  // bottom neighbour
         	if(column+4<columnSize) image.data[index+columnSize+4] += (error*1)>>4;  // bottom right neighbour
		}
	}

 // Pseudo-código
 //  for each y from top to bottom do
 //    for each x from left to right do
 //        oldpixel := pixel[x][y]
 //        newpixel := find_closest_palette_color(oldpixel)
 //        pixel[x][y] := newpixel
 //        quant_error := oldpixel - newpixel
 //        pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error × 7 / 16
 //        pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error × 3 / 16
 //        pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error × 5 / 16
 //        pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error × 1 / 16

	
	// cosas operando en varias componentes

	// 	// rComponent = imageA.data[i * 4]     - imageA.data[i * 4];
	// 	// gComponent = imageA.data[i * 4 + 1] - imageA.data[i * 4 + 1];
	// 	// bComponent = imageA.data[i * 4 + 2] - imageA.data[i * 4 + 2];
	// 	// aComponent = imageA.data[i * 4 + 3] - imageA.data[i * 4 + 3];

	// 	image.data[i * 4]     = image.data[i * 4] + 50;
	// 	// image[i * 4 + 1] = gComponent;
	// 	// image[i * 4 + 2] = bComponent;
	// 	// copyImageData[i * 4 + 3] = aComponent;
	// }
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result) 
{
	// testear bien esto
	var pixelSize = imageA.data.length;

	for (var i = pixelSize - 1; i >= 0; i--) {

		rComponent = imageA.data[i * 4]     - imageB.data[i * 4];
		gComponent = imageA.data[i * 4 + 1] - imageB.data[i * 4 + 1];
		bComponent = imageA.data[i * 4 + 2] - imageB.data[i * 4 + 2];
		aComponent = imageA.data[i * 4 + 3] - imageB.data[i * 4 + 3];

		result.data[i * 4]     = rComponent;
		result.data[i * 4 + 1] = gComponent;
		result.data[i * 4 + 2] = bComponent;
		result.data[i * 4 + 3] = 255;
	}s
}