<template>
  <main class="preview-page">
    <section class="phone-shell">
      <header class="header">
        <div class="header-left">
          <div class="company-row">
            <div class="tesla-logo" aria-label="nDS Health Program logo">nD</div>
            <div class="company-text">
              <strong>nDS Health Program</strong>
              <span>당신의 건강을 책임집니다</span>
            </div>
          </div>
          <h1>좋은 저녁이에요, 김삼구님 👋</h1>
          <p>기업 건강관리 프로그램 참여 중</p>
          <p class="mode-caption">현재 {{ modeName }}</p>
        </div>
        <div class="header-actions">
          <div class="mode-toggle" role="tablist" aria-label="서비스 모드 선택">
            <button
              class="mode-btn"
              :class="{ active: mode === 'thehealth' }"
              role="tab"
              :aria-selected="mode === 'thehealth'"
              @click="switchMode('thehealth')"
            >
              더헬스모드
            </button>
            <button
              class="mode-btn"
              :class="{ active: mode === 'special' }"
              role="tab"
              :aria-selected="mode === 'special'"
              @click="switchMode('special')"
            >
              특별모드
            </button>
          </div>
          <button class="alert-icon-btn" aria-label="알림">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4a4 4 0 0 0-4 4v2.6c0 1-.4 2-1.1 2.8L5.5 15h13l-1.4-1.6a4.2 4.2 0 0 1-1.1-2.8V8a4 4 0 0 0-4-4z" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
          </button>
        </div>
      </header>

      <section class="card primary-card">
        <div class="card-head">
          <p class="card-title">오늘의 건강 상태</p>
          <span class="risk-badge">안정</span>
        </div>
        <div class="metrics-grid">
          <div>
            <p class="metric-label">혈당</p>
            <p class="metric-value">108 <span>mg/dL</span></p>
            <p class="metric-sub stable-text">정상</p>
          </div>
          <div>
            <p class="metric-label">예상 HbA1c</p>
            <p class="metric-value">5.7 <span>%</span></p>
          </div>
          <div>
            <p class="metric-label">체중</p>
            <p class="metric-value">71.8 <span>kg</span></p>
            <p class="metric-sub down-text">▼ 지난주 대비 0.3kg</p>
          </div>
          <div>
            <p class="metric-label">걸음 수</p>
            <p class="metric-value">7,240</p>
          </div>
        </div>
        <p class="support-text">건강 지표가 안정적으로 잘 관리되고 있어요.</p>
        <div class="prediction-inline">
          <span>식사 후 혈당 오를 가능성 미리보기</span>
          <strong>2시간 내 상승 가능성 18%</strong>
          <em>현재 안정 구간</em>
        </div>
      </section>

      <section class="card killer-card">
        <div class="card-head">
          <p class="card-title">{{ killerTitle }}</p>
          <span class="soft-badge">{{ killerBadge }}</span>
        </div>
        <div class="killer-grid">
          <button
            v-for="item in killerActions"
            :key="item.title"
            class="killer-action"
          >
            <strong>{{ item.title }}</strong>
            <span>{{ item.desc }}</span>
          </button>
        </div>
      </section>

      <section class="card streak-card">
        <div>
          <p class="card-title">{{ streakTitle }}</p>
          <p class="streak-value">{{ streakValue }}</p>
          <p class="muted">{{ streakDesc }}</p>
        </div>
        <button class="outline-btn compact">{{ streakButton }}</button>
      </section>

      <section class="card program-card">
        <div class="card-head">
          <p class="card-title">혈당 관리 - 12주 프로그램</p>
          <strong class="percent">52%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill program-fill" />
        </div>
        <p class="muted right">5주 남음</p>
        <p class="mission-title">오늘의 미션</p>
        <ul class="mission-list">
          <li>✔ 30분 걷기 (완료)</li>
          <li>☐ 저당 식단 기록</li>
          <li>☐ 혈당 기록</li>
        </ul>
        <p class="microcopy">오늘 미션 1개만 더 완료하면 주간 목표 달성률이 70%가 됩니다.</p>
        <div class="stability-badge">최근 4주 안정구간 유지율 86%</div>
        <div class="program-actions">
          <button class="primary-btn">미션 완료하기</button>
          <button class="text-btn">진행도 보기</button>
        </div>
      </section>

      <section class="card snapshot-card">
        <p class="card-title">건강 데이터 스냅샷</p>
        <div class="horizontal-scroll">
          <article class="mini-chart-card">
            <div class="mini-head">
              <p>혈당 추이</p>
              <span class="trend-chip good">좋음</span>
            </div>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,30 15,28 30,32 45,24 60,26 75,18 100,20" />
              </svg>
            </div>
            <div class="mini-foot">
              <span class="period-tag">기준: 최근 7일</span>
              <span class="status-text up">안정적 추세</span>
            </div>
          </article>
          <article class="mini-chart-card">
            <div class="mini-head">
              <p>체중 추이</p>
              <span class="trend-chip good">좋음</span>
            </div>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,20 20,19 40,18 60,19 80,17 100,16" />
              </svg>
            </div>
            <div class="mini-foot">
              <span class="period-tag">기준: 최근 4주</span>
              <span class="status-text up">완만한 감소</span>
            </div>
          </article>
          <article class="mini-chart-card">
            <div class="mini-head">
              <p>평균 수면 시간</p>
              <span class="trend-chip warn">주의</span>
            </div>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,28 15,25 30,27 45,21 60,24 75,19 100,22" />
              </svg>
            </div>
            <div class="mini-foot">
              <span class="period-tag">기준: 최근 7일</span>
              <span class="status-text down">변동 큼</span>
            </div>
          </article>
        </div>
        <button class="text-btn report-link">전체 건강 리포트 보기</button>
      </section>

      <section class="card consultation-card">
        <p class="card-title">전문가 상담이 필요하신가요?</p>
        <p class="muted">원하실 때 언제든 전문가 상담을 요청할 수 있어요.</p>
        <button class="outline-btn">상담 요청하기</button>
      </section>

      <section class="card medication-card">
        <p class="card-title">오늘의 복약</p>
        <p class="medication-text">오후 8:00 - 메트포르민</p>
        <button class="primary-btn">복용 완료</button>
      </section>

      <section class="card content-card">
        <p class="card-title">추천 콘텐츠</p>
        <article class="content-item">
          <div class="thumb"></div>
          <div>
            <p class="content-title">저당 식단 가이드</p>
            <p class="muted">평일 식단에 바로 적용할 수 있는 팁</p>
          </div>
        </article>
        <article class="content-item">
          <div class="thumb"></div>
          <div>
            <p class="content-title">20분 저녁 유산소 루틴</p>
            <p class="muted">퇴근 후 가볍게 하는 회복 루틴</p>
          </div>
        </article>
      </section>
    </section>

    <div v-if="mode === 'special'" class="special-sub-nav">
      <button
        v-for="item in specialSubMenu"
        :key="item.id"
        class="sub-nav-item"
        :class="{ active: activeSpecialSub === item.id }"
        @click="activeSpecialSub = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <nav class="bottom-nav" :class="{ special: mode === 'special' }">
      <template v-if="mode === 'thehealth'">
        <button
          v-for="item in theHealthMenu"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeMainNav === item.id }"
          @click="handleMainMenuClick(item.id)"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="item.id === 'home'" d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />
            <path v-else-if="item.id === 'content'" d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 9h8M8 13h8M8 17h5" />
            <path v-else-if="item.id === 'my'" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" />
            <path v-else-if="item.id === 'all'" d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" />
            <path v-else d="M7 7h4v4H7zM13 13h4v4h-4zM6 14l4 4M14 6l4 4" />
          </svg>
          <span>{{ item.label }}</span>
        </button>
      </template>

      <template v-else>
        <button class="nav-item back" @click="goBackToTheHealth">
          <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 6L8.5 12l6 6" />
          </svg>
          <span>백</span>
        </button>
        <button
          v-for="item in specialMenu"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeSpecialNav === item.id }"
          @click="activeSpecialNav = item.id"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="item.id === 'program'" d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 10h8M8 14h5" />
            <path v-else-if="item.id === 'record'" d="M5 19V9M10 19V5M15 19v-8M20 19v-4" />
            <path v-else-if="item.id === 'consult'" d="M6 7h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-6l-4 3v-3H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
            <path v-else d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" />
          </svg>
          <span>{{ item.label }}</span>
        </button>
      </template>
    </nav>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'

