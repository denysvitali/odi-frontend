import { ref, onMounted, onUnmounted } from 'vue'

export interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px' } = options

  const targetRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          callback()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    targetRef
  }
}
