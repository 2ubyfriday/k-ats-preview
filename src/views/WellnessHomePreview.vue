<template>
  <main class="preview-page" :class="{ 'is-nds-home': currentScreen === 6 }">
    <section class="phone-shell" :class="{ 'home-only': currentScreen === 6 }">
      <section v-if="currentScreen !== 6" class="flow-header card">
        <p class="flow-title">기업 건강관리 UX 플로우</p>
        <p class="flow-sub">온보딩부터 프로그램 참여까지 8개 주요 화면</p>
        <div class="flow-steps">
          <button
            v-for="step in totalScreens"
            :key="step"
            class="step-chip"
            :class="{ active: currentScreen === step }"
            @click="goToScreen(step)"
          >
            {{ step }}
          </button>
        </div>
      </section>

      <Transition :name="transitionName" mode="out-in">
        <section :key="currentScreen">
          <section v-if="currentScreen === 1" class="card">
            <p class="screen-label">SCREEN 1 · ONBOARDING WELCOME</p>
            <h2 class="headline">건강검진 데이터를 기반으로 맞춤 건강관리를 시작하세요.</h2>
            <p class="body-text">당신의 건강 상태를 분석하고 맞춤 건강관리 프로그램을 제공합니다.</p>
            <button class="primary-btn" @click="nextScreen">Start</button>
          </section>

          <section v-else-if="currentScreen === 2" class="card">
            <p class="screen-label">SCREEN 2 · SERVICE VALUE INTRODUCTION</p>
            <h2 class="headline">서비스 핵심 가치를 확인해보세요</h2>
            <div class="value-grid">
              <article v-for="item in valueCards" :key="item.title" class="value-card">
                <p class="value-title">{{ item.title }}</p>
                <p class="value-desc">{{ item.desc }}</p>
              </article>
            </div>
            <button class="primary-btn" @click="nextScreen">Continue</button>
          </section>

          <section v-else-if="currentScreen === 3" class="card">
            <p class="screen-label">SCREEN 3 · HEALTH CHECKUP DATA IMPORT</p>
            <h2 class="headline">건강검진 데이터를 가져오면 당신의 건강 상태를 정확히 분석할 수 있습니다.</h2>
            <div class="import-list">
              <button
                v-for="option in importOptions"
                :key="option.id"
                class="import-item"
                :class="{ active: selectedImport === option.id }"
                @click="selectedImport = option.id"
              >
                <p class="import-title">{{ option.title }}</p>
                <p class="import-desc">{{ option.desc }}</p>
              </button>
            </div>
            <button class="primary-btn" @click="nextScreen">Import Health Data</button>
          </section>

          <section v-else-if="currentScreen === 4" class="card">
            <p class="screen-label">SCREEN 4 · HEALTH DATA ANALYSIS</p>
            <h2 class="headline">건강 데이터를 분석하고 있습니다.</h2>
            <div class="analysis-box">
              <div class="spinner"></div>
              <p class="body-text center">건강지표를 불러오고 위험도를 계산하는 중입니다.</p>
            </div>
            <button class="primary-btn" @click="nextScreen">분석 결과 보기</button>
          </section>

          <section v-else-if="currentScreen === 5" class="card">
            <p class="screen-label">SCREEN 5 · HEALTH RISK CLASSIFICATION</p>
            <h2 class="headline">건강 위험도 분류 결과</h2>
            <div class="risk-chart">
              <div class="risk-track"></div>
              <div class="risk-stops">
                <span v-for="(label, idx) in riskLabels" :key="label" :class="{ active: idx === riskIndex }">
                  {{ label }}
                </span>
              </div>
              <div class="risk-pointer" :style="{ left: `${(riskIndex / (riskLabels.length - 1)) * 100}%` }"></div>
            </div>
            <article class="highlight-box">
              <p class="score-text">Health Score <strong>74</strong></p>
              <p class="risk-text-main">C 단계 · 생활습관 개선 권장</p>
              <p class="body-text">지금 관리하면 건강 상태를 충분히 개선할 수 있습니다.</p>
            </article>
            <button class="primary-btn" @click="nextScreen">View Recommended Program</button>
          </section>

          <section v-else-if="currentScreen === 6" class="nds-home">
            <div class="nds-status" aria-hidden="true">
              <span>9:41</span>
              <span class="nds-status-icons">
                <span class="nds-signal" />
                <span class="nds-wifi" />
                <span class="nds-battery" />
              </span>
            </div>

            <header class="nds-appbar">
              <span class="nds-brand">nDS Health</span>
              <div class="nds-appbar-actions">
                <button
                  type="button"
                  class="nds-toggle"
                  :class="{ on: homeToggle }"
                  aria-label="모드 전환"
                  @click="homeToggle = !homeToggle"
                >
                  <span class="nds-toggle-knob" />
                </button>
                <button type="button" class="nds-icon-circle" aria-label="알림">
                  <svg class="nds-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path
                      d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1z"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div class="nds-subbar">
              <span class="nds-subbar-title">홈</span>
              <div class="nds-subbar-right">
                <span class="nds-subbar-divider" aria-hidden="true" />
                <div class="nds-subbar-icons">
                  <button type="button" class="nds-icon-plain" aria-label="블루투스">
                    <svg class="nds-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path
                        d="M12 3v7l4-3-4-4zm0 7l-4 3 4 4v-7zm0 7v5M8.5 8.5l7 7M15.5 8.5l-7 7"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button type="button" class="nds-icon-plain" aria-label="설정">
                    <svg class="nds-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path
                        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                        stroke-width="1.5"
                      />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button type="button" class="nds-announce">
              <span class="nds-announce-ico" aria-hidden="true">📢</span>
              <span class="nds-announce-text">
                공지가 있다면 이곳에 텍스트로 노출. 선택 가능. 한줄만...
              </span>
              <span class="nds-chevron" aria-hidden="true">›</span>
            </button>

            <article class="nds-metric-card card">
              <div class="nds-metric-grid">
                <div class="nds-metric-col nds-metric-glucose">
                  <div class="nds-metric-head">
                    <span class="nds-metric-label">혈당</span>
                    <button type="button" class="nds-refresh" aria-label="새로고침">
                      <svg class="nds-svg-sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M4 12a8 8 0 0 1 14.5-4M20 12a8 8 0 0 1-14.5 4M4 12h3m13 0h-3M12 4v3m0 13v-3"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                    <span class="nds-metric-time">방금 전</span>
                  </div>
                  <button type="button" class="nds-dropdown">
                    공복혈당
                    <span class="nds-caret">▼</span>
                  </button>
                  <p class="nds-value-row">
                    <span class="nds-value-num">140</span>
                    <span class="nds-value-unit">mg/dL</span>
                  </p>
                  <p class="nds-status-tag danger">높음</p>
                  <div class="nds-glucose-accent" aria-hidden="true" />
                </div>
                <div class="nds-metric-divider" aria-hidden="true" />
                <div class="nds-metric-col">
                  <div class="nds-metric-head">
                    <span class="nds-metric-label">식사</span>
                    <button type="button" class="nds-refresh" aria-label="새로고침">
                      <svg class="nds-svg-sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M4 12a8 8 0 0 1 14.5-4M20 12a8 8 0 0 1-14.5 4M4 12h3m13 0h-3M12 4v3m0 13v-3"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                        />
                      </svg>
                    </button>
                    <span class="nds-metric-time">방금 전</span>
                  </div>
                  <p class="nds-value-row meal">
                    <span class="nds-value-num">1,200</span>
                    <span class="nds-value-unit">kcal</span>
                  </p>
                  <div class="nds-macros">
                    <span class="nds-macro-chip">탄 400g</span>
                    <span class="nds-macro-chip">당 10g</span>
                  </div>
                </div>
              </div>
              <div class="nds-metric-foot">
                <div class="nds-tags">
                  <span># 혈당 상승</span>
                  <span># 식사유의</span>
                </div>
                <div class="nds-chart-icons">
                  <button type="button" class="nds-mini-chart" aria-label="막대 차트">
                    <svg viewBox="0 0 24 24" class="nds-svg-sm" aria-hidden="true">
                      <path d="M5 19V9M10 19V5M15 19v-6M20 19v-3" fill="none" stroke="currentColor" stroke-width="1.8" />
                    </svg>
                  </button>
                  <button type="button" class="nds-mini-chart" aria-label="추이 차트">
                    <svg viewBox="0 0 24 24" class="nds-svg-sm" aria-hidden="true">
                      <path d="M4 16l4-4 4 3 8-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            <article class="nds-coach card">
              <h3 class="nds-section-title">1:1 건강코치 코멘트</h3>
              <p class="nds-coach-body">
                식후에 혈당이 조금 높게 올라간 게 보여요. 오늘 식사에서 탄수화물이 조금 많았을 수도 있어서, 다음에는 양을 살짝만 조절해 보시면 좋을 것 같아요.
              </p>
            </article>

            <article class="nds-goal card">
              <div class="nds-goal-left">
                <p class="nds-goal-d">D-28</p>
                <p class="nds-goal-name">홍길동 님</p>
                <p class="nds-goal-target">혈당 10 mg/dL 낮추기</p>
                <p class="nds-goal-week">1주차</p>
              </div>
              <div class="nds-goal-gauge">
                <div class="nds-gauge-wrap">
                  <div class="nds-gauge-arc" aria-hidden="true">
                    <div class="nds-gauge-disk" />
                  </div>
                  <div class="nds-gauge-center">
                    <span class="nds-gauge-pct">0%</span>
                    <span class="nds-gauge-label">오늘 달성률</span>
                  </div>
                </div>
              </div>
            </article>

            <section class="nds-mission-section">
              <h3 class="nds-section-title">오늘의 미션</h3>
              <div class="nds-mission-scroll">
                <article class="nds-mission-card card">
                  <p class="nds-mission-placeholder">오늘의 미션 내용이 이곳에 표시됩니다.</p>
                  <div class="nds-mission-btns">
                    <button type="button" class="nds-btn-outline">아니오</button>
                    <button type="button" class="nds-btn-solid">네</button>
                  </div>
                </article>
                <article class="nds-mission-card card nds-mission-peek">
                  <p class="nds-mission-tag"># 수면</p>
                  <p class="nds-mission-peek-text">오늘은...</p>
                </article>
              </div>
            </section>
          </section>

          <section v-else-if="currentScreen === 7" class="card">
            <p class="screen-label">SCREEN 7 · PROGRAM DASHBOARD</p>
            <h2 class="headline">프로그램 진행 현황</h2>
            <p class="program-progress">Week 2 of 4 · 완료율 45%</p>
            <div class="progress-track">
              <div class="progress-fill" style="width: 45%"></div>
            </div>
            <div class="program-board">
              <article v-for="item in programBoard" :key="item.name" class="board-item">
                <p class="board-name">{{ item.name }}</p>
                <p class="board-value">{{ item.value }}</p>
              </article>
            </div>
            <button class="primary-btn" @click="nextScreen">상담 지원 보기</button>
          </section>

          <section v-else class="card">
            <p class="screen-label">SCREEN 8 · CONSULTATION SUPPORT</p>
            <h2 class="headline">전문가 상담 지원</h2>
            <p class="body-text">
              전문가 상담을 통해 건강관리를 시작해보세요.
              고위험군 사용자는 간호사/영양사 상담과 연계됩니다.
            </p>
            <button class="primary-btn">Request Consultation</button>
          </section>
        </section>
      </Transition>

      <section v-if="currentScreen !== 6" class="flow-actions card">
        <button class="ghost-btn" :disabled="currentScreen === 1" @click="prevScreen">이전</button>
        <button class="ghost-btn" :disabled="currentScreen === totalScreens" @click="nextScreen">다음</button>
      </section>
    </section>

    <nav class="bottom-nav">
      <button
        v-for="item in bottomNav"
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNav === item.id }"
      >
        {{ item.label }}
      </button>
    </nav>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const totalScreens = 8
