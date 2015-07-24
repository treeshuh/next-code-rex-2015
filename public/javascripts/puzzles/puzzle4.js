/* Infinite maze puzzle */

// Navigate the infinite corridors of the maze and retrieve those spinning totems.

// Avoid suspicious portkeys.

const walls = [{
        x: 1,
        z: 2,
        orientation: 'front'
    }, {
        x: 1,
        z: 2,
        orientation: 'right'
    }, {
        x: 1,
        z: 2,
        orientation: 'back'
    }, {
        x: 1,
        z: 7,
        orientation: 'back'
    }, {
        x: 1,
        z: 7,
        orientation: 'right'
    }, {
        x: 1,
        z: 9,
        orientation: 'front'
    }, {
        x: 1,
        z: 9,
        orientation: 'right'
    },

    {
        x: 2,
        z: 5,
        orientation: 'front'
    }, {
        x: 2,
        z: 5,
        orientation: 'back'
    }, {
        x: 2,
        z: 5,
        orientation: 'left'
    }, {
        x: 2,
        z: 7,
        orientation: 'front'
    }, {
        x: 2,
        z: 7,
        orientation: 'back'
    }, {
        x: 2,
        z: 7,
        orientation: 'left'
    }, {
        x: 2,
        z: 7,
        orientation: 'right'
    },

    {
        x: 3,
        z: 1,
        orientation: 'right'
    }, {
        x: 3,
        z: 1,
        orientation: 'left'
    }, {
        x: 3,
        z: 2,
        orientation: 'right'
    }, {
        x: 3,
        z: 2,
        orientation: 'left'
    }, {
        x: 3,
        z: 2,
        orientation: 'back'
    }, {
        x: 3,
        z: 5,
        orientation: 'back'
    }, {
        x: 3,
        z: 5,
        orientation: 'right'
    }, {
        x: 3,
        z: 5,
        orientation: 'front'
    }, {
        x: 3,
        z: 6,
        orientation: 'right'
    },

    {
        x: 4,
        z: 3,
        orientation: 'front'
    }, {
        x: 4,
        z: 3,
        orientation: 'back'
    }, {
        x: 4,
        z: 3,
        orientation: 'left'
    }, {
        x: 4,
        z: 3,
        orientation: 'right'
    }, {
        x: 4,
        z: 5,
        orientation: 'front'
    }, {
        x: 4,
        z: 7,
        orientation: 'front'
    }, {
        x: 4,
        z: 7,
        orientation: 'right'
    }, {
        x: 4,
        z: 9,
        orientation: 'right'
    },


    {
        x: 5,
        z: 4,
        orientation: 'right'
    }, {
        x: 5,
        z: 4,
        orientation: 'back'
    }, {
        x: 5,
        z: 7,
        orientation: 'back'
    }, {
        x: 5,
        z: 9,
        orientation: 'right'
    }, {
        x: 5,
        z: 9,
        orientation: 'front'
    },


    {
        x: 6,
        z: 3,
        orientation: 'front'
    }, {
        x: 6,
        z: 3,
        orientation: 'left'
    }, {
        x: 6,
        z: 7,
        orientation: 'back'
    },

    {
        x: 7,
        z: 2,
        orientation: 'front'
    }, {
        x: 7,
        z: 2,
        orientation: 'left'
    }, {
        x: 7,
        z: 8,
        orientation: 'back'
    }, {
        x: 7,
        z: 8,
        orientation: 'front'
    }, {
        x: 7,
        z: 8,
        orientation: 'left'
    }, {
        x: 7,
        z: 8,
        orientation: 'right'
    },

    {
        x: 8,
        z: 2,
        orientation: 'front'
    }, {
        x: 8,
        z: 2,
        orientation: 'right'
    }, {
        x: 8,
        z: 3,
        orientation: 'right'
    }, {
        x: 8,
        z: 4,
        orientation: 'right'
    }, {
        x: 8,
        z: 5,
        orientation: 'right'
    }, {
        x: 8,
        z: 6,
        orientation: 'right'
    }, {
        x: 8,
        z: 7,
        orientation: 'right'
    }, {
        x: 8,
        z: 8,
        orientation: 'right'
    }, {
        x: 8,
        z: 9,
        orientation: 'right'
    },

    {
        x: 9,
        z: 1,
        orientation: 'back'
    }, {
        x: 9,
        z: 7,
        orientation: 'back'
    },

    {
        x: 10,
        z: 1,
        orientation: 'back'
    }, {
        x: 10,
        z: 5,
        orientation: 'back'
    }, {
        x: 10,
        z: 5,
        orientation: 'front'
    }, {
        x: 10,
        z: 5,
        orientation: 'left'
    }, {
        x: 10,
        z: 7,
        orientation: 'back'
    },

    {
        x: 11,
        z: 1,
        orientation: 'back'
    }, {
        x: 11,
        z: 5,
        orientation: 'back'
    }, {
        x: 11,
        z: 5,
        orientation: 'front'
    }, {
        x: 11,
        z: 7,
        orientation: 'back'
    },

    {
        x: 12,
        z: 1,
        orientation: 'back'
    }, {
        x: 12,
        z: 5,
        orientation: 'back'
    }, {
        x: 12,
        z: 5,
        orientation: 'front'
    }, {
        x: 12,
        z: 7,
        orientation: 'back'
    },

    {
        x: 13,
        z: 1,
        orientation: 'back'
    }, {
        x: 13,
        z: 5,
        orientation: 'back'
    }, {
        x: 13,
        z: 5,
        orientation: 'front'
    }, {
        x: 13,
        z: 5,
        orientation: 'right'
    }, {
        x: 13,
        z: 7,
        orientation: 'back'
    },

    {
        x: 14,
        z: 2,
        orientation: 'back'
    }, {
        x: 14,
        z: 2,
        orientation: 'front'
    }, {
        x: 14,
        z: 2,
        orientation: 'left'
    }, {
        x: 14,
        z: 2,
        orientation: 'right'
    }, {
        x: 14,
        z: 4,
        orientation: 'front'
    }, {
        x: 14,
        z: 4,
        orientation: 'left'
    }, {
        x: 14,
        z: 8,
        orientation: 'back'
    }, {
        x: 14,
        z: 8,
        orientation: 'front'
    }, {
        x: 14,
        z: 8,
        orientation: 'left'
    }, {
        x: 14,
        z: 8,
        orientation: 'right'
    },

    {
        x: 15,
        z: 4,
        orientation: 'front'
    }

];