const mode = ref('thehealth')
const activeMainNav = ref('home')
const activeSpecialNav = ref('program')
const activeSpecialSub = ref('sugar')

const theHealthMenu = [
  { id: 'home', label: '홈' },
  { id: 'content', label: '콘텐츠' },
  { id: 'my', label: '마이' },
  { id: 'all', label: '전체' },
  { id: 'switch', label: '전환테스트' }
]

const specialMenu = [
  { id: 'program', label: '프로그램' },
  { id: 'record', label: '건강기록' },
  { id: 'consult', label: '상담' },
  { id: 'mypage', label: '마이페이지' }
]

const specialSubMenu = [
  { id: 'sugar', label: '혈당관리' },
  { id: 'meal', label: '식단' },
  { id: 'exercise', label: '운동' },
  { id: 'medication', label: '복약' }
]

const switchMode = (nextMode) => {
  mode.value = nextMode
  if (nextMode === 'special') {
    activeSpecialNav.value = 'program'
    activeSpecialSub.value = 'sugar'
  }
}

const goBackToTheHealth = () => {
  mode.value = 'thehealth'
  activeMainNav.value = 'home'
}

const handleMainMenuClick = (id) => {
  if (id === 'switch') {
    switchMode('special')
    return
  }
  activeMainNav.value = id
}