const route = useRoute()
const router = useRouter()
const transitionName = ref('slide-forward')
const homeToggle = ref(false)
const selectedImport = ref('corp')
const riskLabels = ['A', 'C', 'D', 'High Risk']
const riskIndex = 1

const currentScreen = computed(() => {
  const parsed = Number(route.params.step)
  if (!Number.isFinite(parsed)) return 1
  if (parsed < 1) return 1
  if (parsed > totalScreens) return totalScreens
  return parsed
})

const valueCards = [
  { title: '맞춤형 건강분석', desc: '검진 데이터를 기반으로 현재 건강상태를 파악합니다.' },
  { title: '생활습관 개선 가이드', desc: '실행 가능한 식단/운동 가이드를 제공합니다.' },
  { title: '건강관리 프로그램', desc: '위험도별 맞춤 프로그램을 단계적으로 운영합니다.' },
  { title: '전문가 코칭', desc: '필요 시 상담 연결로 지속 관리가 가능합니다.' }
]

const importOptions = [
  { id: 'corp', title: '사내 건강검진 데이터 가져오기', desc: '내부 시스템 데이터 자동 연동' },
  { id: 'national', title: '국가건강검진 데이터 가져오기', desc: '공공 검진결과 데이터 연동' },
  { id: 'file', title: '건강검진 파일 업로드', desc: 'PDF/이미지 파일 직접 업로드' }
]

