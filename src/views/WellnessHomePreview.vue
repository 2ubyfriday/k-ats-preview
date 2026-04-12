<template>
  <main class="preview-page" :class="{ 'is-nds-wellness': currentScreen === 6 }">
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

          <section v-else-if="currentScreen === 6" class="nds-wellness-screen6" aria-label="nDS Health 홈">
            <Transition name="w6-panel" mode="out-in">
              <!-- 1페이지: 홈 -->
              <div v-if="screen6Panel === 'home'" key="s6-home" class="w6-stack">
                <header class="nds-appbar">
                  <span class="nds-brand">nDS Health</span>
                  <div class="nds-appbar-actions">
                    <button
                      type="button"
                      class="nds-toggle"
                      :class="{ on: homeToggle }"
                      aria-label="건강경영 모드"
                      @click="homeToggle = !homeToggle"
                    >
                      <span class="nds-toggle-text">건강경영</span>
                      <span class="nds-toggle-knob" />
                    </button>
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
                </div>

                <button type="button" class="nds-announce">
                  <span class="nds-announce-ico" aria-hidden="true">📢</span>
                  <span class="nds-announce-text">새로운 건강 미션이 도착했습니다. 오늘의 미션을 확인해 보세요.</span>
                  <span class="nds-chevron" aria-hidden="true">›</span>
                </button>

                <article class="w6-mission-card card">
                  <div class="w6-mission-card-top">
                    <span class="w6-d28">D-28</span>
                  </div>
                  <h2 class="w6-mission-heading">혈당 10mg/dL 낮춰보기!</h2>
                  <p class="w6-mission-tags"># 할만해요 · # 식사, 운동 위주</p>
                  <div class="w6-mission-cta-wrap">
                    <span class="w6-new-pill" aria-hidden="true">New</span>
                    <button type="button" class="w6-mission-link" @click="goScreen6Mission">
                      오늘의 미션 바로가기
                      <span class="w6-chev">›</span>
                    </button>
                  </div>
                  <p class="w6-mission-sub">▶ 오늘 수행하지 않은 미션이 5개 있어요 :)</p>
                </article>

                <article class="w6-ticker card" aria-live="polite">
                  <Transition name="w6-tick" mode="out-in">
                    <div :key="tickerIndex" class="w6-ticker-body">
                      <div class="w6-ticker-row">
                        <span class="w6-ticker-label">{{ healthTickerItems[tickerIndex].label }}</span>
                        <span class="w6-ticker-num">{{ healthTickerItems[tickerIndex].value }}</span>
                        <span
                          v-if="healthTickerItems[tickerIndex].delta"
                          class="w6-ticker-delta"
                          :class="healthTickerItems[tickerIndex].up ? 'is-up' : 'is-down'"
                        >
                          {{ healthTickerItems[tickerIndex].delta }}
                        </span>
                      </div>
                      <p class="w6-ticker-note">{{ healthTickerItems[tickerIndex].note }}</p>
                    </div>
                  </Transition>
                </article>

                <div class="w6-quick-row">
                  <button type="button" class="w6-quick-tile">컨텐츠 / 다양한 건강정보</button>
                  <button type="button" class="w6-quick-tile">1:1 문의 / 전담코치에게 문의</button>
                </div>

                <button type="button" class="w6-primary-mission-btn" @click="goScreen6Mission">오늘의 미션</button>
              </div>

              <!-- 2페이지: 미션 -->
              <div v-else key="s6-mission" class="w6-stack">
                <header class="nds-appbar">
                  <span class="nds-brand">nDS Health</span>
                  <div class="nds-appbar-actions">
                    <button
                      type="button"
                      class="nds-toggle"
                      :class="{ on: homeToggle }"
                      aria-label="건강경영 모드"
                      @click="homeToggle = !homeToggle"
                    >
                      <span class="nds-toggle-text">건강경영</span>
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

                <div class="w6-mp-head">
                  <span class="w6-mp-mission-label">미션</span>
                  <div class="w6-mp-head-right">
                    <span class="w6-chart-ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" stroke-width="1.8">
                        <path d="M5 19V9M10 19V5M15 19v-6M20 19v-3" stroke-linecap="round" />
                      </svg>
                    </span>
                    <span class="w6-d28">D-28</span>
                  </div>
                </div>
                <p class="w6-mp-line">혈당 10mg/dL 낮춰보기!</p>
                <button type="button" class="w6-purple-mission" @click="focusMissionCarousel">오늘의 미션</button>

                <div ref="missionCarouselEl" class="w6-carousel" role="region" aria-label="미션 카드">
                  <article v-for="card in missionSwipeCards" :key="card.id" class="w6-carousel-card card">
                    <p class="w6-c-tag">{{ card.tag }}</p>
                    <h3 class="w6-c-title">{{ card.title }}</h3>
                    <div class="w6-c-img">image</div>
                  </article>
                </div>

                <div class="w6-record-bar">
                  <span class="w6-record-txt">기록</span>
                  <button
                    type="button"
                    class="w6-back-home"
                    aria-label="이전 화면(홈)으로"
                    @click="screen6Panel = 'home'"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M3 10.5 12 3l9 7.5M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition>
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

    <nav v-if="currentScreen !== 6" class="bottom-nav">
      <button
        v-for="item in bottomNav"
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNav === item.id }"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            v-if="item.id === 'management'"
            d="M4 19V10M9 19V6M14 19v-8M19 19v-4"
          />
          <path
            v-else-if="item.id === 'program'"
            d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 10h8M8 14h5"
          />
          <path
            v-else-if="item.id === 'record'"
            d="M12 3v18M4 12h16M6 6h4v4H6zM14 14h4v4h-4z"
          />
          <path
            v-else-if="item.id === 'med'"
            d="M8 7l9 9M10 5l9 9M6.8 11.2a4 4 0 1 1 5.7-5.7l1.4 1.4a4 4 0 1 1-5.7 5.7zM14.2 18.8a4 4 0 1 1 5.7-5.7l-1.4-1.4a4 4 0 1 1-5.7 5.7z"
          />
          <path
            v-else
            d="M6 7h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-6l-4 3v-3H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
          />
        </svg>
        {{ item.label }}
      </button>
    </nav>
  </main>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const totalScreens = 8