const modeName = computed(() =>
  mode.value === 'thehealth' ? '더헬스모드' : '특별모드'
)

const killerTitle = computed(() =>
  mode.value === 'thehealth' ? '오늘의 추천 기능' : '특별모드 추천 기능'
)

const killerBadge = computed(() =>
  mode.value === 'thehealth' ? 'AI 코칭' : '프리미엄'
)

const killerActions = computed(() => {
  if (mode.value === 'special') {
    return [
      { title: '식후 혈당 미리보기', desc: '식사 후 혈당이 오를 가능성을 미리 안내' },
      { title: '맞춤 식사 점수', desc: '오늘 점심 점수 82점 (내 기록 기준)' },
      { title: '전담 코치 피드백', desc: '기록 업로드 후 24시간 내 답변' }
    ]
  }

  return [
    { title: '식후 혈당 예측', desc: '식사 사진 1장으로 예측' },
    { title: '저당 식단 추천', desc: '회사 근처 메뉴 자동 추천' },
    { title: '3분 위험 체크', desc: '오늘 리스크를 빠르게 점검' }
  ]
})

const streakTitle = computed(() =>
  mode.value === 'thehealth' ? '연속 관리 리워드' : '특별모드 달성 혜택'
)

const streakValue = computed(() =>
  mode.value === 'thehealth' ? '11일 연속 달성' : '이번 달 특별 미션 2/3 완료'
)

const streakDesc = computed(() =>
  mode.value === 'thehealth'
    ? '3일 더 달성하면 건강 리워드 포인트 +500'
    : '마지막 미션 완료 시 1:1 코칭 1회가 제공됩니다'
)

const streakButton = computed(() =>
  mode.value === 'thehealth' ? '리워드 확인' : '특별 혜택 보기'
)
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  padding: 0;
  background: #f3f7fc;
  color: #1f2937;
}