const indicators = [
  { name: 'Blood Sugar', value: '112 mg/dL', interpretation: '경계 수치', statusClass: 'warn' },
  { name: 'HbA1c', value: '6.0 %', interpretation: '관리 필요', statusClass: 'warn' },
  { name: 'BMI', value: '24.7', interpretation: '과체중 경계', statusClass: 'warn' },
  { name: 'Weight Change', value: '+1.8 kg / 3개월', interpretation: '증가 추세', statusClass: 'warn' }
]

const todayMissions = [
  { id: 1, text: '20분 걷기', done: true },
  { id: 2, text: '오늘 식사 기록', done: false },
  { id: 3, text: '건강 데이터 기록', done: false }
]

const programBoard = [
  { name: '이번 주 미션 완료', value: '5 / 11' },
  { name: '평균 걸음 수', value: '8,420 보' },
  { name: '식사 기록률', value: '62%' },
  { name: '혈당 기록일', value: '주 4회' }
]

const bottomNav = [
  { id: 'home', label: 'Home' },
  { id: 'management', label: 'Health Management' },
  { id: 'checkup', label: 'Checkup Results' },
  { id: 'mypage', label: 'My Page' }
]

const activeNav = computed(() => {
  if (currentScreen.value === 6) return 'home'
  if (currentScreen.value === 7) return 'management'
  if (currentScreen.value === 8) return 'mypage'
  if (currentScreen.value === 5) return 'checkup'
  return 'home'
})

