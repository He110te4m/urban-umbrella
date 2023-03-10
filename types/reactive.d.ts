import { Ref } from 'vue'

declare global {
  type MaybeRef<T> = Ref<T> | T
}

export {}
