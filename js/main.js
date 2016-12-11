'use strict'

var keyboard = new THREEx.KeyboardState();
var stats = new Stats();
document.body.appendChild( stats.dom );

var mboggs = {
	projects: [
		{name: 'MeanChatBot', slug: 'meanChatBot', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
		{name: 'Recursia', slug: 'recursia', image: '', description: ''},
	],
	captions: [
		'Cheese Balls and Gravy Boats'
	],
	canvas: $('canvas.game'),
	activeCanvas: 'game',
	camera: new THREE.PerspectiveCamera(75, document.body.clientWidth / document.body.clientHeight, 0.1, 1000),
	games: {
		game: {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({canvas: $('canvas.game').get(0), alpha: true, antalias: false}),
			ambLight: new THREE.AmbientLight('#444'),
			dirLight: new THREE.DirectionalLight(0xffffff, 1),
		},
		game2: {
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer({canvas: $('canvas.game2').get(0), alpha: true, antalias: false}),
			ambLight: new THREE.AmbientLight('#444'),
			dirLight: new THREE.DirectionalLight(0xffffff, 1),
			gameSize: 4,
			dir: [0, 0, -1],
			progress: [],
			nibblet: false,
			nibbletMaterial: new THREE.MeshBasicMaterial({color: 'yellow', transparent: true, opacity: 0.7}),
			displacedMaterial: false,
			starting: true,
			score: 0
		}
	},
	window: {
		width: 0,
		height: 0,
		maxWidth: 949, // 1120 853
		maxHeight: 534, // 630  480
	},
	toRad: Math.PI / 180
};

mboggs.games.game2.head = [mboggs.games.game2.gameSize, mboggs.games.game2.gameSize, 2 * mboggs.games.game2.gameSize];

// window
mboggs.window.aspectRatio = mboggs.window.maxWidth / mboggs.window.maxHeight;
mboggs.games[mboggs.activeCanvas].renderer.setSize( document.body.clientWidth, document.body.clientHeight );
mboggs.camera.position.z = 5;
$(window).resize(function () {
	mboggs.window.width = mboggs.canvas.parent().width();
	mboggs.window.height = mboggs.canvas.parent().height();
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
	mboggs.games[mboggs.activeCanvas].renderer.setSize(mboggs.window.width, mboggs.window.height);
	mboggs.camera.aspect = mboggs.window.width / mboggs.window.height;
	mboggs.camera.updateProjectionMatrix();
});
$(window).resize();

// populate projects
for (var i = 0; i < mboggs.projects.length; i += 1) {
	$('.projects').append(
		'<a class="project" target="_blank" href="' + mboggs.projects[i].slug + '">' +
			mboggs.projects[i].name +
		'</a>'
	);
}

// allow multiple canvases, with one active at a time
$(window).scroll(function (e) {
	$('canvas').each(function (i) {
		var canvas = $(this);
		if ($(document.body).scrollTop() < canvas.offset().top + canvas.height()) {
			if (!this.className || this.className === mboggs.activeCanvas) return false;
			mboggs.activeCanvas = this.className;
			console.log('canvas switched: ' + mboggs.activeCanvas);
			mboggs.canvas = $(this);
			mboggs.canvas.resize();
			return false;
		}
	});
});

// lighting
for (var game in mboggs.games) {
	mboggs.games[game].dirLight.position.set(0, 20, 14);
	mboggs.games[game].dirLight.castShadow = true;
	mboggs.games[game].scene.add(mboggs.games[game].ambLight);
	mboggs.games[game].scene.add(mboggs.games[game].dirLight);
	mboggs.games[game].renderer.shadowMap.enabled = true;
}

// floor
mboggs.floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10, 10), new THREE.MeshLambertMaterial({color: '#ffffff'}));
mboggs.floor.rotation.x = -90 * mboggs.toRad;
mboggs.floor.position.y = -3.7;
mboggs.floor.position.z = -3;
mboggs.floor.receiveShadow = true;
mboggs.games.game.scene.add(mboggs.floor);

// cube
mboggs.cubes = [];
for (var i = 0; i < 9; i += 1) {
	var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({
		color: getRandomColor(i)
	}));
	cube.castShadow = true;
	cube.receiveShadow = true;
	mboggs.cubes.push(cube);
	mboggs.cubes[mboggs.cubes.length - 1].position.set(
		[-3, -1, 1, 3, -4, -2, 0, 2, 4][i],
		2.8,
		[-2, -2, -2, -2, -1, -1, -1, -1, -1][i]
	);
	mboggs.games.game.scene.add(mboggs.cubes[mboggs.cubes.length - 1]);
}

