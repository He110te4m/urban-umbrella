import { ref } from 'vue'

interface UsePasswordOption {
  initValue: string
}

export function usePassword({ initValue }: UsePasswordOption) {
  return ref(initValue)
}
