<template>
  <div>
    <div class="overlay" v-if="visible"/>
    <div class="commandpalette" v-if="visible">
      <input
        ref="searchInput"
        class="search-input"
        type="text"
        v-model="searchText"
        @keydown.down="downKey"
        @keydown.up="upKey"
        @keyup.esc="hide"
        @keyup.enter="$emit('selectChoice', choices[focusedChoiceIndex])"
      />
      <div ref="choices" class="commandpalette-choices">
        <div v-for="(c, index) in displayedChoices" :class="{
          'commandpalette-choice': true,
          focused: index === focusedChoiceIndex
        }">
          <div v-if="$slots.item">
            <slot name="item" />
          </div>
          <div v-else>
            {{ c.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js';
import './theme-white.css';
import mousetrap from 'mousetrap';

export default {
  name: "CommandPalette",
  props: {
    choices: {
      type: Array,
      required: true
    },
    keys: {
      type: Array,
      default: () => [ 'label' ]
    }
  },
  data() {
    return {
      visible: false,
      focusedChoiceIndex: 0,
      displayedChoices: [],
      fuse: undefined,
      fuseOptions: {
        keys: this.keys
      },
      searchText: '',
    };
  },
  mounted() {
    mousetrap.bind('ctrl+p', () => {
      this.show();
      return false;
    });
  },
  watch: {
    visible: {
      handler(v) {
        if (v) {
          mousetrap.bind('esc', this.hide.bind(this));
        } else {
          mousetrap.unbind('esc');
        }
      },
      immediate: true
    },
    choices: {
      handler(v) {
        this.fuse = new Fuse(v, this.fuseOptions);
        this.displayedChoices = this.choices;
      },
      immediate: true
    },
    searchText(v) {
      if (v) {
        this.displayedChoices = this.fuse.search(v);
        this.focusedChoiceIndex = 0;
      } else {
        this.displayedChoices = this.choices;
        this.focusedChoiceIndex = 0;
      }
    },
    focusedChoiceIndex: {
      handler() {
        this.$nextTick(() => {
          const choicesEl = this.$refs.choices;
          if (choicesEl && choicesEl.querySelector) {
            const focusedEl = choicesEl.querySelector('.focused');
            if (choicesEl.scrollTop > focusedEl.offsetTop - this.$refs.searchInput.offsetHeight - 9) {
              choicesEl.scrollTo(0, focusedEl.offsetTop - this.$refs.searchInput.offsetHeight - 9);
            } else if (choicesEl.scrollTop + choicesEl.offsetHeight < focusedEl.offsetTop + focusedEl.offsetHeight - 8) {
              choicesEl.scrollTo(0, focusedEl.offsetTop - choicesEl.offsetHeight - 8);
            }
          }
        });
      },
      immediate: true
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.$nextTick(() => {
        this.$el.querySelector('input').focus();
      });
    },
    hide() {
      this.visible = false;
    },
    upKey() {
      if (this.focusedChoiceIndex > 0) {
        this.focusedChoiceIndex--;
      }
    },
    downKey() {
      if (this.focusedChoiceIndex < this.displayedChoices.length - 1) {
        this.focusedChoiceIndex++;
      }
    }
  }
};
</script>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  background: #00000045;
}
.commandpalette {
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
  background: #fafafa;
  border-radius: 0 0 8px 8px;
  padding: 8px;
  position: absolute;
  top: 0;
  z-index: 100001;
  left: calc(50% - 200px);
  width: 400px;
}
.commandpalette-choices {
  max-height: 300px;
  overflow: auto;
}

.commandpalette-choice:first-child {
  border-top: 1px solid #d1d1d2;
}
.commandpalette-choice {
  width: calc(100% - 20px);
  border-bottom: 1px solid #d1d1d2;
  border-left: 1px solid #d1d1d2;
  border-right: 1px solid #d1d1d2;
  background: white;
  padding: 8px;
}

.commandpalette-choice.focused {
  background: #ebebeb;
}

.commandpalette .search-input{
  width: calc(100% - 22px);
  padding: 8px;
}

</style>
