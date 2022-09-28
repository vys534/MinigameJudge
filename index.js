const websocketURI = "ws://127.0.0.1:24050/ws";

const ma = document.getElementById("hit-320");
const pr = document.getElementById("hit-300");
const gr = document.getElementById("hit-200");
const gd = document.getElementById("hit-100");
const bd = document.getElementById("hit-50");
const ms = document.getElementById("hit-0");
const unstableRate = document.getElementById("ur");
const acc = document.getElementById("acc");
const lateDiv = document.getElementById("late");
const earlyDiv = document.getElementById("early");
const noteDiv = document.getElementById("totalnote");
const renderTimeDiv = document.getElementById("rendertime");
const ratioDiv = document.getElementById("ratio");
const debugContainer = document.getElementById("debug-container");
const socket = new ReconnectingWebSocket(websocketURI);

const marvelousTimingWindow = 16.5;

// Used to keep track of the last index seen in the hit error array
let lastKnownHitErrorArrayLength = 0;

let late = 0;
let early = 0;

let tempState;
let timeNow;

let tempTotalNotes;

const debug = true;

if (debug) {
    debugContainer.style.display = "block";
}

socket.onopen = () => {
    console.log("Connected");
}

socket.onclose = (e) => {
    console.log(`Websocket closed connection: ${e}`);
    socket.send("Client closed");
}

socket.onerror = (e) => {
    console.error(`Websocket encountered an error!: ${e}`);
}

socket.onmessage = (e) => {
    if (debug) {
        timeNow = new Date().getMilliseconds()
    }
    const json = JSON.parse(e.data);
    if (tempState !== json.menu.state) {
        tempState = json.menu.state;
    }

    if (tempState === 2 || tempState === 7 || tempState === 14) {
        ma.innerHTML = json.gameplay.hits.geki;
        pr.innerHTML = json.gameplay.hits[300];
        gr.innerHTML = json.gameplay.hits.katu;
        gd.innerHTML = json.gameplay.hits[100];
        bd.innerHTML = json.gameplay.hits[50];
        ms.innerHTML = json.gameplay.hits[0];

        const totalNotes = json.gameplay.hits.geki + json.gameplay.hits[300] + json.gameplay.hits.katu + json.gameplay.hits[100] + json.gameplay.hits[50] + json.gameplay.hits[0];
        noteDiv.innerHTML = totalNotes;
        tempTotalNotes = totalNotes;

        unstableRate.innerHTML = json.gameplay.hits.unstableRate.toFixed(2);
        acc.innerHTML = json.gameplay.accuracy.toFixed(2);

        if (json.gameplay.hits[300] === 0) {
            if (json.gameplay.hits.geki > 0 && json.gameplay.hits.katu + json.gameplay.hits[100] + json.gameplay.hits[50] + json.gameplay.hits[0] === 0) {
                ratioDiv.classList.add("ratio-green");
                ratioDiv.innerHTML = "ET";
            } else {
                ratioDiv.classList.remove("ratio-green");
                ratioDiv.classList.remove("ratio-red");
                ratioDiv.innerHTML = "0.00";
            }
        } else {
            const ratio = json.gameplay.hits.geki / json.gameplay.hits[300];
            if (ratio >= 1) {
                ratioDiv.classList.remove("ratio-red");
                ratioDiv.classList.add("ratio-green");
            } else {
                ratioDiv.classList.remove("ratio-green");
                ratioDiv.classList.add("ratio-red");
            }
                ratioDiv.innerHTML = ratio.toFixed(2);
        }


        // dont even ask
        if (json.gameplay.hits.hitErrorArray !== null && json.gameplay.hits.hitErrorArray.length > lastKnownHitErrorArrayLength) {
            for (let i = lastKnownHitErrorArrayLength; i < json.gameplay.hits.hitErrorArray.length - 1; i++) {
                if (json.gameplay.hits.hitErrorArray[i] > marvelousTimingWindow) late++;
                if (json.gameplay.hits.hitErrorArray[i] < -marvelousTimingWindow) early++;
                lastKnownHitErrorArrayLength++;
            }
            lateDiv.innerHTML = late;
            earlyDiv.innerHTML = early;
        }

    } else {
        ma.innerHTML = 0;
        pr.innerHTML = 0;
        gr.innerHTML = 0;
        gd.innerHTML = 0;
        bd.innerHTML = 0;
        ms.innerHTML = 0;
        unstableRate.innerHTML = "0.00";
        acc.innerHTML = "0.00";
        late = 0;
        early = 0;
        noteDiv.innerHTML = 0;
        lateDiv.innerHTML = 0;
        earlyDiv.innerHTML = 0;
        ratioDiv.innerHTML = "0.00";
        lastKnownHitErrorArrayLength = 0;
        ratioDiv.classList.remove("ratio-green");
        ratioDiv.classList.remove("ratio-red");
    }
    if (debug) {
        renderTimeDiv.innerHTML = new Date().getMilliseconds() - timeNow;
    }
}
