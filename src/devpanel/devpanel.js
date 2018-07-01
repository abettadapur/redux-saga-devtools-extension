import * as React from "react";
import { Provider } from "react-redux";
import { render, unmountComponentAtNode } from "react-dom";
import SagaMonitorView from "../components/SagaMonitorView";
import { Events } from "../constants";

let rendered = false;
let backgroundWindow;
let backgroundConnection;

function renderDevTools(store) {
    const containerElement = document.getElementById("container");
    render(
        <Provider store={store}>
            <SagaMonitorView />
        </Provider>,
        container
    );

    rendered = true;
}

function unmount() {
    const containerElement = document.getElementById("container");
    unmountComponentAtNode(containerElement);
}

function renderNA() {
    // if (rendered === false) return;
    // rendered = false;
    // naTimeout = setTimeout(() => {
    //     let message = (
    //         <div style={messageStyle}>
    //             No store found. Make sure to follow <a href="https://github.com/zalmoxisus/redux-devtools-extension#usage" target="_blank">the instructions</a>.
    //     </div>
    //     );
    //     if (isChrome) {
    //         chrome.devtools.inspectedWindow.getResources(resources => {
    //             if (resources[0].url.substr(0, 4) === 'file') {
    //                 message = (
    //                     <div style={messageStyle}>
    //                         No store found. Most likely you did not allow access to file URLs. <a href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#access-file-url-file" target="_blank">See details</a>.
    //           </div>
    //                 );
    //             }

    //             const node = document.getElementById('root');
    //             unmountComponentAtNode(node);
    //             render(message, node);
    //             store = undefined;
    //         });
    //     } else {
    //         const node = document.getElementById('root');
    //         unmountComponentAtNode(node);
    //         render(message, node);
    //         store = undefined;
    //     }
    // }, 3500);
}

function getBackgroundContextAndRender(id) {
    setTimeout(() => {
        chrome.runtime.getBackgroundPage((window) => {
            const storeMap = window.storeMap;
            if (storeMap && storeMap[id]) {
                renderDevTools(storeMap[id]);
            }
        })
    }, 100);
}

function init(id) {
    renderNA();
    getBackgroundContextAndRender(id);

    backgroundConnection = chrome.runtime.connect({ name: id ? id.toString() : undefined });
    backgroundConnection.onMessage.addListener((message) => {
        if (message.type === Events.TAB_RECONNECTED) {
            unmount();
            getBackgroundContextAndRender(id);
        }
        if (message.type === Events.TAB_RECONNECTED) {
            unmount();
        }
    })
}

init(chrome.devtools.inspectedWindow.tabId);