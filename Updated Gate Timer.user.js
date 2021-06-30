// ==UserScript==
// @name         Updated Gate Timer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       Zerothousand
// @match        https://tie.tomalprremote.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    let tieNotification = document.querySelector(".location");
    let gateStatus = document.getElementById("gate-status");
    const btn = document.getElementById("open-gate");

    var containerDiv = document.querySelector(".container");
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    containerDiv.appendChild(appDiv)


const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "blue"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

const TIME_LIMIT = 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
const defaultApp = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
)}</span>
</div>
`;
    var sync = setInterval(gateSync, 1000);

    function gateSync() {
        if(document.body.style.background === "rgb(43, 43, 43) none repeat scroll 0% 0%"){
         
            GM_addStyle("#gate-div{top: -576px; left: -87px; position: relative;}");
        } else {
         GM_addStyle("#gate-div{top: -618px; left: -87px; position: relative;}");
        }
        if(gateStatus.innerHTML === "opening" && timerInterval === null){
         startTimer();
        } else if (gateStatus.innerHTML === "closing" || gateStatus.innerHTML === "UNKNOWN") {
          onTimesUp()
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;

    document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
</div>
`
        }
    }

document.getElementById("app").innerHTML = defaultApp

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}


    GM_addStyle(".base-timer {position: relative; width: 300px; height: 300px; top: -1108px; left: 1107px;}");
    GM_addStyle(".base-timer__svg {transform: scaleX(-1);}");
    GM_addStyle(".base-timer__circle {fill: none; stroke: none;}");
    GM_addStyle(".base-timer__path-elapsed {stroke-width: 7px; stroke: grey;}");
    GM_addStyle(".base-timer__path-remaining {stroke-width: 7px; stroke-linecap: round; transform: rotate(90deg); transform-origin: center; transition: 1s linear all; fill-rule: nonzero; stroke: currentColor;}");
    GM_addStyle(".base-timer__path-remaining.blue {color: rgb(0, 202, 255);}");
    GM_addStyle(".base-timer__path-remaining.orange {color: #FF9900;}");
    GM_addStyle(".base-timer__path-remaining.red {color: red;}");
    GM_addStyle(".base-timer__label {position: absolute; width: 300px; height: 300px; top: 0; display: flex; align-items: center; justify-content: center; font-size: 48px; color: rgb(0, 202, 255); -webkit-text-stroke-width: .25px; -webkit-text-stroke-color: black;}");
    GM_addStyle("#gate-div{top: -618px; left: -87px; position: relative;}");
    GM_addStyle("#gate-status {position: relative; top: 155px; left: 561px;}");
    GM_addStyle("#open-gate {padding: 54px 154px;");
    GM_addStyle(".location {position: relative; top:52px; left: 141px;");
     GM_addStyle(".card-title {position: relative; top:-37px;");
    GM_addStyle(".btn-primary {background-color: rgb(0, 202, 255);}");





})();