// Esta función construye una matriz de transfromación de 3x3 en coordenadas homogéneas 
// utilizando los parámetros de posición, rotación y escala. La estructura de datos a 
// devolver es un arreglo 1D con 9 valores en orden "column-major". Es decir, para un 
// arreglo A[] de 0 a 8, cada posición corresponderá a la siguiente matriz:
//
// | A[0] A[3] A[6] |
// | A[1] A[4] A[7] |
// | A[2] A[5] A[8] |
// 
// Se deberá aplicar primero la escala, luego la rotación y finalmente la traslación. 
// Las rotaciones vienen expresadas en grados. 
function BuildTransform( positionX, positionY, rotation, scale )
{
	let array = Array(1,0,0,0,1,0,0,0,1);

	// escala
	array[0] = array[0] * scale;
	array[4] = array[4] * scale;

	// rotacion
	// expresada en radianes
	let phi = rotation * (Math.PI/180);
	let px = array[0];
	let py = array[4];

	array[0] = Math.cos(phi) * px;
	array[1] = Math.sin(phi) * px;
	array[3] = - Math.sin(phi) * py;
	array[4] = Math.cos(phi) * py;

	// traslación
	// eje x
	array[6] = positionX;
	// eje y
	array[7] = positionY;

	return array;
}

// Esta función retorna una matriz que resula de la composición de trasn1 y trans2. Ambas 
// matrices vienen como un arreglo 1D expresado en orden "column-major", y se deberá 
// retornar también una matriz en orden "column-major". La composición debe aplicar 
// primero trans1 y luego trans2. 
function ComposeTransforms( trans1, trans2 )
{
	// el resultado tiene la pinta:
	// | A[0] A[3] A[6] |
	// | A[1] A[4] A[7] |
	// | A[2] A[5] A[8] |
	// res = trans2 * trans1 (al punto se aplican así: T2*T1*p )
	// primer fila t2 por primer columna t1
	let res_0 = trans2[0] * trans1[0] 
	          + trans2[3] * trans1[1]
	          + trans2[6] * trans1[2];
  	// primer fila t2 por segunda columna t1
	let res_3 = trans2[0] * trans1[3] 
	          + trans2[3] * trans1[4]
	          + trans2[6] * trans1[5];
  	// primer fila t2 por tercer columna t1
	let res_6 = trans2[0] * trans1[6] 
	          + trans2[3] * trans1[7]
	          + trans2[6] * trans1[8];

	// segunda fila t2 por primer columna t1
	let res_1 = trans2[1] * trans1[0] 
	          + trans2[4] * trans1[1]
	          + trans2[7] * trans1[2];
  	// segunda fila t2 por segunda columna t1
	let res_4 = trans2[1] * trans1[3] 
	          + trans2[4] * trans1[4]
	          + trans2[7] * trans1[5];
  	// segunda fila t2 por tercer columna t1
	let res_7 = trans2[1] * trans1[6] 
	          + trans2[4] * trans1[7]
	          + trans2[7] * trans1[8];

	// tercer fila t2 por primer columna t1
	let res_2 = trans2[2] * trans1[0] 
	          + trans2[5] * trans1[1]
	          + trans2[8] * trans1[2];
  	// tercer fila t2 por segunda columna t1
	let res_5 = trans2[2] * trans1[3] 
	          + trans2[5] * trans1[4]
	          + trans2[8] * trans1[5];
  	// tercer fila t2 por tercer columna t1
	let res_8 = trans2[2] * trans1[6] 
	          + trans2[5] * trans1[7]
	          + trans2[8] * trans1[8];

	return Array(res_0,res_1,res_2,
				 res_3,res_4,res_5,
				 res_6,res_7,res_8);
}