watch(
  () => route.params.step,
  (step) => {
    const parsed = Number(step)
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > totalScreens) {
      router.replace({ name: 'WellnessFlowStep', params: { step: '1' } })
    }
  },
  { immediate: true }
)

watch(
  currentScreen,
  (next, prev) => {
    transitionName.value = next >= prev ? 'slide-forward' : 'slide-back'
  }
)

const goToScreen = (step) => {
  const safeStep = Math.min(totalScreens, Math.max(1, step))
  transitionName.value = safeStep > currentScreen.value ? 'slide-forward' : 'slide-back'
  router.push({ name: 'WellnessFlowStep', params: { step: String(safeStep) } })
}

const nextScreen = () => {
  if (currentScreen.value < totalScreens) {
    goToScreen(currentScreen.value + 1)
  }
}

const prevScreen = () => {
  if (currentScreen.value > 1) {
    goToScreen(currentScreen.value - 1)
  }
}
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef4ff 0%, #f6f8ff 44%, #f8faff 100%);
  color: #181b20;
}

.preview-page.is-nds-home {
  background: #f2f4f8;
}

.phone-shell {
  width: min(100%, 375px);
  margin: 0 auto;
  padding: 16px 14px 112px;
}

.phone-shell.home-only {
  padding-top: 8px;
}

