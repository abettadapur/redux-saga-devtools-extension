import { TAB, Events, EVENT_SOURCE } from "../constants";

// Listen to events from the saga monitor, and relay them to the background script

let background;
let connected = false

function connect() {
    connected = true;
    background = chrome.runtime.connect({ name: TAB });
}

function sendMessage(message) {
    if (!connected) {
        connect();
    }

    background.postMessage({ name: Events.RELAY, message });
}

function handleMessages(event) {
    const message = event.data;
    if (message.source == EVENT_SOURCE) {
        sendMessage(message.action);
    }
}

window.addEventListener("message", handleMessages, false);