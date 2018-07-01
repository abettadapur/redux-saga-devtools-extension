Redux-Saga DevTools Chrome Extension
------------------------------------------
Chrome Extension for Redux-Saga Devtools
![alt-text](https://raw.githubusercontent.com/abettadapur/redux-saga-devtools-extension/master/readme.png)

Usage
--------------------------------
1. Install the extension from the [Chrome marketplace](https://chrome.google.com/webstore/detail/kclmpmjofefcpjlommdpokoccidafnbi)
2. When creating your saga middlware, pass the extension monitor to the middleware as an option
```js
const monitor = window["__SAGA_MONITOR_EXTENSION__"]
const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor })
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)
```
3. Open the Chrome DevTools and inspect your Sagas