/* —— nDS Health home (screen 6) —— */
.nds-home {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nds-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #111827;
}

.nds-status-icons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nds-signal {
  width: 18px;
  height: 10px;
  border-radius: 2px;
  background: linear-gradient(90deg, #111 0 20%, transparent 20% 40%, #111 40% 60%, transparent 60% 80%, #111 80%);
  opacity: 0.85;
}

.nds-wifi {
  width: 14px;
  height: 10px;
  border: 2px solid #111;
  border-top: none;
  border-radius: 0 0 10px 10px;
  opacity: 0.85;
}

.nds-battery {
  width: 22px;
  height: 10px;
  border: 1.5px solid #111;
  border-radius: 2px;
  position: relative;
  opacity: 0.85;
}

.nds-battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 2px;
  width: 2px;
  height: 6px;
  background: #111;
  border-radius: 0 1px 1px 0;
}

.nds-appbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px 10px;
}

.nds-brand {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
}

.nds-appbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nds-toggle {
  width: 44px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #e5e7eb;
  padding: 2px;
  position: relative;
  transition: background 0.2s ease;
}

.nds-toggle.on {
  background: #c7d2fe;
  border-color: #a5b4fc;
}

.nds-toggle-knob {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
}

.nds-toggle.on .nds-toggle-knob {
  transform: translateX(18px);
}

.nds-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
}

.nds-svg {
  width: 22px;
  height: 22px;
}

.nds-svg-sm {
  width: 18px;
  height: 18px;
}

.nds-subbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 12px;
  gap: 12px;
}

.nds-subbar-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111827;
}

.nds-subbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nds-subbar-divider {
  width: 1px;
  height: 22px;
  background: #e5e7eb;
  flex-shrink: 0;
}

.nds-subbar-icons {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nds-icon-plain {
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.nds-icon-plain:active {
  background: #e5e7eb;
}

.nds-announce {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 0;
  border-radius: 14px;
  background: #e8eaef;
  text-align: left;
  margin-bottom: 2px;
}

.nds-announce-ico {
  font-size: 16px;
  flex-shrink: 0;
}

.nds-announce-text {
  flex: 1;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nds-chevron {
  font-size: 18px;
  color: #9ca3af;
  font-weight: 300;
}

.nds-metric-card {
  padding: 14px 14px 12px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
  border: 1px solid #eef0f4;
}

.nds-metric-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  align-items: stretch;
}

.nds-metric-col {
  padding: 4px 8px 8px;
  position: relative;
}

.nds-metric-glucose {
  padding-bottom: 10px;
}

.nds-metric-divider {
  width: 1px;
  background: #eceef2;
  margin: 4px 0 8px;
}

.nds-metric-head {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.nds-metric-label {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.nds-refresh {
  border: 0;
  background: transparent;
  color: #9ca3af;
  padding: 2px;
  display: flex;
  align-items: center;
}

.nds-metric-time {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
}

.nds-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  padding: 0;
  margin-bottom: 6px;
}

.nds-caret {
  font-size: 9px;
  color: #9ca3af;
}

.nds-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 2px 0 4px;
}

.nds-value-row.meal {
  margin-top: 28px;
}

.nds-value-num {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111827;
  line-height: 1;
}

.nds-value-unit {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.nds-status-tag {
  font-size: 14px;
  font-weight: 700;
}

.nds-status-tag.danger {
  color: #dc2626;
}

.nds-glucose-accent {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e879f9, #a855f7, #6366f1);
}

.nds-macros {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.nds-macro-chip {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 5px 8px;
  border-radius: 8px;
}

.nds-metric-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}

.nds-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
}

.nds-chart-icons {
  display: flex;
  gap: 4px;
}

.nds-mini-chart {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nds-section-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #111827;
  margin: 0 0 8px;
}

.nds-coach {
  padding: 16px;
  border: 1px solid #eef0f4;
}

.nds-coach-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #4b5563;
}

.nds-goal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid #eef0f4;
}

