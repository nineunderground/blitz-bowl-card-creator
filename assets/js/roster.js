writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(lines[i], x, y + (lineNum * lineHeight));
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineNum * lineHeight));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            context.fillText(words.join(' '), x, y + (lineNum * lineHeight));
            lineNum++;
        }

    }

}

function drawCardPlayerName(value, xStart, yStart, maxLinesForNormalFont) {

    let context = getContext();
    context.textAlign = "left";
    context.textBaseline = "middle";
    let maxCharactersForThreeLines = 4;
    let minFontSize = 38;
    let fontSize = 42;
    let lineHeight = 40;
    let fitWidth = 140; // Reduced fitWidth for accommodating 4 lines at smaller font size
    let textLines = splitWordWrap(context, value, fitWidth);

    if (value.length > maxCharactersForThreeLines) {
        maxLinesForNormalFont = 4; // Allow 4 lines if there are more than 300 characters
    }

    // Calculate the font size, etc...
    if (textLines.length > maxLinesForNormalFont) {
        let fontReductionStep = 2;
        while (textLines.length > maxLinesForNormalFont) {
            fontSize -= fontReductionStep;
            lineHeight = fontSize * 1.2;
            fitWidth = 140 / (fontSize / 36); // Adjust fit width proportionally to the font size
            textLines = splitWordWrap(context, value, fitWidth);
        }
        fontSize = Math.max(fontSize, minFontSize);
        lineHeight = fontSize * 1.2;
    }

    // Define border color and size
    const borderColor = 'navy';
    const borderSize = 2;

    // Draw the border effect
    textLines.forEach((line, index) => {
        context.font = `${fontSize}px brothers-regular`;
        context.fillStyle = borderColor;

        // Draw text at multiple offsets to create border effect
        for (let i = -borderSize; i <= borderSize; i++) {
            for (let j = -borderSize; j <= borderSize; j++) {
                if (i !== 0 || j !== 0) {  // Skip the center position
                    context.fillText(line, xStart + i, yStart + index * lineHeight + j);
                }
            }
        }
    });

    // It print the lines...
    textLines.forEach((line, index) => {
        let fillStyle = 'white';
        context.font = `${fontSize}px brothers-regular`;
        context.fillStyle = fillStyle;
        context.fillText(line, xStart, yStart + index * lineHeight);
    });

}

function drawReserves(value, xStart, yStart, fontSize) {

    reservesLine = 'EMERGENCY RESERVES: ' + value
    getContext().font = `${fontSize}px brothers-regular`;
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    // getContext().rotate(-6 * Math.PI / 180);
    writeScaled(reservesLine, { x: xStart +4, y: yStart+4 });
    getContext().fillStyle = 'white';
    writeScaled(reservesLine, { x: xStart, y: yStart });
    // getContext().rotate(6 * Math.PI / 180);

}

function drawAttributeName(value, xStart, yStart, fontSize) {

    getContext().font = `${fontSize}px brothers-regular`;
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    // getContext().rotate(-6 * Math.PI / 180);
    writeScaled(value, { x: xStart +4, y: yStart+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: xStart, y: yStart });
    // getContext().rotate(6 * Math.PI / 180);

}

function drawCardAbility(value, xStart, yStart, maxLinesForNormalFont) {
    
    let context = getContext();
    context.textAlign = "left";
    context.textBaseline = "middle";
    let maxCharactersForThreeLines = 20;
    let minFontSize = 25;
    let fontSize = 36;
    let lineHeight = 35;
    let fitWidth = 600; // Reduced fitWidth for accommodating 4 lines at smaller font size
    let textLines = splitWordWrap(context, value, fitWidth);

    if (value.length > maxCharactersForThreeLines) {
        maxLinesForNormalFont = 4; // Allow 4 lines if there are more than 300 characters
    }

    // Calculate the font size, etc...
    if (textLines.length > maxLinesForNormalFont) {
        let fontReductionStep = 2;
        while (textLines.length > maxLinesForNormalFont) {
            fontSize -= fontReductionStep;
            lineHeight = fontSize * 1.2;
            fitWidth = 600 / (fontSize / 36); // Adjust fit width proportionally to the font size
            textLines = splitWordWrap(context, value, fitWidth);
        }
        fontSize = Math.max(fontSize, minFontSize);
        lineHeight = fontSize * 1.2;
    }

    // It print the lines...
    textLines.forEach((line, index) => {
        let fillStyle = 'black';
        context.font = `${fontSize}px franklin-gothic-book`;
        context.fillStyle = fillStyle;
        context.fillText(line, xStart, yStart + index * lineHeight);
    });
}

