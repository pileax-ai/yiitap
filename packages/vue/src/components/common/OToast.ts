import { computePosition, autoUpdate, flip, shift } from '@floating-ui/dom'

interface ToastInstance {
  el: HTMLElement
  cleanup: () => void
  x: number
}

class ToastManager {
  private instances: ToastInstance[] = []
  private readonly gap = 12
  private readonly topMargin = 20

  error(message: string, duration = 3000) {
    this.show(message, 'error', duration)
  }

  info(message: string, duration = 3000) {
    this.show(message, 'info', duration)
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration)
  }

  warning(message: string, duration = 3000) {
    this.show(message, 'warning', duration)
  }

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 3000
  ) {
    const toastEl = document.createElement('div')
    toastEl.className = `o-toast ${type}`

    // 1. Initial State: Invisible and shifted up
    Object.assign(toastEl.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '9999',
      transition:
        'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease',
      opacity: '0',
      pointerEvents: 'none',
    })

    toastEl.innerHTML = `
      <i class="yiitip-icon icon-${type}"></i>
      <span class="message">${message}</span>
    `
    document.body.appendChild(toastEl)

    const instance: ToastInstance = {
      el: toastEl,
      cleanup: () => {},
      x: 0,
    }

    let isFirstPosition = true

    // 2. Position Sync
    instance.cleanup = autoUpdate(document.body, toastEl, () => {
      computePosition(document.body, toastEl, {
        placement: 'top',
        middleware: [shift(), flip()],
      }).then(({ x }) => {
        instance.x = x

        if (isFirstPosition) {
          // Initialize position WITHOUT transition to prevent sliding from left
          const initialY = -toastEl.offsetHeight
          toastEl.style.transition = 'none'
          toastEl.style.transform = `translate3d(${x}px, ${initialY}px, 0)`

          // Force reflow
          const _ = toastEl.offsetHeight

          // Re-enable transition and show
          toastEl.style.transition =
            'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease'
          isFirstPosition = false

          this.instances.push(instance)
          this.repositionToasts()
          toastEl.style.opacity = '1'
        } else {
          // Normal update (e.g., window resize)
          this.repositionToasts()
        }
      })
    })

    if (duration > 0) {
      setTimeout(() => this.destroy(instance), duration)
    }
  }

  private repositionToasts() {
    let currentY = this.topMargin

    this.instances.forEach((instance) => {
      // Apply the final stack position
      instance.el.style.transform = `translate3d(${instance.x}px, ${currentY}px, 0)`
      currentY += instance.el.offsetHeight + this.gap
    })
  }

  private destroy(instance: ToastInstance) {
    instance.el.style.opacity = '0'
    // Slide up slightly while fading out
    const currentTransform = instance.el.style.transform
    instance.el.style.transform = `${currentTransform} translateY(-20px) scale(0.9)`

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'opacity') {
        instance.cleanup()
        if (instance.el.parentNode) {
          document.body.removeChild(instance.el)
        }
        this.instances = this.instances.filter((i) => i !== instance)
        this.repositionToasts()
        instance.el.removeEventListener('transitionend', handleTransitionEnd)
      }
    }

    instance.el.addEventListener('transitionend', handleTransitionEnd)
  }
}

export const OToast = new ToastManager()
