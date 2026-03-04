<template>
  <div class="admin-login-overlay">
    <div class="admin-login-dialog">
      <h2>Admin 로그인</h2>
      <p class="login-description">관리자만 접근할 수 있습니다.</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="password-input"
            autofocus
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="login-btn">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AdminLogin',
  emits: ['login-success'],
  setup(props, { emit }) {
    const password = ref('')
    const error = ref('')
    
    // 비밀번호는 환경변수나 설정 파일에서 관리하는 것이 좋지만,
    // 간단한 방식으로 여기에 하드코딩 (나중에 변경 가능)
    const ADMIN_PASSWORD = 'ice10311##' // 원하는 비밀번호로 변경하세요
    
    const handleLogin = () => {
      if (password.value === ADMIN_PASSWORD) {
        // 로그인 성공 - 세션 스토리지에 저장 (브라우저 닫으면 로그아웃)
        sessionStorage.setItem('admin_authenticated', 'true')
        emit('login-success')
        error.value = ''
      } else {
        error.value = '비밀번호가 올바르지 않습니다.'
        password.value = ''
      }
    }
    
    return {
      password,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.admin-login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.admin-login-dialog {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.admin-login-dialog h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  text-align: center;
}

.login-description {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666666;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.password-input:focus {
  outline: none;
  border-color: #000000;
}

.error-message {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #ff4444;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #333333;
}

.login-btn:active {
  transform: scale(0.98);
}
</style>




















