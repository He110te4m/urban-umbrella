<script lang="ts" setup>
import LayoutSidebar from './layouts/Sidebar.vue'
</script>

<template>
  <div class="container">
    <LayoutSidebar class="sidebar" />
    <router-view class="content" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.container .sidebar {
  flex: 0 0 200px;
}
.container .content {
  flex: 1;
}
</style>