.phone-shell {
  max-width: 390px;
  margin: 0 auto;
  padding: 14px 14px 88px;
  background: #f6f9fd;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e7edf5;
  box-shadow: 0 4px 14px rgba(20, 45, 92, 0.05);
  padding: 14px;
}

.header-left h1 {
  font-size: 20px;
  line-height: 1.25;
  margin: 8px 0 4px;
}

.header-left p {
  color: #8090a3;
  font-size: 13px;
}

.company-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tesla-logo {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.company-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.company-text strong {
  font-size: 12px;
  color: #1f2b3b;
}

.company-text span {
  font-size: 11px;
  color: #7f8fa5;
}

.mode-caption {
  margin-top: 6px;
  font-size: 11px;
  color: #6e83a0;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mode-toggle {
  display: inline-flex;
  align-items: center;
  background: #eef4fb;
  border: 1px solid #d8e3f1;
  border-radius: 999px;
  padding: 1px;
}

.mode-btn {
  border: 0;
  background: transparent;
  color: #6d8098;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 7px;
  border-radius: 999px;
  line-height: 1;
}

.mode-btn.active {
  background: #2f79d8;
  color: #fff;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #dce6f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #1f4f95;
}

.alert-icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #dce6f2;
  border-radius: 12px;
  background: #f8fbff;
  color: #2f6db8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.alert-icon-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.card {
  margin-top: 12px;
  background: #fff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 5px 16px rgba(18, 56, 124, 0.06);
  border: 1px solid #e7edf5;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  color: #1f2b3b;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.risk-badge {
  background: #e5f5ea;
  color: #237a41;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 10px;
  margin-top: 8px;
}

.metric-label {
  color: #6f8095;
  font-size: 12px;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 24px;
  font-weight: 800;
  color: #0f1f33;
  line-height: 1.1;
}

.metric-value span {
  font-size: 14px;
  font-weight: 600;
}

.metric-sub {
  margin-top: 2px;
  font-size: 12px;
}

.stable-text {
  color: #237a41;
}

.down-text {
  color: #2f6db8;
}

.support-text {
  margin-top: 10px;
  font-size: 12px;
  color: #66788d;
}

.prediction-inline {
  margin-top: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #f3f8ff;
  border: 1px solid #dfebfb;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.prediction-inline span {
  color: #637a95;
  font-size: 12px;
}

.prediction-inline strong {
  color: #1f4f95;
  font-size: 14px;
}

.prediction-inline em {
  margin-left: auto;
  font-style: normal;
  color: #237a41;
  font-size: 12px;
  font-weight: 700;
}

.percent {
  color: #2f6db8;
  font-size: 18px;
}

.progress-track {
  margin-top: 8px;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e6eef8;
}

.progress-fill {
  height: 100%;
  width: 52%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2b76d6 0%, #5da3ff 100%);
}

.muted {
  color: #7a8ea6;
  font-size: 13px;
}

.right {
  text-align: right;
  margin-top: 6px;
}

.mission-title {
  margin-top: 10px;
  font-size: 13px;
  color: #5b6e84;
  font-weight: 600;
}

.mission-list {
  margin: 8px 0 8px;
  list-style: none;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #30445c;
}

.microcopy {
  margin-bottom: 10px;
  color: #6882a1;
  font-size: 12px;
}

.stability-badge {
  margin-bottom: 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #edf8f1;
  color: #237a41;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
}

.soft-badge {
  background: #e8f1ff;
  color: #2f6db8;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 700;
}

