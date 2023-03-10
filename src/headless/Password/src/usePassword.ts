interface UsePasswordOption {
  initValue?: string
  maskChar?: string
}

export function usePassword({ initValue = '', maskChar = '*' }: UsePasswordOption = {}) {
  const text = ref(initValue)

  return computed({
    get: () => text.value.split('').map(() => maskChar).join(''),
    set: (newText: string) => {
      // TODO: 功能未完成，set 还需要添加 diff
      text.value = newText
    },
  })
}