function splitWordWrap(context, text, fitWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    
    for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const testWidth = context.measureText(testLine).width;
        
        if (testWidth <= fitWidth) {
            line = testLine;
        } else {
            lines.push(line);
            line = word;
        }
    }
    lines.push(line);
    return lines;
}

getScalingFactor = function (canvas, warcryCardOne) {
    return {
        x: canvas.width / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function () {
    return document.getElementById("canvas");
}

getContext = function () {
    return getCanvas().getContext("2d");
}

getBackgroundImage = function () {
    return document.getElementById('bg1');
}

drawBackground = function () {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
}

scalePixelPosition = function (pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = { x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y };
    return scaledPosition;
}

writeScaled = function (value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function (inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function (inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

// drawCardName = function (value) {
//     getContext().fillStyle = 'black';
//     getContext().textAlign = "left";
//     getContext().textBaseline = "middle";
//     getContext().rotate(-6 * Math.PI / 180);

//     // Set the initial font size
//     var fontSize = 70;

//     // Check if the value is 18 characters or more
//     if (value.length >= 18) {
//         // Calculate the maximum width based on the desired length
//         var maxWidth = 650;

//         // Calculate the width of the text with the current font size
//         getContext().font = 'italic ' + fontSize + 'px brothers-regular';
//         var textWidth = getContext().measureText(value).width;

//         // Reduce font size if the text width exceeds the maximum width
//         while (textWidth > maxWidth && fontSize > 1) {
//             fontSize--;
//             getContext().font = 'italic ' + fontSize + 'px brothers-regular';
//             textWidth = getContext().measureText(value).width;
//         }
//     }

//     // Set the font size and draw the text with black shadow
//     getContext().font = 'italic ' + fontSize + 'px brothers-regular';
//     writeScaled(value, { x: 48 + 4, y: 180 + 4 });
    
//     // Set the font size and draw the text in white
//     getContext().fillStyle = 'white';
//     writeScaled(value, { x: 48, y: 180 });

//     getContext().rotate(6 * Math.PI / 180);
// }

// SET - TEAM NAME
drawTeamName = function (value) {
    getContext().font = '90px brothers-regular';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 40 +4, y: 75+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: 40, y: 75 });
}

drawFooter = function (value) {
    getContext().font = '30px brothers-regular';
    getContext().fillStyle = 'white';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 90, y: 990 });
}

drawPositionName = function (value) {
    getContext().font = '50px brothers-regular';
    getContext().fillStyle = 'white';
    getContext().textAlign = "center";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: 480, y: 1010 });
}

drawDevelopment = function (primary, secondary) {

    getContext().font = 'bold 26px franklin-gothic-book';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    x = 265;
    writeScaled("Primary: ", { x: x, y: 890 });
    writeScaled("Secondary: ", { x: x, y: 930 });
    getContext().font = '30px franklin-gothic-book';
    writeScaled(primary, { x: x+95, y: 890 });
    writeScaled(secondary, { x: x+125, y: 930 });
    
    
}

function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
}

function getSelectedRunemark(radioDiv) {
    var checked = $(radioDiv).find('input:checked');
    if (checked.length > 0) {
        return getImage(getLabel(checked[0])).getAttribute("src");
    }
    return null;
}

function setSelectedRunemark(radioDiv, runemark, radioGroupName, bgColor) {
    // uncheck all
    {
        var checked = $(radioDiv).find('input:checked');
        for (var i = 0; i < checked.length; i++) {
            checked[i].checked = false;
        }
        var icons = $(radioDiv).find('img');
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.backgroundColor = bgColor;
        }
    }

    if (runemark != null) {
        var queryString = "img[src='" + runemark + "']";
        var img = $(radioDiv).find(queryString);
        if (img.length > 0) {
            var radioButton = $(img[0].parentNode.parentNode).find("input")[0];
            radioButton.checked = true;
            // img[0].style.backgroundColor = "tomato";
            img[0].style.backgroundColor = "#00bc8c";
        }
        else {
            var newDiv =
                addToImageRadioSelector(
                    runemark,
                    radioDiv,
                    radioGroupName,
                    bgColor);
            // $(newDiv).find("img")[0].style.backgroundColor = "tomato";
            $(newDiv).find("img")[0].style.backgroundColor = "#00bc8c";
            $(newDiv).find("input")[0].checked = true;
        }
    }
}

