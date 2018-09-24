import { is, SAGA_ACTION } from 'redux-saga/utils'
import {
    EFFECT_TRIGGERED,
    EFFECT_RESOLVED,
    EFFECT_REJECTED,
    EFFECT_CANCELLED,
    ACTION_DISPATCHED
} from 'redux-saga-devtools/lib/store/constants'
import { EVENT_SOURCE } from '../constants';

function getTime() {
    if (performance && performance.now) {
        return performance.now()
    } else {
        return Date.now()
    }
}

function postToContent(action) {
    try {
        window.postMessage({
            source: EVENT_SOURCE,
            action: serialize(action)
        }, "*");
    } catch (e) {
        console.error(e);
    }
}

export function createSagaRelayMonitor() {
    function effectTriggered(effect) {
        postToContent({
            type: EFFECT_TRIGGERED,
            effect,
            time: getTime()
        })
    }

    function effectResolved(effectId, result) {
        if (is.task(result)) {
            result.done.then(
                taskResult => {
                    if (result.isCancelled())
                        effectCancelled(effectId)
                    else
                        effectResolved(effectId, taskResult)
                },
                taskError => {
                    effectRejected(effectId, taskError)
                }
            )
        } else {
            const action = {
                type: EFFECT_RESOLVED,
                effectId,
                result,
                time: getTime()
            }
            postToContent(action)
        }
    }

    function effectRejected(effectId, error) {
        const action = {
            type: EFFECT_REJECTED,
            effectId,
            error,
            time: getTime()
        }
        postToContent(action)
    }

    function effectCancelled(effectId) {
        const action = {
            type: EFFECT_CANCELLED,
            effectId,
            time: getTime()
        }
        postToContent(action)
    }


    function actionDispatched(action) {
        const isSagaAction = action[SAGA_ACTION]
        const now = getTime();
        postToContent({
            type: ACTION_DISPATCHED,
            id: now,
            action,
            isSagaAction,
            time: now
        })
    }

    return {
        effectTriggered, effectResolved, effectRejected, effectCancelled, actionDispatched
    };
}

function mapKeysDeep(object, cb) {
    mapValues(
        mapKeys(obj, cb),
        val => (_.isObject(val) ? mapKeysDeep(val, cb) : val),
    )
}

function serialize(effect) {
    const fns = [];
    try {
        return JSON.stringify(effect, (key, value) => {
            if (typeof value === "function") {
                return { name: value.name };
            }
            if (value instanceof Error) {
                return {
                    message: value.message,
                    name: value.name,
                    stack: value.stack
                };
            }
            return value;
        });
    }
    catch (e) {
        if (e.message.indexOf("circular") >= 0) {
            return "[CIRCULAR OBJECT]";
        }
    }
}