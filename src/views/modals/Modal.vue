<script setup lang="js">

import { ref, computed, watchEffect, onUnmounted, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({
  title: {type: String, default: '', required: true},
  size: {type: String, default: ''},
  actions: {type: String, default: ''},
  cancelLabel: {type: String, default: ''},
  hideIconClose: {type: Boolean, default: false},
  noscroll: {type: Boolean, default: false},
  open: {type: Boolean, default: false, required: true},
  noclose: {type: Boolean, default: true},
  tabs: {type: Boolean, default: false},
  rounded: {type: Boolean, default: false}
})

const wasOpen = ref(false)

const dinamicClassHeader = computed(() => ({
  "is-justify-content-center": props.hideIconClose,
  "is-justify-content-space-between": !props.hideIconClose
}))

const checkScroll = () => {
  if (props.noscroll && props.open) {
    document.documentElement.classList.add('no-scroll')
    wasOpen.value = true
  } else if (wasOpen.value && props.noscroll && !props.open) {
    document.documentElement.classList.remove('no-scroll')
    wasOpen.value = false
  }
}

watchEffect(checkScroll)
onUnmounted(() => {
  document.documentElement.classList.remove('no-scroll')
})
</script>

<template>
  <teleport to="body">
    <div
      :class="[open && 'is-active', size && `is-${size}`]"
      class="modal v-modal"
    >
      <div
        class="modal-background v-modal-close"
        role="button"
        tabindex="0"
        @click="() => noclose === false && emit('close')"
        @keydown.space.prevent="() => noclose === false && emit('close')"
      />
      <div class="modal-content">
        <div class="modal-card">
          <header
            class="modal-card-head"
            :class="dinamicClassHeader"
          >
            <slot name="title">
              <span class="text-wrap fs-5 fw-bold">{{ title }}</span>
            </slot>
            
            <button
              v-if="hideIconClose"
              class="v-modal-close"
              aria-label="close"
              @click="emit('close')"
            >
            <img src="../../../public/close.svg" alt="" style="width: 15px; height: 15px;">
            </button>
          </header>

          <div
            class="modal-card-body"
            :class="[props.tabs && 'has-tabs']"
          >
            <div class="inner-content">
              <slot name="content" />
            </div>
          </div>
          <div
            class="modal-card-foot"
            :class="[
              actions === 'center' && 'is-centered',
              actions === 'right' && 'is-end',
            ]"
          >
            <slot name="action" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.281);
  z-index: 9999;

  &.is-big {
    .modal-content {
      width: 100%;
      max-width: 1300px;
      padding: 30px !important;
      max-height: 90vh;

      .modal-card {
        width: 100%;
      }
    }
  }

  &.is-large {
    .modal-content {
      width: 100%;
      max-width: 720px;

      .modal-card {
        width: 100%;
      }
    }
  }

  &.is-medium {
    .modal-content {
      width: 100%;
      max-width: 640px;

      .modal-card {
        width: 100%;
      }
    }
  }

  &.is-small {
    .modal-content {
      width: 100%;
      max-width: 420px;

      .modal-card {
        width: 100%;
      }
    }
  }

  .modal-content {
    transition: all 0.4s;
  }
}

.v-modal {
  &.is-active {
    z-index: 200 !important;

    .v-modal-close {
      cursor: pointer;
    }
  }

  .v-modal-card {
    width: 100%;
    background: var(--modal-bg-color);
    border: 1px solid var(--modal-border-color);
    border-radius: 8px;
    padding: 40px;
  }

  .modal-background {
    background-color: var(--night);
    opacity: 0.8;
  }

  .modal-content {
    transform: scale(1) !important;
    opacity: 1 !important;
    max-width: 540px;
    overflow-x: hidden;
    animation: fadedown 0.5s;
    margin: 0;
    padding: 0 10px;

    .modal-card {
      max-width: 100%;
      margin: 0 auto;

      &.is-rounded {
        border-radius: 12px;
      }

      .modal-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 5px;
        background: var(--modal-bg-color);
        border-bottom-color: var(--modal-border-color);
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;

        &.no-border {
          border-bottom-color: transparent;
        }

        .v-modal-close {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background: none;
          border-color: transparent;
          width: 22px;
          height: 22px;
          padding: 0;
          outline: none !important;

          &:hover {
            svg {
              color: var(--primary);
            }
          }

          svg {
            width: 22px;
            height: 22px;
            color: var(--light-text);
            transition: color 0.3s;
          }
        }
      }

      .modal-card-body {
        padding: 10px !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
        background: var(--modal-bg-color);

        .modal-form {
          padding: 10px 0 20px;
        }

        &.has-tabs {
          padding: 0;
          overflow-x: hidden;

          .tabs {
            overflow-x: auto;

            &::-webkit-scrollbar {
              height: 5px !important;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 10px !important;
              background: green;
              opacity: 20%;
            }

            a {
              padding: 0.75em 1em;
            }
          }
        }
      }

      .modal-card-foot {
        background-color: var(--modal-bg-color);
        padding: 0 1.5rem 1rem;
        border: none;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;

        &.no-border {
          border-top-color: transparent;
        }

        &.is-start {
          justify-content: flex-start !important;
        }

        &.is-centered {
          justify-content: center !important;
        }

        &.is-end {
          justify-content: flex-end !important;
        }
      }
    }
  }
}

@media (min-width: 300px) and (max-width: 768px) {
  .modal.modal-lg {
    .modal-card,
    .modal-content {
    width: 800px !important;
    }
  }
  .modal.modal-sm {
    .modal-card,
    .modal-content {
    width: 400px !important;
    }
  }
}

</style>