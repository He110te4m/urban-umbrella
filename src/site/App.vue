<script lang="ts" setup>
import LayoutSidebar from './layouts/Sidebar.vue'
</script>

<template>
  <div class="container">
    <LayoutSidebar class="sidebar" />
    <div class="content">
      <router-view class="content" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.container .sidebar {
  flex: 0 0 240px;
}
.container .content {
  flex: 1;
}
</style>
