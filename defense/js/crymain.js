var camera = null;
var scene;
var renderer;
var clock = new THREE.Clock();
var content = new Object();
var trackballControls = null;
var groundMirror;
var targetList = [];
var mouseDownMode = false;
var startMouseX = 0;
var startMouseY = 0;
var endMouseX = 0;
var endMouseY = 0;
var tapSize = 52;
var towers = [];
var enemies = [];
var gradientCanvas = null;
var cameraShiftCounter = 0;
var cameraShiftStepX = 0;
var cameraShiftStepY = 0;
var cameraShiftStepZ = 0;
var selectionTicker = new SelectionTicker();
//var sparkle1 = null;
//var sparkle2 = null;
//var sparkle3 = null;
var selectionX = 0;
var selectionZ = 0;
var selectionExists = false;
var selectionMesh = null;
var blured = false;
var blurStart = 0;
var blurDuration = 0;
var pathArrayA = null;
var pathArrayB = null;
var vSparkleTexture1 = null;
var vSparkleTexture2 = null;
var vSparkleTexture3 = null;
var vSparkleTexture4 = null;
var deads = [];
var ya = "Yes";
var nope = "No";
var mz = window.localStorage.getItem("mz");
var sfx = window.localStorage.getItem("sfx");
//var ruleBaseTowerPrice() = 20;
var scoreBubble = null;
var waveBubble = null;
//var enemyRedBubble = null;
//var enemyGreenBubble = null;
//var enemyBlueBubble = null;
//var moneyBubble = null;
var scoreCount = ruleLivesStart();
var moneyCount = ruleMoneyStart();
var freezeMode = false;
var looseMode = false;
//var startMode = false;
//var tickDuration = 0.01;
//var tickLast = 0;
var enemyBubles = [];
var waveCounter = -1;
var spriteA = null;
var webAudioContext = null;
var spriteAcounter = -1;
var backgroundAudio = null;
var wathPrompt = null;
//for(var i=0;i<200;i++){console.log(""+i+" - "+ruleWaveColorIndex(i)+": "+ruleWaveLength(i)+" x "+ruleWavePower(i)+", "+ruleEnemyPrize(i));}
var BUFFERS = {};
var BUFFERS_TO_LOAD = {
	/*kick: 'crystal/sounds/kick.wav',
	snare: 'crystal/sounds/snare.wav',
	hihat: 'crystal/sounds/hihat.wav',
	jam: 'crystal/sounds/br-jam-loop.wav',
	crowd: 'crystal/sounds/clapping-crowd.wav',
	drums: 'crystal/sounds/blueyellow.wav',
	organ: 'crystal/sounds/organ-echo-chords.wav',
	techno: 'crystal/sounds/techno.wav'*/
	//test1 : 'crystal/sounds/151022__bubaproducer__laser-shot-silenced.wav',
	dead : './sounds/dead.wav',
	fail : './sounds/fail.wav',
	//test4 : 'crystal/sounds/219620__ani-music__massive-laser-blast-laser2.wav',
	laser1 : './sounds/laser1.wav',
	laser2 : './sounds/laser2.wav',
	laser3 : './sounds/laser3.wav',
	laser4 : './sounds/laser4.wav',
	done : './sounds/done.mp3'
};
var towerRedMaterial = new THREE.MeshLambertMaterial({
		color : 0xff0000,
		side : THREE.DoubleSide
		//specular : 0x333333,
		//metal : true,
		//shininess : 599,
		//transparent : true,
		//opacity : 0.7,
	});
var towerGreenMaterial = new THREE.MeshLambertMaterial({
		color : 0x00ff00,
		side : THREE.DoubleSide
		/*specular : 0x333333,
		metal : true,
		shininess : 599,
		transparent : true,
		opacity : 0.7,*/
	});
var towerBlueMaterial = new THREE.MeshLambertMaterial({
		color : 0x0000ff,
		side : THREE.DoubleSide
		/*specular : 0x333333,
		metal : true,
		shininess : 599,
		transparent : true,
		opacity : 0.7,*/
	});
var textureLaser = new THREE.Texture(laserBodyCanvas());
textureLaser.needsUpdate = true;
var materialRedLaser = new THREE.MeshBasicMaterial({
		map : textureLaser,
		blending : THREE.AdditiveBlending,
		color : 0xaa4444,
		side : THREE.DoubleSide,
		depthWrite : false,
		transparent : true
	});
var materialGreenLaser = new THREE.MeshBasicMaterial({
		map : textureLaser,
		blending : THREE.AdditiveBlending,
		color : 0x44aa44,
		side : THREE.DoubleSide,
		depthWrite : false,
		transparent : true
	});
var materialBlueLaser = new THREE.MeshBasicMaterial({
		map : textureLaser,
		blending : THREE.AdditiveBlending,
		color : 0x4444aa,
		side : THREE.DoubleSide,
		depthWrite : false,
		transparent : true
	});
var requestAnimationFrame = requestAnimationFrame //
	 || window.msRequestAnimationFrame //
	 || window.mozRequestAnimationFrame //
	 || window.webkitRequestAnimationFrame //