.nds-goal-d {
  font-size: 13px;
  font-weight: 700;
  color: #6366f1;
  margin: 0 0 4px;
}

.nds-goal-name {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 6px;
}

.nds-goal-target {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 4px;
  line-height: 1.35;
}

.nds-goal-week {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.nds-goal-gauge {
  flex-shrink: 0;
}

.nds-gauge-wrap {
  position: relative;
  width: 118px;
  height: 72px;
}

.nds-gauge-arc {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 58px;
  overflow: hidden;
  pointer-events: none;
}

.nds-gauge-disk {
  width: 116px;
  height: 116px;
  border-radius: 50%;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  bottom: -58px;
  transform: translateX(-50%);
  background: conic-gradient(
    from 180deg at 50% 50%,
    #facc15 0deg 58deg,
    #4ade80 58deg 116deg,
    #1e3a8a 116deg 180deg,
    #e5e7eb 180deg 360deg
  );
}

.nds-gauge-center {
  position: absolute;
  left: 50%;
  bottom: 4px;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
}

.nds-gauge-pct {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  line-height: 1.1;
}

.nds-gauge-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
}

.nds-mission-section {
  margin-top: 4px;
}

.nds-mission-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.nds-mission-scroll::-webkit-scrollbar {
  height: 4px;
}

.nds-mission-card {
  flex: 0 0 calc(100% - 48px);
  min-width: calc(100% - 48px);
  scroll-snap-align: start;
  padding: 16px;
  border: 1px solid #eef0f4;
}

.nds-mission-peek {
  flex: 0 0 72px;
  min-width: 72px;
  opacity: 0.92;
  background: #fafafa;
}

.nds-mission-placeholder {
  min-height: 56px;
  margin: 0 0 16px;
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
}

.nds-mission-btns {
  display: flex;
  gap: 10px;
}

.nds-btn-outline {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #6366f1;
  background: #fff;
  color: #6366f1;
  font-size: 15px;
  font-weight: 700;
}

