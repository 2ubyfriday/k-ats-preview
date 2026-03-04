<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    
    onMounted(() => {
      // 기본 경로가 없으면 사용자 화면으로 리다이렉트
      if (router.currentRoute.value.path === '/') {
        // 이미 '/' 경로이므로 리다이렉트 불필요
      }
    })
    
    return {}
  }
}
</script>

<style scoped>
/* App 컴포넌트는 라우터 뷰만 표시하므로 스타일 불필요 */
</style>
