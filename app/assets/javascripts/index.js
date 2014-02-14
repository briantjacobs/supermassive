var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

var btj = {};

var data = $.ajax('assets/stars.json')

btj.stars = [];

btj.init = function() {

	var self = this;
	///////////
	// SCENE //
	///////////
	scene = new THREE.Scene();

	////////////
	// CAMERA //
	////////////
	
	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);
	// the camera defaults to position (0,0,0)
	// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	

	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	container = document.getElementById( 'app' );
	container.appendChild( renderer.domElement );

	//////////////
	// CONTROLS //
	//////////////

	// move mouse and: left   click to rotate, 
	//                 middle click to zoom, 
	//                 right  click to pan
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	///////////
	// STATS //
	///////////
	
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	///////////
	// LIGHT //
	///////////
	
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	var ambientLight = new THREE.AmbientLight(0x111111);
	// scene.add(ambientLight);

	//////////////
	// GEOMETRY //
	//////////////
		
	// most objects displayed are a "mesh":
	//  a collection of points ("geometry") and
	//  a set of surface parameters ("material")	

	// Sphere parameters: radius, segments along width, segments along height
	var sphereGeometry = new THREE.SphereGeometry( 1, 16, 16 ); 
	// use a "lambert" material rather than "basic" for realistic lighting.
	//   (don't forget to add (at least one) light!)
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x8888ff} ); 

	var smoothness = 100;

	var stars = self.data[0].data;
	for (var i = 0; i < stars.length; i++) {
		// var moment = data[i];
		// var momentStars = data[i].data;
		var star = stars[i];
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(star.x *50, star.y *50, star.z*50);
		self.stars.push(sphere);
		scene.add(sphere);			

		// for (var j = 0; j < momentStars.length; j++) {
		// 	var star = momentStars[j];
		// 	sphere.position.set(star.x *50, star.y *50, star.z*50);
		// 	scene.add(sphere);
		// };
	}



	var axes = new THREE.AxisHelper(100);
	scene.add( axes );

	/////////
	// SKY //
	/////////
	
	// recommend either a skybox or fog effect (can't use both at the same time) 
	// without one of these, the scene's background color is determined by webpage background

	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// BackSide: render faces from inside of the cube, instead of from outside (default).
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	
	// fog must be added to scene before first render
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );	

}

btj.animate = function() {
    requestAnimationFrame( btj.animate );
	btj.render();		
	btj.update();	

	// one timestamp per loop
	// update each star within loop
	// store previous time index, increment that indexx

}

var timeCounter = 0
btj.update = function() {
	var self = this;
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta();	
		
	// var stars = self.data;
		var star = self.data[timeCounter+1];

		for (var j = 0; j < star.data.length; j++) {
			self.stars[j].position.set(star.data[j].x * 50, star.data[j].y *50, star.data[j].z*50);
		}

		timeCounter++;
	

	//loop over the stars, animate the new xyz according to the previous index

	controls.update();
	stats.update();
}

btj.render = function() {
	renderer.render( scene, camera );
}

$(function() {
	// initialization
	$.when(data).then(function(data){
		btj.data = data;
		btj.init();

		// animation loop / game loop
		btj.animate();
	});

});