$(document).ready(function() {

    const positions = [{
        x: -727,
        z: 156
    }, {
        x: -666,
        z: 2
    }, {
        x: 30,
        z: 125
    }, {
        x: -234,
        z: -398
    }, {
        x: -734,
        z: -115
    }, {
        x: -620,
        z: -375
    }, {
        x: -283,
        z: 348
    }, {
        x: -20,
        z: 481
    }];

    var cubes = [];
    var collected = [];
    var mazeComplete = false;
    var solved = false;
    var camera,
        scene,
        renderer,
        geometry,
        material,
        mesh,
        sphere,
        pointLight,
        plane,
        plane2,
        plane3,
        plane4,
        center;

    var mouseX = 0,
        mouseY = 0,
        mouseZ = 0;
    var maze = {
        width: 15,
        large: 9,
        cellSize: 125
    };
    var angleY = 0;
    var angleX = 0;
    var windowHalfX = $(window).width() / 2;
    var windowHalfY = $(window).height() / 2;
    var incrementoX = Math.PI / (windowHalfX);
    var incrementoY = Math.PI / (windowHalfY);
    var posInitial = {
        x: 1,
        z: 8
    };
    var ray;
    window.wallGeometries = [];
    init();
    var slider = new Slider();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = (posInitial.x - maze.width / 2) * maze.cellSize;
        camera.position.z = (posInitial.z - maze.large / 2) * maze.cellSize - maze.cellSize / 2;

        center = new THREE.Vector3(camera.position.x + 125, 0, 0);

        geometry = new THREE.BoxGeometry(100, 100, 100);
        geometrySphere = new THREE.SphereGeometry(75, 16, 16);
        geometryCube = new THREE.BoxGeometry($(window).height() / 20, $(window).height() / 20, $(window).height() / 20);
        geometryPlane = new THREE.PlaneBufferGeometry(maze.width * maze.cellSize, maze.large * maze.cellSize);
        geometryPlaneBasic = new THREE.PlaneBufferGeometry(maze.cellSize, maze.cellSize, 1, 1);

        var texture = THREE.ImageUtils.loadTexture('/images/maze/floor.jpg', {}, function() {
            setTimeout(function() {
                renderer.render(scene, camera);
                animate();
            }, 125);
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(maze.width, maze.large);
        texture.needsUpdate = true;
        material = new THREE.MeshBasicMaterial({
            map: texture,
            doubleSided: true,
            side: THREE.DoubleSide
        });

        loaded = false;
        var wallTexture = THREE.ImageUtils.loadTexture('/images/maze/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.needsUpdate = true;

        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            map: wallTexture,
            color: 0x009900,
            wireframe: false
        }));
        mesh.position.z = -1500;

        for (var i = 0; i < positions.length; i++) {
            cubes[i] = new THREE.Mesh(geometryCube, new THREE.MeshBasicMaterial({
                map: new THREE.ImageUtils.loadTexture('/images/maze/totem' + i + '.png')
            }));
            cubes[i].position.x = positions[i].x;
            cubes[i].position.z = positions[i].z;
        }

        plane = new THREE.Mesh(geometryPlane, material);
        plane.side = THREE.DoubleSide;
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 60;
        plane.position.x = 0;
        plane.position.z = 0;

        plane2 = new THREE.Mesh(geometryPlane, material);
        plane2.rotation.x = -Math.PI / 2;
        plane2.position.y = -125;
        plane2.position.x = 0;
        plane2.position.z = 0;

        var wall;
        var wallMaterial = new THREE.MeshBasicMaterial({
            map: wallTexture,
            doubleSided: true,
            side: THREE.DoubleSide
        });

        for (var i = 0; i < maze.width; i++) {
            wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
            wall.position.z = maze.large / 2 * maze.cellSize;
            wall.position.y = 0;
            wall.position.x = (i - maze.width / 2) * maze.cellSize + maze.cellSize / 2;
            scene.add(wall);
            wallGeometries.push(wall);
            wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
            wall.position.z = -maze.large / 2 * maze.cellSize;
            wall.position.y = 0;
            wall.position.x = (i - maze.width / 2) * maze.cellSize + maze.cellSize / 2;
            scene.add(wall);
            wallGeometries.push(wall);
        }

        for (var i = 0; i < maze.large; i++) {
            wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
            wall.position.x = maze.width / 2 * maze.cellSize;
            wall.rotation.y = Math.PI / 2;
            wall.position.y = 0;
            wall.position.z = (i - maze.large / 2) * maze.cellSize + maze.cellSize / 2;
            scene.add(wall);
            wallGeometries.push(wall);
            wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
            wall.position.x = -maze.width / 2 * maze.cellSize;
            wall.rotation.y = Math.PI / 2;
            wall.position.y = 0;
            wall.position.z = (i - maze.large / 2) * maze.cellSize + maze.cellSize / 2;
            scene.add(wall);
            wallGeometries.push(wall);
        }

        var offsizeX = 0;
        var offsizeZ = 0;
        for (var i = 0; i < walls.length; i++) {
            wallData = walls[i];
            wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
            if (wallData.orientation == 'front') {
                offsizeX = -125;
                offsizeZ = -maze.cellSize;
            } else if (wallData.orientation == 'back') {
                offsizeX = -125;
                offsizeZ = 0;
            } else if (wallData.orientation == 'left') {
                offsizeX = -maze.cellSize;
                offsizeZ = -125;
            } else if (wallData.orientation == 'right') {
                offsizeX = 0;
                offsizeZ = -125;
            }
            wall.position.x = (wallData.x - maze.width / 2) * maze.cellSize + offsizeX;
            wall.rotation.y = wallData.orientation == 'left' || wallData.orientation == 'right' ? Math.PI / 2 : 0;
            wall.position.y = 0;
            wall.position.z = (wallData.z - maze.large / 2) * maze.cellSize + offsizeZ;
            scene.add(wall);
            wallGeometries.push(wall);
        }

        for (i in cubes) {
            scene.add(cubes[i]);
        }
        scene.add(plane);
        scene.add(plane2);
        pointLight = new THREE.DirectionalLight(0xffffff);
        pointLight.position.set(0, 0, 1).normalize();
        scene.add(pointLight);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth * 0.55, window.innerHeight * 0.6);
        window.camera = camera;
        setTimeout(function() {
            $("#interactive").append(renderer.domElement).fadeIn(750);
        }, 500);
        $(document).on("mousemove", onDocumentMouseMove)
        $(document).on("keydown", onDocumentKeyDown);
    };

    /* $(document).on("click", function(){
        console.log(camera.position.x, camera.position.z);
    }) */

    function onDocumentMouseMove(e) {
        difference = mouseX - e.clientX;
        angleX -= incrementoX * difference;
        mouseX = e.clientX;
        if (mouseX <= windowHalfX - 100 && difference > 0) {
            angleX -= incrementoX * 5;
        }
        if (mouseX >= windowHalfX + 100 && difference < 0) {
            angleX += incrementoX * 5;
        }
        e.preventDefault();
    };

    function onDocumentKeyDown(e) {
        var keyCode = e.which || e.keyCode;
        if (keyCode == 38) { // up
            e.preventDefault();
            camera.translateZ(-20);
        }
        if (keyCode == 40) { // down
            e.preventDefault();
            camera.translateZ(20);
        }
        ray = new THREE.Raycaster(camera.position, center.clone().normalize());
        ray.far = 50;

        if (ray.intersectObjects(wallGeometries).length > 0) {
            if (keyCode == 38) { // up
                camera.translateZ(20);
            }
            if (keyCode == 39) { // right
                camera.translateX(-20);
            }
            if (keyCode == 40) { // down
                camera.translateZ(-20);
            }
            if (keyCode == 37) { // left
                camera.translateX(20);
            }
        } else {
            angleY += incrementoY;
            center.y = 400 * Math.sin(angleY * 80);
        }
        for (var c in cubes) {
            try {
                if (ray.intersectObject(cubes[c]).length > 0) {
                    scene.remove(cubes[c]);
                    if (collected.indexOf(c) < 0) {
                        collected.push(c);
                        slider.drawTile(c);
                    }
                }
            } catch (e) {}
        }
        if (collected.length === cubes.length) {
            slider.drawTiles();
            if (!mazeComplete) {
                alertSuccess("You've discovered all the totems.", "");
                mazeComplete = true;
                $(document).unbind("mousemove");
                $(document).unbind("keydown");
            }
        }
    };

    function animate() {
        if (mouseX <= 100) {
            angleX -= incrementoX * 10;
        }
        if (mouseX >= windowHalfX * 2 - 100) {
            angleX += incrementoX * 10;
        }
        center.x = windowHalfX * 32 * Math.cos(angleX);
        center.z = windowHalfX * 32 * Math.sin(angleX);
        requestAnimationFrame(animate);
        for (var i in cubes) {
            try {
                cubes[i].rotation.x += 20/((cubes[i].position.x-camera.position.x)^2 + (cubes[i].position.z-camera.position.z)^2)
                cubes[i].rotation.z += 15/((cubes[i].position.x-camera.position.x)^2 + (cubes[i].position.z-camera.position.z)^2)
            } catch (e) {}
        }
        camera.lookAt(center);
        renderer.render(scene, camera);
    };

    function Slider() {

        const height = Math.min(300, $(window).height() / 2.7);
        $("#left-pane").append("<br><canvas id='slider' height=\"" + height + "px\" width=\"" + height + "px\"></canvas>");
        var context = document.getElementById("slider").getContext('2d');
        var scale;
        const boardSize = $("#slider").width();
        var img = new Image();
        img.src = '/images/maze/totem.png';
        img.onload = function() {
            scale = boardSize / img.height;
        }
        const tileCount = 3;
        const tileSize = boardSize / tileCount;

        var clickLoc = new Object;
        clickLoc.x = 0;
        clickLoc.y = 0;

        var emptyLoc = new Object;
        emptyLoc.x = 0;
        emptyLoc.y = 0;

        var boardParts;

        $("#slider").on("click", function(e) {
            if (mazeComplete) {
                clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
                clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
                if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
                    try {
                        slideTile(emptyLoc, clickLoc);
                        drawTiles();
                    } catch (e) {
                        setBoard();
                        drawTiles();
                        slideTile(emptyLoc, clickLoc)
                    }
                }
                if (solved) {
                    solve();
                }
            }
        });

        setBoard = function() {
            boardParts = new Array(tileCount);
            for (var i = 0; i < tileCount; ++i) {
                boardParts[i] = new Array(tileCount);
                for (var j = 0; j < tileCount; ++j) {
                    boardParts[i][j] = new Object;
                    boardParts[i][j].x = (tileCount - 1) - i;
                    boardParts[i][j].y = (tileCount - 1) - j;
                }
            }
            emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
            emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
            solved = false;
            console.log("Board is set.")
            $("#slider").click();
        };


        drawTiles = function() {
                try {
                    if (mazeComplete) {
                        context.clearRect(0, 0, boardSize, boardSize);
                        for (var i = 0; i < tileCount; ++i) {
                            for (var j = 0; j < tileCount; ++j) {
                                var x = boardParts[i][j].x;
                                var y = boardParts[i][j].y;
                                if (i != emptyLoc.x || j != emptyLoc.y || solved == true) {
                                    context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
                                        i * tileSize / scale, j * tileSize / scale, tileSize, tileSize);
                                }
                            }
                        }
                    }
                } catch (e) {
                    setBoard();
                    drawTiles();
                }
            },

            this.drawTiles = drawTiles;

        this.drawTile = function(n) {
            var x = Math.floor(n / tileCount);
            var y = (n % tileCount);
            var i = (tileCount - 1) - x;
            var j = (tileCount - 1) - y;
            context.drawImage(img, x * tileSize / scale, y * tileSize / scale, tileSize / scale, tileSize / scale,
                i * tileSize, j * tileSize, tileSize, tileSize);
        }

        slideTile = function(toLoc, fromLoc) {
            if (!solved) {
                boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
                boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
                boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
                boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
                toLoc.x = fromLoc.x;
                toLoc.y = fromLoc.y;
                checkSolved();
            }
        }

        function distance(x1, y1, x2, y2) {
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }


        checkSolved = function() {
            var flag = true;
            for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {
                    if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                        flag = false;
                    }
                }
            }
            solved = flag;
        }

        solve = function() {
            context.clearRect(0, 0, boardSize, boardSize);
            context.drawImage(img, 0, 0);
        }

    }

    window.onbeforeunload = function() {
        if (collected.length > 0 && !solved) {
            return "Are you sure you want to leave the dream? All your progress will be lost!";
        }
    };


});
