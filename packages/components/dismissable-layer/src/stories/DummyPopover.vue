<script setup lang="ts">
import {
  OkuPopper,
  OkuPopperAnchor,
  OkuPopperArrow,
  OkuPopperContent,
} from '@oku-ui/popper'
import { ref } from 'vue'
import { OkuFocusGuards } from '@oku-ui/focus-guards'
import { OkuPortal } from '@oku-ui/portal'
import { OkuDismissableLayer } from '@oku-ui/dismissable-layer'
import { OkuFocusScope } from '@oku-ui/focus-scope'

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent
}>

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

withDefaults(
  defineProps<{
    openLabel?: string
    closeLabel?: string
    color?: string
    trapped?: boolean
    disableOutsidePointerEvents?: boolean
    preventScroll?: boolean
  }>(),
  {
    openLabel: 'Open',
    closeLabel: 'Close',
    color: '#333',
    trapped: true,
    disableOutsidePointerEvents: false,
    preventScroll: false,
  },
)

defineEmits<{
  (event: 'escapeKeyDown', e: KeyboardEvent): void
  (event: 'pointerDownOutside', e: PointerDownOutsideEvent): void
  (event: 'focusOutside', e: FocusOutsideEvent): void
  (event: 'interactOutside', e: Event): void
}>()

const open = ref(false)
const skipUnmountAutoFocus = ref(false)
const openButtonRef = ref<HTMLButtonElement | null>(null)

function toggleOpen() {
  open.value = !open.value
}

function closeLayer() {
  open.value = false
}

function setSkipUnmountAutoFocus() {
  skipUnmountAutoFocus.value = !skipUnmountAutoFocus.value
}
</script>

<template>
  <div>
    <OkuPopper>
      <OkuPopperAnchor as-child>
        <button ref="openButtonRef" type="button" @click="toggleOpen">
          {{ openLabel }}
        </button>
      </OkuPopperAnchor>

      <template v-if="open">
        <OkuFocusGuards>
          <OkuPortal as-child>
            <OkuDismissableLayer
              as-child
              :disable-outside-pointer-events="disableOutsidePointerEvents"
              @escape-key-down="(event) => $emit('escapeKeyDown', event)"
              @pointer-down-outside="
                (event) => {
                  setSkipUnmountAutoFocus();
                  if (event.target === openButtonRef) {
                    event.preventDefault();
                  }
                  else {
                    $emit('pointerDownOutside', event);
                  }
                }
              "
              @dismiss="closeLayer"
              @interact-outside="(event) => $emit('interactOutside', event)"
              @focus-outside="(event) => $emit('focusOutside', event)"
            >
              <OkuFocusScope
                as-child
                :trapped="trapped"
                @unmount-auto-focus="(event: Event) => {
                  if (skipUnmountAutoFocus) {
                    event.preventDefault()
                  }
                  skipUnmountAutoFocus = false
                }"
              >
                <OkuPopperContent
                  :style="{
                    filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
                    display: 'flex',
                    gap: '10px',
                    background: 'white',
                    borderRadius: '4px',
                    alignItems: 'flex-start',
                    backgroundColor: color,
                    minWidth: '200px',
                    minHeight: '150px',
                    padding: '20px',
                  }"
                  side="bottom"
                  :side-offset="10"
                >
                  <slot />

                  <button type="button" @click="closeLayer">
                    {{ closeLabel }}
                  </button>

                  <input type="text" defaultValue="hello world">

                  <OkuPopperArrow
                    :width="10"
                    :height="10"
                    :style="{ fill: color }"
                    :offset="20"
                  />
                </OkuPopperContent>
              </OkuFocusScope>
            </OkuDismissableLayer>
          </OkuPortal>
        </OkuFocusGuards>
      </template>
    </OkuPopper>
  </div>
</template>