;
console.log(requestAnimationFrame);
function tickBubles() {
	for (var i = 0; i < enemyBubles.length; i++) {
		enemyBubles[i].bubble.sprite.position.y = enemyBubles[i].bubble.sprite.position.y + ruleBubbleStepSize();
		if (enemyBubles[i].bubble.sprite.position.y > 3) {
			enemyBubles[i].dead = true;
			enemyBubles[i].bubble.sprite.visible = false;
		}
	}
}
function addEmptyBubble(x, z, txt) {
	for (var i = 0; i < enemyBubles.length; i++) {
		if (enemyBubles[i].dead) {
			enemyBubles[i].dead = false;
			enemyBubles[i].bubble.place(x, 0.5, z);
			enemyBubles[i].bubble.sprite.visible = true;
			enemyBubles[i].bubble.text(txt);
			return enemyBubles[i];
		}
	}
	var eb = new EnemyBubble();
	enemyBubles.push(eb);
	eb.bubble.place(x, 2, z);
	eb.bubble.text(txt);

	return eb;
}
function EnemyBubble() {
	var me = this;
	me.dead = false;
	me.bubble = new Bubble(30, "#ffff00", 100, 2);
	me.tick = function () {
		
	};
	return me;
}
function FieldLabel() {
	var canvasSize = 300;

	var me = this;

	me.textSize = 22;
	me.t1 = "";
	me.t2 = ""; 
	me.t3 = "";
	me.t4 = ""; 
	me.t5 = ""; 
	me.canvas = document.createElement('canvas');
	me.context = me.canvas.getContext('2d');
	me.canvas.width = canvasSize;
	me.canvas.height = canvasSize;
	me.context.textBaseline = "top";
	
	me.context.font = me.textSize + "px font_ttf";

	me.context.fillStyle = "#ffffff";
	me.context.fillText("?", 0, 0);
	me.texture = new THREE.Texture(me.canvas);
	me.texture.needsUpdate = true;
	me.geometry = new THREE.PlaneGeometry(15, 15);
	me.material = new THREE.MeshBasicMaterial({
			
			map : me.texture
		});
	me.material.transparent = true;
	me.mesh = new THREE.Mesh(me.geometry, me.material);
	me.mesh.rotation.x = -0.5 * Math.PI;
	
	me.mesh.position.y = 0.52;
	
	scene.add(me.mesh);
	me.place = function (x, z) {
		me.mesh.position.x = x - 2.5;
		me.mesh.position.z = z - 7.5;
		return me;
	};
	me.retext = function () {
		me.context.clearRect(0, 0, canvasSize, canvasSize);
		
		me.context.fillText(me.t1, 0, 0);
		me.context.fillText(me.t2, 0, 30);
		me.context.fillText(me.t3, 0, 60);
		me.context.fillText(me.t4, 0, 90);
		me.context.fillText(me.t5, 0, 120);

		me.texture.needsUpdate = true;
		me.material.map.needsUpdate = true;
		return me;
	};
	return me;
}
function Bubble(txtSz, clr, canvasSize, spriteSize) {
	var me = this;
	console.log("create bubble");
	me.textSize = txtSz;
	me.color = clr;
	me.material = null;
	me.canvas = document.createElement('canvas');
	me.context = me.canvas.getContext('2d');
	me.canvas.width = canvasSize;
	me.canvas.height = canvasSize;
	me.context.textBaseline = "top";
	
	me.context.font = me.textSize + "px font_ttf";
	me.context.fillStyle = me.color;
	me.context.fillText("?", 0, 0);
	me.texture = new THREE.Texture(me.canvas);
	me.texture.needsUpdate = true;
	me.place = function (x, y, z) {
		
		me.sprite.position.set(x, y, z);
		
		return me;
	};
	me.material = new THREE.SpriteMaterial({
			side : THREE.DoubleSide,
			map : me.texture
			
		});
	me.material.transparent = true;

	me.material.map.needsUpdate = true;
	me.sprite = new THREE.Sprite(me.material);
	me.sprite.scale.set(spriteSize, spriteSize, spriteSize);
	scene.add(me.sprite);
	
	me.text = function (txt) {
		me.context.clearRect(0, 0, canvasSize, canvasSize);
		
		me.context.fillText(txt, 0, 0);
		me.texture.needsUpdate = true;
		me.material.map.needsUpdate = true;
		return me;
	};
	return this;
}
function TowerRed(x, z) {
	var t = new Tower(x, z, towerRedMaterial, 0);
	t.beamFunc = LaserBeamRed;
	t.spriteColor = 0xff6666;
	t.createBeam();
	t.strikeEffect = function (enemy) {
		
		enemy.addRedEffect(ruleEffectPowerRed(t.level));
	};
	t.actCounter = 123456789;
	return t;
}
function TowerGreen(x, z) {
	var t = new Tower(x, z, towerGreenMaterial, 1);
	t.beamFunc = LaserBeamGreen;
	t.spriteColor = 0x66ff66;
	t.createBeam();
	t.strikeEffect = function (enemy) {
		
		enemy.addGreenEffect(ruleEffectPowerGreen(t.level));
	};
	t.actCounter = 123456789;
	return t;
}
function TowerBlue(x, z) {
	var t = new Tower(x, z, towerBlueMaterial, 2);
	t.beamFunc = LaserBeamBlue;
	t.spriteColor = 0x6666ff;
	t.createBeam();
	t.strikeEffect = function (enemy) {
		enemy.addBlueEffect(ruleEffectPowerBlue(t.level));
		
	};
	t.actCounter = 123456789;
	return t;
}
function Tower(x, z, towerMaterial, towerColorId) {
	var me = this;
	me.towerColor = towerColorId;
	me.spriteColor = 0xffffff;
	me.xx = x;
	me.zz = z;
	
	me.r = Math.random() * 0.2 + 1;
	me.sleepDuration = ruleSleepDuration1();
	me.fireDuration = ruleFireDuration1();
	
	me.sellPrice = ruleSellTower1();
	me.actCounter = 0;
	me.inFire = false;
	me.enemy = null;
	me.speed = ruleTowerRotationSpeed1();
	me.level = 0;
	
	me.level = 0;
	

	me.currentBox = 0;
	me.material = towerMaterial;
	
	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(0.5, 0, 0));
	geo.vertices.push(new THREE.Vector3(-0.5, 0, 0));
	geo.vertices.push(new THREE.Vector3(0, 1, 0));
	geo.vertices.push(new THREE.Vector3(0, -1, 0));
	geo.vertices.push(new THREE.Vector3(0, 0, 0.5));
	geo.vertices.push(new THREE.Vector3(0, 0, -0.5));
	geo.faces.push(new THREE.Face3(0, 2, 4));
	geo.faces.push(new THREE.Face3(1, 2, 4));
	geo.faces.push(new THREE.Face3(1, 2, 5));
	geo.faces.push(new THREE.Face3(0, 2, 5));
	geo.faces.push(new THREE.Face3(0, 4, 3));
	geo.faces.push(new THREE.Face3(1, 4, 3));
	geo.faces.push(new THREE.Face3(1, 5, 3));
	geo.faces.push(new THREE.Face3(5, 0, 3));
	geo.computeFaceNormals();
	geo.computeVertexNormals();
	me.mesh = new THREE.Mesh(geo, me.material);
	me.mesh.position.x = 2 * me.xx - 10 + 1;
	me.mesh.position.y = 1.5;
	me.mesh.position.z = 2 * me.zz - 15 + 1;
	scene.add(me.mesh);
	towers.push(me);
	me.beamFunc = LaserBeamRed;
	me.beamY = 2;
	me.turn = function () {
		me.mesh.rotation.y = me.mesh.rotation.y + me.speed * me.r;
	};
	
	me.strikeEffect = function (enemy) {
		
	};
	me.startFire = function () {
		me.enemy = findNearestEnemy(2 * me.xx - 10 + 1, 2 * me.zz - 15 + 1, ruleTowerStrikeDistance(me.level));
		if (me.enemy != null) {
			if (me.level == 0) {
				playSound(BUFFERS.laser1, 0);
			}
			if (me.level == 1) {
				playSound(BUFFERS.laser2, 0);
			}
			if (me.level == 2) {
				playSound(BUFFERS.laser3, 0);
			}
			if (me.level == 3) {
				playSound(BUFFERS.laser4, 0);
			}
			me.beam.unhide();
			me.sprite.visible = true;
			me.highlight.visible = true;
			
			me.updateFire();
			me.actCounter = 0;
			me.inFire = true;
			if (me.enemy.strike(ruleStrikePower(0, me.towerColor, me.level), ruleStrikePower(1, me.towerColor, me.level), ruleStrikePower(2, me.towerColor, me.level)))
				
			{
				if (Math.random() < ruleEffectSeed()) {
					me.strikeEffect(me.enemy);
				}
			}
		}
	};
	me.updateFire = function () {
		var twr = new THREE.Vector3(2 * me.xx - 10 + 1, me.beamY, 2 * me.zz - 15 + 1);
		var enm = new THREE.Vector3(me.enemy.left - 10 + 0.5, 1, me.enemy.top - 15 + 0.5);
		me.beam.reset(twr, enm);
		var ray = new THREE.Raycaster(twr, enm.sub(twr).normalize());
		var intersects = ray.intersectObject(me.enemy.mesh);
		if (intersects.length > 0) {
			me.sprite.position.x = intersects[0].point.x;
			me.sprite.position.y = intersects[0].point.y;
			me.sprite.position.z = intersects[0].point.z;
		}
		me.highlight.position.x = twr.x;
		me.highlight.position.y = twr.y;
		me.highlight.position.z = twr.z;
	};
	me.stopFire = function () {
		me.beam.hide();
		me.sprite.visible = false;
		me.highlight.visible = false;
		
		me.actCounter = 0;
		me.inFire = false;
		me.currentBox++;
		if (me.currentBox > 2) {
			if (me.level == 2) {
				if (me.currentBox > 3) {
					me.currentBox = 0;
				}
			} else {
				me.currentBox = 0;
			}
		}
	};
	me.tick = function () {
		me.turn();
		me.actCounter++;
		if (me.inFire) {
			me.updateFire();
			if (me.actCounter > me.fireDuration) {
				me.stopFire();
			}
		} else {
			if (me.actCounter > me.sleepDuration) {
				me.startFire();
			}
			
		}

	};
	me.createBeam = function () {
		me.beam = new me.beamFunc(new THREE.Vector3(2 * me.xx - 10 + 1, 2, 2 * me.zz - 15 + 1), new THREE.Vector3(0, 1, 0));
		scene.add(me.beam.object3d);
		
		me.sprite = sparkleSprite(2, me.spriteColor, sparkleTexture3());
		me.highlight = sparkleSprite(3, me.spriteColor, sparkleTexture2());
		scene.add(me.highlight);
		scene.add(me.sprite);
		me.stopFire();
	};
	me.upgrade = function () {
		me.actCounter = 123456789;
		if (me.level == 0) {
			me.upgrade1();
		} else {
			if (me.level == 1) {
				me.upgrade2();
			} else {
				if (me.level == 2) {
					me.upgrade3();
				} else {
					showWarning("Maximum level aready");
				}
			}
		}
	};
	me.upgrade1 = function () {
		scene.remove(me.mesh);
		
		me.sellPrice = ruleSellTower2();
		me.level++;
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0.75, 0, 0));
		geo.vertices.push(new THREE.Vector3(-0.75, 0, 0));
		geo.vertices.push(new THREE.Vector3(0, 3, 0));
		geo.vertices.push(new THREE.Vector3(0, -1, 0));
		geo.vertices.push(new THREE.Vector3(0, 0, 0.75));
		geo.vertices.push(new THREE.Vector3(0, 0, -0.75));
		geo.faces.push(new THREE.Face3(0, 2, 4));
		geo.faces.push(new THREE.Face3(1, 2, 4));
		geo.faces.push(new THREE.Face3(1, 2, 5));
		geo.faces.push(new THREE.Face3(0, 2, 5));
		geo.faces.push(new THREE.Face3(0, 4, 3));
		geo.faces.push(new THREE.Face3(1, 4, 3));
		geo.faces.push(new THREE.Face3(1, 5, 3));
		geo.faces.push(new THREE.Face3(5, 0, 3));
		geo.computeFaceNormals();
		geo.computeVertexNormals();
		me.mesh = new THREE.Mesh(geo, me.material);
		me.mesh.position.x = 2 * me.xx - 10 + 1;
		me.mesh.position.y = 1.5;
		me.mesh.position.z = 2 * me.zz - 15 + 1;
		me.speed = ruleTowerRotationSpeed2();
		
		me.sleepDuration = ruleSleepDuration2();
		me.fireDuration = ruleFireDuration2();

		me.highlight.scale.set(1, 1, 1).multiplyScalar(4);
		me.beamY = 3;
		scene.add(me.mesh);
		
	};
	me.upgrade2 = function () {
		scene.remove(me.mesh);
		
		me.sellPrice = ruleSellTower3();
		me.level++;
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0.5, 0, 0));
		geo.vertices.push(new THREE.Vector3(-0.5, 0, 0));
		geo.vertices.push(new THREE.Vector3(0, 5, 0));
		geo.vertices.push(new THREE.Vector3(0, 0, 0.5));
		geo.vertices.push(new THREE.Vector3(0, 0, -0.5));
		geo.faces.push(new THREE.Face3(0, 2, 3));
		geo.faces.push(new THREE.Face3(1, 2, 3));
		geo.faces.push(new THREE.Face3(1, 2, 4));
		geo.faces.push(new THREE.Face3(0, 2, 4));
		geo.computeFaceNormals();
		geo.computeVertexNormals();
		me.mesh = new THREE.Mesh(geo, me.material);
		me.mesh.position.x = 2 * me.xx - 10 + 1;
		me.mesh.position.y = 0.5;
		me.mesh.position.z = 2 * me.zz - 15 + 1;
		me.speed = ruleTowerRotationSpeed3();
		
		me.sleepDuration = ruleSleepDuration3();
		me.fireDuration = ruleFireDuration3();

		me.highlight.scale.set(1, 1, 1).multiplyScalar(4);
		me.beamY = 3;
		scene.add(me.mesh);
		geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		me.mesh1 = new THREE.Mesh(geo, me.material);
		
		me.mesh1.position.set(0, 0, -1 * 0.75);
		
		me.mesh2 = new THREE.Mesh(geo, me.material);
		me.mesh2.position.set(0.75 * 0.75, 0, 0.5 * 0.75);
		
		me.mesh3 = new THREE.Mesh(geo, me.material);
		me.mesh3.position.set(-0.75 * 0.75, 0, 0.5 * 0.75);
		
		me.group = new THREE.Object3D();
		me.group.position.set(2 * me.xx - 10 + 1, 3, 2 * me.zz - 15 + 1);
		me.group.add(me.mesh1);
		me.group.add(me.mesh2);
		me.group.add(me.mesh3);
		
		scene.add(me.group);

		me.turn = function () {
			
			me.mesh1.rotation.y = me.mesh1.rotation.y + me.speed * me.r;
			me.mesh1.rotation.x = me.mesh1.rotation.x + 0.5 * me.speed * me.r;
			me.mesh2.rotation.y = me.mesh2.rotation.y + me.speed * me.r;
			me.mesh2.rotation.z = me.mesh2.rotation.z + 0.5 * me.speed * me.r;
			me.mesh3.rotation.y = me.mesh3.rotation.y + 0.5 * me.speed * me.r;
			me.mesh3.rotation.x = me.mesh3.rotation.x + me.speed * me.r;
			
			me.group.rotation.y = me.group.rotation.y + 0.3 * me.speed * me.r;
		};
		me.updateFire = function () {
			var cuMesh = me.mesh1;
			if (me.currentBox == 1) {
				cuMesh = me.mesh2;
			}
			if (me.currentBox == 2) {
				cuMesh = me.mesh3;
			}
			var twr = new THREE.Vector3(0, 0, 0); 
			cuMesh.localToWorld(twr);
			

			var enm = new THREE.Vector3(me.enemy.left - 10 + 0.5, 1, me.enemy.top - 15 + 0.5);
			me.beam.reset(twr, enm);
			var ray = new THREE.Raycaster(twr, enm.sub(twr).normalize());
			var intersects = ray.intersectObject(me.enemy.mesh);
			if (intersects.length > 0) {
				me.sprite.position.x = intersects[0].point.x;
				me.sprite.position.y = intersects[0].point.y;
				me.sprite.position.z = intersects[0].point.z;
			}
			me.highlight.position.x = twr.x;
			me.highlight.position.y = twr.y;
			me.highlight.position.z = twr.z;

		};
		
	};

	me.upgrade3 = function () {
		scene.remove(me.mesh);
		
		me.sellPrice = ruleSellTower4();
		me.level++;
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 3, 0));
		geo.vertices.push(new THREE.Vector3(0.75, 0, 0.75));
		geo.vertices.push(new THREE.Vector3(-0.75, 0, 0.75));
		geo.vertices.push(new THREE.Vector3(-0.75, 0, -0.75));
		geo.vertices.push(new THREE.Vector3(0.75, 0, -0.75));
		geo.faces.push(new THREE.Face3(0, 1, 2));
		geo.faces.push(new THREE.Face3(0, 2, 3));
		geo.faces.push(new THREE.Face3(0, 3, 4));
		geo.faces.push(new THREE.Face3(0, 4, 1));
		geo.computeFaceNormals();
		geo.computeVertexNormals();
		me.mesh = new THREE.Mesh(geo, me.material);
		me.mesh.position.x = 2 * me.xx - 10 + 1;
		me.mesh.position.y = 0.5;
		me.mesh.position.z = 2 * me.zz - 15 + 1;
		me.speed = ruleTowerRotationSpeed4();
		
		me.sleepDuration = ruleSleepDuration4();
		me.fireDuration = ruleFireDuration4();
		me.highlight.scale.set(1, 1, 1).multiplyScalar(4);
		me.beamY = 3;
		scene.add(me.mesh);
		geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		me.mesh4 = new THREE.Mesh(geo, me.material);
		me.group.add(me.mesh4);
		me.group.position.y = 2;
		me.mesh1.position.set(+1 * 1.25, 0, +1 * 1.25);
		me.mesh2.position.set(+1 * 1.25, 0, -1 * 1.25);
		me.mesh3.position.set(-1 * 1.25, 0, -1 * 1.25);
		me.mesh4.position.set(-1 * 1.25, 0, +1 * 1.25);
		me.turn = function () {
			
			me.mesh1.rotation.y = me.mesh1.rotation.y + me.speed * me.r;
			me.mesh1.rotation.x = me.mesh1.rotation.x + 0.5 * me.speed * me.r;
			me.mesh1.position.y = 0.5 * Math.sin(-me.mesh1.rotation.x);
			me.mesh1.position.x = 1 - 0.125 * Math.cos(me.mesh1.rotation.x);
			me.mesh1.position.z = 1 - 0.125 * Math.cos(me.mesh1.rotation.x);

			me.mesh2.rotation.y = me.mesh2.rotation.y + me.speed * me.r;
			me.mesh2.rotation.z = me.mesh2.rotation.z + 0.5 * me.speed * me.r;
			me.mesh2.position.y = 0.5 * Math.sin(-me.mesh1.rotation.x);
			me.mesh2.position.x = 1 - 0.125 * Math.cos(-me.mesh1.rotation.x);
			me.mesh2.position.z = -1.75 + 1 + 0.125 * Math.cos(-me.mesh1.rotation.x);

			me.mesh3.rotation.y = me.mesh3.rotation.y + 0.5 * me.speed * me.r;
			me.mesh3.rotation.x = me.mesh3.rotation.x + me.speed * me.r;
			me.mesh3.position.y = 0.5 * Math.sin( - me.mesh1.rotation.x);
			me.mesh3.position.x = -1.75 + 1 + 0.125 * Math.cos(me.mesh1.rotation.x);
			me.mesh3.position.z = -1.75 + 1 + 0.125 * Math.cos(me.mesh1.rotation.x);

			me.mesh4.rotation.y = me.mesh4.rotation.y + 0.5 * me.speed * me.r;
			me.mesh4.rotation.x = me.mesh4.rotation.x + me.speed * me.r;
			me.mesh4.position.y = 0.5 * Math.sin(-me.mesh1.rotation.x);
			me.mesh4.position.x = -1.75 + 1 + 0.125 * Math.cos(me.mesh1.rotation.x);
			me.mesh4.position.z = 1 - 0.125 * Math.cos(me.mesh1.rotation.x);

			
			me.group.rotation.y = me.group.rotation.y + 0.7 * me.speed * me.r;
		};
		me.updateFire = function () {
			var cuMesh = me.mesh1;
			if (me.currentBox == 1) {
				cuMesh = me.mesh2;
			}
			if (me.currentBox == 2) {
				cuMesh = me.mesh3;
			}
			if (me.currentBox == 3) {
				cuMesh = me.mesh4;
			}
			var twr = new THREE.Vector3(0, 0, 0); 
			cuMesh.localToWorld(twr);
			

			var enm = new THREE.Vector3(me.enemy.left - 10 + 0.5, 1, me.enemy.top - 15 + 0.5);
			me.beam.reset(twr, enm);
			var ray = new THREE.Raycaster(twr, enm.sub(twr).normalize());
			var intersects = ray.intersectObject(me.enemy.mesh);
			if (intersects.length > 0) {
				me.sprite.position.x = intersects[0].point.x;
				me.sprite.position.y = intersects[0].point.y;
				me.sprite.position.z = intersects[0].point.z;
			}
			me.highlight.position.x = twr.x;
			me.highlight.position.y = twr.y;
			me.highlight.position.z = twr.z;

		};
		
	};

	me.sell = function () {
		for (var i = 0; i < towers.length; i++) {
			if (towers[i] == me) {

				towers.splice(i, 1);
				scene.remove(me.mesh);
				scene.remove(me.beam.object3d);
				scene.remove(me.highlight);
				scene.remove(me.sprite);
				if (me.level > 1) {
					scene.remove(me.group);
				}
			}
		}
	};
	return me;
}
function distance(v1, v2) {
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;

	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function findNearestEnemy(tx, ty, limi) {
	var r = null;
	var minD = 0;
	for (var i = 0; i < enemies.length; i++) {
		var e = enemies[i];
		var d = distance(new THREE.Vector3(tx, 2, ty) //
			, new THREE.Vector3(e.left - 10 + 0.5, 1, e.top - 15 + 0.5) //
			);
		if (d < limi) {
			if (d < minD || minD == 0) {
				r = e;
				minD = d;
			}
		}
	}
	return r;
}
function sparkleTexture1(name) {
	if (vSparkleTexture1 == null) {
		var textureUrl = './images/sparkle1.jpg';
		vSparkleTexture1 = THREE.ImageUtils.loadTexture(textureUrl);
	}
	return vSparkleTexture1;
}
function sparkleTexture2(name) {
	if (vSparkleTexture2 == null) {
		var textureUrl = './images/sparkle2.jpg';
		vSparkleTexture2 = THREE.ImageUtils.loadTexture(textureUrl);
	}
	return vSparkleTexture2;
}
function sparkleTexture3(name) {
	if (vSparkleTexture3 == null) {
		var textureUrl = './images/sparkle3.jpg';
		vSparkleTexture3 = THREE.ImageUtils.loadTexture(textureUrl);
	}
	return vSparkleTexture3;
}
function sparkleTexture4(name) {
	if (vSparkleTexture4 == null) {
		var textureUrl = './images/sparkle4.jpg';
		vSparkleTexture4 = THREE.ImageUtils.loadTexture(textureUrl);
	}
	return vSparkleTexture4;
}
function sparkleSprite(meshSize, c, texture) {
	var material = new THREE.SpriteMaterial({
			map : texture,
			blending : THREE.AdditiveBlending,
			useScreenCoordinates : false,
			color : c
		});
	var s = new THREE.Sprite(material);
	s.scale.set(1, 1, 1).multiplyScalar(meshSize);
	return s;
}

function EnemyRedGreen(pathArray, strong) {
	var e = new Enemy(0xcccc00, pathArray, strong, strong, 0);
	return e;
}
function EnemyRedBlue(pathArray, strong) {
	var e = new Enemy(0xcc00cc, pathArray, strong, 0, strong);
	return e;
}
function EnemyGreenBlue(pathArray, strong) {
	var e = new Enemy(0x00cccc, pathArray, 0, strong, strong);
	return e;
}
function EnemyWhite(pathArray, strong) {
	var e = new Enemy(0xcccccc, pathArray, strong, strong, strong);
	return e;
}
function removeEnemy(e) {
	deads.push(e);
	playSound(BUFFERS.dead, 0);
	
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i] === e) {
			e.removeRedEffect();
			e.removeGreenEffect();
			e.removeBlueEffect();
			enemies.splice(i, 1);
			
			break;
		}
	}
	checkWaveWin();
}
function checkWaveWin() {
	if (enemies.length < 1) {
		console.log("wave done");
		updateWaveLabel(waveCounter + 1);
		document.getElementById("hudSelect").style.visibility = 'visible';
		selectionMesh.visible = true;
		freezeMode = true;
	}
}
function updateWaveLabel(cucntr) {
	var cntr = cucntr;
	if (cntr < 0) {
		cntr = 0;
	}
	console.log("updateWaveLabel " + cntr);

	if (waveBubble == null) {
		console.log("waveBubble is null");
		return;
	}
	var waveColor = ruleWaveColorIndex(cntr);
	waveBubble.t1 = "wave: " + (cntr + 1);
	var str = ruleWavePower(cntr);
	var cnt = ruleWaveLength(cntr); 
	if (waveColor == 0) {
		waveBubble.t2 = "red: " + str;
		waveBubble.t3 = "green: " + str;
		waveBubble.t4 = "blue: 0";
		waveBubble.t5 = "prize: " + (2 * cnt) + "x" + ruleEnemyPrize(cntr);
	} else {
		if (waveColor == 1) {
			waveBubble.t2 = "red: 0";
			waveBubble.t3 = "green: " + str;
			waveBubble.t4 = "blue: " + str;
			waveBubble.t5 = "prize: " + (2 * cnt) + "x" + ruleEnemyPrize(cntr);
		} else {
			if (waveColor == 2) {
				waveBubble.t2 = "red: " + str;
				waveBubble.t3 = "green: 0";
				waveBubble.t4 = "blue: " + str;
				waveBubble.t5 = "prize: " + (2 * cnt) + "x" + ruleEnemyPrize(cntr);
			} else {
				waveBubble.t2 = "red: " + str;
				waveBubble.t3 = "green: " + str;
				waveBubble.t4 = "blue: " + str;
				waveBubble.t5 = "prize: " + cnt + "x2x" + ruleEnemyPrize(cntr);
			}
		}
	}
	
	waveBubble.retext();

}
function tickDeads() {
	for (var i = 0; i < deads.length; i++) {
		deads[i].mesh.position.y = deads[i].mesh.position.y - ruleDeadStepSize();
	}
	for (var i = 0; i < deads.length; i++) {
		if (deads[i].mesh.position.y < -0.1) {
			removeDead(deads[i]);
			i--;
		}
	}
}
function removeDead(e) {
	for (var i = 0; i < deads.length; i++) {
		if (deads[i] === e) {
			deads.splice(i, 1);
			scene.remove(e.mesh);
			break;
		}
	}
}
function Enemy(c, f, r, g, b) {
	var me = this;
	me.lifeRed = r;
	me.lifeGreen = g;
	me.lifeBlue = b;

	me.maxRed = r;
	me.maxGreen = g;
	me.maxBlue = b;

	me.fields = f;
	me.left = findEnterX(f);
	me.top = findEnterY(f);
	
	me.stepSize = ruleEnemyStepSize();
	me.direction = 0;
	me.redEffect = false;
	me.greenEffect = false;
	me.blueEffect = false;
	me.effectTicks = ruleEffectDuration();
	me.effectCounter = 0;
	
	me.powerGreen = 0;
	var sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
	me.sphereMaterial = new THREE.MeshPhongMaterial(
		{
			color : c,
			specular : 0x666666,
			
			shininess : 599,
			needsUpdate : true
		});

	me.mesh = new THREE.Mesh(sphereGeometry, me.sphereMaterial);
	me.move = function (x, z) {
		me.mesh.position.x = x - 10 + 0.5;
		me.mesh.position.y = 1;
		me.mesh.position.z = z - 15 + 0.5;
		if (me.redEffect) {
			me.redMesh.position.x = me.mesh.position.x + Math.random() * 0.4 - 0.2;
			me.redMesh.position.y = 1 + Math.random() * 0.4 - 0.2;
			me.redMesh.position.z = me.mesh.position.z + Math.random() * 0.4 - 0.2;
		}
		if (me.greenEffect) {
			me.greenMesh.position.x = me.mesh.position.x;
			me.greenMesh.position.y = 1;
			me.greenMesh.position.z = me.mesh.position.z;
		}
		if (me.blueEffect) {
			me.blueMesh.position.x = me.mesh.position.x;
			me.blueMesh.position.y = 1;
			me.blueMesh.position.z = me.mesh.position.z;
		}
	};
	me.strike = function (r, g, b) {
		me.lifeRed = me.lifeRed - r;
		me.lifeGreen = me.lifeGreen - g;
		me.lifeBlue = me.lifeBlue - b;
		if (me.lifeRed < 0) {
			me.lifeRed = 0;
		}
		if (me.lifeGreen < 0) {
			me.lifeGreen = 0;
		}
		if (me.lifeBlue < 0) {
			me.lifeBlue = 0;
		}
		var ir = 0;
		var ig = 0;
		var ib = 0;
		if (me.maxRed > 0) {
			ir = me.lifeRed / me.maxRed;
		}
		if (me.maxGreen > 0) {
			ig = me.lifeGreen / me.maxGreen;
		}
		if (me.maxBlue > 0) {
			ib = me.lifeBlue / me.maxBlue;
		}

		if (ir > 0 || ig > 0 || ib > 0) {
			me.sphereMaterial.color.setRGB(0xcc / 0xff * ir, 0xcc / 0xff * ig, 0xcc / 0xff * ib);
			
			return true;
		} else {
			addEmptyBubble(me.mesh.position.x, me.mesh.position.z, "+" + ruleEnemyPrize(waveCounter));
			moneyCount = moneyCount + ruleEnemyPrize(waveCounter); 
			updateScore();
			removeEnemy(me);
			return false;
		}
	};
	me.tick = function () {
		
		var newLeft = me.left;
		var newTop = me.top;
		var cuStepSize = me.stepSize;
		if (me.greenEffect) {
			cuStepSize = 0.2 * me.stepSize;
		}
		if (me.blueEffect) {
			cuStepSize = 0;
		}
		if (me.direction == 2) {
			if (me.left + 0.5 - Math.floor(me.left + 0.5) < 0.5 && me.left + 0.5 - Math.floor(me.left + 0.5) > 0) {
				me.direction = me.fields[Math.floor(me.left + 0.5) + Math.floor(me.top + 0.5) * 20];

			}
		} else {
			if (me.direction == 3) {
				if (me.top + 0.5 - Math.floor(me.top + 0.5) < 0.5 && me.top + 0.5 - Math.floor(me.top + 0.5) > 0) {
					me.direction = me.fields[Math.floor(me.left + 0.5) + Math.floor(me.top + 0.5) * 20];
				}
			} else {
				if (me.direction == 4) { 
					if (me.left + 0.5 - Math.floor(me.left + 0.5) > 0.5) {
						me.direction = me.fields[Math.floor(me.left + 0.5) + Math.floor(me.top + 0.5) * 20];
					}
				} else { 
					if (me.top + 0.5 - Math.floor(me.top + 0.5) > 0.5) {
						
						me.direction = me.fields[Math.floor(me.left + 0.5) + Math.floor(me.top + 0.5) * 20];
					}
				}
			}
		}
		if (me.direction == undefined) {
			me.direction = 5;
		}
		if (me.direction == 2) {
			newLeft = newLeft - cuStepSize;
			
		} else {
			if (me.direction == 3) { 
				newTop = newTop - cuStepSize;
				
			} else {
				if (me.direction == 4) { 
					newLeft = newLeft + cuStepSize;
					
				} else {
					newTop = newTop + cuStepSize;
					
				}
			}
		}
		
		if (newTop > 29) {
			playSound(BUFFERS.fail, 0);
			fail();
			newLeft = findEnterX(me.fields);
			newTop = findEnterY(me.fields);

			startLoseFlashA();
		}

		if (cellEmpty(me, newLeft, newTop, me.direction)) {
			me.left = newLeft; 
			me.top = newTop; 
			me.move(me.left, me.top);
		}

		if (me.greenEffect) {
			me.effectCounter++;
			me.strike(me.powerGreen, me.powerGreen, me.powerGreen);
			if (me.effectCounter > me.effectTicks) {
				me.removeGreenEffect();
			}
		}

		if (me.blueEffect) {
			me.effectCounter++;
			me.strike(me.powerBlue, me.powerBlue, me.powerBlue);
			if (me.effectCounter > me.effectTicks) {
				me.removeBlueEffect();
			}
		}

		if (me.redEffect) {
			me.effectCounter++;
			me.strike(me.powerRed, me.powerRed, me.powerRed); 
			
			if (me.effectCounter > me.effectTicks) {
				me.removeRedEffect();
			}
		}

	};
	me.addGreenEffect = function (power) {
		me.powerGreen = power;
		me.effectCounter = 0;
		if (!(me.redEffect || me.greenEffect || me.blueEffect)) {
			me.greenEffect = true;
			var greenGeometry = new THREE.SphereGeometry(0.8, 20, 20);
			var greenMaterial = new THREE.MeshPhongMaterial({
					color : 0x006600,
					
					transparent : true,
					
					opacity : 0.3
				});
			me.greenMesh = new THREE.Mesh(greenGeometry, greenMaterial);
			me.greenMesh.position.y = 1;
			scene.add(me.greenMesh);
			
		}
	};
	me.removeGreenEffect = function () {
		if (me.greenEffect) {
			scene.remove(me.greenMesh);
			me.greenMesh = null;
			me.greenEffect = false;

		}
	};
	me.addRedEffect = function (power) {
		me.powerRed = power;
		me.effectCounter = 0;
		if (!(me.redEffect || me.greenEffect || me.blueEffect)) {
			me.redEffect = true;

			me.redMesh = sparkleSprite(8, 0x990000, sparkleTexture1());
			me.redMesh.position.y = 1;
			me.redMesh.position.x = 0;
			me.redMesh.position.z = 0;
			scene.add(me.redMesh);

		}
	};
	me.removeRedEffect = function () {
		if (me.redEffect) {
			scene.remove(me.redMesh);
			me.redMesh = null;
			me.redEffect = false;

		}
	};

	me.addBlueEffect = function (power) {
		me.powerBlue = power;
		me.effectCounter = 0;
		if (!(me.redEffect || me.greenEffect || me.blueEffect)) {
			me.blueEffect = true;
			var blueGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

			var blueMaterial = new THREE.MeshPhongMaterial({
					color : 0x3366ff,
					
					transparent : true,
					
					opacity : 0.6
				});
			me.blueMesh = new THREE.Mesh(blueGeometry, blueMaterial);
			me.blueMesh.position.y = 1;
			me.blueMesh.rotation.x = me.lifeRed;
			me.blueMesh.rotation.y = me.lifeGreen;
			me.blueMesh.rotation.z = me.lifeBlue;
			scene.add(me.blueMesh);
		}
	};
	me.removeBlueEffect = function () {
		if (me.blueEffect) {
			scene.remove(me.blueMesh);
			me.blueMesh = null;
			me.blueEffect = false;

		}
	};
	me.move(me.left, me.top);
	scene.add(me.mesh);
	return me;
}
function updateScore() {
	if (scoreBubble == null) {
		console.log("scoreBubble is null");
		return;
	}
	scoreBubble.t1 = "lives: " + scoreCount;
	scoreBubble.t2 = "money: " + moneyCount;
	scoreBubble.t3 = "";
	scoreBubble.t4 = "";
	scoreBubble.t5 = "";
	scoreBubble.retext();
}
function fail() {
	scoreCount--;
	//scoreBubble.text("жизней: " + scoreCount);
	updateScore();
	if (scoreCount < 1) {
		loose();
	}

}
function loose() {
	console.log("loose");
	//backgroundAudio.pause();
	stopBackgroundSong();
	playSound(BUFFERS.done, 0);
	looseMode = true;

	promptNewGame();
}
function promptNewGame() {
	showPrompt("You loose. New game?", function () {
		startNewGame();
	});
}
function startNewGame() {
	console.log("startNewGame");
	clearEnemies();
	clearTowers();
	resetScore();
	//backgroundAudio.play();
	startBackgroundSong();
	looseMode = false;
}
function clearEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		var e = enemies[i];
		e.removeRedEffect();
		e.removeGreenEffect();
		e.removeBlueEffect();
		scene.remove(e.mesh);
	}
	enemies = [];
}
function clearTowers() {
	/*for (var i = 0; i < towers.length; i++){
	var t = towers[i];
	t.sell();

	}*/
	while (towers.length > 0) {
		towers[0].sell();
	}
}
function resetScore() {
	waveCounter = -1;
	scoreCount = ruleLivesStart();
	moneyCount = ruleMoneyStart();
	updateScore();
	updateWaveLabel(0);
}
function findEnterY(arr) {
	/*for (var i = 0; i < arr.length; i++) {
	if (arr[i] == 1) {
	return Math.floor(i/20);
	}
	}
	return 0;*/
	return -1;
}
function findEnterX(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == 1) {
			return i - Math.floor(i / 20);
		}
	}
	return 0;
}
function cellEmpty(who, toX, toY, curDirection) {
	//curDirection
	//1 down start
	// 2 left
	// 3 up
	// 4 right
	// 5 down
	// 6 down end
	// 7 a
	//console.log(who.left + " x " + who.top + " -> " + toX + " x " + toY);
	for (var i = 0; i < enemies.length; i++) {
		var t = enemies[i];
		if (t == who) {
			//skip
		} else {
			if (curDirection == 1 || curDirection == 6 || curDirection == 5) {
				if (Math.abs(t.left - who.left) < 0.5 && t.top > who.top && t.top - who.top < 2.2) {
					return false;
				}
			}
			if (curDirection == 2) {
				if (Math.abs(t.top - who.top) < 0.5 && t.left < who.left && who.left - t.left < 2.2) {
					return false;
				}
			}
			if (curDirection == 3) {
				if (Math.abs(t.left - who.left) < 0.5 && t.top < who.top && who.top - t.top < 2.2) {
					return false;
				}
			}
			if (curDirection == 4) {
				if (Math.abs(t.top - who.top) < 0.5 && t.left > who.left && t.left - who.left < 2.2) {
					return false;
				}
			}

		}
	}
	/*
	var start = false;
	for (var i = 0; i < enemies.length; i++) {
	if (enemies[i] == who) {
	start = true;
	}
	if (enemies[i] != who) {
	if (start) {
	//console.log("	test " + enemies[i].left + " x " + enemies[i].top);
	if (Math.abs(enemies[i].left - toX) < 0.7 && Math.abs(enemies[i].top - toY) < 0.7) {
	return false;
	}
	}
	}
	}*/
	return true;
}
function SelectionTicker() {
	var me = this;
	me.timeFrom = 0;
	me.timeTo = 0;
	me.endShiftX = 0;
	me.endShiftY = 0;
	me.endShiftZ = 0;
	me.startShiftX = 0;
	me.startShiftY = 0;
	me.startShiftZ = 0;
	me.tick = function (curTime) {
		if (me.timeTo > 0) {
			if (curTime >= me.timeTo) {
				me.timeTo = 0;
				trackballControls.target.set(//
					me.endShiftX, //
					me.endShiftY, //
					me.endShiftZ //
				);
			} else {
				var r = 1 - (me.timeTo - curTime) / (me.timeTo - me.timeFrom);
				trackballControls.target.set(//
					me.startShiftX + (me.endShiftX - me.startShiftX) * r, //
					me.startShiftY + (me.endShiftY - me.startShiftY) * r, //
					me.startShiftZ + (me.endShiftZ - me.startShiftZ) * r //
				);
			}
		}
	};
	me.go = function (_timeTo, _endShiftX, _endShiftY, _endShiftZ //
	) {
		me.timeFrom = clock.getElapsedTime();
		me.timeTo = clock.getElapsedTime() + _timeTo;
		me.startShiftX = trackballControls.target.x;
		me.startShiftY = trackballControls.target.y;
		me.startShiftZ = trackballControls.target.z;
		me.endShiftX = _endShiftX;
		me.endShiftY = _endShiftY;
		me.endShiftZ = _endShiftZ;
	};
	return me;
}
function LaserBeam(materialLaser, vFrom, vTo) {
	var me = this;
	me.object3d = new THREE.Object3D();
	me.texture = new THREE.Texture(laserBodyCanvas());
	me.texture.needsUpdate = true;
	me.radius = 0.2;
	me.material = materialLaser;
	/*new THREE.MeshBasicMaterial({
	map : me.texture,
	blending : THREE.AdditiveBlending,
	color : baseColor,
	side : THREE.DoubleSide,
	depthWrite : false,
	transparent : true
	}
	);*/
	me.geometry1 = null;
	me.geometry1 = null;
	me.geometry1 = null;
	me.reset2 = function (vFrom, vTo) {};
	me.reset = function (vFrom, vTo) {
		for (var i = 0; i < me.object3d.children.length; i++) {
			me.object3d.children[0].geometry.dispose();
			me.object3d.remove(me.object3d.children[0]);
		}
		var nPlanes = 3;
		var distance = vFrom.distanceTo(vTo);
		var orientation = new THREE.Matrix4();
		var offsetRotation = new THREE.Matrix4();
		orientation.lookAt(vFrom, vTo, new THREE.Vector3(0, 3, 0));
		offsetRotation.makeRotationX(Math.PI * 0.5);
		orientation.multiply(offsetRotation);
		var position = vTo.clone().add(vFrom).divideScalar(2);
		me.object3d.position.x = position.x;
		me.object3d.position.y = position.y;
		me.object3d.position.z = position.z;
		for (var i = 0; i < nPlanes; i++) {
			var rotationY = new THREE.Matrix4();
			rotationY.makeRotationY(i / nPlanes * Math.PI);
			var geometry = new THREE.PlaneGeometry(me.radius, distance);
			geometry.applyMatrix(rotationY);
			geometry.matrixAutoUpdate = false;
			geometry.applyMatrix(orientation);
			var mesh = new THREE.Mesh(geometry, me.material);
			me.object3d.add(mesh);
		}
	};
	me.reset(vFrom, vTo);
	me.hide = function () {
		for (var i = 0; i < me.object3d.children.length; i++) {
			me.object3d.children[i].visible = false;
		}
	};
	me.unhide = function () {
		for (var i = 0; i < me.object3d.children.length; i++) {
			me.object3d.children[i].visible = true;
		}
	};
	return me;
}
/*
function directionMatrix4(vstart, vend){
var orientation = new THREE.Matrix4();
var offsetRotation = new THREE.Matrix4();
orientation.lookAt(vstart, vend, new THREE.Vector3(0, 3, 0));
offsetRotation.makeRotationX(Math.PI * 0.5);
orientation.multiply(offsetRotation);
return orientation;
}
 */