const route = useRoute()
const router = useRouter()
const transitionName = ref('slide-forward')
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
  { id: 'management', label: '건강경영' },
  { id: 'program', label: '프로그램' },
  { id: 'record', label: '기록' },
  { id: 'med', label: '복약' },
  { id: 'consult', label: '상담' }
]

const activeNav = computed(() => {
  if (currentScreen.value === 7) return 'program'
  if (currentScreen.value === 8) return 'consult'
  if (currentScreen.value === 5) return 'record'
  return 'management'
})

/** /wellness-flow/6: 홈 ↔ 미션 전환 (웰니스 전용, 스포츠 앱과 무관) */
const screen6Panel = ref('home')
const homeToggle = ref(true)
const tickerIndex = ref(0)
const missionCarouselEl = ref(null)

const healthTickerItems = [
  {
    label: '혈당',
    value: '120 mg/dL',
    delta: '▲ 1.2',
    up: true,
    note: '▶ 지난주대비 혈당이 상승했어요. 주의가 필요해요.'
  },
  {
    label: '혈압',
    value: '120 mmHg',
    delta: '▲ 2.3 상승',
    up: true,
    note: '▶ 수축기 혈압이 소폭 올랐어요. 나트륨 섭취를 한 번 점검해 보세요.'
  },
  {
    label: '체중',
    value: '72 kg',
    delta: '▼ 0.4',
    up: false,
    note: '▶ 지난주보다 소폭 감소했어요. 지금 리듬을 유지해 보세요.'
  }
]

const missionSwipeCards = [
  { id: 'm1', tag: '#식사', title: '30분이상 꼭꼭 씹어먹기' },
  { id: 'm2', tag: '#수면', title: '하루 6시간 이상 자기' },
  { id: 'm3', tag: '#활동', title: '식후 10분 가볍게 걷기' }
]

let tickerTimer = null

const clearHealthTicker = () => {
  if (tickerTimer != null) {
    clearInterval(tickerTimer)
    tickerTimer = null
  }
}

const syncHealthTicker = () => {
  clearHealthTicker()
  if (currentScreen.value !== 6 || screen6Panel.value !== 'home') return
  tickerTimer = window.setInterval(() => {
    tickerIndex.value = (tickerIndex.value + 1) % healthTickerItems.length
  }, 4200)
}

