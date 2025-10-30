import {COLORS} from "./constants.js";

const scope = generateRandomColors();

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

console.log('scope', scope);

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
    // let selected = false;

    return (currentStone, event) => {

        const selected = scope.flat().find((stone) => {
            return stone.selected
        });

        if (!selected) {
            currentStone.selected = true;
            event.target.parentElement.classList.add("selected-item");
        } else {
            const tmpColor = currentStone.color;
            currentStone.color = selected.color
            selected.color = tmpColor;

            currentStone.selected = true;
            selected.selected = false;

            document.querySelector('#square').innerHTML = "";
            drawStone()
        }
        console.log("stone", scope)
    }
}

// function replacePlacesOfStone() {
//
// }
//
// const secondStonePlace = replacePlacesOfStone(2)
// secondStonePlace(4);