<script lang="ts" setup>
</script>

<template>
  <h2>description:</h2>
  <ul>
    <li>mask the text</li>
  </ul>

  <div class="spin-container">
    <div class="spin">
      loading...
    </div>
    <div class="content spin-blur">
      content
    </div>
  </div>
</template>

<style scoped>
.spin-container {
  position: relative;
}

.spin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spin-blur {
  opacity: .5;
  clear: both;
  user-select: none;
  pointer-events: none;
}

.content {
  text-align: center;
  padding: 30px;
  background: #ddd;
}
</style>
