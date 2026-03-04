<template>
  <div class="header">
    <div class="header-content">
      <h2 v-if="isEnglish" class="korea-sports-title">🇰🇷 KOREA Sports</h2>
      <p v-else class="support-notice">{{ supportNotice }}</p>
      <div class="title-section">
        <h1 class="title">{{ currentTitle }}</h1>
        <div class="title-dropdown" v-if="titles.length > 1 && !hideTitleDropdown">
          <button class="title-toggle" @click="showTitleMenu = !showTitleMenu">
            <span>▼</span>
          </button>
          <div v-if="showTitleMenu" ref="titleMenu" class="title-menu">
            <button
              v-for="(title, index) in titles"
              :key="title"
              :ref="el => { if (title === currentTitle) activeItem = el }"
              :class="['title-menu-item', { active: title === currentTitle }]"
              @click="selectTitle(title)"
            >
              {{ title }}
            </button>
          </div>
        </div>
      </div>
      <p class="season">{{ season }}</p>
    </div>
    <div class="header-actions" v-if="!hideExportImport">
      <div class="export-dropdown">
        <button class="data-btn" @click="showExportMenu = !showExportMenu">
          📥 Export
        </button>
        <div v-if="showExportMenu" class="export-menu">
          <button class="export-menu-item" @click="handleExportJson">
            JSON 다운로드
          </button>
          <button class="export-menu-item" @click="handleExportExcel">
            Excel 다운로드
          </button>
        </div>
      </div>
      <label class="data-btn import-btn">
        📤 Import
        <input type="file" accept=".json,.xlsx,.xls" @change="handleFileImport" style="display: none;" />
      </label>
      <div class="language-section">
        <button class="language-btn" @click="$emit('change-language')">
          <span>{{ langBtnText }}</span>
          <span class="arrow">›</span>
        </button>
        <span v-if="langNotice" class="language-notice">{{ langNotice }}</span>
      </div>
    </div>
    <div class="header-actions" v-else>
      <div class="language-section">
        <button class="language-btn" @click="$emit('change-language')">
          <span>{{ langBtnText }}</span>
          <span class="arrow">›</span>
        </button>
        <span v-if="langNotice" class="language-notice">{{ langNotice }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

export default {
  name: 'Header',
  props: {
    season: {
      type: String,
      required: true
    },
    hideExportImport: {
      type: Boolean,
      default: false
    },
    hideTitleDropdown: {
      type: Boolean,
      default: false
    },
    titles: {
      type: Array,
      default: () => ['K-Basketball(남자)', 'K-Basketball(여자)']
    },
    currentTitle: {
      type: String,
      default: 'K-Basketball(여자)'
    },
    supportNotice: {
      type: String,
      default: '*현재 농구 남자,여자 / 배구 남자,여자 지원'
    },
    langBtnText: {
      type: String,
      default: 'US / Eng'
    },
    langNotice: {
      type: String,
      default: '*English version coming soon'
    },
    isEnglish: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change-language', 'export-data', 'export-excel', 'import-data', 'title-change'],
  setup(props, { emit }) {
    const showTitleMenu = ref(false)
    const showExportMenu = ref(false)
    const titleMenu = ref(null)
    const activeItem = ref(null)
    
    const selectTitle = (title) => {
      emit('title-change', title)
      showTitleMenu.value = false
    }
    
    const handleFileImport = (event) => {
      const file = event.target.files[0]
      if (file) {
        emit('import-data', file)
      }
      // 같은 파일을 다시 선택할 수 있도록 리셋
      event.target.value = ''
    }
    
    const handleExportJson = () => {
      emit('export-data')
      showExportMenu.value = false
    }
    
    const handleExportExcel = () => {
      emit('export-excel')
      showExportMenu.value = false
    }
    
    const closeMenu = (event) => {
      if (!event.target.closest('.title-dropdown')) {
        showTitleMenu.value = false
      }
      if (!event.target.closest('.export-dropdown')) {
        showExportMenu.value = false
      }
    }
    
    // 메뉴가 열릴 때 현재 선택된 항목으로 스크롤
    watch(showTitleMenu, async (isOpen) => {
      if (isOpen) {
        await nextTick()
        if (activeItem.value) {
          // activeItem이 배열일 수 있으므로 처리
          const item = Array.isArray(activeItem.value) ? activeItem.value[0] : activeItem.value
          if (item) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            // 포커스도 설정 (접근성)
            item.focus()
          }
        }
      }
    })
    
    onMounted(() => {
      document.addEventListener('click', closeMenu)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', closeMenu)
    })
    
    return {
      showTitleMenu,
      showExportMenu,
      titleMenu,
      activeItem,
      selectTitle,
      handleFileImport,
      handleExportJson,
      handleExportExcel
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  flex: 1;
}

.korea-sports-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.support-notice {
  font-size: 13px;
  color: #666666;
  margin: 0 0 6px 0;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  margin: 0 0 4px 0;
}

.title-dropdown {
  position: relative;
}

.title-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #666666;
  font-size: 12px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.title-toggle:hover {
  color: #000000;
}

.title-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.title-menu-item {
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

.title-menu-item:hover {
  background-color: #f5f5f5;
}

.title-menu-item.active {
  background-color: #f0f0f0;
  font-weight: 600;
}

.title-menu-item:focus {
  outline: 2px solid #000000;
  outline-offset: -2px;
}

.season {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-btn {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #000000;
  transition: background-color 0.2s;
}

.data-btn:hover {
  background-color: #e8e8e8;
}

.import-btn {
  display: inline-block;
  cursor: pointer;
}

.export-dropdown {
  position: relative;
}

.export-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
}

.export-menu-item {
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

.export-menu-item:hover {
  background-color: #f5f5f5;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
  transition: background-color 0.2s;
}

.language-btn:hover {
  background-color: #e8e8e8;
}

.language-btn:active {
  background-color: #d8d8d8;
}

.arrow {
  font-size: 18px;
  color: #666666;
}

.language-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.language-notice {
  font-size: 12px;
  color: #666666;
}

@media (min-width: 768px) {
  .header {
    padding: 20px 24px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>