.nds-btn-solid {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 0;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.nds-mission-tag {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  margin: 0 0 6px;
}

.nds-mission-peek-text {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 6px 20px rgba(43, 58, 104, 0.08);
}

.flow-header {
  background: linear-gradient(135deg, #edf3ff 0%, #f5f3ff 100%);
}

.flow-title {
  font-size: 16px;
  font-weight: 800;
}

.flow-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #627086;
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  margin-top: 12px;
}

.step-chip {
  border: 1px solid #d8e2f4;
  background: #fff;
  color: #64738b;
  font-size: 11px;
  font-weight: 700;
  border-radius: 8px;
  padding: 6px 0;
}

.step-chip.active {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}

.screen-label {
  font-size: 11px;
  font-weight: 700;
  color: #5d6f89;
}

.headline {
  margin-top: 8px;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.body-text {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #5f6f85;
}

.body-text.center {
  text-align: center;
}

.primary-btn {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 13px 12px;
  margin-top: 16px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  background: #2563eb;
}

.ghost-btn {
  flex: 1;
  border: 1px solid #d7e1f0;
  background: #f8fbff;
  color: #3f5471;
  border-radius: 12px;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 700;
}

.ghost-btn:disabled {
  opacity: 0.45;
}

.flow-actions {
  display: flex;
  gap: 8px;
}

.value-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.value-card {
  border: 1px solid #e5edf8;
  border-radius: 14px;
  padding: 12px;
  background: #fafcff;
}

.value-title {
  font-size: 13px;
  font-weight: 800;
}

.value-desc {
  margin-top: 5px;
  font-size: 12px;
  line-height: 1.45;
  color: #607087;
}

.import-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.import-item {
  border: 1px solid #dce6f5;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  text-align: left;
}

.import-item.active {
  border-color: #2563eb;
  background: #f0f6ff;
}

.import-title {
  font-size: 14px;
  font-weight: 800;
}

.import-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #617188;
}

.analysis-box {
  margin-top: 14px;
  border: 1px solid #e4ebf7;
  border-radius: 14px;
  padding: 20px 12px;
}

.spinner {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #dbe8ff;
  border-top-color: #2563eb;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.risk-chart {
  margin-top: 12px;
  position: relative;
}

.risk-track {
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4ade80 0%, #facc15 35%, #fb923c 68%, #ef4444 100%);
}

.risk-stops {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #8291a5;
}

.risk-stops span.active {
  color: #1e293b;
}

.risk-pointer {
  position: absolute;
  top: -4px;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #1d4ed8;
  border: 2px solid #fff;
  box-shadow: 0 1px 8px rgba(29, 78, 216, 0.35);
}

.highlight-box {
  margin-top: 12px;
  border: 1px solid #e0e9f8;
  border-radius: 14px;
  padding: 12px;
  background: #fafcff;
}

.score-text {
  font-size: 14px;
  color: #526279;
}

.score-text strong {
  margin-left: 4px;
  font-size: 26px;
  color: #111827;
}

.risk-text-main {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 800;
}

.screen-stack {
  display: grid;
  gap: 12px;
}

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.28s ease;
}

.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.greeting {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}

.icon-row {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #e2eaf6;
  background: #f7fbff;
}

.card-title {
  font-size: 16px;
  font-weight: 800;
}

.score-big {
  margin-top: 4px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.risk-chart.small {
  margin-top: 10px;
}

.indicator-list {
  display: grid;
  gap: 8px;
}

.indicator-row {
  border: 1px solid #e6edf8;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.indicator-name {
  font-size: 12px;
  color: #63748b;
}

.indicator-value {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 800;
}

.indicator-tag {
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  padding: 4px 8px;
}

.indicator-tag.warn {
  color: #b45309;
  background: #fff3df;
}

.predict-main {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
}

.program-title {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 800;
}

.program-list {
  margin: 8px 0 0;
  padding-left: 18px;
  color: #506077;
  line-height: 1.6;
  font-size: 14px;
}

.mission-list {
  margin-top: 6px;
  padding-left: 0;
  list-style: none;
}

.mission-list li + li {
  margin-top: 8px;
}

.mission-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.program-progress {
  margin-top: 8px;
  font-size: 15px;
  color: #536278;
  font-weight: 700;
}

.progress-track {
  height: 10px;
  border-radius: 999px;
  background: #e8eef9;
  margin-top: 10px;
}

.progress-fill {
  height: 10px;
  border-radius: inherit;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
}

.program-board {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.board-item {
  border: 1px solid #e4ebf7;
  border-radius: 12px;
  padding: 10px;
}

.board-name {
  font-size: 12px;
  color: #6c7d93;
}

.board-value {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 800;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: min(100%, 375px);
  margin: 0 auto;
  background: #fff;
  border-top: 1px solid #e6ecf6;
  box-shadow: 0 -6px 18px rgba(31, 45, 77, 0.08);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 8px 8px 12px;
}

.nav-item {
  border: 0;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  color: #8290a3;
  padding: 6px 2px;
  border-radius: 10px;
}

.nav-item.active {
  color: #2563eb;
  background: #eff6ff;
}

@media (max-width: 420px) {
  .phone-shell {
    width: 100%;
  }

  .flow-steps {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