function drawImage(scaledPosition, scaledSize, image) {
    if (image != null) {
        if (image.complete) {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else {
            image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc) {
    if (imageSrc != null) {
        var image = new Image();
        image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}

function drawModel(imageUrl, imageProps) {
    if (imageUrl != null) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: 590 + imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);

            URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "BloodBowl_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}

function getModelImage() {
    var imageSelect = $("#imageSelect")[0];
    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
}

function setModelImage(image) {
    //console.log("setModelImage:" + image);
    $("#fighterImageUrl")[0].value = image;
}

function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}

function getModelImageProperties() {
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}

function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();

    data.teamName = document.getElementById("teamName").value;
    data.totalPlayers = document.getElementById("totalPlayers").value;
    data.totalPos = document.getElementById("totalPos").value;
    data.totalReserves = document.getElementById("totalReserves").value;

    data.position_row_1_name = document.getElementById("position_row_1_name").value;
    data.position_row_1_move = document.getElementById("position_row_1_move").value;
    data.position_row_1_block = document.getElementById("position_row_1_block").value;
    data.position_row_1_throw = document.getElementById("position_row_1_throw").value;
    data.position_row_1_armour = document.getElementById("position_row_1_armour").value;
    data.position_row_1_ability = document.getElementById("position_row_1_ability").value;

    data.position_row_2_name = document.getElementById("position_row_2_name").value;
    data.position_row_2_move = document.getElementById("position_row_2_move").value;
    data.position_row_2_block = document.getElementById("position_row_2_block").value;
    data.position_row_2_throw = document.getElementById("position_row_2_throw").value;
    data.position_row_2_armour = document.getElementById("position_row_2_armour").value;
    data.position_row_2_ability = document.getElementById("position_row_2_ability").value;

    data.position_row_3_name = document.getElementById("position_row_3_name").value;
    data.position_row_3_move = document.getElementById("position_row_3_move").value;
    data.position_row_3_block = document.getElementById("position_row_3_block").value;
    data.position_row_3_throw = document.getElementById("position_row_3_throw").value;
    data.position_row_3_armour = document.getElementById("position_row_3_armour").value;
    data.position_row_3_ability = document.getElementById("position_row_3_ability").value;

    data.position_row_4_name = document.getElementById("position_row_4_name").value;
    data.position_row_4_move = document.getElementById("position_row_4_move").value;
    data.position_row_4_block = document.getElementById("position_row_4_block").value;
    data.position_row_4_throw = document.getElementById("position_row_4_throw").value;
    data.position_row_4_armour = document.getElementById("position_row_4_armour").value;
    data.position_row_4_ability = document.getElementById("position_row_4_ability").value;

    data.position_row_5_name = document.getElementById("position_row_5_name").value;
    data.position_row_5_move = document.getElementById("position_row_5_move").value;
    data.position_row_5_block = document.getElementById("position_row_5_block").value;
    data.position_row_5_throw = document.getElementById("position_row_5_throw").value;
    data.position_row_5_armour = document.getElementById("position_row_5_armour").value;
    data.position_row_5_ability = document.getElementById("position_row_5_ability").value;

    return data;
}

function drawCardDetails(fighterData){
    
    //console.log('drawCardDetails...')
    var totalPositionSelected = document.getElementById("totalPos").value;
    // Depending on combobox, select the image filename
    var frameToPick = 'frame' + totalPositionSelected;
    getContext().drawImage(document.getElementById(frameToPick), 0, 0, getCanvas().width, getCanvas().height);

    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);
    }

    // HEADER
    drawTeamName(fighterData.teamName);
    drawNumber(fighterData.totalPlayers, 1326, 18, false);

    // Attribute names
    drawAttributeName('POSITION', 35, 175, 35);
    drawAttributeName('MOVE', 405, 175, 35);
    drawAttributeName('BLOCK', 555, 175, 35);
    drawAttributeName('THROW', 705, 175, 35);
    drawAttributeName('ARMOUR', 855, 175, 35);
    drawAttributeName('ABILITY', 1040, 175, 35);

    // PLAYER STATS
    const yPosStart = 230;
    const yPosIncrement = 170;
    
    for (let i = 1; i <= fighterData.totalPos; i++) {
        const yPos = yPosStart + (i - 1) * yPosIncrement;
        // Player Name
        drawCardPlayerName(fighterData[`position_row_${i}_name`], 30, yPos, 2);
        // MA (Move) -> +75
        drawNumber(fighterData[`position_row_${i}_move`], 350, yPos, false);
        // ST (Block)
        drawNumber(fighterData[`position_row_${i}_block`], 475, yPos, false);
        // PA (Throw)
        drawNumber(fighterData[`position_row_${i}_throw`], 590, yPos, true);
        // AV (Armour)
        drawNumber(fighterData[`position_row_${i}_armour`], 705, yPos, true);   
        // Ability
        drawCardAbility(fighterData[`position_row_${i}_ability`], 840, yPos, 4);
    }

    // FOOTER
    drawReserves(fighterData.totalReserves, 1350, 1270, 35);

}

