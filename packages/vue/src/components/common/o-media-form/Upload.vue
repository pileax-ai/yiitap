<template>
  <section class="o-media-upload">
    <section
      class="upload-area"
      :class="{ dragging: isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerInput"
    >
      <div class="tips" v-if="selectedFile">
        <div class="o-loading"></div>
        <div>
          {{ tr('label.uploader.uploading') }}:
          <strong>{{ selectedFile?.name }}</strong>
        </div>
      </div>
      <div class="tips" v-else>
        <o-icon name="cloud_upload" />
        <div>{{ tr('label.uploader.tips') }}</div>
      </div>

      <input ref="fileInput" type="file" :accept="accept" @change="onInput" />
    </section>
    <footer class="actions o-text-error" v-if="error">
      {{ error }}
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { OIcon } from '../../index'

import useI18n from '../../../hooks/useI18n'

const props = defineProps({
  val: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  onUpload: {
    type: Function as PropType<(file: File, type: string) => Promise<string>>,
    default: undefined,
  },
})
const emit = defineEmits(['input'])

const { tr } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const error = ref(null)

const accept = computed(() => {
  switch (props.type) {
    case 'video':
      return 'video/*,.mp4,.webm,.ogg'
    case 'model':
      return '.glb,.gltf'
    default:
      return 'image/*,.jpg,.jpeg,.png,.gif,.webp,.svg'
  }
})

const triggerInput = () => {
  fileInput.value?.click()
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFile(target.files[0])
  }
}

const processFile = (file: File) => {
  error.value = null
  selectedFile.value = file
  if (props.onUpload) {
    props
      .onUpload(file, props.type)
      .then((url) => {
        emit('input', url)
      })
      .catch((err) => {
        error.value = `${tr('label.uploader.failed')}: ${err}`
      })
      .finally(() => {
        selectedFile.value = null
      })
  } else {
    selectedFile.value = null
    error.value = tr('label.uploader.notConfigured')
  }
}
</script>

<style lang="scss">
.o-media-upload {
  min-width: 500px;

  .upload-area {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yii-tips-color);
    border-radius: 4px;
    border-style: dashed;
    border-color: var(--yii-border-color);
    padding: 8px;
    min-height: 100px;
    cursor: pointer;

    &:hover {
      border-color: var(--yii-color);
    }

    input {
      display: none;
    }

    .tips {
      width: 100%;
      text-align: center;
      margin: 0 auto;
      .o-icon {
        display: unset;
        font-size: 26px;
      }

      .o-loading {
        width: 30px;
        height: 30px;
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
