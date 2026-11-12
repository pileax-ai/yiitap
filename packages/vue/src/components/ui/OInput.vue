<template>
  <div class="o-input o-field" :class="`type-${type}`">
    <div class="o-input-native">
      <div class="o-input-native__prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="o-input-native__main">
        <input
          ref="input"
          v-model="value"
          :type="type"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          @focus="emit('focus')"
          @blur="emit('blur')"
          @keyup.enter="emit('enter')"
        />
      </div>
      <div class="o-input-native__suffix">
        <slot name="suffix"></slot>
        <o-icon
          name="close"
          class="clear o-tips"
          @click="clear"
          v-if="clearable && value"
        />
      </div>
    </div>
    <div class="o-input-bottom">
      <div class="o-text-error" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OIcon from './OIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['blur', 'enter', 'focus', 'clear', 'update:modelValue'])
const input = ref<HTMLInputElement | null>(null)

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

function focus() {
  input.value?.focus()
}

function clear() {
  value.value = ''
  focus()
  emit('clear')
}

defineExpose({
  clear,
  focus,
})
</script>

<style lang="scss">
.o-input {
  &.error {
    .o-input-native {
      outline: solid 1px #f44336;
    }
  }

  &-native {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 4px 8px;
    width: 100%;
    border-radius: 3px;
    box-sizing: border-box;
    outline: solid 1px rgba(0, 0, 0, 0.05);


    &:has(input:focus) {
      background: var(--yii-active-bg-color);
      outline: solid 1px #2080f0;
    }

    &__prefix {
      flex: 0;
      margin-right: 10px;
    }

    &__main {
      flex: 1;

      input {
        width: 100%;
        height: 30px;
        border: none;
        color: var(--yii-color);
        background: transparent;

        &:focus {
          outline: none !important;
        }
      }
    }

    &__suffix {
      flex: 0;
      display: flex;

      .o-icon.clear {
        cursor: pointer;
        width: 30px;
        height: 30px;
        margin-left: 4px;
        text-align: center;
        justify-content: center;

        &:hover {
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  &-bottom {
    margin-top: 4px;
    font-size: 0.7rem;
  }
}
</style>