function LaserBeamRed(vFrom, vTo) {
	return new LaserBeam(materialRedLaser, vFrom, vTo);
}
function LaserBeamGreen(vFrom, vTo) {
	return new LaserBeam(materialGreenLaser, vFrom, vTo);
}
function LaserBeamBlue(vFrom, vTo) {
	return new LaserBeam(materialBlueLaser, vFrom, vTo);
}
function laserBodyCanvas() {
	if (gradientCanvas == null) {
		gradientCanvas = document.createElement('canvas');
		var context = gradientCanvas.getContext('2d');
		gradientCanvas.width = 64;
		gradientCanvas.height = 1;
		var gradient = context.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
		gradient.addColorStop(0, 'rgba(  255,255,255,0.0)');
		gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(0.5, 'rgba(255,255,255,0.9)');
		gradient.addColorStop(0.7, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(1.0, 'rgba( 255,255,255,0.0)');
		context.fillStyle = gradient;
		context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
	}
	return gradientCanvas;
}
/*
function createGradientCanvas() {
var gradientCanvas = document.createElement('canvas');
var context = gradientCanvas.getContext('2d');
gradientCanvas.width = 1;
gradientCanvas.height = 64;
var gradient = context.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
gradient.addColorStop(0, 'rgba(  255,255,255,0.0)');
gradient.addColorStop(0.5, 'rgba( 255,255,255,1.0)');
context.fillStyle = gradient;
context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

return gradientCanvas;
}*/
function init() {
	console.log("init");

	var pixelRatio = window.devicePixelRatio;
	tapSize = 40 * pixelRatio;
	if (isNaN(tapSize)) {
		tapSize = 51;
	}
	console.log("tapSize is " + tapSize);

	setupScene();
	setupRenderer();
	setupCamera();
	setupSky();
	setupGameField();
	setupShapes();
	setupSelection();
	setupInteraction();
	setupScore();

	setupAudio();
	window.addEventListener('resize', onWindowResize, false);
	window.onfocus = function () {
		console.log("onfocus");
		blured = false;
		blurDuration = blurDuration + clock.getElapsedTime() - blurStart;
		//try {
		//backgroundAudio.play();
		startBackgroundSong();
		//} catch (e) {
		//	console.log(e);
		//}
		animate();
	};
	window.onblur = function () {
		console.log("onblur");
		blured = true;
		stopBackgroundSong();
		/*try {
		backgroundAudio.pause();
		} catch (e) {
		console.log(e);
		}*/
		saveState();
	};
	window.onbeforeunload = function () {
		console.log("onbeforeunload");
		blured = true;
		stopBackgroundSong();
		/*try {
		backgroundAudio.pause();
		} catch (e) {
		console.log(e);
		}*/
		saveState();
	};
	setupMenu();
	clock.start();
	console.log("init done");
	loadState();
	updateWaveLabel(waveCounter);
	updateScore();
	//console.log(window);
	animate();

}

function setupMenu() {
	var sz = tapSize;
	var ww = window.innerWidth / 4;
	var hh = window.innerHeight;
	if (sz > ww) {
		sz = ww;
	}
	if (sz > hh) {
		sz = hh;
	}
	document.getElementById("imgStart").width = sz;
	document.getElementById("imgStart").height = sz;
	document.getElementById("imgTools").width = sz;
	document.getElementById("imgTools").height = sz;
	document.getElementById("imgZoom").width = sz;
	document.getElementById("imgZoom").height = sz;
	document.getElementById("imgHelp").width = sz;
	document.getElementById("imgHelp").height = sz;
}
function initBackgroundSong() {
	try {
		backgroundAudio = document.getElementById("audiopl");
		//backgroundAudio.volume = 0.3;
		if (mz != nope) {
			startBackgroundSong();
		} else {
			stopBackgroundSong();
		}
	} catch (e) {
		console.log(e);
	}
}
function stopBackgroundSong() {
	try {
		backgroundAudio.pause();
	} catch (e) {
		console.log(e);
	}
}
function startBackgroundSong() {
	if (mz != nope) {
		try {
			backgroundAudio.play();
		} catch (e) {
			console.log(e);
		}
	}
}
function setupAudio() {
	console.log("setupAudio start");
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		webAudioContext = new AudioContext();
		initBackgroundSong();
		loadBuffers();
		//playSound(BUFFERS.test,0);
	} catch (e) {
		console.log(e);
	}
	console.log("setupAudio done");
}
function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	console.log("loadBuffer " + url);
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function () {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(request.response, function (buffer) {
			if (!buffer) {
				console.error('error decoding file data: ' + url);
				return;
			}
			//console.log(buffer);
			loader.bufferList[index] = buffer;
			loader.loadCount++;
			if (loader.loadCount == loader.urlList.length) {
				//if (++loader.loadCount == loader.urlList.length){
				loader.onload(loader.bufferList);
			}
		},
			function (error) {
			console.error('decodeAudioData error', error);
		});
	}

	request.onerror = function () {
		console.error('BufferLoader: XHR error');
	}

	request.send();
};

