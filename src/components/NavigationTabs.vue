<template>
  <div class="navigation-tabs">
    <button
      v-for="tab in tabs"
      :key="tab"
      :class="['tab', { active: activeTab === tab }]"
      @click="$emit('tab-change', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'NavigationTabs',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change']
}
</script>

<style scoped>
.navigation-tabs {
  display: flex;
  gap: 0;
  padding: 0 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.tab {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 500;
  color: #999999;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.tab:hover {
  color: #666666;
}

.tab.active {
  color: #000000;
  font-weight: 700;
  border-bottom-color: #000000;
}

@media (min-width: 768px) {
  .navigation-tabs {
    padding: 0 24px;
  }
  
  .tab {
    padding: 16px 20px;
    font-size: 16px;
  }
}
</style>


