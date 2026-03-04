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
        </div>
        <div class="header-actions">
          <button class="icon-btn" aria-label="Notifications">🔔</button>
          <div class="avatar">HG</div>
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
        <p class="microcopy">이번 주도 좋은 흐름입니다. 지금처럼 이어가보세요.</p>
        <div class="program-actions">
          <button class="primary-btn">미션 완료하기</button>
          <button class="text-btn">진행도 보기</button>
        </div>
      </section>

      <section class="card snapshot-card">
        <p class="card-title">건강 데이터 스냅샷</p>
        <div class="horizontal-scroll">
          <article class="mini-chart-card">
            <p>최근 7일 혈당 추이</p>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,30 15,28 30,32 45,24 60,26 75,18 100,20" />
              </svg>
            </div>
          </article>
          <article class="mini-chart-card">
            <p>체중 추이</p>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,20 20,19 40,18 60,19 80,17 100,16" />
              </svg>
            </div>
          </article>
          <article class="mini-chart-card">
            <p>평균 수면 시간</p>
            <div class="mini-chart">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none">
                <polyline points="0,28 15,25 30,27 45,21 60,24 75,19 100,22" />
              </svg>
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

    <nav class="bottom-nav">
      <button class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />
        </svg>
        <span>홈</span>
      </button>
      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="3" />
          <path d="M8 10h8M8 14h5" />
        </svg>
        <span>프로그램</span>
      </button>
      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19V9M10 19V5M15 19v-8M20 19v-4" />
        </svg>
        <span>건강기록</span>
      </button>
      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.5 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM15.5 20a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          <path d="M18.5 18.5L21 21" />
        </svg>
        <span>상담</span>
      </button>
      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" />
        </svg>
        <span>마이페이지</span>
      </button>
    </nav>
  </main>
</template>

<script setup>
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dce6f2;
  border-radius: 10px;
  background: #f8fbff;
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
  width: 19px;
  height: 19px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-item.active {
  color: #2f79d8;
  font-weight: 700;
}

.nav-item.active .nav-icon {
  filter: drop-shadow(0 1px 1px rgba(47, 121, 216, 0.18));
}

@media (max-width: 420px) {
  .phone-shell {
    max-width: 100%;
    min-height: 100vh;
    padding-bottom: 90px;
  }

  .bottom-nav {
    max-width: none;
  }
}
</style>