BufferLoader.prototype.load = function () {
	for (var i = 0; i < this.urlList.length; ++i) {
		this.loadBuffer(this.urlList[i], i);
	}
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
	// Array-ify
	var names = [];
	var paths = [];
	for (var name in BUFFERS_TO_LOAD) {
		var path = BUFFERS_TO_LOAD[name];
		names.push(name);
		paths.push(path);
	}
	bufferLoader = new BufferLoader(webAudioContext, paths, function (bufferList) {
			for (var i = 0; i < bufferList.length; i++) {
				var buffer = bufferList[i];
				var name = names[i];
				BUFFERS[name] = buffer;
			}
		});
	bufferLoader.load();
}

function playSound(buffer) {
	if (sfx != nope) {
		try {
			var source = webAudioContext.createBufferSource();
			source.buffer = buffer;
			source.connect(webAudioContext.destination);
			if (!source.start) {
				source.start = source.noteOn;
			}
			source.start(0);
		} catch (e) {
			console.log(e);
		}
	}
}
function setupScore() {
	console.log("setupScore scoreBubble");
	scoreBubble = new FieldLabel(); //40, "#ff3333", 300, 5);

	scoreBubble.t1 = "lives: " + scoreCount;
	scoreBubble.t2 = "money: 150";
	scoreBubble.retext();
	scoreBubble.place(3, 26.1);
	console.log("setupScore waveBubble");
	waveBubble = new FieldLabel();
	waveBubble.t1 = "wave: 25";
	waveBubble.t2 = "red: 150";
	waveBubble.t3 = "green: 0";
	waveBubble.t4 = "blue: 150";
	waveBubble.t5 = "prize: 39x20";
	waveBubble.retext();
	waveBubble.place(9.3, 0.1);
	console.log("setupScore done");
}

