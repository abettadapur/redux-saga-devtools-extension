import { createSagaRelayMonitor } from "./sagaMonitor";
const sagaMonitor = createSagaRelayMonitor();
window["__SAGA_MONITOR_EXTENSION__"] = sagaMonitor;