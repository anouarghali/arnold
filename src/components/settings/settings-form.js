import React, { Component } from 'react';
import { Form, Button, Header, Segment } from 'semantic-ui-react';
import SettingsStore from '../../stores/settings-store.js';
import { setSettings } from '../../actions/settings-actions.js';
import { addNotification } from '../../actions/notification-actions.js';
import { isProduction, isMockMode } from '../../util/env.js';

class SettingsForm extends Component {
  state = {
    settings: SettingsStore.get()
  }

  _handleSubmit(e, serializedForm) {
    e.preventDefault();
    this.setState(serializedForm);
    setSettings(serializedForm);

    addNotification({
      title: 'Settings',
      message: 'Your settings have been saved.',
      level: 'success'
    });
  }

  _getTransportLayers(isProduction, isMockMode) {
    let transportLayers;

    if(isProduction && isMockMode) {
      transportLayers = [
        { text: 'Static data', value: 'mock' }
      ];
    } else if(isProduction) {
      transportLayers = [
        { text: 'WebSocket', value: 'websocket' },
        { text: 'AJAX', value: 'ajax' }
      ];
    } else {
      transportLayers = [
        { text: 'WebSocket', value: 'websocket' },
        { text: 'AJAX', value: 'ajax' },
        { text: 'Mock', value: 'mock' }
      ];
    }

    return transportLayers;
  }

  render() {
    const transportLayers = this._getTransportLayers(isProduction, isMockMode);

    return (
      <div>
        <Form onSubmit={this._handleSubmit.bind(this)}>
          <Segment>
            <Header size='medium'>General</Header>
            <Form.Checkbox label='Check for updates on initial load' name='checkForUpdatesOnInitialLoad' defaultChecked={this.state.settings.checkForUpdatesOnInitialLoad} />
          </Segment>
          <Segment>
            <Header size='medium'>Connection</Header>
            <Form.Group widths='equal'>
              <Form.Input label='Kodi IP Address' name='ipAddress' defaultValue={this.state.settings.ipAddress} />
              <Form.Select label='Transport Layer' name='transportLayer' options={transportLayers} defaultValue={this.state.settings.transportLayer} />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input label='WebSocket Port' name='webSocketPort' type='number' defaultValue={this.state.settings.webSocketPort} />
              <Form.Input label='AJAX Port' name='ajaxPort' type='number' defaultValue={this.state.settings.ajaxPort} />
            </Form.Group>
          </Segment>
          <Segment>
            <Header size='medium'>Display</Header>
            <Form.Group widths='equal'>
              {/* <Form.Input label='Items per page' name='itemsPerPage' type='number' defaultValue={this.state.settings.itemsPerPage} /> */}
              <Form.Input label='Items per row' name='itemsPerRow' type='number' defaultValue={this.state.settings.itemsPerRow} />
            </Form.Group>
          </Segment>
          <Button primary type='submit'>Save</Button>
        </Form>
      </div>
    );
  }
}

export default SettingsForm;