function setupSelection() {
	console.log("setupSelection");
	var gradientCanvas = document.createElement('canvas');
	var context = gradientCanvas.getContext('2d');
	gradientCanvas.width = 1;
	gradientCanvas.height = 64;
	var gradient = context.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
	gradient.addColorStop(0, 'rgba(  255,255,255,0.0)');
	gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
	gradient.addColorStop(0.5, 'rgba(255,255,255,0.9)');
	gradient.addColorStop(0.7, 'rgba(255,255,255,0.5)');
	gradient.addColorStop(1.0, 'rgba( 255,255,255,0.0)');
	context.fillStyle = gradient;
	context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
	var texture = new THREE.Texture(gradientCanvas);
	texture.needsUpdate = true;
	var material = new THREE.MeshBasicMaterial({
			map : texture,
			blending : THREE.AdditiveBlending,
			color : 0xaaaa44,
			side : THREE.DoubleSide,
			depthWrite : false,
			transparent : true
		});
	selectionMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.0, 3.9, 50, 50, true), material);
	selectionMesh.position.y = 0.9;
	selectionMesh.visible = false;
	scene.add(selectionMesh);
}
function setupInteraction() {
	console.log("setupInteraction");
	projector = new THREE.Projector();
	var cubeMaterial = new THREE.MeshPhongMaterial({
			color : 0x000000,
		});
	for (var xx = 0; xx < 10; xx++) {
		for (var zz = 0; zz < 15; zz++) {
			var cube = new THREE.Mesh(new THREE.BoxGeometry(1.99, 0.7, 1.99, 1, 1, 1), cubeMaterial);
			cube.position.x = 1 - 10 + xx * 2;
			cube.position.y = -0.1;
			cube.position.z = 1 - 15 + zz * 2;
			scene.add(cube);
			targetList.push(cube);
		}
	}
	renderer.domElement.addEventListener('mousedown', mousedown, false);
	renderer.domElement.addEventListener('mousemove', mousemove, false);
	renderer.domElement.addEventListener('mouseup', mouseup, false);
	renderer.domElement.addEventListener('touchstart', touchstart, false);
	renderer.domElement.addEventListener('touchend', touchend, false);
	renderer.domElement.addEventListener('touchmove', touchmove, false);
}
function startLoseFlashA() {
	spriteAcounter = 0;
	spriteA.visible = true;
}

