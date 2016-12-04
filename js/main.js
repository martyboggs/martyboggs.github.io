var mboggs = {
	canvas: $('canvas#game'),
	three: {
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
		renderer: new THREE.WebGLRenderer({canvas: $('canvas#game').get(0), alpha: true, antalias: true}),
		ambLight: new THREE.AmbientLight(0x222222),
		dirLight: new THREE.DirectionalLight(0xffffff, 1)
	},
	window: {
		width: 0,
		height: 0,
		maxWidth: 949, // 1120 853
		maxHeight: 534, // 630  480
	}
};

mboggs.toRad = Math.PI / 180;

// lighting
mboggs.three.dirLight.position.set(100, 100, 50);
mboggs.three.dirLight.castShadow = true;
mboggs.three.scene.add(mboggs.three.ambLight);
mboggs.three.scene.add(mboggs.three.dirLight);
mboggs.three.renderer.shadowMap.enabled = true;

// floor
mboggs.floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10, 10), new THREE.MeshLambertMaterial({color: '#ffffff'}));
mboggs.floor.rotation.x = -90 * mboggs.toRad;
mboggs.floor.position.y = -3.7;
mboggs.floor.position.z = -3;
mboggs.floor.receiveShadow = true;
mboggs.three.scene.add(mboggs.floor);

// cube
mboggs.cubes = [];
for (var i = 0; i < 10; i += 1) {
	var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({
		color: getRandomColor(i)
	}));
	cube.castShadow = true;
	cube.receiveShadow = true;
	mboggs.cubes.push(cube);
	mboggs.cubes[mboggs.cubes.length - 1].position.set(Math.random() * -6 + 3, 2.8, Math.random() * -6);
	mboggs.three.scene.add(mboggs.cubes[mboggs.cubes.length - 1]);
}

var i = 0;
animateCube(mboggs.cubes[0]);
function animateCube(c) {
	new TWEEN.Tween(c.position).to({y: [-3, 2.8]}, 3000)
		.easing(TWEEN.Easing.Sinusoidal.InOut).repeat(Infinity).start();
	i += 1;
	if (i < mboggs.cubes.length) {
		setTimeout(function () {
			animateCube(mboggs.cubes[i]);
		}, 500);
	}
}

// window
mboggs.window.aspectRatio = mboggs.window.maxWidth / mboggs.window.maxHeight;
mboggs.three.renderer.setSize( window.innerWidth, window.innerHeight );
mboggs.three.camera.position.z = 5;
$(window).resize(function () {
	mboggs.window.width = $('#main-content').width();
	mboggs.window.height = $('#main-content').height();
	if (mboggs.window.windowWidth >= mboggs.window.maxWidth) {
		mboggs.window.width = mboggs.window.maxWidth;
	} else {
		mboggs.window.height = mboggs.window.width / mboggs.window.aspectRatio;
	}
	if (mboggs.window.height >= mboggs.window.maxHeight) {
		mboggs.window.height = mboggs.window.maxHeight;
	} else {
		mboggs.window.width = mboggs.window.height * mboggs.window.aspectRatio;
	}
	mboggs.three.renderer.setSize(mboggs.window.width, mboggs.window.height);
	mboggs.three.camera.aspect = mboggs.window.width / mboggs.window.height;
	mboggs.three.camera.updateProjectionMatrix();
});
$(window).resize();

function render() {
	requestAnimationFrame( render );

	for (var i = 0; i < mboggs.cubes.length; i += 1) {
		mboggs.cubes[i].rotation.x += 0.01;
		mboggs.cubes[i].rotation.y += 0.01;
	}
	TWEEN.update();

	mboggs.three.renderer.render( mboggs.three.scene, mboggs.three.camera );
}
render();

function getRandomColor(i) {
	return ['#327ace', '#ffffff', '#000000'][i % 3];
}
