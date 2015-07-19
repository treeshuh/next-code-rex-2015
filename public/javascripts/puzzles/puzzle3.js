$(document).ready(function() {

    /* 3D Objects */
    var camera, scene, renderer, raycaster, mouse, cube;

    /* States of the cube */
    var faces = {
        "0": {
            "images": ["6R", "6B", "6V"],
            "state": 2,
            "solve": 0
        },
        "1": {
            "images": ["3Y", "3G", "3V"],
            "state": 1,
            "solve": 2
        },
        "2": {
            "images": ["1R", "1G", "1B"],
            "state": 2,
            "solve": 2
        },
        "3": {
            "images": ["4R", "4O", "4Y"],
            "state": 0,
            "solve": 1
        },
        "4": {
            "images": ["2R", "2Y", "2G"],
            "state": 2,
            "solve": 1
        },
        "5": {
            "images": ["5O", "5Y", "5G"],
            "state": 0,
            "solve": 2
        }
    };

    const rules = [
        ["In the solved state, each color <b><span class='red'>R</span><span class='orange'>O</span><span class='yellow'>Y</span><span class='green'>G</span><span class='blue'>B</span><span class='violet'>V</span></b> appears exactly once on the cube."],
        ["In addition, <b><span class='red'>RED</span></b> appears opposite <b><span class='violet'>VIOLET</span></b>."],
        ["The primary colors <b><span class='red'>RED</span></b>, <b><span class='yellow'>YELLOW</span></b>, <b><span class='blue'>BLUE</span></b> share a vertex."]
    ]

    var paused = false;
    var slow = false;
    var isDragging = false;

    showRules();
    initCube();
    addListeners();
    animate();

    function showRules() {
        for (i in rules) {
            $("#instruction-panel").append("<li>" + rules[i] + "</li>")
        }
        //$(".challenge-title").addClass("rainbow");
        $("#solution").addClass("rainbow-solution");
    }

    function initCube() {
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setSize(window.innerWidth * .5, window.innerHeight * .5);
        renderer.setClearColor(0xffffff, 0);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(110, 110, 250);
        camera.lookAt(scene.position);

        var materials = [
            getMaterial(getTexture('/images/cube/cube6V.png')),
            getMaterial(getTexture('/images/cube/cube3G.png')),
            getMaterial(getTexture('/images/cube/cube1B.png')),
            getMaterial(getTexture('/images/cube/cube4R.png')),
            getMaterial(getTexture('/images/cube/cube2G.png')),
            getMaterial(getTexture('/images/cube/cube5O.png'))
        ];
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(190, 190, 190, 5, 5, 5),
            new THREE.MeshFaceMaterial(materials));

        scene.add(camera);
        scene.add(cube);

        setTimeout(function(){
            $("#interactive").append(renderer.domElement).fadeIn(1000);
        }, 250);

        // Randomize faces
        iter = Math.floor(Math.random() * 15 + 25);
        var randomize = setInterval(
            function() {
                if (iter > 0) {
                    for (var f = 0; f < 6; f++) {
                        toggleFace(f);
                    }
                } else {
                    clearInterval(randomize);
                    slow = true;
                }
                iter--;
            }, 75)

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        function render() {
            renderer.render(scene, camera);
            requestAnimFrame(render);
        }

        render();
    }

    function addListeners() {

        var previousMousePosition = {
            x: 0,
            y: 0
        };

        $(renderer.domElement).on('mousedown', function(e) {
                isDragging = true;
            })
            .on('mousemove', function(e) {
                var deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                if (isDragging) {
                    var deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(new THREE.Euler(
                            toRadians(deltaMove.y * 1),
                            toRadians(deltaMove.x * 1),
                            0,
                            'XYZ'
                        ));
                    cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
                }
                previousMousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };
            })
            .on('click', function(e) {
                if (!isDragging) {
                    mouse = {};
                    mouse.x = (e.offsetX / renderer.domElement.width) * 2 - 1;
                    mouse.y = -(e.offsetY / renderer.domElement.height) * 2 + 1;
                    raycaster.setFromCamera(mouse, camera);
                    var intersects = raycaster.intersectObject(cube);
                    if (intersects.length) {
                        toggleFace(intersects[0].face.materialIndex);
                    }
                }
                isDragging = false;
            });

        $(document).on('mouseup', function(e) {
            isDragging = false;
        });

    }

    function animate() {
        requestAnimationFrame(animate);
        if (!paused) {
            if (slow) {
                cube.rotation.x += .005;
                cube.rotation.y += .005;
                cube.rotation.z += .005;
            } else {
                cube.rotation.x += .03;
                cube.rotation.y += .03;
                cube.rotation.z += .03;
            }
        }
        renderer.render(scene, camera);
    }

    function getTexture(url) {
        var texture = THREE.ImageUtils.loadTexture(url);
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }

    function getMaterial(texture) {
        var material = new THREE.MeshBasicMaterial({
            map: texture
        });
        return material;
    }

    function toggleFace(i) {
        currentState = faces[i].state;
        nextState = (currentState + 1) % (faces[i].images.length);
        faces[i].state = nextState;
        src = "/images/cube/cube" + faces[i].images[nextState] + ".png"
        cube.material.materials[i].map = getTexture(src);
        if (slow) {
            checkSolve();
        }
    }

    function checkSolve() {
        for (i in faces) {
            if (faces[i].state !== faces[i].solve) {
                return false;
            }
        }
        solve();
        return true;
    }

    function solve() {
        $(renderer.domElement).unbind("click");
        alertSuccess("Congrats, you've solved the cube!",
            "Now read the codes in rainbow order (it might help if you pause the animation).");
        return;
    }
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}
