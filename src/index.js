import CommandPalette from "./components/CommandPalette";

const LibraryModule = {
  CommandPalette,

  install(Vue) {
    // Register components with vue
    Vue.component("command-palette", CommandPalette);
  }
};

// Export library
export default LibraryModule;

// Export components
export { CommandPalette };
