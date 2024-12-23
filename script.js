"use strict";
const bulb = `💡`;
const bulb_div = document.getElementById('lightbulb');
let pid = null;
let vals = [.2, .3, .7, .8, .5];
let enc = vals.map(mapValueToPixel);
let lastMeasurementTime = Date.now();
let yellowClickCount = { top: 0, bottom: 0 };

function flip() {
    if (bulb_div.innerHTML == bulb)
        return bulb_div.innerHTML = '';
    return bulb_div.innerHTML = bulb;
}

function addPoint() {
    vals.shift();
    enc.shift();
    const val = Number(codeDiv.value);
    const e = mapValueToPixel(val);
    vals.push(val);
    enc.push(mapValueToPixel(vals[vals.length - 1]));
    console.log('val', val, 'e', e);
    const ans = vals.map((v, i) => `<div class='point' style='margin-left:${(i + 1) * 125}px; top:${mapValueToPixel(v)}px'></div>`);
    console.log(ans, vals);
    pointsDiv.innerHTML = ans.join('');

    handleMeasurement(val);
    lastMeasurementTime = Date.now();
}

function mapValueToPixel(value) {
    const maxValue = 0.6;
    const maxPixel = 290;

    if (value < 0) value = 0;
    if (value > maxValue) value = maxValue;

    const ans = maxPixel - (value / maxValue * maxPixel);
    console.log('value', value, 'ans', ans);
    return ans;
}

function handleMeasurement(value) {
    if (value >= 0.5 && value <= 0.6) {
        panic();
        alert('Tighten the screw and remeasure');
    } else if (value >= 0 && value <= 0.1) {
        panic();
        alert('Loosen the screw and remeasure');
    } else if (value > 0.1 && value <= 0.2) {
        yellowClickCount.bottom++;
        if (yellowClickCount.bottom >= 2) {
            panic();
            alert('Loosen the screw');
        }
    } else if (value > 0.5 && value <= 0.6) {
        yellowClickCount.top++;
        if (yellowClickCount.top >= 2) {
            panic();
            alert('Tighten the screw');
        }
    } else {
        calm();
    }
}

function panic() {
    bulb_div.style.background = 'red';
    pid = setInterval(() => { flip(); }, 300);
}

function calm() {
    bulb_div.style.background = 'transparent';
    if (pid) {
        clearInterval(pid);
        pid = null;
    }
}

function promptMeasurement() {
    const now = Date.now();
    if (now - lastMeasurementTime >= 60000) {
        panic();
        alert('Please enter a measurement');
    }
}

setInterval(promptMeasurement, 60000);

const pointsDiv = document.getElementById("points-div");
const codeDiv = document.getElementById('code');
pointsDiv.innerHTML = '';
addPoint();