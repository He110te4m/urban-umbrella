<script lang="ts" setup>
import { useMenus } from './menu/useMenus'

const { onMenuItemClick, menus, activeNodes } = useMenus()
</script>

<template>
  <aside class="sidebar">
    <h3 class="sidebar-title">
      headless demo
    </h3>
    <dl class="headless-component-category-list">
      <dd
        v-for="category in menus" :key="category.url" class="headless-component-category-item"
        :class="{ active: activeNodes.includes(category.url) }"
      >
        <div class="headless-component-category-title">
          {{ category.label }}
        </div>
        <dl class="headless-component-demo-list">
          <dd
            v-for="item in category.children" :key="item.url" class="headless-component-demo-item"
            :class="{ active: activeNodes.includes(item.url) }" @click="onMenuItemClick(item.url)"
          >
            <span class="headless-component-demo-link">
              {{ item.label }}
            </span>
          </dd>
        </dl>
      </dd>
    </dl>
  </aside>
</template>

<style scoped>
.sidebar-title {
  font-size: 20px;
  font-weight: bold;
}

dl,
dd {
  margin: 0;
}

.headless-component-category-title {
  color: rgba(0, 0, 0, .45);
  padding: 8px 16px;
  font-size: 14px;
  line-height: 20px;
}

.headless-component-demo-item {
  padding: 10px 24px 10px 16px;
  margin: 4px;
  height: 20px;
  display: flex;
  transition: background-color .3s;
  cursor: pointer;
}

.headless-component-demo-item:hover {
  background-color: rgba(0, 0, 0, .06);
}

.headless-component-demo-link {
  flex: 1;
  text-decoration: none;
  color: rgba(0, 0, 0, .88);
}
</style>
