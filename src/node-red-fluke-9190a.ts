import { NodeDef, Node as NodeRedNode, NodeAPISettingsWithData, NodeAPI, NodeMessageInFlow } from 'node-red';

interface ConfigDef extends NodeDef {}

interface SettingsWithData extends NodeAPISettingsWithData {}

interface Message extends NodeMessageInFlow {
  payload: string;
}

module.exports = function (RED: NodeAPI<SettingsWithData>) {
  function CreateFluke9190ANode(this: NodeRedNode<{ test: string }>, config: ConfigDef) {
    RED.nodes.createNode(this, config);
    this.on('input', async (msg: NodeMessageInFlow) => {
      const tsMsg = msg as Message;
      msg.payload = tsMsg.payload.toLowerCase();
      this.send(msg);
    });
  }
  RED.nodes.registerType('node-red-contrib-fluke9190a-ultra-cool-field-metrology-well', CreateFluke9190ANode);
};