const goScreen6Mission = () => {
  screen6Panel.value = 'mission'
}

const focusMissionCarousel = () => {
  missionCarouselEl.value?.scrollTo({ left: 0, behavior: 'smooth' })
}

watch(
  () => [currentScreen.value, screen6Panel.value],
  () => {
    if (currentScreen.value !== 6) {
      screen6Panel.value = 'home'
      tickerIndex.value = 0
    }
    syncHealthTicker()
  },
  { immediate: true }
)

onUnmounted(() => clearHealthTicker())

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

.preview-page.is-nds-wellness {
  background: #f2f4f8;
}

.phone-shell {
  width: min(100%, 375px);
  margin: 0 auto;
  padding: 16px 14px 112px;
}

.phone-shell.home-only {
  padding-top: 8px;
  padding-bottom: 28px;
}

/* —— /wellness-flow/6 nDS Health (웰니스 전용 UI) —— */
.nds-wellness-screen6 {
  min-height: 60vh;
}

.w6-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
}

.w6-panel-enter-active,
.w6-panel-leave-active {
  transition: opacity 0.22s ease;
}

.w6-panel-enter-from,
.w6-panel-leave-to {
  opacity: 0;
}

.w6-tick-enter-active,
.w6-tick-leave-active {
  transition: opacity 0.32s ease, transform 0.32s ease;
}

.w6-tick-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.w6-tick-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.w6-mission-card {
  padding: 16px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

.w6-mission-card-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.w6-d28 {
  font-size: 14px;
  font-weight: 800;
  color: #6366f1;
}

.w6-mission-heading {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
}

.w6-mission-tags {
  margin: 0 0 14px;
  font-size: 13px;
  color: #6b7280;
}

.w6-mission-cta-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.w6-new-pill {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  background: #ef4444;
  padding: 3px 8px;
  border-radius: 6px;
  line-height: 1;
}

.w6-mission-link {
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 15px;
  font-weight: 700;
  color: #4f46e5;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.w6-chev {
  font-size: 18px;
  font-weight: 300;
  color: #9ca3af;
}

.w6-mission-sub {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
}

.w6-ticker {
  padding: 16px 14px;
  border-radius: 16px;
  border: 1px solid #eef0f4;
  min-height: 108px;
  overflow: hidden;
}

.w6-ticker-body {
  min-height: 76px;
}

.w6-ticker-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
  margin-bottom: 8px;
}

.w6-ticker-label {
  font-size: 14px;
  font-weight: 800;
  color: #374151;
}

.w6-ticker-num {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111827;
  line-height: 1;
}

.w6-ticker-delta {
  font-size: 16px;
  font-weight: 800;
}

.w6-ticker-delta.is-up {
  color: #dc2626;
}

.w6-ticker-delta.is-down {
  color: #2563eb;
}

.w6-ticker-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #4b5563;
}

.w6-quick-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.w6-quick-tile {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  padding: 14px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  line-height: 1.35;
  text-align: center;
  cursor: pointer;
  min-height: 64px;
}

.w6-primary-mission-btn {
  width: 100%;
  margin-top: 4px;
  padding: 14px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
}

.w6-mp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px 0;
}

.w6-mp-mission-label {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.w6-mp-head-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.w6-chart-ico {
  display: flex;
  align-items: center;
}

.w6-mp-line {
  margin: 4px 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.w6-purple-mission {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 8px;
}

.w6-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 4px 2px 12px;
  scrollbar-width: thin;
}

.w6-carousel::-webkit-scrollbar {
  height: 4px;
}

.w6-carousel-card {
  flex: 0 0 78%;
  min-width: 78%;
  scroll-snap-align: center;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.w6-c-tag {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: #6366f1;
}

.w6-c-title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.35;
  color: #111827;
}

.w6-c-img {
  height: 120px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #9ca3af;
  font-weight: 600;
}

.w6-record-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 4px 8px;
  border-top: 1px solid #e5e7eb;
  margin-top: 4px;
}

.w6-record-txt {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
}

