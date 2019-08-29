import { storiesOf } from "@storybook/vue";

storiesOf("CommandPalette", module).add("Simple example", () => {
  const items = [];

  for (var i = 0; i < 99; i++) {
    items.push({ label: `item-${i}` });
  }

  return {
    data() {
      return { items };
    },
    template: `<div>
      <command-palette :choices="items" />
      <p>Hit <i>ctrl+p</i> to show the command palette</p>
    </div>`
  };
});

storiesOf("CommandPalette", module).add("other", () => ({
  template: `<command-palette :choices="[{ label: 'aaa' }, { label: 'bbb' }, { label: 'ccc' }]"></command-palette>`
}));
