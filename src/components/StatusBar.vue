<template>
  <div class="status-bar">
    <div class="status-left">
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'StatusBar',
  setup() {
    const currentTime = ref('9:41')
    
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
    }
    
    let timeInterval
    
    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 60000) // 1분마다 업데이트
    })
    
    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })
    
    return {
      currentTime
    }
  }
}
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  height: 44px;
  background-color: #ffffff;
}

.status-left {
  display: flex;
  align-items: center;
}

.time {
  color: #000000;
}

@media (min-width: 768px) {
  .status-bar {
    padding: 12px 20px;
  }
}
</style>


