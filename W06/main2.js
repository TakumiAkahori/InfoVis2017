function main2()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var i;
    var v = [];
    var f = [];
    var vertices = [[-1, 1, 1],[-1,-1, 1],[ 1,-1, 1],[ 1, 1, 1],
		    [-1, 1, -1],[-1,-1, -1],[ 1,-1, -1],[ 1, 1, -1]];

    var faces = [[0,1,2],[0,2,3],[2,1,5],[2,5,6],[3,2,6],[3,6,7],[0,3,7],[0,7,4],[1,0,4],[1,4,5],[5,7,6],[5,4,7]];
    
    for(i=0;i<8;i++)
	v[i] = new THREE.Vector3().fromArray( vertices[i] );
    
    for(i=0;i<12;i++){
	var id = faces[i];
	f[i] = new THREE.Face3( id[0], id[1], id[2] );
    }

    //点
    var geometry = new THREE.Geometry();
    for(i=0;i<8;i++)//頂点座標を追加
	geometry.vertices.push( v[i] );

    //面(三角形)
    for(i=0;i<12;i++)//三角形の面を一つずつ作る
	geometry.faces.push( f[i] );

    geometry.computeFaceNormals();

    //面に色をつける
    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.FaceColors;
    for(i=0;i<12;i++)
	geometry.faces[i].color = new THREE.Color( 0, 1, 0 );
    
    material.side = THREE.DoubleSide;

    //立方体のメッシュ作成
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ワイヤーフレームのメッシュ作成
    var wire = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    var wireMesh = new THREE.Mesh(geometry, wire);
    scene.add(wireMesh);


    document.addEventListener( 'mousedown', mouse_down_event );


    //色を変える
    function mouse_down_event( event ){
	
	//スクリーン幅,高さ
	var vx = renderer.domElement.offsetLeft;
	var vy = renderer.domElement.offsetTop;

	var vw = renderer.domElement.width;
	var vh = renderer.domElement.height;

	//マウス位置(2D)
	var x_win = event.clientX;
	var y_win = event.clientY;

	//マウス位置(3D)
	var x_NDC = 2*(x_win-vx)/vw-1;
	var y_NDC = -( 2*(y_win-vy)/vh-1);

	//マウスベクトル
	var p_NDC = new THREE.Vector3( x_NDC, y_NDC, 1 );
	var p_wld = p_NDC.unproject( camera );

	var ray = new THREE.Raycaster( camera.position, p_wld.sub( camera.position ).normalize() );
	

	var intersects = ray.intersectObject( mesh );
	if(intersects.length>0){
	    intersects[0].face.color.setRGB( 1, 0, 1 );
	    intersects[0].object.geometry.colorsNeedUpdate = true;
	}
    }

    
    loop();

    function loop()
    {
	requestAnimationFrame( loop );
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.005;
	wireMesh.rotation.x += 0.005;
	wireMesh.rotation.y += 0.005;
	renderer.render( scene, camera );
    }
}