// animate bouncing boxes
var globalI = 0;
animateCube(mboggs.cubes[0]);
function animateCube(c) {
	var tween = new TWEEN.Tween(c.position).to({y: [-3, 2.8]}, 3000)
		.easing(TWEEN.Easing.Sinusoidal.InOut).repeat(Infinity).start();
	c.tween = tween;
	globalI += 1;
	if (globalI < mboggs.cubes.length) {
		setTimeout(function () {
			animateCube(mboggs.cubes[globalI]);
		}, 200);
	}
}

// explode
mboggs.explode = function (mesh) {
	console.log('explode started');
	new TWEEN.Tween(mesh.scale).to({x: 0.001}, 3000).start().onComplete(function () {
		console.log('explode shrink complete runs twice');
		if (mesh.tween) mesh.tween.stop();

		var newCube = new THREE.Mesh(new THREE.BoxGeometry(0.001, 1, 1), new THREE.MeshLambertMaterial({
			color: '#327ace'
		}));
		newCube.castShadow = true;
		newCube.receiveShadow = true;
		newCube.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
		mboggs.cubes.push(newCube);

		var group = new THREE.Object3D({position: mesh.position});
		group.add(mesh, newCube);
// console.log(group);
		mboggs.games.game.scene.add(group);
		mesh = group;

		// new TWEEN.Tween(group.scale).to({x: 2}, 2000).repeat(Infinity).start();

	});
};
// mboggs.explode(mboggs.cubes[0]);


// snake init
(function () {
	var g = mboggs.games.game2;
	mboggs.snake = new THREE.Object3D();
	mboggs.snakeArr = [];
	for (var i = -g.gameSize; i <= g.gameSize; i += 1) {
		mboggs.snakeArr.push([]);
	}
	for (var i = 0; i < mboggs.snakeArr.length; i += 1) {
		for (var j = -g.gameSize; j <= g.gameSize; j += 1) {
			mboggs.snakeArr[i].push([]);
		}
	}
	g.scene.add(mboggs.snake);
console.log('basic');
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	for (var x = -g.gameSize; x <= g.gameSize; x += 1) {
		for (var y = -g.gameSize; y <= g.gameSize; y += 1) {
			for (var z = -g.gameSize; z <= g.gameSize; z += 1) {
				var cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					color: getRandomColor(i),
					transparent: true,
					opacity: 0.1
				}));
				cube.position.set(x, y, z);
				mboggs.snake.add(cube);
				mboggs.snakeArr[x + g.gameSize][y + g.gameSize][z + g.gameSize] = cube;
			}
		}
	}
	mboggs.snake.position.z = -2 * g.gameSize;
	// mboggs.snakeArr[g.head[0]][g.head[1]][g.head[2]].material.opacity = 0.6;

	g.axis = new THREE.AxisHelper(2 * g.gameSize + 0.5);
	g.axis.position.set(0, -g.gameSize - 0.5, -2 * g.gameSize);
	g.axis.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-g.gameSize - 0.5, 0, -g.gameSize - 0.5));
	g.scene.add(g.axis);
}());

// bite yourself
mboggs.games.game2.bit = function () {
	var g = mboggs.games.game2;
	for (var i = 0; i < g.progress.length; i += 1) {
		if (
		g.progress[i][0] === g.head[0] &&
		g.progress[i][1] === g.head[1] &&
		g.progress[i][2] === g.head[2]
		) return true;
	}
	return false;
};

// scored
mboggs.games.game2.scored = function (head) {
	var g = mboggs.games.game2;
	if (
	g.nibblet &&
	g.nibblet[0] === head[0] &&
	g.nibblet[1] === head[1] &&
	g.nibblet[2] === head[2]
	) {
		console.log('scored');
		mboggs.snakeArr[g.nibblet[0]][g.nibblet[1]][g.nibblet[2]].material = g.displacedMaterial;
		mboggs.snakeArr[g.nibblet[0]][g.nibblet[1]][g.nibblet[2]].material.opacity = 0.6;
		return true;
	}
	return false;
};

var stopped = false;

