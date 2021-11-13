import { EditorRED } from 'node-red';

declare const RED: EditorRED;

RED.nodes.registerType('node-red-fluke-9190a', {
  category: 'function',
  color: '#a6bbcf',
  defaults: {
    name: { value: '' }
  },
  inputs: 1,
  outputs: 1,
  icon: 'file.png',
  label: function () {
    return this.name || 'node-red-fluke-9190a';
  }
});
