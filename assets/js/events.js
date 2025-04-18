writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function drawTextLetterByLetter(value, xStart, yStart, fontSize, rotateSize, spacingRatio) {
    const ctx = getContext();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.rotate((-1 * rotateSize * Math.PI) / 180);
    
    const extraSpacing = fontSize * spacingRatio; // Adjust spacing for the larger first letter
    // ─ ─────────────────────
    
    if (value.length > 0) {
        ctx.fillStyle = 'black';
        ctx.font = `${fontSize * 2}px brothers-regular`;
        writeScaled(value[0], { x: xStart + 5, y: yStart + 5 });
        ctx.fillStyle = 'white';
        writeScaled(value[0], { x: xStart, y: yStart });
    }
    
    if (value.length > 1) {
        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px brothers-regular`;
        writeScaled(value.substring(1), { x: xStart + 5 + extraSpacing, y: yStart + 5 });
        ctx.fillStyle = 'white';
        writeScaled(value.substring(1), { x: xStart + extraSpacing, y: yStart });
    }
    
    ctx.rotate(rotateSize * Math.PI / 180);
}

function drawText(value, xStart, yStart, fontSize, rotateSize) {

    getContext().font = `${fontSize}px brothers-regular`;
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "middle";
    getContext().rotate((-1 * rotateSize * Math.PI) / 180);
    writeScaled(value, { x: xStart +5, y: yStart+5 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: xStart, y: yStart });
    getContext().rotate(rotateSize * Math.PI / 180);

}


function drawCardEvent(valueToRender, xCoordinateStart, yCoordinateStart) {

    let context = getContext();
    const maxLines = 7;
    let fontSize = 0;
    let maxCharsPerLine = 45;
    if ( valueToRender.length > 188) {    
        // maxlength 188
        fontSize = 12;
        maxCharsPerLine = 45;
    } else {
        // maxlength 262
        fontSize = 14;
        maxCharsPerLine = 36;
    }

    context.font = `${fontSize}px franklin-gothic-book`;
    context.fillStyle = "black";    
    const lineHeight = fontSize * 1.2; // Adjust ratio for better spacing
    
    let words = valueToRender.split(" ");
    let lines = [];
    let currentLine = "";
    
    for (let word of words) {
        if ((currentLine + word).length > maxCharsPerLine) {
            if (lines.length >= maxLines) break;
            lines.push(currentLine.trim());
            currentLine = "";
        }
        currentLine += word + " ";
    }
    if (currentLine.trim().length > 0 && lines.length < maxLines) {
        lines.push(currentLine.trim());
    }
    
    lines.forEach((line, index) => {
        context.fillText(line, xCoordinateStart, yCoordinateStart + index * lineHeight);
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

// SET - TEAM NAME
drawCardName = function (value) {
    getContext().font = '160px brothers-regular';
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
    data.cardName = document.getElementById("cardName").value;
    data.eventText = document.getElementById("eventText").value;
    data.cardType = document.getElementById("cardType").value;

    return data;
}

function drawCardDetails(fighterData){
    
    console.log('drawCardDetails...')
    // Depending on combobox, select the image filename
    getContext().drawImage(document.getElementById('frame'), 0, 0, getCanvas().width, getCanvas().height);
    // If checkbox is enabled
    getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);

    totalHyphens = fighterData.cardName.length - 3;
    hyphenValue = "";
    for (let i = 0; i < totalHyphens; i++) {
        hyphenValue += "─";
    }

    drawTextLetterByLetter(fighterData.cardName, 60, 120, 120, 3, 1.5);
    drawText(hyphenValue, 210, 180, 120, 4);
    drawCardEvent(fighterData.eventText, 8, 300);
    drawText(fighterData.cardType, 900, 1240, 80, 3);

}

render = function (fighterData) {
    // console.log("Render:");
    // console.log(fighterData);
    // First the textured background
    
    getContext().drawImage(document.getElementById('bg1'), 0, 0, getCanvas().width, getCanvas().height);
    if (fighterData.imageUrl) {
        var image = new Image();
        image.onload = function () {
            getContext().reset();
            var position = scalePixelPosition({ x: 100 + fighterData.imageProperties.offsetX, y: fighterData.imageProperties.offsetY });
            var scale = fighterData.imageProperties.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);
            drawCardDetails(fighterData);
        };
        image.src = fighterData.imageUrl;
    }
    drawCardDetails(fighterData);
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

    $("#cardName")[0].value = fighterData.cardName;
    $("#eventText")[0].value = fighterData.eventText;
    $("#cardType")[0].value = fighterData.cardType;

    // render the updated info
    render(fighterData);
}

function defaultData() {
    var fighterData = new Object;
    fighterData.name = "BloodBowl_Card_event";
    fighterData.imageProperties = getDefaultModelImageProperties();

    fighterData.cardName = "BANANA SKINS";
    fighterData.eventText = "Each Coach chooses one Standing (but not Marked) Opposition Player, if any. The chosen Player becomes Prone (do not roll an Armor Check). If they were holding a ball, it will Bounce";
    fighterData.cardType = "RANDOM EVENT";

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
    map["BloodBowl_Card"] = defaultData();
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
        data = defaultData();
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
    console.log("START...");
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
    var fighterData = defaultData();
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
    downloadAnchorNode.setAttribute("download", "bloodbowl_card_" + data.cardName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "bloodbowl_card_" + data.cardName + ".png");
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