function setupShapes() {
	console.log("setupShapes");
	/*
	var t1 = new TowerGreen(2, 5);
	//t1.upgrade();
	new TowerGreen(3, 5);
	var t3 = new TowerBlue(3, 3);
	//t3.upgrade();
	//t3.upgrade();
	new TowerRed(7, 7);
	new TowerBlue(8, 8);
	new TowerGreen(3, 9);
	var t7 = new TowerRed(3, 10);
	t7.upgrade();
	t7.upgrade();
	t7.upgrade();
	new TowerRed(3, 11);
	 */
	/*
	scene.add(LaserBeamRed(new THREE.Vector3(-10 + 7 + 0.5, 2, -15 + 10 - 0.5), new THREE.Vector3(-10 + 7 + 0.5-2, 1, -15 + 10 - 0.5-1)).object3d);
	sparkle = new Sparkle(1, 0.1, 300);
	sparkle.move(-10 + 7 + 0.5-2, 1, -15 + 10 - 0.5-1);
	 */
	spriteA = sparkleSprite(12, 0xffffff, sparkleTexture1());
	spriteA.position.y = 1;
	spriteA.position.x = 4;
	spriteA.position.z = 14;
	scene.add(spriteA);

	spriteA.visible = false;

}

function setupSky() {
	console.log("setupSky");
	var urls = [
		'./images/skybox_left.jpg', //-x
		'./images/skybox_right.jpg', //+x
		'./images/skybox_down.jpg', //+y
		'./images/skybox_top.jpg', //-y
		'./images/skybox_forward.jpg', //-z
		'./images/skybox_back.jpg' //+z
	];
	var cubemap = THREE.ImageUtils.loadTextureCube(urls);
	cubemap.format = THREE.RGBFormat;
	var shader = THREE.ShaderLib['cube'];
	shader.uniforms['tCube'].value = cubemap;
	var SkyBoxMaterial = new THREE.ShaderMaterial({
			fragmentShader : shader.fragmentShader,
			vertexShader : shader.vertexShader,
			uniforms : shader.uniforms,
			depthWrite : false,
			side : THREE.BackSide
		});
	var skybox = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300), SkyBoxMaterial);
	scene.add(skybox);
}
function setupCamera() {
	console.log("setupCamera");
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 2;
	camera.position.y = 50;
	camera.position.z = 20;
	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;

	camera.lookAt(new THREE.Vector3(0, 0, 0));
	trackballControls = new THREE.OrbitControls(camera, renderer.domElement);
	trackballControls.rotateSpeed = 1.0;
	trackballControls.zoomSpeed = 1.0;
	trackballControls.panSpeed = 1.0;
	trackballControls.minDistance = 5;
	trackballControls.maxDistance = 100;

	trackballControls.minPolarAngle = 0; // radians
	trackballControls.maxPolarAngle = 0.5 * Math.PI; // radians

}
function setupScene() {
	console.log("setupScene");
	scene = new THREE.Scene();
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(5, 15, 10);
	scene.add(directionalLight);

	directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-5, 1, -5);
	scene.add(directionalLight);

	/*
	var light = new THREE.AmbientLight(0x404040); // soft white light
	scene.add(light);
	 */
	/*
	var p1 = new THREE.PointLight(0xffffff, 1, 100);
	p1.position.set(9, 2, 20);
	scene.add(p1);

	var p2 = new THREE.PointLight(0xffffff, 1, 100);
	p2.position.set(-9, 12, -20);
	scene.add(p2);
	 */
	/*
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(10, 5, 20);
	spotLight.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(spotLight);

	spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-10, 7, -5);
	spotLight.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(spotLight);
	 */
	//sparkle1 = new Sparkle(11, 0.5, 300);
	//sparkle2 = new Sparkle(3, 0.7, 200);
	//sparkle3 = new Sparkle(5, 0.9, 100);
}
function setupGround() {
	var groundGeometry = new THREE.BoxGeometry(30, 20, 1, 1, 1, 1);
	var groundMaterial = new THREE.MeshLambertMaterial({
			color : 0x666699
		});
	ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -0.5 * Math.PI;
	ground.rotation.z = -0.5 * Math.PI;
	scene.add(ground);
}
function setupMirror() {
	groundMirror = new THREE.Mirror(renderer, camera, {
			clipBias : 0.003,
			textureWidth : window.innerWidth,
			textureHeight : window.innerHeight,
			color : 0x444444
		});
	var groundPlane = new THREE.PlaneGeometry(30, 20);
	var mirrorMesh = new THREE.Mesh(groundPlane, groundMirror.material);
	mirrorMesh.add(groundMirror);
	mirrorMesh.rotation.x = -0.5 * Math.PI;
	mirrorMesh.rotation.z = -0.5 * Math.PI;
	mirrorMesh.position.y = 0.51;
	scene.add(mirrorMesh);
}
function setupLines() {
	var mline = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			transparent : true,
			opacity : 0.5,
			side : THREE.DoubleSide
		});
	var g1 = new THREE.PlaneGeometry(20.06, 1.06);
	for (var zz = 1; zz < 15; zz++) {
		var s = new THREE.Mesh(g1, mline);
		s.position.z = -15 + zz * 2;
		scene.add(s);
	}
	var g2 = new THREE.PlaneGeometry(30.06, 1.06);
	for (var xx = 1; xx < 10; xx++) {
		var s = new THREE.Mesh(g2, mline);
		s.position.x = -10 + xx * 2;
		s.rotation.y = -0.5 * Math.PI;
		scene.add(s);
	}
}
function setupPlates() {
	pathArrayA = getPathArrayA();
	pathArrayB = getPathArrayB();
	for (var i = 0; i < 20 * 30; i++) {
		if (pathArrayA[i] > 0) {
			var y = Math.floor(i / 20);
			var x = i - y * 20;
			addPlate(x, y);
		}
	}
	for (var i = 0; i < 20 * 30; i++) {
		if (pathArrayB[i] > 0) {
			if (pathArrayA[i] == 0) {
				var y = Math.floor(i / 20);
				var x = i - y * 20;
				addPlate(x, y);
			}
		}
	}
}
function setupGameField() {
	console.log("setupGameField");
	setupGround();
	setupMirror();
	setupLines();
	setupPlates();

	/*
	var tx = new THREE.Texture(createGradientCanvas());
	tx.needsUpdate = true;
	var m = new THREE.MeshBasicMaterial({
	map : tx,
	//blending : THREE.AdditiveBlending,
	color : 0x666699,
	//side : THREE.DoubleSide,
	depthWrite : false,
	transparent : true
	});


	var g = new THREE.PlaneGeometry(20, 2);
	var s = new THREE.Mesh(g, m);
	s.rotation.x = -0.5 * Math.PI;
	s.position.x =  0 ;
	s.position.y = 0.53;
	s.position.z =   14 ;
	scene.add(s);*/
}
function getPathArrayA() {
	var arr = [//
		//1 down start
		// 2 left
		// 3 up
		// 4 right
		// 5 down
		// 6 down end
		// 7 a
		0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 5, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 2, 2, 2, 2, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
	];
	return arr;
}
function getPathArrayB() {
	var arr = [//
		//1 down start
		// 2 left
		// 3 up
		// 4 right
		// 5 down
		// 6 down end
		// 7 a
		0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 5, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 5, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 0,
		0, 0, 5, 2, 2, 2, 0, 0, 0, 0, 0, 3, 2, 2, 2, 2, 2, 2, 2, 0,
		0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
	];
	return arr;
}
function addPlate(xx, zz) {
	var m = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			transparent : true,
			opacity : 0.5
		});
	var g = new THREE.PlaneGeometry(1, 1);
	var s = new THREE.Mesh(g, m);
	s.rotation.x = -0.5 * Math.PI;
	s.position.x = xx - 10 + 0.5;
	s.position.y = 0.54;
	s.position.z = zz - 15 + 0.5;
	scene.add(s);
}
function setupRenderer() {
	console.log("setupRenderer");
	renderer = new THREE.WebGLRenderer({
			antialias : true,
			alpha : true
		});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x0000ff, 1);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	document.body.appendChild(renderer.domElement);
}
function onWindowResize(event) {
	console.log("onWindowResize");
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
/*
function animate(){

requestAnimationFrame(animate);
if (!blured){

render();//clock.getElapsedTime() - blurDuration);
}
}*/
function animate() {
	//console.log("animate");
	//console.log(window);
	//console.log(window.requestAnimationFrame);
	if (!blured) {
		render(); //clock.getElapsedTime() - blurDuration);
		setTimeout(function () {
			//console.log(clock.getElapsedTime());
			//console.log(window);
			//console.log(window.requestAnimationFrame);
			requestAnimationFrame(animate);
		}, ruleFrameDelay());

	}
}
function render() //elapsed)
{

	var delta = clock.getDelta();
	selectionTicker.tick(clock.getElapsedTime());
	if (trackballControls != null) {
		trackballControls.update();
	}
	//var timer = elapsed * 0.2;
	/*if (!freezeMode) {
	sparkle1.move(Math.sin(timer * 2) * 30, Math.cos(timer * 4) * 22, Math.cos(timer * 3) * 35);
	sparkle2.move(Math.sin(timer * 7) * 25, Math.cos(timer * 8) * 40, Math.cos(-timer * 5) * 40);
	sparkle3.move(Math.sin(timer * 6) * 30, Math.cos(-timer * 3) * 27, Math.cos(-timer * 2) * 35);
	}*/
	/*if (tickLast == 0)
{
	tickLast = elapsed - tickDuration - 1;
	}
	while (elapsed > tickLast + tickDuration)
{
	if (!freezeMode)
{
	tickTowers(elapsed);
	tickEnemies(elapsed);
	tickDeads();
	tickBubles();
	}
	tickLast = tickLast + tickDuration;

	}*/
	/*
	if ((elapsed > tickLast + tickDuration) || (tickLast == 0)) {
	tickTowers(elapsed);
	tickEnemies(elapsed);
	tickLast = elapsed;
	}*/
	//
	if (!freezeMode)
		if (!looseMode) { {
				tickTowers();
				tickEnemies();
				tickDeads();
				tickBubles();
			}
		}
	if (groundMirror != null) {
		groundMirror.render();
	}
	renderer.render(scene, camera);
}
function tickTowers() {

	for (var i = 0; i < towers.length; i++) {
		towers[i].tick();

	}

}
function tickEnemies() {

	moveEnemies();
	if (spriteAcounter > -1) {
		spriteAcounter++;
		if (spriteAcounter > 10) {
			spriteA.visible = false;
		}
	}

}
function moveEnemies() {
	//console.log("moveEnemies");
	for (var i = 0; i < enemies.length; i++) {
		//console.log(i);
		enemies[i].tick();
	}
}

function waveStrong(cntr) {
	return 99 + 30 * Math.round(cntr / 4);
}
function fillWave() {
	console.log("fillWave " + waveCounter);
	waveCounter++;
	updateWaveLabel(waveCounter);
	var waveColor = ruleWaveColorIndex(waveCounter); //waveCounter % 4;
	var enemyFunction = null;
	if (waveColor == 0) {
		enemyFunction = EnemyRedGreen;
	} else {
		if (waveColor == 1) {
			enemyFunction = EnemyGreenBlue;
		} else {
			if (waveColor == 2) {
				enemyFunction = EnemyRedBlue;
			} else {
				enemyFunction = EnemyWhite;
			}
		}
	}

	//waveColor = 4;

	var str = ruleWavePower(waveCounter); //50 + 10 * Math.round(waveCounter / 4); ;
	var cnt = ruleWaveLength(waveCounter);
	console.log("enemy count " + cnt);
	//var swtch = waveCounter % 4;
	//cnt = 1;
	//waveColor = 0;
	//
	for (var i = 0; i < cnt; i++) {
		if (waveColor == 0 || waveColor == 2) {
			enemies.push(new enemyFunction(pathArrayA, str));
			enemies.push(new enemyFunction(pathArrayA, str));
		} else {
			if (waveColor == 1) {
				enemies.push(new enemyFunction(pathArrayB, str));
				enemies.push(new enemyFunction(pathArrayB, str));
			} else {
				enemies.push(new enemyFunction(pathArrayA, str));
				enemies.push(new enemyFunction(pathArrayB, str));
			}
		}

	}
	//enemies[0].addGreenEffect();
	//if (waveCounter == waveCounter * Math.round(waveCounter / 3)
	//enemies.push(new EnemyWhite(pathArrayA));
	/*
	enemies.push(new EnemyWhite(pathArrayA));
	enemies.push(new EnemyWhite(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));

	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedGreen(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyGreenBlue(pathArrayB));
	enemies.push(new EnemyRedGreen(pathArrayA));
	enemies.push(new EnemyRedBlue(pathArrayB));
	 */

	/*
	enemies[0].distance = 0;
	enemies[1].distance = 1;
	enemies[2].distance = 2;*/

}
function mousedown(mouseEvent) {
	mouseDownMode = true;
	startMouseX = mouseEvent.clientX;
	startMouseY = mouseEvent.clientY;
	endMouseX = mouseEvent.clientX;
	endMouseY = mouseEvent.clientY;
	checkTouch();
}
function mousemove(mouseEvent) {
	if (mouseDownMode) {
		endMouseX = mouseEvent.clientX;
		endMouseY = mouseEvent.clientY;
		checkDrag();
	}
}
function mouseup(mouseEvent) {
	endMouseX = mouseEvent.clientX;
	endMouseY = mouseEvent.clientY;
	mouseDownMode = false;
	checkRelease();
}
function touchstart(touchEvent) {
	touchEvent.preventDefault();
	mouseDownMode = true;
	var touches = touchEvent.touches;
	var first = touches[0];
	startMouseX = first.clientX;
	startMouseY = first.clientY;
	endMouseX = first.clientX;
	endMouseY = first.clientY;
	checkTouch();
}
function touchend(touchEvent) {
	touchEvent.preventDefault();
	var touches = touchEvent.changedTouches;
	var first = touches[0];
	endMouseX = first.clientX;
	endMouseY = first.clientY;
	mouseDownMode = false;
	checkRelease();
}
function touchmove(touchEvent) {
	touchEvent.preventDefault();
	if (mouseDownMode) {
		var touches = touchEvent.touches;
		var first = touches[0];
		endMouseX = first.clientX;
		endMouseY = first.clientY;
		checkDrag();
	}
}
function checkTouch() {
	//
}
function checkDrag() {
	//
}
function checkRelease() {
	if (Math.abs(endMouseX - startMouseX) < tapSize / 4 && Math.abs(endMouseY - startMouseY) < tapSize / 4) {
		doTap(startMouseX, startMouseY);
	}
}
function doTap(screenX, screenY) {
	var xx = (screenX / window.innerWidth) * 2 - 1;
	var yy =  - (screenY / window.innerHeight) * 2 + 1;
	var vector = new THREE.Vector3(xx, yy, 1);
	projector.unprojectVector(vector, camera);
	var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = ray.intersectObjects(targetList);
	if (intersects.length > 0) {
		selectCell(intersects[0].object.position.x, intersects[0].object.position.z);
	} else {
		closeHudSelection();
	}
}
function canBuild() {
	console.log("canBuild " + selectionX + " x " + selectionZ);
	for (var i = 0; i < towers.length; i++) {
		var t = towers[i];
		if (t.xx == Math.floor((selectionX + 9) * 0.5) && t.zz == Math.floor((selectionZ + 14) * 0.5)) {
			//console.log("found tower at " + t.xx + " x " + t.zz);
			showWarning("Клетка уже занята кристаллом");
			return false;
		}
	}
	var bx = selectionX + 9;
	var bz = selectionZ + 14;
	//console.log("canBuild " + bx + ":" + bz);
	if (pathArrayA[20 * (bz + 0) + bx + 0] > 0 //
		 || pathArrayA[20 * (bz + 0) + bx + 1] > 0 //
		 || pathArrayA[20 * (bz + 1) + bx + 0] > 0 //
		 || pathArrayA[20 * (bz + 1) + bx + 1] > 0 //
	) {
		console.log("found road A");
		showWarning("Нельзя ставить кристаллы на пути шаров");
		return false;
	}
	if (pathArrayB[20 * (bz + 0) + bx + 0] > 0 //
		 || pathArrayB[20 * (bz + 0) + bx + 1] > 0 //
		 || pathArrayB[20 * (bz + 1) + bx + 0] > 0 //
		 || pathArrayB[20 * (bz + 1) + bx + 1] > 0 //
	) {
		console.log("found road B");
		showWarning("Нельзя ставить кристаллы на пути шаров");
		return false;
	}
	//console.log("build ok");
	return true;
}
function selectCell(x, z) {
	console.log("select " + x + " x " + z);
	if (looseMode) {
		promptNewGame();
	} else {
		selectionX = x;
		selectionZ = z;
		selectionExists = true;
		//selectionTicker.go(0.5, x, 1, z);


		document.getElementById("hudSelect").style.visibility = 'visible';
		selectionMesh.position.x = x;
		selectionMesh.position.z = z;
		selectionMesh.visible = true;
		freezeMode = true;
	}
}
function unselect() {
	console.log("unselect");
	selectionExists = false;
	selectionMesh.visible = false;
}
function closeHudSelection() {
	unselect();
	document.getElementById("hudSelect").style.visibility = 'hidden';
	document.getElementById("hudWarning").style.visibility = 'hidden';
	document.getElementById("hudPrompt").style.visibility = 'hidden';
	document.getElementById("hudTowerMenu").style.visibility = 'hidden';
	document.getElementById("hudZoomMenu").style.visibility = 'hidden';
	freezeMode = false;
}
function hudStartWave() {
	console.log("hudStartWave");
	closeHudSelection();
	if (enemies.length > 0) {
		//already
	} else {
		//startMode = true;
		//showPrompt("test question",function(){fillWave();});
		fillWave();
	}
	//playSound(BUFFERS.test,0);
}
function hudBuidRed() {
	console.log("hudBuidRed");
	closeHudSelection()
	if (canBuild()) {
		if (moneyCount >= ruleBaseTowerPrice()) {
			moneyCount = moneyCount - ruleBaseTowerPrice();
			var bx = Math.floor((selectionX + 9) / 2);
			var bz = Math.floor((selectionZ + 14) / 2);
			var t = new TowerRed(bx, bz);
			addEmptyBubble(t.mesh.position.x, t.mesh.position.z, "-" + ruleBaseTowerPrice());
			updateScore();
		} else {
			//console.log("no money");
			showWarning("Недостаточно денег");
		}
	}
}
function hudBuidGreen() {
	console.log("hudBuidGreen");
	closeHudSelection();
	if (canBuild()) {
		if (moneyCount >= ruleBaseTowerPrice()) {
			moneyCount = moneyCount - ruleBaseTowerPrice();
			var bx = Math.floor((selectionX + 9) / 2);
			var bz = Math.floor((selectionZ + 14) / 2);
			var t = new TowerGreen(bx, bz);
			addEmptyBubble(t.mesh.position.x, t.mesh.position.z, "-" + ruleBaseTowerPrice());
			updateScore();
		} else {
			//console.log("no money");
			showWarning("Недостаточно денег");
		}
	}
}
function hudBuidBlue() {
	console.log("hudBuidBlue");
	closeHudSelection();
	if (canBuild()) {
		if (moneyCount >= ruleBaseTowerPrice()) {

			moneyCount = moneyCount - ruleBaseTowerPrice();
			var bx = Math.floor((selectionX + 9) / 2);
			var bz = Math.floor((selectionZ + 14) / 2);
			var t = new TowerBlue(bx, bz);
			addEmptyBubble(t.mesh.position.x, t.mesh.position.z, "-" + ruleBaseTowerPrice());
			updateScore();

		} else {
			//console.log("no money");
			showWarning("Недостаточно денег");
		}
	}
}
function hudUpgrade() {
	console.log("hudUpgrade " + Math.floor((selectionX + 9) * 0.5) + " x " + Math.floor((selectionZ + 14) * 0.5));
	closeHudSelection();
	//console.log(selectionX+" x "+selectionZ);
	for (var i = 0; i < towers.length; i++) {
		var t = towers[i];
		if (t.xx == Math.floor((selectionX + 9) * 0.5) && t.zz == Math.floor((selectionZ + 14) * 0.5)) {
			if (moneyCount >= ruleUpgradeTowerPrice(t.level) && t.level < 3) {
				addEmptyBubble(t.mesh.position.x, t.mesh.position.z, "-" + ruleUpgradeTowerPrice(t.level));
				moneyCount = moneyCount - ruleUpgradeTowerPrice(t.level);
				t.upgrade();
				updateScore();
			} else {
				showWarning("Not enough money");
			}
			return;
		}
		//console.log(t.xx + " x " + t.zz);
	}
	//console.log("nothing to upgrade");
	showWarning("Select diamond first");
}
function hudSell() {
	console.log("hudSell " + Math.floor((selectionX + 9) * 0.5) + " x " + Math.floor((selectionZ + 14) * 0.5));
	closeHudSelection();

	for (var i = 0; i < towers.length; i++) {
		var t = towers[i];
		if (t.xx == Math.floor((selectionX + 9) * 0.5) && t.zz == Math.floor((selectionZ + 14) * 0.5)) {

			showPrompt("Sell diamond", function () {
				addEmptyBubble(t.mesh.position.x, t.mesh.position.z, "+" + t.sellPrice);
				moneyCount = moneyCount + t.sellPrice;
				t.sell();
				updateScore();
			});
			return;
		}
	}
	showWarning("Select diamond first");
}
function fireCenter() {
	console.log("fireCenter");

	closeHudSelection();
	//freezeMode = !freezeMode;
	//console.log("now " + freezeMode);
	/*camera.position.x = 2;
	camera.position.y = 50;
	camera.position.z = 20;
	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;*/

	//selectionTicker.go(0.5, 2, 50, 20);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	trackballControls.reset();

}
function fireToSelection() {
	console.log("fireToSelection");
	//closeHudSelection();

	selectionTicker.go(0.5, selectionX, 1, selectionZ);

}
function fireZoom() {
	console.log("fireZoom");
	closeHudSelection();
	camera.position.x = 5;
	camera.position.y = 3;
	camera.position.z = 25;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//trackballControls.reset();
	//showWarning("zfjndiosfbndofbn");
}
function showWarning(txt) {
	closeHudSelection();
	freezeMode = true;
	document.getElementById('warningText').innerHTML = txt;
	document.getElementById("hudWarning").style.visibility = 'visible';
}
/*
function hideWarning(){
closeHudSelection();
}*/
function showPrompt(txt, action) {
	closeHudSelection();
	wathPrompt = action;
	freezeMode = true;
	document.getElementById('promptText').innerHTML = txt;
	document.getElementById("hudPrompt").style.visibility = 'visible';
}
/*
function hidePrompt(){
wathPrompt = null;
closeHudSelection();
}*/
function confirmPrompt() {
	if (wathPrompt != null) {
		wathPrompt();
	}
	closeHudSelection();
}
function showTowerMenu() {
	closeHudSelection();
	freezeMode = true;
	var upgr = "?";
	var sll = "?";

	for (var i = 0; i < towers.length; i++) {
		var t = towers[i];
		if (t.xx == Math.floor((selectionX + 9) * 0.5) && t.zz == Math.floor((selectionZ + 14) * 0.5)) {
			if (t.level < 3) {
				upgr = "" + ruleUpgradeTowerPrice(t.level);
			} else {
				upgr = "?";
			}
			break;
		}
	}
	for (var i = 0; i < towers.length; i++) {
		var t = towers[i];
		if (t.xx == Math.floor((selectionX + 9) * 0.5) && t.zz == Math.floor((selectionZ + 14) * 0.5)) {
			sll = "" + t.sellPrice;
			break;
		}
	}
	document.getElementById("redBaseCost").innerHTML = " (-" + ruleBaseTowerPrice() + ")";
	document.getElementById("greenBaseCost").innerHTML = " (-" + ruleBaseTowerPrice() + ")";
	document.getElementById("blueBaseCost").innerHTML = " (-" + ruleBaseTowerPrice() + ")";
	document.getElementById("upgradeCost").innerHTML = " (-" + upgr + ")";
	document.getElementById("sellPrice").innerHTML = " (+" + sll + ")";
	document.getElementById("hudTowerMenu").style.visibility = 'visible';
}
function showZoomMenu() {
	closeHudSelection();
	freezeMode = true;
	document.getElementById("hudZoomMenu").style.visibility = 'visible';

}
function saveTexToStorage(name, text) {
	try {
		window.localStorage.setItem(name, text);
	} catch (e) {
		console.log("saveTexToStorage: " + name + ": " + e);
	}
}
function readTexFromStorage(name) {
	var text = "?";
	try {
		text = window.localStorage.getItem(name);
	} catch (e) {
		console.log("readTexFromStorage: " + name + ": " + e);
	}
	return text;
}
function readNumFromStorage(name, minValue, defValue, maxValue) {
	var nn = defValue;
	var text = readTexFromStorage(name);
	try {
		text = window.localStorage.getItem(name);
		nn = parseFloat(text);
	} catch (e) {
		console.log("readNumFromStorage: " + name + ": " + e);
	}
	if (isNaN(nn)) {
		nn = defValue;
	}
	if (nn > maxValue) {
		nn = maxValue;
	}
	if (nn < minValue) {
		nn = minValue;
	}
	return nn;
}
function saveState() {
	console.log("saveState");
	try {
		var lastDate = "" + new Date();
		saveTexToStorage("lastDate", lastDate);
		var o = new Object();
		o.waveCounter = waveCounter;
		o.scoreCount = scoreCount;
		o.moneyCount = moneyCount;
		o.towers = [];
		for (var i = 0; i < towers.length; i++) {
			var t = new Object();
			t.level = towers[i].level;
			t.towerColor = towers[i].towerColor;
			t.xx = towers[i].xx;
			t.zz = towers[i].zz;
			/*t.f = me.inFire ? 1 : 0;
			t.lx=0;
			t.ly=0;
			t.lz=0;
			t.ex=0;
			t.ey=0;
			t.ez=0;*/
			o.towers.push(t);
		}
		o.enemies = [];
		for (var i = 0; i < enemies.length; i++) {
			var m = new Object();
			m.r = enemies[i].lifeRed;
			m.g = enemies[i].lifeGreen;
			m.b = enemies[i].lifeBlue;
			m.mr = enemies[i].maxRed;
			m.mg = enemies[i].maxGreen;
			m.mb = enemies[i].maxBlue;
			m.left = enemies[i].left;
			m.top = enemies[i].top;
			m.direction = enemies[i].direction;
			if (enemies[i].fields == pathArrayA) {
				m.a = 2;
			} else {
				m.a = 1;
			}
			o.enemies.push(m);
		}

		o.valid = 1;
		var json = JSON.stringify(o);
		console.log(json);
		saveTexToStorage("lastState", json);
	} catch (e) {
		console.log(e);
	}
}
function loadState() {
	console.log("loadState");
	try {
		mz = window.localStorage.getItem("mz");
		sfx = window.localStorage.getItem("sfx");
		if (mz != nope) {
			mz = ya;
		}
		if (sfx != nope) {
			sfx = ya;
		}

		var lastDate = readTexFromStorage("lastDate");
		console.log("lastDate " + lastDate);
		var json = readTexFromStorage("lastState");
		console.log(json);
		var o = JSON.parse(json);
		//console.log( o);
		if (o.valid == 1) {
			console.log("start state");
			for (var i = 0; i < o.towers.length; i++) {
				var towerData = o.towers[i];
				var newTower = null;
				if (towerData.towerColor == 0) {
					newTower = new TowerRed(towerData.xx, towerData.zz);
				} else {
					if (towerData.towerColor == 1) {
						newTower = new TowerGreen(towerData.xx, towerData.zz);
					} else {
						newTower = new TowerBlue(towerData.xx, towerData.zz);
					}
				}
				for (var k = 0; k < towerData.level; k++) {
					newTower.upgrade();
				}
				/*
				if(towerData.f){
				newTower.beam.unhide();
				newTower.sprite.visible = true;
				newTower.highlight.visible = true;
				newTower.beam.reset(newTower, enm);
				}*/
			}
			waveCounter = o.waveCounter;
			if (waveCounter > -1) {
				//pathArrayA = getPathArrayA();
				//pathArrayB = getPathArrayB();

				for (var i = 0; i < o.enemies.length; i++) {
					var enemyData = o.enemies[i];
					var a = pathArrayA;
					if (enemyData.a == 1) {
						a = pathArrayB;
					}
					var newEnemy = new Enemy(0x000000, a, enemyData.mr, enemyData.mg, enemyData.mb);
					//var waveColor = ruleWaveColorIndex(waveCounter); //waveCounter % 4;

					//console.log("a");
					//console.log(a);
					//var str = ruleWavePower(waveCounter);
					//var newEnemy = new EnemyWhite(a, str);
					newEnemy.lifeRed = enemyData.r;
					newEnemy.lifeGreen = enemyData.g;
					newEnemy.lifeBlue = enemyData.b;
					newEnemy.left = enemyData.left;
					newEnemy.top = enemyData.top;
					enemies.push(newEnemy);
					newEnemy.move(newEnemy.left, newEnemy.top);
					newEnemy.strike(0, 0, 0);
					//console.log("enemy "+enemyData.left+":"+enemyData.top+":"+enemyData.direction);
				}
			}
			//waveCounter = o.waveCounter;
			/*if (waveCounter > -1)
		{
			waveCounter = waveCounter - 1;
			}*/
			scoreCount = o.scoreCount;
			moneyCount = o.moneyCount;
			if (scoreCount < 1) {
				looseMode = true;
			}
		}
		if (mz == nope) {
			//backgroundAudio.pause();
			stopBackgroundSong();
		}
	} catch (e) {
		console.log(e);
	}
	console.log("loadState done");
}