.w6-back-home {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.w6-back-home:active {
  background: #eef2ff;
}

/* —— nDS Health home (screen 6) —— */
.nds-home {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nds-appbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px 8px;
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
  width: 112px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #e5e7eb;
  padding: 2px 3px;
  position: relative;
  transition: background 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.nds-toggle.on {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-color: #4f46e5;
}

.nds-toggle-text {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  margin-left: 8px;
  line-height: 1;
}

.nds-toggle.on .nds-toggle-text {
  color: #fff;
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
  transform: translateX(0);
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

.nds-metric-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.nds-metric-tabs::-webkit-scrollbar {
  display: none;
}

.nds-metric-tab {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  padding: 6px 14px;
  border-radius: 12px;
  transition: all 0.18s ease;
}

.nds-metric-tab.active {
  color: #111827;
  border-color: #c7d2fe;
  background: #eef2ff;
  box-shadow: inset 0 -2px 0 #6366f1;
}

.nds-metric-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.nds-metric-carousel::-webkit-scrollbar {
  display: none;
}

.nds-metric-slide {
  flex: 0 0 100%;
  min-width: 100%;
  scroll-snap-align: start;
  position: relative;
  padding: 4px 8px 8px;
}

.nds-metric-glucose {
  padding-bottom: 10px;
}

.nds-metric-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.nds-metric-label {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111827;
}

.nds-refresh {
  border: 0;
  background: transparent;
  color: #9ca3af;
  padding: 0;
  display: flex;
  align-items: center;
}

.nds-metric-right {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.nds-metric-time {
  font-size: 13px;
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
  font-weight: 700;
  color: #111827;
  padding: 0;
  margin-bottom: 6px;
}

.nds-caret {
  font-size: 10px;
  color: #6b7280;
}

.nds-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 2px 0 4px;
}

.nds-value-wrap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.nds-value-row.meal {
  margin-top: 8px;
}

.nds-value-num {
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #111827;
  line-height: 1;
}

.nds-value-unit {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
}

.nds-status-side {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-top: 4px;
  flex-shrink: 0;
}

.nds-status-side.danger {
  color: #dc2626;
}

.nds-status-side.warn {
  color: #d97706;
}

.nds-macros {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.nds-macro-chip {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  padding: 5px 8px;
  border-radius: 8px;
}

.nds-glucose-accent {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #e879f9, #a855f7, #6366f1);
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
  align-items: flex-start;
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
  text-align: center;
}

.nds-goal-rate-title {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 8px;
}

.nds-gauge-wrap {
  position: relative;
  width: 74px;
  height: 74px;
  margin: 0 auto;
}

.nds-gauge-svg {
  width: 74px;
  height: 74px;
  transform: rotate(-90deg);
}

.nds-gauge-track {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.nds-gauge-value {
  fill: none;
  stroke: #2563eb;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.25s ease;
}

.nds-gauge-pct {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.nds-gauge-label {
  margin: 6px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
}

.nds-mission-section {
  margin-top: 4px;
}

.nds-mission-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: -2px 0 8px;
}

.nds-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #d1d5db;
}

.nds-dot.active {
  width: 18px;
  background: #6366f1;
}

.nds-mission-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.nds-mission-scroll::-webkit-scrollbar {
  display: none;
}

.nds-mission-card {
  flex: 0 0 100%;
  min-width: 100%;
  scroll-snap-align: start;
  padding: 16px;
  border: 1px solid #eef0f4;
  cursor: pointer;
}

.nds-mission-placeholder {
  min-height: 48px;
  margin: 0 0 16px;
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
}

.nds-mission-btns {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.nds-btn-outline {
  width: 102px;
  padding: 9px 10px;
  border-radius: 12px;
  border: 2px solid #6366f1;
  background: #fff;
  color: #6366f1;
  font-size: 14px;
  font-weight: 700;
}

.nds-btn-solid {
  width: 102px;
  padding: 9px 10px;
  border-radius: 12px;
  border: 0;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.nds-mission-tag {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  margin: 0 0 6px;
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
  grid-template-columns: repeat(5, 1fr);
  padding: 8px 8px 12px;
}

.nav-item {
  border: 0;
  background: transparent;
  font-size: 10px;
  font-weight: 700;
  color: #8290a3;
  padding: 5px 2px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.nav-item.active {
  color: #2563eb;
  background: #eff6ff;
}

.nav-icon {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
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