render = function (fighterData) {
    // console.log("Render:");
    // console.log(fighterData);
    // First the textured background
    getContext().drawImage(document.getElementById('bg1'), 0, 0, getCanvas().width, getCanvas().height);

    if (fighterData.imageUrl) {
        var image = new Image();
        image.onload = function () {
        var position = scalePixelPosition({ x: 100 + fighterData.imageProperties.offsetX, y: fighterData.imageProperties.offsetY });
        var scale = fighterData.imageProperties.scalePercent / 100.0;
        var width = image.width * scale;
        var height = image.height * scale;
        getContext().drawImage(image, position.x, position.y, width, height);
        // TODO: Uncomment???
        //drawCardDetails(fighterData);
        };
    image.src = fighterData.imageUrl;
    }
    // next the frame elements

    drawCardDetails(fighterData);
}

function drawNumber(num,x, y, plus){

    if(num<1 || num>11 ) {
        num = '-';
        plus = false;
    }
    if(num>9){
        getContext().drawImage(document.getElementById('sf1'), x-15, y, 35, 70);
        x = x + 35-15;
        num = num -10;
    }
    elementId = 'sf'+num;

    if(num == 1) {
        width = 35;
        x = x+9;
    } else {
        width = 53;
    }

    getContext().drawImage(document.getElementById(elementId), x, y, width, 70);
    if (plus){
        getContext().drawImage(document.getElementById('sf+'), x+width, y, 39, 70);
    }
}

async function writeControls(fighterData) {

    // here we check for base64 loaded image and convert it back to imageUrl
    if (fighterData.base64Image != null) {

        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64Image);
        // then create URL object
        fighterData.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64Image = null;
    } else {
        fighterData.imageUrl = null;
    }

    setName(fighterData.name);
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);
    
    $("#teamName")[0].value = fighterData.teamName;
    $("#totalPlayers")[0].value = fighterData.totalPlayers;
    $("#totalPos")[0].value = fighterData.totalPos;
    $("#totalReserves")[0].value = fighterData.totalReserves;

    $("#position_row_1_name")[0].value = fighterData.position_row_1_name;
    $("#position_row_1_move")[0].value = fighterData.position_row_1_move;
    $("#position_row_1_block")[0].value = fighterData.position_row_1_block;
    $("#position_row_1_throw")[0].value = fighterData.position_row_1_throw;
    $("#position_row_1_armour")[0].value = fighterData.position_row_1_armour;
    $("#position_row_1_ability")[0].value = fighterData.position_row_1_ability;

    $("#position_row_2_name")[0].value = fighterData.position_row_2_name;
    $("#position_row_2_move")[0].value = fighterData.position_row_2_move;
    $("#position_row_2_block")[0].value = fighterData.position_row_2_block;
    $("#position_row_2_throw")[0].value = fighterData.position_row_2_throw;
    $("#position_row_2_armour")[0].value = fighterData.position_row_2_armour;
    $("#position_row_2_ability")[0].value = fighterData.position_row_2_ability;

    $("#position_row_3_name")[0].value = fighterData.position_row_3_name;
    $("#position_row_3_move")[0].value = fighterData.position_row_3_move;
    $("#position_row_3_block")[0].value = fighterData.position_row_3_block;
    $("#position_row_3_throw")[0].value = fighterData.position_row_3_throw;
    $("#position_row_3_armour")[0].value = fighterData.position_row_3_armour;
    $("#position_row_3_ability")[0].value = fighterData.position_row_3_ability;

    $("#position_row_4_name")[0].value = fighterData.position_row_4_name;
    $("#position_row_4_move")[0].value = fighterData.position_row_4_move;
    $("#position_row_4_block")[0].value = fighterData.position_row_4_block;
    $("#position_row_4_throw")[0].value = fighterData.position_row_4_throw;
    $("#position_row_4_armour")[0].value = fighterData.position_row_4_armour;
    $("#position_row_4_ability")[0].value = fighterData.position_row_4_ability;

    $("#position_row_5_name")[0].value = fighterData.position_row_5_name;
    $("#position_row_5_move")[0].value = fighterData.position_row_5_move;
    $("#position_row_5_block")[0].value = fighterData.position_row_5_block;
    $("#position_row_5_throw")[0].value = fighterData.position_row_5_throw;
    $("#position_row_5_armour")[0].value = fighterData.position_row_5_armour;
    $("#position_row_5_ability")[0].value = fighterData.position_row_5_ability;    

    // render the updated info
    render(fighterData);
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = "BloodBowl_Card";
    fighterData.teamName = "Amazon Team";

    fighterData.imageProperties = getDefaultModelImageProperties();
    fighterData.totalPlayers = "6";
    fighterData.totalPos = 4;
    fighterData.totalReserves = 5;

    fighterData.position_row_1_name = "EAGLE WARRIOR";
    fighterData.position_row_1_move = 6;
    fighterData.position_row_1_block = 1;
    fighterData.position_row_1_throw = 4;
    fighterData.position_row_1_armour = 4;
    fighterData.position_row_1_ability = ""
    
    fighterData.position_row_2_name = "PYTHON THROWER";
    fighterData.position_row_2_move = "6";
    fighterData.position_row_2_block = "1";
    fighterData.position_row_2_throw = "3";
    fighterData.position_row_2_armour = "4";
    fighterData.position_row_2_ability = "Handling Skills: Whenever this player is moved into a square containing the ball, they pick it up, as though they were making a Run action";

    fighterData.position_row_3_name = "PIRANHA BLITZER";
    fighterData.position_row_3_move = "7";
    fighterData.position_row_3_block = "1";
    fighterData.position_row_3_throw = "4";
    fighterData.position_row_3_armour = "4";
    fighterData.position_row_3_ability = "Offensive Specialist: Whenever this player makes a Block action, you can choose to re-roll the block dice";

    fighterData.position_row_4_name = "JAGUAR BLOCKER";
    fighterData.position_row_4_move = "6";
    fighterData.position_row_4_block = "2";
    fighterData.position_row_4_throw = "5";
    fighterData.position_row_4_armour = "3";
    fighterData.position_row_4_ability = "";

    fighterData.position_row_5_name = "";
    fighterData.position_row_5_move = "";
    fighterData.position_row_5_block = "";
    fighterData.position_row_5_throw = "";
    fighterData.position_row_5_armour = "";
    fighterData.position_row_5_ability = "";

    return fighterData;
}

