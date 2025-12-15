const COLORS = ['blue', 'red', 'green', 'yellow'];

let scope = generateRandomColors();

function generateRandomColors() {
    const colors = []
    for (let i = 0; i < 8; i++) {
        colors[i] = [];
        for (let j = 0; j < 8; j++) {
            const randomColors = Math.floor(Math.random() * COLORS.length);
            colors[i].push(
                {
                    color: COLORS[randomColors],
                    selected: false,
                    positionX: j,
                    positionY: i
                })
        }
    }
    return colors;
}

const clickHandler = selectFirstElement();

drawStone();

function drawStone() {
    const squareHtml = document.querySelector('#square');
    for (let i = 0; i < scope.length; i++) {

        const upperSquare = createDOMElement('p');
        upperSquare.classList.add('square-item');
        for (let j = 0; j < scope.length; j++) {
            const innerBorder = createDOMElement('p')
            const innerColors = createDOMElement('p')
            innerBorder.classList.add('color-border');
            innerColors.classList.add('color-item');

            if (scope[i][j].color === undefined) {
                return
            }

            innerColors.style.backgroundColor = scope[i][j].color;
            if (scope[i][j].selected) {
                innerBorder.classList.add('selected-item', 'replace');
            }

            const boundHandler = clickHandler.bind(null, scope[i][j]);
            innerColors.addEventListener('click', boundHandler);

            innerBorder.append(innerColors);
            upperSquare.append(innerBorder);
            squareHtml.append(upperSquare);
        }
    }
}

function createDOMElement(tagNAME) {
    return document.createElement(tagNAME)
}

function selectFirstElement() {
    return (currentStone, event) => {

        const selectedStone = scope.flat().find((stone) => {
            return stone.selected
        });

        if (!selectedStone) {
            currentStone.selected = true;
            event.target.parentElement.classList.add("selected-item");
        } else {


            if (!isNeighbors(selectedStone, currentStone)) {
                selectedStone.selected = false;
                currentStone.selected = true;
                event.target.parentElement.classList.add("selected-item");
                updateView();
                return
            }

            const tmpColor = currentStone.color;
            currentStone.color = selectedStone.color
            selectedStone.color = tmpColor;

            const matchedStones = isColorMatches(currentStone, currentStone.positionY, currentStone.positionX);

            if (matchedStones.length >= 3) {


                matchedStones.forEach(stone => {
                    stone.color = 'black';
                });

                fillEmptyStones(matchedStones)

                currentStone.selected = true;
                selectedStone.selected = false;

                updateView();

            }
        }
    }
}

function isNeighbors(selectedStone, currentStone) {

    const xLineIsEqual = selectedStone.positionX === currentStone.positionX;
    const yLineIsEqual = selectedStone.positionY === currentStone.positionY;

    const directionForMoving = {
        up: selectedStone.positionY - 1 === currentStone.positionY && xLineIsEqual,
        down: selectedStone.positionY + 1 === currentStone.positionY && xLineIsEqual,
        left: selectedStone.positionX - 1 === currentStone.positionX && yLineIsEqual,
        right: selectedStone.positionX + 1 === currentStone.positionX && yLineIsEqual
    }

    return Object.values(directionForMoving).some((el) => el);
}

function isColorMatches(selectedStone, positionY, positionX, matchedStones = []) {
    // debugger;
    // const inner = () => {
    if (positionY < 0 || positionY >= scope.length || positionX < 0 || positionX >= scope[0].length) {
        return matchedStones;
    }

    const currentStone = scope[positionY][positionX];
    if (currentStone.color !== selectedStone.color || matchedStones.includes(currentStone)) {
        return matchedStones;
    }
    matchedStones.push(currentStone);

    // check up and down stones color matches
    isColorMatches(selectedStone, positionY - 1, positionX, matchedStones);
    isColorMatches(selectedStone, positionY + 1, positionX, matchedStones);

    // check left and right stones color matches
    isColorMatches(selectedStone, positionY, positionX - 1, matchedStones);
    isColorMatches(selectedStone, positionY, positionX + 1, matchedStones);

    return matchedStones;
    // }


}

function updateView() {
    document.querySelector('#square').innerHTML = "";
    drawStone()
}

function fillEmptyStones(removedStones) {

    removedStones.forEach(stone => {
        const {positionX, positionY} = stone;
        scope[positionY][positionX].color = 'black';
    });

    for (let x = 0; x < scope[0].length; x++) {
        let writePos = scope.length - 1;

        for (let y = scope.length - 1; y >= 0; y--) {
            if (scope[y][x].color !== 'black') {
                if (writePos !== y) {
                    scope[writePos][x] = scope[y][x];
                    scope[writePos][x].positionY = writePos;
                }
                writePos--;
            }
        }

        for (let y = writePos; y >= 0; y--) {
            const randomColorIndex = Math.floor(Math.random() * COLORS.length);
            scope[y][x] = {
                color: COLORS[randomColorIndex],
                selected: false,
                positionX: x,
                positionY: y
            };
        }
    }

    updateView();
}



