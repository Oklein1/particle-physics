////////////////////////////////////////
/////        GLOBAL VARS         ///////
////////////////////////////////////////
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;
const particleWorldStateObject = {}
const NUMPARTICLES = 1
const ANGLE = 10




////////////////////////////////////////
/////        STARTS HERE         ///////
////////////////////////////////////////

main()


////////////////////////////////////////
///////        MAIN FUNC         ///////
////////////////////////////////////////

function main() {
    generateParticleDivElement(NUMPARTICLES)
    generateInitalParticlesOnScreen(draw, particleWorldStateObject, NUMPARTICLES);

    // document.addEventListener("click", (e) => {
    //     let elementId = e.target.id;
    //     popCircle(elementId);
    // });

    updateParticlesOnScreen(draw, particleWorldStateObject, NUMPARTICLES, ANGLE)

}

function updateParticlesOnScreen(drawFunc, particleWorldStateObject, numberOfObjOnScreen, angle) {
    for (let i = 0; i < numberOfObjOnScreen; i++) {
        const particleName = `particle${i}`;
        let particleObj = particleWorldStateObject[particleName]
        const { x, y } = particleObj
        const cartesianCoords = [x, y]
        const [rotatedX, rotatedY] = rotateObject(cartesianCoords, angle)
        drawFunc(particleWorldStateObject, particleName, rotatedX, rotatedY, 100, 50, 100);

    }
}

////////////////////////////////////////
/////       GEOMETRY FUNCS         /////
////////////////////////////////////////

// function rotation(cartesianCoords, angle) {
//     let [theta, radius] = cartesianToPolarCoords(cartesianCoords)
//     return cartesianToPolarCoords([theta + angle, radius])

// }

// function cartesianToPolarCoords(cartesianCoords) {
//     let [x, y] = cartesianCoords

//     let theta = Math.atan2(y, x)
//     let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
//     return [theta, radius]
// }

// function polarToCartesianCoords(polarCoords) {
//     let [theta, radius] = polarCoords
//     let x = radius * Math.cos(theta)
//     let y = radius * Math.sin(theta)
//     return [x, y]
// }



function wedgeProduct2D(vec1, vec2) {
    let vec2Reversed = vectorReverse(vec2);
    return vectorReduceSubtract(vectorMulti(vec1, vec2Reversed))
}

function wedgeProductHigherDim(vec1, vec2) {
    let a = vec1;
    let b = vec2;
    let storage = [];
    a.push(vec1[0]);
    b.push(vec2[0]);

    for (let i = 0; i < vec1.length; i++) {
        storage.push(a[0] * b[1] - a[1] * b[0]);
    }

    storage.push(storage[0]);
    return storage.slice(1, storage.length);
}

function wedgeProduct(vec1, vec2) {
    // MAKE INTO TRY 
    let v1Length = vec1.length;
    let v2Length = vec2.length;

    if (v1Length < 2 || v2Length < 2) {
        return console.log("one vector is less than 2 dimensions");
    } else if (v1Length === 2 && v2Length === 2) {
        return wedgeProduct2D(vec1, vec2);
    } else if (v1Length > 2 && v2Length > 2) {
        return wedgeProductHigherDim(vec1, vec2);
    } else {
        console.log("error");
    }
}

function geometricProduct(vec1, vec2) {
    let dotP = dotProduct(vec1, vec2);
    let wedgeP = wedgeProduct(vec1, vec2);
    return vec1.length == 2 && vec2.length == 2 ? [dotP, wedgeP] : [dotP, ...wedgeP];
}


function rotateObject(vertices, angle) {
    // Define the rotation bivector using the angle
    const rotationBivector = [Math.cos(angle / 2), Math.sin(angle / 2)]
    let storage = []
    storage.push(geometricProduct(rotationBivector, vertices))
    return storage
}

function dotProduct(vec1, vec2) {
    return vectorReduceSum(vectorMulti(vec1, vec2));
}

function vectorReverse(vec) {
    return vec.slice().reverse()
}

function vectorAddition(vec1, vec2) {
    return vec1.map((ele, index) => { return ele + vec2[index] })
}

function vectorSubtraction(vec1, vec2) {
    return vec1.map((ele, index) => { return ele - vec2[index] })
}

function vectorMulti(vec1, vec2) {
    return vec1.map((ele, index) => { return ele * vec2[index] })
}

function vectorScalarMulti(s, vec) {
    return vec.map((ele) => { return s * ele })
}

function vectorScalarDiv(s, vec) {
    return vec.map((ele) => { return ele / s })
}

function vectorSquared(vec) {
    return vectorMulti(vec, vec);
}

function vectorReduceSum(vec) {
    return vec.reduce((acc, ele) => { return acc + ele });
}

function vectorReduceSubtract(vec) {
    return vec.reduce((acc, ele) => { return acc - ele });
}

function vectorLength(vec) {
    return Math.sqrt(vectorReduceSum(vectorSquared(vec)));
}

function distance(vec1, vec2) {
    return Math.sqrt(
        vectorReduceSum(vectorSquared(vectorSubtraction(vec1, vec2)))
    );
}


////////////////////////////////////////
///////        FUNCTIONS         ///////
////////////////////////////////////////


function generateParticleDivElement(numberOfParticles) {
    function addEmptyParticleToWorldStateObj(particleWorldStateObject, particleName) {
        particleWorldStateObject[particleName] = {};
    }

    for (let i = 0; i < numberOfParticles; i++) {
        const particleName = `particle${i}`;
        let newDiv = document.createElement('div');
        newDiv.id = particleName;
        newDiv.classList.add("particle");
        document.body.appendChild(newDiv);
        addEmptyParticleToWorldStateObj(particleWorldStateObject, particleName);
    }
}

function generateInitalParticlesOnScreen(drawFunc, particleWorldStateObject, numberOfObjOnScreen) {
    for (let i = 0; i < numberOfObjOnScreen; i++) {
        const particleName = `particle${i}`;
        x = screenHeight / 2
        y = screenWidth / 2
        drawFunc(particleWorldStateObject, particleName, x, y, 100, 50, 100);
    }
}


function draw(worldStateObj, particleName, x, y, w, h, borderRadius) {
    updateParticlePositionObject(worldStateObj, particleName, x, y, w, h, borderRadius);
    placeElementOnScreen(worldStateObj, particleName);
}

function placeElementOnScreen(worldStateObj, particleName) {
    const particleDiv = document.getElementById(particleName);
    const particleObj = worldStateObj[particleName];
    particleDiv.style.left = particleObj.x + "px";
    particleDiv.style.top = particleObj.y + "px";
}

function updateParticlePositionObject(worldStateObj, particleName, x, y, w, h, borderRadius) {
    const particleObj = worldStateObj[particleName];
    particleObj["x"] = x;
    particleObj["y"] = y;
    particleObj["w"] = w;
    particleObj["h"] = h;
    particleObj["radii"] = borderRadius;
}


// function popCircle(elementId) {
//     let particleElement = elementId.startsWith("particle");
//     if (particleElement) {
//         let particleDiv = document.getElementById(elementId);
//         delete particleWorldStateObject[elementId];
//         particleDiv.className = "particle is-popping";
//         particleDiv.addEventListener("animationend", function() {
//             // Remove the particle element from the DOM after the animation ends
//             particleDiv.remove();
//         });
//     }
// }