function saveFighterDataMap(newMap) {
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap() {
    // TODO: Uncomment to use the cookie!!!
    var storage = window.localStorage.getItem("fighterDataMap");
    var storage = null;
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["BloodBowl_Card"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData() {
    var latestCardName = window.localStorage.getItem("latestCardName");
    if (latestCardName == null) {
        latestCardName = "BloodBowl_Card";
    }

    // console.log("Loading '" + latestCardName + "'...");

    var data = loadFighterData(latestCardName);

    if (data) {
        //console.log("Loaded data:");
        //console.log(data);
    }
    else {
        console.log("Failed to load data, loading defaults.");
        data = defaultFighterData();
    }

    return data;
}

function saveLatestFighterData() {
    var fighterData = readControls();
    if (!fighterData.name) {
        return;
    }

    window.localStorage.setItem("latestCardName", fighterData.name);
    //saveFighterData(fighterData);
}

function loadFighterData(fighterDataName) {
    if (!fighterDataName) {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName]) {
        return map[fighterDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj) {
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl) {
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl) {
    if (imageUrl &&
        imageUrl.startsWith("blob:")) {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

async function saveFighterData(fighterData) {
    var finishSaving = function () {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name) {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);

        finishSaving();
    }
}

function getLatestFighterDataName() {
    return "latestFighterData";
}

// ENTRYPOINT - load the card
window.onload = function () {
    //window.localStorage.clear();
    // console.log("START...");
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    refreshSaveSlots();
}

onAnyChange = function () {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor) {
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${imgSrc}">
        <img src="${imgSrc}" width="50" height="50" alt="" style="background-color:${bgColor};">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${imgSrc}" onchange="onTagRunemarkSelectionChanged(this, '${bgColor}')">
    `;
    grid.appendChild(div);
    return div;
}

function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var fighterData = defaultFighterData();
    writeControls(fighterData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();
    // temp null while I work out image saving
    //console.log(data);
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data, null, 4);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bloodbowl_card_" + data.teamName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "bloodbowl_card_" + data.teamName + ".png");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // ctx.stroke();
});

async function readJSONFile(file) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {
            // If successfully read, resolve the Promise with JSON parsed contents of the file
            resolve(JSON.parse(event.target.result))
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

async function fileChange(file) {
    // Function to be triggered when file input changes
    // As readJSONFile is a promise, it must resolve before the contents can be read
    // in this case logged to the console

    var saveJson = function (json) {
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

function getFighterImageUrl() {
    var imageSelect = $("#fighterImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
}