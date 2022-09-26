const websocketURI = "ws://127.0.0.1:24050/ws";

const ma = document.getElementById("hit-320");
const pr = document.getElementById("hit-300");
const gr = document.getElementById("hit-200");
const gd = document.getElementById("hit-100");
const bd = document.getElementById("hit-50");
const ms = document.getElementById("hit-0");
const unstableRate = document.getElementById("ur");
const acc = document.getElementById("acc");

const socket = new ReconnectingWebSocket(websocketURI);

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
    const json = JSON.parse(e.data);

    if (json.gameplay.hits.geki > 0) {
        ma.innerHTML = json.gameplay.hits.geki;
    } else {
        ma.innerHTML = 0;
    }
    if (json.gameplay.hits[300] > 0) {
        pr.innerHTML = json.gameplay.hits[300];
    } else {
        pr.innerHTML = 0;
    }
    if (json.gameplay.hits.katu > 0) {
        gr.innerHTML = json.gameplay.hits.katu;
    } else {
        gr.innerHTML = 0;
    }
    if (json.gameplay.hits[100] > 0) {
        gd.innerHTML = json.gameplay.hits[100];
    } else {
        gd.innerHTML = 0;
    }
    if (json.gameplay.hits[50] > 0) {
        bd.innerHTML = json.gameplay.hits[50];
    } else {
        bd.innerHTML = 0;
    }
    if (json.gameplay.hits[0] > 0) {
        ms.innerHTML = json.gameplay.hits[0];
    } else {
        ms.innerHTML = 0;
    }
    if (json.gameplay.hits.unstableRate > 0) {
        unstableRate.innerHTML = json.gameplay.hits.unstableRate.toFixed(2);
    } else {
        unstableRate.innerHTML = 0;
    }
    if (json.gameplay.accuracy > 0) {
        acc.innerHTML = json.gameplay.accuracy.toFixed(2);
    } else {
        acc.innerHTML = 0;
    }
}
