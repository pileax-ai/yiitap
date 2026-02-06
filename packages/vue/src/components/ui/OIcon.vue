<template>
  <span class="o-icon" :class="{ small: small }" :style="{ color: color }">
    <i class="yiitip-icon" :class="`icon-${name}`" />
  </span>
</template>

<script setup lang="ts">
/**
 * Use yiitap-icon iconfont.
 */
defineOptions({ name: 'ICon' })

const props = defineProps({
  /**
   * Icon name
   */
  name: {
    type: String,
    default: '',
  },
  /**
   * Icon color,  color name, or hex value
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * Small
   */
  small: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss">
.o-icon {
  display: flex;
  align-items: center;
  font-size: 20px;

  &.small {
    font-size: 16px !important;
  }

  &.rotate-45 {
    transform: rotate(45deg);
  }

  &.rotate-90 {
    transform: rotate(90deg);
  }

  &.rotate-135 {
    transform: rotate(135deg);
  }

  &.rotate-180 {
    transform: rotate(180deg);
  }

  &.rotate-225 {
    transform: rotate(225deg);
  }

  &.rotate-270 {
    transform: rotate(270deg);
  }

  &.rotate-315 {
    transform: rotate(315deg);
  }

  span {
    font-size: unset !important;
  }
}
</style>