mboggs.games.game2.placeNibblet = function () {
	var g = mboggs.games.game2;
	var length = 2 * g.gameSize + 1;

	var found = checkPlace(getPlace());
	g.nibblet = found;
	g.displacedMaterial = mboggs.snakeArr[found[0]][found[1]][found[2]].material;
	mboggs.snakeArr[found[0]][found[1]][found[2]].material = g.nibbletMaterial;

	function getPlace() {
		var x = Math.floor(Math.random() * length);
		var y = Math.floor(Math.random() * length);
		var z = Math.floor(Math.random() * length);
		return [x, y, z];
	}

	function checkPlace(place) {
		for (var i = 0; i < g.progress.length; i += 1) {
			if (g.progress[i][0] === place[0] &&
			g.progress[i][1] === place[1] &&
			g.progress[i][2] === place[2]) {
				place = false;
				break;
			}
		}
		return place ? place : checkPlace(getPlace());
	}
};
mboggs.games.game2.placeNibblet();

mboggs.games.game2.reset = function () {
	console.log('reset');
	var g = mboggs.games.game2;
	if (g.score > parseInt($('.game2-score').data('score')) && g.score > 0) {
		$('.game2-score').data('score', g.score);
		$('.game2-score').text('high score: ' + g.score + ' points');
	}
	g.score = 0;
	g.lastDir = false;
	g.starting = true;
	for (var i = 0; i < g.progress.length; i += 1) {
		mboggs.snakeArr
			[g.progress[i][0]]
			[g.progress[i][1]]
			[g.progress[i][2]].material.opacity = 0.1;
	}
	g.head = [g.gameSize, g.gameSize, 2 * g.gameSize];
	g.progress.length = 0;
	g.progress.push(g.head.concat());
};

var frame60 = 0;
function render() {
	stats.begin();

	switch (mboggs.activeCanvas) {
		case 'game':
			for (var i = 0; i < mboggs.cubes.length; i += 1) {
				mboggs.cubes[i].rotation.x += 0.01;
				mboggs.cubes[i].rotation.y += 0.01;
			}
		break;
		case 'game2':
			var g = mboggs.games.game2;

			if (keyboard.pressed('d')) {
				g.dir = [1, 0, 0];
			}
			if (keyboard.pressed('a')) {
				g.dir = [-1, 0, 0];
			}
			if (keyboard.pressed('j')) {
				g.dir = [0, 1, 0];
			}
			if (keyboard.pressed('k')) {
				g.dir = [0, -1, 0];
			}
			if (keyboard.pressed('w')) {
				g.dir = [0, 0, -1];
			}
			if (keyboard.pressed('s')) {
				g.dir = [0, 0, 1];
			}

			mboggs.snake.rotation.y += 0.2* mboggs.toRad;
			g.axis.rotation.y += 0.2* mboggs.toRad;

			if (frame60 % 20 === 0) {
				if (g.starting) {
					g.starting = false;
					g.dir = [0, 0, -1];
				}

				// prevent backtracking
				if (g.lastDir && (
				g.lastDir[0] && g.dir[0] && g.lastDir[0] === -g.dir[0] ||
				g.lastDir[1] && g.dir[1] && g.lastDir[1] === -g.dir[1] ||
				g.lastDir[2] && g.dir[2] && g.lastDir[2] === -g.dir[2]
				)) {
					g.dir = g.lastDir.concat();
				}

				// get next move and test
				g.head[0] += g.dir[0];
				g.head[1] += g.dir[1];
				g.head[2] += g.dir[2];

				if (
				Math.abs(g.head[0] - g.gameSize) <= g.gameSize &&
				Math.abs(g.head[1] - g.gameSize) <= g.gameSize &&
				Math.abs(g.head[2] - g.gameSize) <= g.gameSize) { // if in bounds
					if (!g.bit(g.head)) {
						mboggs.snakeArr[g.head[0]][g.head[1]][g.head[2]].material.opacity = 0.6;
						g.progress.push(g.head.concat());
						if (g.progress.length === g.score + 4) {
							var caboose = g.progress.shift();
							mboggs.snakeArr[caboose[0]][caboose[1]][caboose[2]].material.opacity = 0.1;
						}
						g.last = g.head.concat();
						g.lastDir = g.dir.concat();
						if (g.scored(g.head)) {
							g.score += 1;
							g.placeNibblet();
						}
					} else {
						g.reset();
					}
				} else {
					g.reset();
				}
			}
		break;
	}

	stats.end();
	requestAnimationFrame(render);
	frame60 = frame60 < 59 ? frame60 + 1 : 0;
	TWEEN.update();
	mboggs.games[mboggs.activeCanvas].renderer.render(mboggs.games[mboggs.activeCanvas].scene, mboggs.camera);
}
render();


function getRandomColor(i) {
	return ['#327ace', '#d3d3d3', '#333'][i % 3];
}
