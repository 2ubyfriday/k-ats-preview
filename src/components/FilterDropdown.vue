<template>
  <div class="filter-container">
    <div class="filter-dropdown" @click="toggleDropdown">
      <span class="filter-text" v-html="formatFilterText(selectedFilter)"></span>
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </div>
    <div v-if="isOpen" class="dropdown-menu">
      <button
        v-for="option in options"
        :key="option"
        :class="['dropdown-item', { active: selectedFilter === option }]"
        @click="selectFilter(option)"
        v-html="formatFilterText(option)"
      ></button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'FilterDropdown',
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedFilter: {
      type: String,
      required: true
    }
  },
  emits: ['filter-change'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }
    
    const selectFilter = (filter) => {
      emit('filter-change', filter)
      isOpen.value = false
    }
    
    const formatFilterText = (text) => {
      if (text === '기타 상황별') {
        return '기타 상황별 <span class="filter-hint">(홈마핸, 홈플핸, 원정마핸, 원정플핸)</span>'
      }
      return text
    }
    
    const closeDropdown = (event) => {
      if (!event.target.closest('.filter-container')) {
        isOpen.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    
    return {
      isOpen,
      toggleDropdown,
      selectFilter,
      formatFilterText
    }
  }
}
</script>

<style scoped>
.filter-container {
  position: relative;
  padding: 12px 16px;
  background-color: #ffffff;
}

.filter-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-dropdown:hover {
  border-color: #999999;
}

.filter-text {
  font-size: 14px;
  color: #000000;
}

.dropdown-arrow {
  font-size: 12px;
  color: #666666;
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 16px;
  right: 16px;
  margin-top: 4px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #f0f0f0;
  font-weight: 600;
}

@media (min-width: 768px) {
  .filter-container {
    padding: 16px 24px;
  }
  
  .filter-dropdown {
    padding: 12px 20px;
  }
  
  .filter-text {
    font-size: 16px;
  }
  
  .dropdown-menu {
    left: 24px;
    right: 24px;
  }
}
</style>


