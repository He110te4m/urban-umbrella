<script lang="ts" setup>
import { useMenu } from './menu/useMenu'

const menu = useMenu()
</script>

<template>
  <aside>
    <header>侧边栏</header>
    <pre>{{ menu }}</pre>
  </aside>
</template>