.killer-grid {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.killer-action {
  border: 1px solid #deebfb;
  background: #f8fbff;
  border-radius: 12px;
  padding: 10px;
  text-align: left;
}

.killer-action strong {
  display: block;
  color: #1d3760;
  font-size: 13px;
  margin-bottom: 2px;
}

.killer-action span {
  color: #7289a5;
  font-size: 12px;
}

.streak-card {
  display: grid;
  gap: 10px;
}

.streak-value {
  font-size: 24px;
  color: #1f2b3b;
  font-weight: 800;
  margin-bottom: 2px;
}

.program-actions {
  display: grid;
  gap: 6px;
}

.primary-btn {
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: #2f79d8;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 11px 12px;
}

.text-btn {
  border: 0;
  background: transparent;
  color: #2f79d8;
  font-weight: 600;
  font-size: 13px;
  text-align: left;
  padding: 0;
}

.horizontal-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-top: 8px;
}

.mini-chart-card {
  min-width: 160px;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid #e4edf8;
  padding: 10px;
}

.mini-chart-card p {
  font-size: 12px;
  color: #48617f;
}

.mini-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.trend-chip {
  border-radius: 999px;
  padding: 3px 7px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.trend-chip.good {
  background: #e8f6ee;
  color: #237a41;
}

.trend-chip.warn {
  background: #fff4e8;
  color: #b06718;
}

.mini-chart {
  margin-top: 8px;
  height: 50px;
  border-radius: 8px;
  background:
    linear-gradient(to bottom, rgba(36, 99, 191, 0.08) 1px, transparent 1px) 0 0 / 100% 12px;
}

.mini-chart svg {
  width: 100%;
  height: 100%;
}

.mini-chart polyline {
  fill: none;
  stroke: #3c89e8;
  stroke-width: 2;
}

.mini-foot {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.period-tag {
  font-size: 10px;
  color: #7b8ea6;
}

.status-text {
  font-size: 11px;
  font-weight: 700;
}

.status-text.up {
  color: #237a41;
}

.status-text.down {
  color: #b06718;
}

.report-link {
  margin-top: 8px;
}

.outline-btn {
  margin-top: 10px;
  width: 100%;
  border: 1px solid #b8d1ef;
  background: #f4f9ff;
  color: #2f6db8;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 700;
}

.outline-btn.compact {
  margin-top: 0;
}

.medication-text {
  margin: 2px 0 10px;
  color: #2a4767;
  font-size: 14px;
}

.content-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 8px;
  border-radius: 12px;
  background: #f8fbff;
  border: 1px solid #e7edf5;
}

.thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(145deg, #e3eefb, #f4f8fd);
}

.content-title {
  font-size: 14px;
  font-weight: 600;
  color: #23364d;
}

.bottom-nav {
  position: fixed;
  max-width: 390px;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70px;
  padding: 8px 10px 10px;
  background: #fff;
  border-top: 1px solid #e4ebf5;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  box-shadow: 0 -4px 20px rgba(15, 35, 70, 0.06);
}

.nav-item {
  border: 0;
  background: transparent;
  color: #8a9ab0;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-weight: 600;
}

.nav-icon {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-item.back {
  color: #5e6e84;
}

.nav-item.active {
  color: #2f79d8;
  font-weight: 700;
}

.bottom-nav.special {
  grid-template-columns: 0.9fr repeat(4, 1fr);
}

.special-sub-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 70px;
  max-width: 390px;
  margin: 0 auto;
  background: #f8fbff;
  border-top: 1px solid #e3ebf6;
  border-bottom: 1px solid #e3ebf6;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 6px 8px;
  z-index: 10;
}

.sub-nav-item {
  border: 0;
  background: transparent;
  font-size: 11px;
  color: #8a9ab0;
  font-weight: 600;
  padding: 4px 2px;
}

.sub-nav-item.active {
  color: #2f79d8;
  font-weight: 700;
}

@media (max-width: 420px) {
  .phone-shell {
    max-width: 100%;
    min-height: 100vh;
    padding-bottom: 118px;
  }

  .bottom-nav {
    max-width: none;
  }

  .special-sub-nav {
    max-width: none;
  }
}
</style>
