Redux-Saga DevTools Chrome Extension
------------------------------------------
Chrome Extension for Redux-Saga Devtools

Usage
--------------------------------
1. Install the extension from the Chrome marketplace
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
