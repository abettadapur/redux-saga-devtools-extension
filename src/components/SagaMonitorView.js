import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'
import { Row, Cell } from 'redux-saga-devtools/lib/components/Layout'
import Dock from 'redux-saga-devtools/lib/components/Dock'
import EffectView from './EffectView'
import ActionView from 'redux-saga-devtools/lib/containers/ActionView'
import {
    SagaMonitorContainer,
    SagaMonitorHeader,
    SagaMonitorOption,
    SagaMonitorBody
} from './styles'

const EFFECT_VIEW = 'Effects'
const ACTION_VIEW = 'Actions'

const OPTION_WIDTH = 80
const OPTION_STYLE = { width: OPTION_WIDTH }

class SagaMonitorView extends React.Component {

    state = {
        currentView: EFFECT_VIEW,
        currentViewIndex: 0
    }

    viewHandlers = {
        [EFFECT_VIEW]: () => this.setState({ currentView: EFFECT_VIEW, currentViewIndex: 0 }),
        [ACTION_VIEW]: () => this.setState({ currentView: ACTION_VIEW, currentViewIndex: 1 })
    }

    renderCurrentView() {
        switch (this.state.currentView) {
            case EFFECT_VIEW:
                return <EffectView rootEffectIds={this.props.rootEffectIds} />
            case ACTION_VIEW:
                return <ActionView />
            default:
                return 'Unknown View!'
        }
    }

    renderViewOption(view) {
        return (
            <Cell>
                <SagaMonitorOption
                    style={OPTION_STYLE}
                    onMouseDown={this.viewHandlers[view]}
                >
                    {view}
                </SagaMonitorOption>
            </Cell>
        )
    }

    render() {
        const content = this.renderContent();
        if (this.props.useDock) {
            return (
                <Dock>
                    {content}
                </Dock>
            )
        } else {
            return content;
        }
    }

    renderContent() {
        return (
            <SagaMonitorContainer>
                <SagaMonitorHeader>
                    <Row>
                        {this.renderViewOption(EFFECT_VIEW)}
                        {this.renderViewOption(ACTION_VIEW)}
                        <hr style={{ width: OPTION_WIDTH, left: OPTION_WIDTH * this.state.currentViewIndex }} />
                    </Row>
                </SagaMonitorHeader>
                <SagaMonitorBody>
                    {this.renderCurrentView()}
                </SagaMonitorBody>
            </SagaMonitorContainer>
        );
    }
}

SagaMonitorView.propTypes = {
    rootEffectIds: PropTypes.array.isRequired,
    useDock: PropTypes.bool
}

export default connect(
    (state, ownProps) => ({
        rootEffectIds: state.rootEffectIds,
        ...ownProps
    })
)(SagaMonitorView)
