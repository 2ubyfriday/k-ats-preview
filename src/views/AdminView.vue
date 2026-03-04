<template>
  <div class="app-container">
    <AdminLogin v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <template v-else>
      <StatusBar />
      <Header 
      :season="currentSeason"
      :titles="availableTitles"
      :current-title="selectedTitle"
      :hide-title-dropdown="true"
      @change-language="handleLanguageChange"
      @export-data="handleExportData"
      @export-excel="handleExportExcel"
      @import-data="handleImportData"
      @title-change="handleTitleChange"
    />
    
    <!-- 스포츠/성별 선택 -->
    <div class="sport-selector">
      <!-- 농구 -->
      <div class="sport-column">
        <div class="sport-title">
          <span class="sport-icon">🏀</span>
          <span class="sport-name">농구</span>
        </div>
        <div class="sport-buttons">
          <button 
            :class="['sport-btn', { active: selectedTitle === 'K-Basketball(남자)' }]"
            @click="handleTitleChange('K-Basketball(남자)')"
          >
            남자부
          </button>
          <button 
            :class="['sport-btn', { active: selectedTitle === 'K-Basketball(여자)' }]"
            @click="handleTitleChange('K-Basketball(여자)')"
          >
            여자부
          </button>
        </div>
      </div>
      
      <!-- 배구 -->
      <div class="sport-column">
        <div class="sport-title">
          <span class="sport-icon">🏐</span>
          <span class="sport-name">배구</span>
        </div>
        <div class="sport-buttons">
          <button 
            :class="['sport-btn', { active: selectedTitle === 'V-League(남자)' }]"
            @click="handleTitleChange('V-League(남자)')"
          >
            남자부
          </button>
          <button 
            :class="['sport-btn', { active: selectedTitle === 'V-League(여자)' }]"
            @click="handleTitleChange('V-League(여자)')"
          >
            여자부
          </button>
        </div>
      </div>
    </div>
    
    <!-- 사용자 섹션 -->
    <div class="section user-section">
      <div class="section-header">
        <div class="section-title-description">
          <span v-if="userActiveTab === '승/패'">일반 승리, 패배에 대한 데이터</span>
          <span v-else-if="userActiveTab === '핸디캡 승/패' && currentSport === 'basketball'">핸디캡 적용시 데이터 / betman기준</span>
          <span v-else-if="userActiveTab === '핸디캡 승/패' && currentSport === 'volleyball'">핸디캡 승/패 = 세트 핸디캡</span>
          <span v-else-if="userActiveTab === '언더/오버'">언더/오버 = 팀 합계 총점 기준</span>
        </div>
      </div>
      <NavigationTabs 
        :tabs="tabs"
        :active-tab="userActiveTab"
        @tab-change="handleUserTabChange"
      />
      <FilterDropdown 
        :options="userFilterOptions"
        :selected-filter="userSelectedFilter"
        @filter-change="handleUserFilterChange"
      />
      <!-- 요일별 필터 선택 시 요일 버튼 표시 -->
      <div v-if="isDayFilter" class="day-selector">
        <div class="day-selector-header">
          <span class="day-selector-title">요일 선택</span>
        </div>
        <div class="day-buttons">
          <button
            v-for="day in DAYS"
            :key="day.key"
            :class="['day-button', { active: selectedDay === day.key }]"
            @click="selectedDay = day.key"
          >
            {{ day.short }}
          </button>
        </div>
        <div class="day-selector-header">
          <span class="day-selector-title">홈/원정 선택</span>
        </div>
        <div class="day-type-buttons">
          <button
            :class="['day-type-button', { active: selectedDayType === 'all' }]"
            @click="selectedDayType = 'all'"
          >
            전체
          </button>
          <button
            :class="['day-type-button', { active: selectedDayType === 'home' }]"
            @click="selectedDayType = 'home'"
          >
            홈
          </button>
          <button
            :class="['day-type-button', { active: selectedDayType === 'away' }]"
            @click="selectedDayType = 'away'"
          >
            원정
          </button>
        </div>
      </div>
      <!-- 쿼터별/세트별 필터 선택 시 버튼 표시 -->
      <div v-if="isQuarterFilter" class="quarter-selector">
        <div class="quarter-selector-header">
          <span class="quarter-selector-title">{{ currentSport === 'volleyball' ? '세트 선택' : '쿼터 선택' }}</span>
        </div>
        <div class="quarter-buttons">
          <!-- 농구: 1~4쿼터 + 연장전 -->
          <template v-if="currentSport === 'basketball'">
            <button
              v-for="q in [1, 2, 3, 4]"
              :key="q"
              :class="['quarter-button', { active: selectedQuarter === q }]"
              @click="selectedQuarter = q"
            >
              {{ q }}Q
            </button>
            <button
              :class="['quarter-button', { active: selectedQuarter === 'overtime' }]"
              @click="selectedQuarter = 'overtime'"
            >
              연장
            </button>
          </template>
          <!-- 배구: 1~5세트 -->
          <template v-else>
            <button
              v-for="s in [1, 2, 3, 4, 5]"
              :key="s"
              :class="['quarter-button', { active: selectedQuarter === s }]"
              @click="selectedQuarter = s"
            >
              {{ s }}세트
            </button>
          </template>
        </div>
      </div>
      <!-- 휴식일별 필터 선택 시 휴식일 버튼 표시 -->
      <div v-if="isRestDaysFilter" class="rest-days-selector">
        <div class="rest-days-selector-header">
          <span class="rest-days-selector-title">휴식일 선택</span>
        </div>
        <div class="rest-days-buttons">
          <button
            :class="['rest-days-button', { active: selectedRestDays === 0 }]"
            @click="selectedRestDays = 0"
          >
            백투백
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 1 }]"
            @click="selectedRestDays = 1"
          >
            1일
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 2 }]"
            @click="selectedRestDays = 2"
          >
            2일
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 3 }]"
            @click="selectedRestDays = 3"
          >
            3일
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 4 }]"
            @click="selectedRestDays = 4"
          >
            4+일
          </button>
        </div>
      </div>
      <!-- 핸디캡 기타 상황별 필터 선택 시 버튼 표시 -->
      <div v-if="isHandicapTypeFilter" class="handicap-type-selector">
        <div class="handicap-type-selector-header">
          <span class="handicap-type-selector-title">마이너스 핸디캡 / 플러스 핸디캡</span>
        </div>
        <div class="handicap-type-buttons">
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'favorite' }]"
            @click="selectedHandicapCategory = 'favorite'"
          >
            마이너스 핸디캡
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'underdog' }]"
            @click="selectedHandicapCategory = 'underdog'"
          >
            플러스 핸디캡
          </button>
        </div>
        <div class="handicap-type-selector-header">
          <span class="handicap-type-selector-title">홈 / 원정</span>
        </div>
        <div class="handicap-type-buttons">
          <button
            :class="['handicap-type-button', { active: selectedHandicapType === 'home' }]"
            @click="selectedHandicapType = 'home'"
          >
            홈
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapType === 'away' }]"
            @click="selectedHandicapType = 'away'"
          >
            원정
          </button>
        </div>
      </div>
      <!-- 언더/오버 기타 상황별 필터 선택 시 버튼 표시 -->
      <div v-if="isOverUnderTypeFilter" class="handicap-type-selector">
        <div class="handicap-type-selector-header">
          <span class="handicap-type-selector-title">마이너스 핸디캡 / 플러스 핸디캡</span>
        </div>
        <div class="handicap-type-buttons">
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'favorite' }]"
            @click="selectedHandicapCategory = 'favorite'"
          >
            마이너스 핸디캡
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'underdog' }]"
            @click="selectedHandicapCategory = 'underdog'"
          >
            플러스 핸디캡
          </button>
        </div>
        <div class="handicap-type-selector-header">
          <span class="handicap-type-selector-title">홈 / 원정</span>
        </div>
        <div class="handicap-type-buttons">
          <button
            :class="['handicap-type-button', { active: selectedHandicapType === 'home' }]"
            @click="selectedHandicapType = 'home'"
          >
            홈
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapType === 'away' }]"
            @click="selectedHandicapType = 'away'"
          >
            원정
          </button>
        </div>
      </div>
      <StandingsTable 
        :data="userFilteredData"
        :games="gamesData"
        :highlight-key="userSelectedFilterKey"
        :filter-only="true"
      />
    </div>
    
    <!-- Admin 섹션 -->
    <div class="section admin-section">
      <div class="section-header">
        <div class="section-title-description">
          <span v-if="adminActiveTab === '승/패'">일반 승리, 패배에 대한 데이터</span>
          <span v-else-if="adminActiveTab === '핸디캡 승/패' && currentSport === 'basketball'">핸디캡 적용시 데이터 / betman기준</span>
          <span v-else-if="adminActiveTab === '핸디캡 승/패' && currentSport === 'volleyball'">핸디캡 승/패 = 세트 핸디캡</span>
          <span v-else-if="adminActiveTab === '언더/오버'">언더/오버 = 팀 합계 총점 기준</span>
        </div>
      </div>
      <NavigationTabs 
        :tabs="tabs"
        :active-tab="adminActiveTab"
        @tab-change="handleAdminTabChange"
      />
      <FilterDropdown 
        :options="adminFilterOptions"
        :selected-filter="adminSelectedFilter"
        @filter-change="handleAdminFilterChange"
      />
      <StandingsTable 
        :data="adminFilteredData"
        :games="gamesData"
        :highlight-key="adminSelectedFilterKey"
      />
    </div>
    
    <div class="last-update">Last Update: {{ lastUpdate }}</div>
    <GameInputTable 
      :games="orderedGames"
      :sport-type="currentSport"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <!-- 재미로 보는 예측 관리 섹션 -->
    <div class="section prediction-management-section">
      <div class="section-header">
        <h2 class="section-title">재미로 보는 예측 관리 (홈기준)</h2>
        <p class="section-subtitle">* {{ isBasketballMen ? '농구 남자부는 하루 3경기까지' : '하루 2경기까지' }} 등록 가능합니다</p>
      </div>
      
      <!-- 경기 1 -->
      <div class="prediction-input-form">
        <h4 class="form-subtitle">경기 1</h4>
        <div class="form-row">
          <label>경기일</label>
          <input type="date" v-model="predictionForm1.gameDate" />
        </div>
        <div class="form-row">
          <label>홈팀</label>
          <select v-model="predictionForm1.homeTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>원정팀</label>
          <select v-model="predictionForm1.awayTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>핸디캡</label>
          <input type="number" v-model.number="predictionForm1.handicap" step="0.5" placeholder="예: -5.5" />
        </div>
        <div class="form-row">
          <label>오버 기준점</label>
          <input type="number" v-model.number="predictionForm1.overUnderLine" step="0.5" placeholder="예: 150.5" />
        </div>
        <div class="form-actions">
          <button class="btn-save" @click="handleSavePrediction(1)">저장</button>
          <button class="btn-delete" @click="handleDeletePrediction(1)" :disabled="!hasPrediction1">삭제</button>
        </div>
      </div>

      <!-- 경기 2 -->
      <div class="prediction-input-form">
        <h4 class="form-subtitle">경기 2</h4>
        <div class="form-row">
          <label>경기일</label>
          <input type="date" v-model="predictionForm2.gameDate" />
        </div>
        <div class="form-row">
          <label>홈팀</label>
          <select v-model="predictionForm2.homeTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>원정팀</label>
          <select v-model="predictionForm2.awayTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>핸디캡</label>
          <input type="number" v-model.number="predictionForm2.handicap" step="0.5" placeholder="예: -5.5" />
        </div>
        <div class="form-row">
          <label>오버 기준점</label>
          <input type="number" v-model.number="predictionForm2.overUnderLine" step="0.5" placeholder="예: 150.5" />
        </div>
        <div class="form-actions">
          <button class="btn-save" @click="handleSavePrediction(2)">저장</button>
          <button class="btn-delete" @click="handleDeletePrediction(2)" :disabled="!hasPrediction2">삭제</button>
        </div>
      </div>

      <!-- 경기 3 (농구 남자부만) -->
      <div v-if="isBasketballMen" class="prediction-input-form">
        <h4 class="form-subtitle">경기 3</h4>
        <div class="form-row">
          <label>경기일</label>
          <input type="date" v-model="predictionForm3.gameDate" />
        </div>
        <div class="form-row">
          <label>홈팀</label>
          <select v-model="predictionForm3.homeTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>원정팀</label>
          <select v-model="predictionForm3.awayTeam">
            <option value="">선택하세요</option>
            <option v-for="team in teamList" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>핸디캡</label>
          <input type="number" v-model.number="predictionForm3.handicap" step="0.5" placeholder="예: -5.5" />
        </div>
        <div class="form-row">
          <label>오버 기준점</label>
          <input type="number" v-model.number="predictionForm3.overUnderLine" step="0.5" placeholder="예: 150.5" />
        </div>
        <div class="form-actions">
          <button class="btn-save" @click="handleSavePrediction(3)">저장</button>
          <button class="btn-delete" @click="handleDeletePrediction(3)" :disabled="!hasPrediction3">삭제</button>
        </div>
      </div>
    </div>
    <MatchupPrediction 
      v-if="gamesData.length > 0 && statsData.length > 0"
      :games="gamesData"
      :stats="statsData"
      :prediction-data="predictionData"
    />
    <button class="add-data-btn" @click="handleAddClick">
      + 데이터 추가
    </button>
    <DataInput 
      v-if="showInputModal"
      :edit-data="editData"
      :current-title="selectedTitle"
      :current-gender="selectedGender"
      :sport-type="currentSport"
      @close="handleCloseModal"
      @submit="handleDataSubmit"
    />
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click.self="showDeleteConfirm = false">
      <div class="delete-confirm-dialog">
        <h3>삭제 확인</h3>
        <p>정말로 이 경기 데이터를 삭제하시겠습니까?</p>
        <div class="delete-actions">
          <button class="btn-cancel" @click="showDeleteConfirm = false">취소</button>
          <button class="btn-confirm-delete" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="site-footer">
      <p>© 2024 K-Handicap. All rights reserved. by nDS</p>
    </footer>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import StatusBar from '../components/StatusBar.vue'
import Header from '../components/Header.vue'
import NavigationTabs from '../components/NavigationTabs.vue'
import FilterDropdown from '../components/FilterDropdown.vue'
import StandingsTable from '../components/StandingsTable.vue'
import DataInput from '../components/DataInput.vue'
import GameInputTable from '../components/GameInputTable.vue'
import MatchupPrediction from '../components/MatchupPrediction.vue'
import AdminLogin from '../components/AdminLogin.vue'
import { saveGamesData, loadGamesData, subscribeToGamesData, deleteGame, exportGamesData, exportGamesDataToExcel, importGamesData, savePredictionData, loadPredictionData, subscribeToPredictionData, deletePredictionData } from '../utils/firebaseStorage.js'
import { formatGameData, calculateTeamStats, FILTERS, DAYS } from '../utils/gameCalculations.js'
import { getTeamsByTitle } from '../utils/teams.js'

export default {
  name: 'AdminView',
  components: {
    StatusBar,
    Header,
    NavigationTabs,
    FilterDropdown,
    StandingsTable,
    DataInput,
    GameInputTable,
    MatchupPrediction,
    AdminLogin
  },
  setup() {
    // Admin 인증 확인
    const isAuthenticated = ref(false)
    
    // 세션 스토리지에서 인증 상태 확인
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('admin_authenticated')
      isAuthenticated.value = authStatus === 'true'
    }
    
    const handleLoginSuccess = () => {
      isAuthenticated.value = true
    }
    
    const currentSeason = ref('2025~2026')
    const showInputModal = ref(false)
    const editData = ref(null)
    const showDeleteConfirm = ref(false)
    const deleteTargetId = ref(null)
    
    // 타이틀 관리 (나중에 쉽게 추가 가능)
    const availableTitles = ref([
      'K-Basketball(남자)',
      'K-Basketball(여자)',
      'V-League(남자)',
      'V-League(여자)'
    ])
    const selectedTitle = ref('K-Basketball(여자)')
    
    // 타이틀에 따라 자동으로 gender 결정
    const selectedGender = computed(() => {
      if (selectedTitle.value === 'K-Basketball(남자)') {
        return '남자부'
      } else if (selectedTitle.value === 'K-Basketball(여자)') {
        return '여자부'
      } else if (selectedTitle.value === 'V-League(남자)') {
        return '배구남자'
      } else if (selectedTitle.value === 'V-League(여자)') {
        return '배구여자'
      }
      return '여자부'
    })
    
    // 현재 선택된 스포츠 타입
    const currentSport = computed(() => {
      if (selectedTitle.value.includes('V-League') || selectedTitle.value.includes('배구')) {
        return 'volleyball'
      }
      return 'basketball'
    })
    
    const tabs = ['승/패', '핸디캡 승/패', '언더/오버']
    
    // 섹션별 필터 옵션 (사용자 화면용 - 한글)
    const getUserFilterOptionsForTab = (tab) => {
      const isVolleyball = currentSport.value === 'volleyball'
      
      if (tab === '승/패') {
        return [
          '전체',
          '홈경기',
          '원정경기',
          '요일별',
          isVolleyball ? '세트별' : '쿼터별',
          '휴식일별'
        ]
      } else if (tab === '핸디캡 승/패') {
        return [
          '전체',
          '홈경기',
          '원정경기',
          '마핸 받았을 때',
          '플핸 받았을 때',
          '기타 상황별'
        ]
      } else if (tab === '언더/오버') {
        return [
          '전체',
          '홈경기',
          '원정경기',
          '마핸 받았을 때',
          '플핸 받았을 때',
          '기타 상황별'
        ]
      }
      return ['전체']
    }
    
    // 섹션별 필터 옵션 (Admin용)
    const getFilterOptionsForTab = (tab) => {
      if (tab === '승/패') {
        return [
          '전체',
          'As Home Team',
          'As Away Team',
          ...DAYS.flatMap(day => [
            `As ${day.label} Home`,
            `As ${day.label} Away`
          ])
        ]
      } else if (tab === '핸디캡 승/패') {
        return [
          '전체',
          'As Home Team',
          'As Away Team',
          'As Favorite',
          'As Underdog',
          'As Home favorite',
          'As Away favorite',
          'As Home Underdog',
          'As Away Underdog'
        ]
      } else if (tab === '언더/오버') {
        return [
          '전체',
          'As Home Team',
          'As Away Team',
          'As Favorite',
          'As Underdog',
          'As Home favorite',
          'As Away favorite',
          'As Home Underdog',
          'As Away Underdog'
        ]
      }
      return ['전체']
    }
    
    // 사용자 섹션 필터 옵션 (한글)
    const userFilterOptions = computed(() => getUserFilterOptionsForTab(userActiveTab.value))
    
    // Admin 섹션 필터 옵션 (영어)
    const adminFilterOptions = computed(() => getFilterOptionsForTab(adminActiveTab.value))
    
    // 사용자 섹션 상태
    const userActiveTab = ref('승/패')
    const userSelectedFilter = ref('전체')
    
    // 사용자 섹션 서브필터 상태 (요일별, 쿼터별, 휴식일별, 기타 상황별)
    const selectedDay = ref('sun')
    const selectedDayType = ref('all')
    const selectedQuarter = ref(1)
    const selectedRestDays = ref(0)
    const selectedHandicapType = ref('home')
    const selectedHandicapCategory = ref('favorite')
    
    // Admin 섹션 상태
    const adminActiveTab = ref('승/패')
    const adminSelectedFilter = ref('전체')
    
    // 게임 데이터 저장
    const gamesData = ref([])
    
    // 예측 데이터 (배열로 관리: 최대 3경기 - 농구 남자부만)
    const predictionData = ref([])
    const predictionForm1 = ref({
      gameDate: '',
      homeTeam: '',
      awayTeam: '',
      handicap: null,
      overUnderLine: null
    })
    const predictionForm2 = ref({
      gameDate: '',
      homeTeam: '',
      awayTeam: '',
      handicap: null,
      overUnderLine: null
    })
    const predictionForm3 = ref({
      gameDate: '',
      homeTeam: '',
      awayTeam: '',
      handicap: null,
      overUnderLine: null
    })
    
    // 농구 남자부 여부 (3경기까지 가능)
    const isBasketballMen = computed(() => selectedTitle.value === 'K-Basketball(남자)')
    
    // 각 경기 존재 여부
    const hasPrediction1 = computed(() => predictionData.value && predictionData.value[0])
    const hasPrediction2 = computed(() => predictionData.value && predictionData.value[1])
    const hasPrediction3 = computed(() => predictionData.value && predictionData.value[2])
    
    // 실시간 리스너 해제 함수
    let unsubscribeGames = null
    let unsubscribePrediction = null
    
    // 실시간 데이터 구독 설정
    const setupRealtimeListener = () => {
      // 기존 리스너가 있으면 해제
      if (unsubscribeGames) {
        unsubscribeGames()
        unsubscribeGames = null
      }
      
      // 현재 선택된 gender 값 가져오기 (computed이므로 .value 사용)
      const currentGender = selectedGender.value
      console.log('🔧 실시간 리스너 설정 - gender:', currentGender, '타이틀:', selectedTitle.value)
      
      // 새로운 실시간 리스너 설정 (gender 필터 적용)
      unsubscribeGames = subscribeToGamesData((games) => {
        gamesData.value = games
      }, currentGender)
    }
    
    // 데이터 로드 (초기 로드용, 실시간 리스너가 자동으로 업데이트하므로 필요 없을 수도 있음)
    const loadData = async () => {
      try {
        const savedGames = await loadGamesData(selectedGender.value)
        if (savedGames && savedGames.length > 0) {
          gamesData.value = savedGames
        }
        // 실시간 리스너 설정
        setupRealtimeListener()
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      }
    }
    
    // 타이틀 변경 핸들러 (타이틀 변경 시 gender도 자동 변경됨)
    watch(selectedTitle, (newTitle, oldTitle) => {
      console.log('🔄 타이틀 변경 감지:', oldTitle, '→', newTitle)
      console.log('  - 새로운 gender:', selectedGender.value)
      
      // 기존 리스너 해제
      if (unsubscribeGames) {
        unsubscribeGames()
        unsubscribeGames = null
      }
      if (unsubscribePrediction) {
        unsubscribePrediction()
        unsubscribePrediction = null
      }
      
      // gamesData 초기화 (이전 타이틀의 데이터 제거)
      gamesData.value = []
      predictionData.value = null
      
      // 새로운 타이틀에 맞는 데이터 로드
      setupRealtimeListener()
      loadData()
      loadPrediction()
      setupPredictionListener()
    })
    
    const saveData = async () => {
      try {
        const success = await saveGamesData(gamesData.value)
        if (!success) {
          console.warn('데이터 저장에 실패했습니다.')
        }
        // 저장 후 실시간 리스너가 자동으로 업데이트하므로 별도 처리 불필요
      } catch (error) {
        console.error('데이터 저장 실패:', error)
      }
    }
    
    onMounted(() => {
      checkAuth()
      if (isAuthenticated.value) {
        loadData()
        loadPrediction()
        setupPredictionListener()
      }
    })
    
    // 컴포넌트 언마운트 시 리스너 해제
    onUnmounted(() => {
      if (unsubscribeGames) {
        unsubscribeGames()
        unsubscribeGames = null
      }
      if (unsubscribePrediction) {
        unsubscribePrediction()
        unsubscribePrediction = null
      }
    })
    
    // 인증 성공 후 데이터 로드
    watch(isAuthenticated, (authenticated) => {
      if (authenticated) {
        loadData()
        loadPrediction()
        setupPredictionListener()
      } else {
        // 로그아웃 시 리스너 해제
        if (unsubscribeGames) {
          unsubscribeGames()
          unsubscribeGames = null
        }
        if (unsubscribePrediction) {
          unsubscribePrediction()
          unsubscribePrediction = null
        }
      }
    })
    
    const statsData = computed(() => calculateTeamStats(gamesData.value))
    
    // 팀 목록 (teams.js에서 가져오기, 데이터 없어도 표시됨)
    const teamList = computed(() => {
      // teams.js에서 기본 팀 목록 가져오기
      const defaultTeams = getTeamsByTitle(selectedTitle.value)
      if (defaultTeams.length > 0) {
        return defaultTeams.sort()
      }
      // 기본 목록이 없으면 통계 데이터에서 추출
      return statsData.value.map(team => team.team).sort()
    })
    
    // 예측 데이터 로드
    const loadPrediction = async () => {
      try {
        const data = await loadPredictionData(selectedGender.value)
        if (data && Array.isArray(data) && data.length > 0) {
          predictionData.value = data
          // 경기 1
          predictionForm1.value = {
            gameDate: data[0]?.gameDate || '',
            homeTeam: data[0]?.homeTeam || '',
            awayTeam: data[0]?.awayTeam || '',
            handicap: data[0]?.handicap ?? null,
            overUnderLine: data[0]?.overUnderLine ?? null
          }
          // 경기 2 (있으면)
          if (data[1]) {
            predictionForm2.value = {
              gameDate: data[1].gameDate || '',
              homeTeam: data[1].homeTeam || '',
              awayTeam: data[1].awayTeam || '',
              handicap: data[1].handicap ?? null,
              overUnderLine: data[1].overUnderLine ?? null
            }
          } else {
            predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
          // 경기 3 (있으면 - 농구 남자부만)
          if (data[2]) {
            predictionForm3.value = {
              gameDate: data[2].gameDate || '',
              homeTeam: data[2].homeTeam || '',
              awayTeam: data[2].awayTeam || '',
              handicap: data[2].handicap ?? null,
              overUnderLine: data[2].overUnderLine ?? null
            }
          } else {
            predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
        } else {
          predictionData.value = []
          predictionForm1.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
        }
      } catch (error) {
        console.error('예측 데이터 로드 실패:', error)
      }
    }
    
    // 예측 데이터 실시간 구독
    const setupPredictionListener = () => {
      if (unsubscribePrediction) {
        unsubscribePrediction()
        unsubscribePrediction = null
      }
      
      unsubscribePrediction = subscribeToPredictionData((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          predictionData.value = data
          // 경기 1
          predictionForm1.value = {
            gameDate: data[0]?.gameDate || '',
            homeTeam: data[0]?.homeTeam || '',
            awayTeam: data[0]?.awayTeam || '',
            handicap: data[0]?.handicap ?? null,
            overUnderLine: data[0]?.overUnderLine ?? null
          }
          // 경기 2 (있으면)
          if (data[1]) {
            predictionForm2.value = {
              gameDate: data[1].gameDate || '',
              homeTeam: data[1].homeTeam || '',
              awayTeam: data[1].awayTeam || '',
              handicap: data[1].handicap ?? null,
              overUnderLine: data[1].overUnderLine ?? null
            }
          } else {
            predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
          // 경기 3 (있으면 - 농구 남자부만)
          if (data[2]) {
            predictionForm3.value = {
              gameDate: data[2].gameDate || '',
              homeTeam: data[2].homeTeam || '',
              awayTeam: data[2].awayTeam || '',
              handicap: data[2].handicap ?? null,
              overUnderLine: data[2].overUnderLine ?? null
            }
          } else {
            predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
        } else {
          predictionData.value = []
          predictionForm1.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
        }
      }, selectedGender.value)
    }
    
    // 예측 데이터 저장
    const handleSavePrediction = async (gameNumber) => {
      try {
        let form
        if (gameNumber === 1) {
          form = predictionForm1.value
        } else if (gameNumber === 2) {
          form = predictionForm2.value
        } else {
          form = predictionForm3.value
        }
        
        if (!form.homeTeam || !form.awayTeam) {
          alert('홈팀과 원정팀을 모두 선택해주세요.')
          return
        }
        
        // 현재 데이터 복사 (최대 3개 슬롯 유지)
        const currentData = [...(predictionData.value || [])]
        
        // 해당 경기 데이터 업데이트
        const gameData = {
          gameDate: form.gameDate,
          homeTeam: form.homeTeam,
          awayTeam: form.awayTeam,
          handicap: form.handicap,
          overUnderLine: form.overUnderLine
        }
        
        if (gameNumber === 1) {
          currentData[0] = gameData
        } else if (gameNumber === 2) {
          currentData[1] = gameData
        } else {
          currentData[2] = gameData
        }
        
        // 빈 슬롯 제거
        const filteredData = currentData.filter(game => game && game.homeTeam && game.awayTeam)
        
        await savePredictionData({
          games: filteredData,
          gender: selectedGender.value
        })
        
        alert(`경기 ${gameNumber} 예측이 저장되었습니다.`)
        // 실시간 리스너가 자동으로 업데이트함
      } catch (error) {
        console.error('예측 데이터 저장 실패:', error)
        alert('예측 경기 저장에 실패했습니다: ' + error.message)
      }
    }
    
    // 예측 데이터 삭제
    const handleDeletePrediction = async (gameNumber) => {
      if (!confirm(`경기 ${gameNumber} 예측을 삭제하시겠습니까?`)) {
        return
      }
      
      try {
        const currentData = [...(predictionData.value || [])]
        
        // 해당 경기 제거 및 폼 재정렬
        if (gameNumber === 1) {
          currentData.splice(0, 1)
          // 경기 1 삭제 시 나머지 경기들이 앞으로 이동
          if (currentData.length > 0) {
            predictionForm1.value = {
              gameDate: currentData[0].gameDate || '',
              homeTeam: currentData[0].homeTeam || '',
              awayTeam: currentData[0].awayTeam || '',
              handicap: currentData[0].handicap ?? null,
              overUnderLine: currentData[0].overUnderLine ?? null
            }
            if (currentData.length > 1) {
              predictionForm2.value = {
                gameDate: currentData[1].gameDate || '',
                homeTeam: currentData[1].homeTeam || '',
                awayTeam: currentData[1].awayTeam || '',
                handicap: currentData[1].handicap ?? null,
                overUnderLine: currentData[1].overUnderLine ?? null
              }
            } else {
              predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
            }
          } else {
            predictionForm1.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
            predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
          predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
        } else if (gameNumber === 2) {
          // 경기 2 삭제 시 경기 3이 있으면 경기 2로 이동
          currentData.splice(1, 1)
          if (currentData.length > 1) {
            predictionForm2.value = {
              gameDate: currentData[1].gameDate || '',
              homeTeam: currentData[1].homeTeam || '',
              awayTeam: currentData[1].awayTeam || '',
              handicap: currentData[1].handicap ?? null,
              overUnderLine: currentData[1].overUnderLine ?? null
            }
          } else {
            predictionForm2.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
          }
          predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
        } else {
          // 경기 3 삭제
          currentData.splice(2, 1)
          predictionForm3.value = { gameDate: '', homeTeam: '', awayTeam: '', handicap: null, overUnderLine: null }
        }
        
        // 데이터 저장 (빈 배열이면 전체 삭제)
        if (currentData.length === 0) {
          await deletePredictionData(selectedGender.value)
        } else {
          await savePredictionData({
            games: currentData,
            gender: selectedGender.value
          })
        }
        
        alert(`경기 ${gameNumber} 예측이 삭제되었습니다.`)
        // 실시간 리스너가 자동으로 업데이트함
      } catch (error) {
        console.error('예측 데이터 삭제 실패:', error)
        alert('예측 경기 삭제에 실패했습니다: ' + error.message)
      }
    }
    
    // 필터 타입 체크 (요일별, 쿼터별, 휴식일별, 기타 상황별)
    const isDayFilter = computed(() => {
      return userActiveTab.value === '승/패' && userSelectedFilter.value === '요일별'
    })
    
    // 쿼터별/세트별 필터인지 확인
    const isQuarterFilter = computed(() => {
      return userActiveTab.value === '승/패' && 
             (userSelectedFilter.value === '쿼터별' || userSelectedFilter.value === '세트별')
    })
    
    const isRestDaysFilter = computed(() => {
      return userActiveTab.value === '승/패' && userSelectedFilter.value === '휴식일별'
    })
    
    const isHandicapTypeFilter = computed(() => {
      return userActiveTab.value === '핸디캡 승/패' && userSelectedFilter.value === '기타 상황별'
    })
    
    const isOverUnderTypeFilter = computed(() => {
      return userActiveTab.value === '언더/오버' && userSelectedFilter.value === '기타 상황별'
    })
    
    // 사용자 섹션 필터 키
    const userSelectedFilterKey = computed(() => {
      // "전체"를 선택하면 현재 탭에 맞는 필터 사용
      if (userSelectedFilter.value === '전체') {
        const tabToFilterMap = {
          '승/패': 'overall',
          '핸디캡 승/패': 'ats',
          '언더/오버': 'overUnder'
        }
        return tabToFilterMap[userActiveTab.value] || 'overall'
      }
      
      // 승/패 탭
      if (userActiveTab.value === '승/패') {
        // 요일별 필터
        if (userSelectedFilter.value === '요일별') {
          if (selectedDay.value) {
            if (selectedDayType.value === 'all') {
              return `day_${selectedDay.value}`
            } else {
              return `day_${selectedDay.value}_${selectedDayType.value}`
            }
          }
          return 'overall'
        }
        
        // 쿼터별 필터 (농구)
        if (userSelectedFilter.value === '쿼터별') {
          if (selectedQuarter.value === 'overtime') {
            return 'quarter_overtime'
          }
          return `quarter_${selectedQuarter.value}`
        }
        
        // 세트별 필터 (배구)
        if (userSelectedFilter.value === '세트별') {
          return `set_${selectedQuarter.value}`
        }
        
        // 휴식일별 필터
        if (userSelectedFilter.value === '휴식일별') {
          return `restDays_${selectedRestDays.value}`
        }
        
        // 홈경기/원정경기 필터
        if (userSelectedFilter.value === '홈경기') {
          return 'homeTeam'
        } else if (userSelectedFilter.value === '원정경기') {
          return 'awayTeam'
        }
        
        return 'overall'
      }
      
      // 핸디캡 승/패 탭
      if (userActiveTab.value === '핸디캡 승/패') {
        // 홈경기/원정경기 필터
        if (userSelectedFilter.value === '홈경기') {
          return 'atsHomeTeam'
        } else if (userSelectedFilter.value === '원정경기') {
          return 'atsAwayTeam'
        }
        
        // 마핸/플핸 받았을 때 필터 (홈/원정 관계없이 전체)
        if (userSelectedFilter.value === '마핸 받았을 때') {
          return 'atsFavorite'
        } else if (userSelectedFilter.value === '플핸 받았을 때') {
          return 'atsUnderdog'
        }
        
        // 기타 상황별 필터
        if (userSelectedFilter.value === '기타 상황별') {
          if (selectedHandicapCategory.value === 'favorite') {
            if (selectedHandicapType.value === 'home') {
              return 'atsHomeFavorite'
            } else if (selectedHandicapType.value === 'away') {
              return 'atsAwayFavorite'
            }
          } else if (selectedHandicapCategory.value === 'underdog') {
            if (selectedHandicapType.value === 'home') {
              return 'atsHomeUnderdog'
            } else if (selectedHandicapType.value === 'away') {
              return 'atsAwayUnderdog'
            }
          }
          return 'ats'
        }
        
        return 'ats'
      }
      
      // 언더/오버 탭
      if (userActiveTab.value === '언더/오버') {
        // 홈경기/원정경기 필터
        if (userSelectedFilter.value === '홈경기') {
          return 'overUnderHomeTeam'
        } else if (userSelectedFilter.value === '원정경기') {
          return 'overUnderAwayTeam'
        }
        
        // 마핸/플핸 받았을 때 필터 (홈/원정 관계없이 전체)
        if (userSelectedFilter.value === '마핸 받았을 때') {
          return 'overUnderFavorite'
        } else if (userSelectedFilter.value === '플핸 받았을 때') {
          return 'overUnderUnderdog'
        }
        
        // 기타 상황별 필터
        if (userSelectedFilter.value === '기타 상황별') {
          if (selectedHandicapCategory.value === 'favorite') {
            if (selectedHandicapType.value === 'home') {
              return 'overUnderHomeFavorite'
            } else if (selectedHandicapType.value === 'away') {
              return 'overUnderAwayFavorite'
            }
          } else if (selectedHandicapCategory.value === 'underdog') {
            if (selectedHandicapType.value === 'home') {
              return 'overUnderHomeUnderdog'
            } else if (selectedHandicapType.value === 'away') {
              return 'overUnderAwayUnderdog'
            }
          }
          return 'overUnder'
        }
        
        return 'overUnder'
      }
      
      return 'overall'
    })
    
    // Admin 섹션 필터 키
    const adminSelectedFilterKey = computed(() => {
      // "전체"를 선택하면 현재 탭에 맞는 필터 사용
      if (adminSelectedFilter.value === '전체') {
        const tabToFilterMap = {
          '승/패': 'overall',
          '핸디캡 승/패': 'ats',
          '언더/오버': 'overUnder'
        }
        return tabToFilterMap[adminActiveTab.value] || 'overall'
      }
      
      // 영어 라벨에서 직접 필터 값 매핑
      const englishLabelToValue = {
        'As Home Team': 'homeTeam',
        'As Away Team': 'awayTeam',
        'As Favorite': 'favorite',
        'As Underdog': 'underdog',
        'As Home favorite': 'homeFavorite',
        'As Away favorite': 'awayFavorite',
        'As Home Underdog': 'homeUnderdog',
        'As Away Underdog': 'awayUnderdog'
      }
      
      // 요일별 필터 처리 (As 월요일 Home, As 월요일 Away 등)
      const dayFilterMatch = adminSelectedFilter.value.match(/^As (.+) (Home|Away)$/)
      if (dayFilterMatch) {
        const dayLabel = dayFilterMatch[1]
        const homeAway = dayFilterMatch[2].toLowerCase()
        const day = DAYS.find(d => d.label === dayLabel)
        if (day) {
          return `day_${day.key}_${homeAway}`
        }
      }
      
      // 영어 라벨 매핑 확인
      let filterValue = englishLabelToValue[adminSelectedFilter.value]
      
      // 영어 라벨에 없으면 FILTERS에서 찾기 (한글 라벨)
      if (!filterValue) {
        const match = FILTERS.find(filter => filter.label === adminSelectedFilter.value)
        filterValue = match ? match.value : null
      }
      
      if (!filterValue) return 'overall'
      
      // 승/패 섹션
      if (adminActiveTab.value === '승/패') {
        return filterValue
      }
      
      // 핸디캡 승/패 섹션
      if (adminActiveTab.value === '핸디캡 승/패') {
        const atsFilterMap = {
          'all': 'ats',
          'homeTeam': 'atsHomeTeam',
          'awayTeam': 'atsAwayTeam',
          'favorite': 'atsFavorite',
          'underdog': 'atsUnderdog',
          'homeFavorite': 'atsHomeFavorite',
          'awayFavorite': 'atsAwayFavorite',
          'homeUnderdog': 'atsHomeUnderdog',
          'awayUnderdog': 'atsAwayUnderdog'
        }
        return atsFilterMap[filterValue] || 'ats'
      }
      
      // 언더/오버 섹션
      if (adminActiveTab.value === '언더/오버') {
        const overUnderFilterMap = {
          'all': 'overUnder',
          'homeTeam': 'overUnderHomeTeam',
          'awayTeam': 'overUnderAwayTeam',
          'favorite': 'overUnderFavorite',
          'underdog': 'overUnderUnderdog',
          'homeFavorite': 'overUnderHomeFavorite',
          'awayFavorite': 'overUnderAwayFavorite',
          'homeUnderdog': 'overUnderHomeUnderdog',
          'awayUnderdog': 'overUnderAwayUnderdog'
        }
        return overUnderFilterMap[filterValue] || 'overUnder'
      }
      
      return filterValue
    })
    
    // 사용자 섹션 필터된 데이터
    const userFilteredData = computed(() => {
      const key = userSelectedFilterKey.value
      return [...statsData.value].sort((a, b) => {
        // 먼저 선택된 필터 기준 승률로 정렬
        const ratioA = a.metrics[key] || 0
        const ratioB = b.metrics[key] || 0
        
        if (ratioB !== ratioA) {
          return ratioB - ratioA
        }
        
        // 승률이 같으면 골득실 마진으로 정렬
        const marginA = a.pointMargin || 0
        const marginB = b.pointMargin || 0
        
        return marginB - marginA
      })
    })
    
    // Admin 섹션 필터된 데이터
    const adminFilteredData = computed(() => {
      const key = adminSelectedFilterKey.value
      return [...statsData.value].sort((a, b) => {
        // 먼저 선택된 필터 기준 승률로 정렬
        const ratioA = a.metrics[key] || 0
        const ratioB = b.metrics[key] || 0
        
        if (ratioB !== ratioA) {
          return ratioB - ratioA
        }
        
        // 승률이 같으면 골득실 마진으로 정렬
        const marginA = a.pointMargin || 0
        const marginB = b.pointMargin || 0
        
        return marginB - marginA
      })
    })
    
    const orderedGames = computed(() => {
      return [...gamesData.value].sort((a, b) => {
        if (a.date === b.date) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return new Date(b.date) - new Date(a.date)
      })
    })
    
    const handleLanguageChange = () => {
      // 언어 변경 로직
      console.log('Language change')
    }
    
    const handleTitleChange = (title) => {
      selectedTitle.value = title
      // 타이틀 변경 시 gender도 자동으로 변경됨 (computed)
      // 데이터도 자동으로 다시 로드됨 (watch)
      console.log('타이틀 변경:', title, '→ gender:', selectedGender.value)
    }
    
    // 사용자 섹션 핸들러
    const handleUserTabChange = (tab) => {
      userActiveTab.value = tab
      // 탭 변경 시 항상 필터를 "전체"로 초기화
      userSelectedFilter.value = '전체'
    }
    
    const handleUserFilterChange = (filter) => {
      userSelectedFilter.value = filter
    }
    
    // Admin 섹션 핸들러
    const handleAdminTabChange = (tab) => {
      adminActiveTab.value = tab
      // 탭 변경 시 항상 필터를 "전체"로 초기화
      adminSelectedFilter.value = '전체'
    }
    
    const handleAdminFilterChange = (filter) => {
      adminSelectedFilter.value = filter
    }
    
    // 섹션 필터 초기화 핸들러
    const resetUserFilter = () => {
      userSelectedFilter.value = '전체'
      userActiveTab.value = '승/패'
    }
    
    const resetAdminFilter = () => {
      adminSelectedFilter.value = '전체'
      adminActiveTab.value = '승/패'
    }
    
    const handleAddClick = () => {
      editData.value = null
      showInputModal.value = true
    }
    
    const handleEdit = (game) => {
      editData.value = game
      showInputModal.value = true
    }
    
    const handleCloseModal = () => {
      showInputModal.value = false
      editData.value = null
    }
    
    const handleDataSubmit = async (gameData) => {
      try {
        // 디버깅: 받은 데이터 확인
        console.log('📥 AdminView handleDataSubmit - 받은 gameData:', JSON.stringify(gameData, null, 2))
        console.log('📥 세트 데이터:', {
          homeSet1: gameData.homeSet1,
          homeSet2: gameData.homeSet2,
          homeSet3: gameData.homeSet3,
          awaySet1: gameData.awaySet1,
          awaySet2: gameData.awaySet2,
          awaySet3: gameData.awaySet3
        })
        
        // 항상 현재 선택된 타이틀에 맞는 gender 사용 (사용자가 수동으로 변경한 값 무시)
        const finalGender = selectedGender.value
        console.log('📝 데이터 저장 시작')
        console.log('  - 선택된 타이틀:', selectedTitle.value)
        console.log('  - 선택된 gender (computed):', selectedGender.value)
        console.log('  - 전달된 gameData.gender:', gameData.gender, '(무시됨)')
        console.log('  - 최종 gender (강제):', finalGender)
        
        if (gameData.id) {
          // 수정 모드
          const index = gamesData.value.findIndex(g => g.id === gameData.id)
          if (index !== -1) {
            const formattedGame = formatGameData({
              ...gameData,
              gender: finalGender
            })
            formattedGame.id = gameData.id // ID 유지
            formattedGame.createdAt = gamesData.value[index].createdAt // 생성 시간 유지
            formattedGame.gender = finalGender // gender 명시적으로 설정
            console.log('✏️ 수정 모드 - 저장할 게임 데이터:', JSON.stringify(formattedGame, null, 2))
            // 개별 게임만 저장 (전체 배열 저장 대신)
            // 실시간 리스너가 자동으로 업데이트하므로 로컬 배열 수정 불필요
            await saveGamesData([formattedGame])
          }
        } else {
          // 추가 모드
          const formattedGame = formatGameData({
            ...gameData,
            gender: finalGender
          })
          formattedGame.gender = finalGender // gender 명시적으로 설정
          console.log('➕ 추가 모드 - 저장할 게임 데이터:', JSON.stringify(formattedGame, null, 2))
          
          // gender 확인
          if (formattedGame.gender !== finalGender) {
            console.error('❌ gender 불일치!', formattedGame.gender, 'vs', finalGender)
            alert('데이터 저장 중 오류가 발생했습니다. gender 필드가 올바르게 설정되지 않았습니다.')
            return
          }
          
          // 개별 게임만 저장 (전체 배열 저장 대신)
          // 실시간 리스너가 자동으로 업데이트하므로 로컬 배열 수정 불필요
          await saveGamesData([formattedGame])
        }
        handleCloseModal()
      } catch (error) {
        console.error('데이터 저장 실패:', error)
        alert('데이터 저장에 실패했습니다.')
      }
    }
    
    const handleDelete = (gameId) => {
      deleteTargetId.value = gameId
      showDeleteConfirm.value = true
    }
    
    const confirmDelete = async () => {
      if (deleteTargetId.value) {
        try {
          // 삭제할 게임이 현재 선택된 gender에 속하는지 확인
          const gameToDelete = gamesData.value.find(g => g.id === deleteTargetId.value)
          if (!gameToDelete) {
            alert('삭제할 경기를 찾을 수 없습니다.')
            showDeleteConfirm.value = false
            return
          }
          
          const currentGender = selectedGender.value
          if (gameToDelete.gender !== currentGender) {
            alert(`이 경기는 ${gameToDelete.gender} 데이터입니다. 현재 선택된 타이틀(${currentGender})과 일치하지 않습니다.`)
            showDeleteConfirm.value = false
            return
          }
          
          console.log('🗑️ 경기 삭제 시작 - 게임 ID:', deleteTargetId.value, 'gender:', gameToDelete.gender, '현재 gender:', currentGender)
          
          // Firestore에서 직접 삭제
          const success = await deleteGame(deleteTargetId.value)
          if (success) {
            // 실시간 리스너가 자동으로 업데이트하므로 로컬 배열 수정 불필요
            console.log('✅ 경기 삭제 완료 - gender:', currentGender)
          } else {
            alert('경기 삭제에 실패했습니다.')
          }
        } catch (error) {
          console.error('경기 삭제 실패:', error)
          alert('경기 삭제 중 오류가 발생했습니다: ' + error.message)
        }
      }
      showDeleteConfirm.value = false
      deleteTargetId.value = null
    }
    
    const handleExportData = () => {
      if (gamesData.value.length === 0) {
        // localStorage에서 직접 확인
        const directLoad = loadGamesData()
        if (directLoad && directLoad.length > 0) {
          console.log('💡 localStorage에서 직접 로드한 데이터:', directLoad.length, '개')
          const useDirect = confirm(
            `localStorage에 ${directLoad.length}개 경기 데이터가 있습니다.\n` +
            '이 데이터를 내보내시겠습니까?'
          )
          if (useDirect) {
            gamesData.value = directLoad
            exportGamesData(directLoad)
            return
          }
        }
        alert('내보낼 데이터가 없습니다.\n\n크롬에서 데이터를 입력했는지 확인해주세요.')
        return
      }
      exportGamesData(gamesData.value)
    }
    
    const handleExportExcel = () => {
      if (gamesData.value.length === 0) {
        // localStorage에서 직접 확인
        const directLoad = loadGamesData()
        if (directLoad && directLoad.length > 0) {
          console.log('💡 localStorage에서 직접 로드한 데이터:', directLoad.length, '개')
          const useDirect = confirm(
            `localStorage에 ${directLoad.length}개 경기 데이터가 있습니다.\n` +
            '이 데이터를 엑셀로 내보내시겠습니까?'
          )
          if (useDirect) {
            gamesData.value = directLoad
            exportGamesDataToExcel(directLoad)
            return
          }
        }
        alert('내보낼 데이터가 없습니다.\n\n크롬에서 데이터를 입력했는지 확인해주세요.')
        return
      }
      exportGamesDataToExcel(gamesData.value)
    }
    
    const handleImportData = async (file) => {
      try {
        const importedGames = await importGamesData(file)
        console.log('📥 엑셀 임포트 시작')
        console.log('📊 임포트된 경기 수:', importedGames.length)
        console.log('📋 임포트된 경기 목록:', importedGames.map(g => `${g.date} ${g.homeTeam} vs ${g.awayTeam}`))
        
        if (importedGames && importedGames.length > 0) {
          // 현재 기존 데이터 확인
          console.log('💾 현재 기존 데이터 수:', gamesData.value.length)
          console.log('📋 기존 경기 목록:', gamesData.value.map(g => `${g.date} ${g.homeTeam} vs ${g.awayTeam}`))
          
          // 기존 데이터의 키 생성
          const existingGamesSet = new Set(
            gamesData.value.map(g => {
              const key = `${g.date}_${g.homeTeam}_${g.awayTeam}`
              console.log('🔑 기존 데이터 키:', key)
              return key
            })
          )
          
          // 1단계: 엑셀 파일 내부 중복 제거 (동일한 날짜, 홈팀, 원정팀)
          const seenInFile = new Set()
          const uniqueInFile = []
          let fileInternalDuplicates = 0
          
          importedGames.forEach(game => {
            const key = `${game.date}_${game.homeTeam}_${game.awayTeam}`
            console.log('🔍 파일 내부 체크 - 키:', key, '중복 여부:', seenInFile.has(key))
            if (!seenInFile.has(key)) {
              seenInFile.add(key)
              uniqueInFile.push(game)
            } else {
              fileInternalDuplicates++
              console.log('⚠️ 파일 내부 중복 발견:', key)
            }
          })
          
          console.log('📊 파일 내부 중복 제거 후:', uniqueInFile.length, '개')
          
          // 2단계: 기존 데이터와의 중복 체크
          const newGames = uniqueInFile.filter(g => {
            const key = `${g.date}_${g.homeTeam}_${g.awayTeam}`
            const isDuplicate = existingGamesSet.has(key)
            console.log('🔍 기존 데이터 체크 - 키:', key, '중복 여부:', isDuplicate)
            if (isDuplicate) {
              console.log('⚠️ 기존 데이터와 중복:', key)
            }
            return !isDuplicate
          })
          
          const existingDuplicates = uniqueInFile.length - newGames.length
          const totalDuplicates = importedGames.length - newGames.length
          
          console.log('📊 최종 결과:')
          console.log('  - 파일 내부 중복:', fileInternalDuplicates, '개')
          console.log('  - 기존 데이터와 중복:', existingDuplicates, '개')
          console.log('  - 추가될 데이터:', newGames.length, '개')
          console.log('  - 총 중복:', totalDuplicates, '개')
          
          if (newGames.length === 0) {
            let message = `모든 데이터가 중복됩니다.\n\n`
            message += `엑셀 파일 내부 중복: ${fileInternalDuplicates}개\n`
            message += `기존 데이터와 중복: ${existingDuplicates}개\n`
            message += `총 중복: ${totalDuplicates}개`
            console.log('❌ 모든 데이터 중복:', message)
            alert(message)
            return
          }
          
          // 중복이 있으면 알림
          let message = `가져온 데이터: ${importedGames.length}개 경기\n\n`
          if (fileInternalDuplicates > 0) {
            message += `엑셀 파일 내부 중복 제외: ${fileInternalDuplicates}개\n`
          }
          if (existingDuplicates > 0) {
            message += `기존 데이터와 중복 제외: ${existingDuplicates}개\n`
          }
          message += `추가될 데이터: ${newGames.length}개\n\n`
          message += '이 데이터를 추가하시겠습니까?'
          
          console.log('💬 사용자 확인 메시지:', message)
          
          const shouldAdd = confirm(message)
          
          if (shouldAdd) {
            gamesData.value.push(...newGames)
            saveData()
            let successMessage = `${newGames.length}개 경기가 추가되었습니다.`
            if (totalDuplicates > 0) {
              successMessage += `\n(총 ${totalDuplicates}개 중복 제외`
              if (fileInternalDuplicates > 0 && existingDuplicates > 0) {
                successMessage += ` - 파일 내부: ${fileInternalDuplicates}개, 기존 데이터: ${existingDuplicates}개`
              } else if (fileInternalDuplicates > 0) {
                successMessage += ` - 파일 내부: ${fileInternalDuplicates}개`
              } else {
                successMessage += ` - 기존 데이터: ${existingDuplicates}개`
              }
              successMessage += ')'
            }
            console.log('✅ 데이터 추가 완료:', successMessage)
            alert(successMessage)
          } else {
            console.log('❌ 사용자가 취소함')
          }
        } else {
          alert('가져올 데이터가 없습니다.')
        }
      } catch (error) {
        alert('데이터 가져오기 실패: ' + error.message)
        console.error('Import error:', error)
      }
    }
    
    const lastUpdate = computed(() => {
      if (gamesData.value.length === 0) {
        return new Date().toISOString().split('T')[0]
      }
      const latest = [...gamesData.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      return latest?.date
    })
    
    return {
      isAuthenticated,
      handleLoginSuccess,
      currentSeason,
      selectedGender,
      showInputModal,
      tabs,
      userFilterOptions,
      adminFilterOptions,
      orderedGames,
      gamesData,
      statsData,
      handleLanguageChange,
      handleAddClick,
      handleEdit,
      handleCloseModal,
      handleDataSubmit,
      handleDelete,
      confirmDelete,
      handleExportData,
      handleExportExcel,
      handleImportData,
      handleTitleChange,
      availableTitles,
      selectedTitle,
      selectedGender,
      currentSport,
      editData,
      showDeleteConfirm,
      lastUpdate,
      // 사용자 섹션
      userActiveTab,
      userSelectedFilter,
      userFilteredData,
      userSelectedFilterKey,
      handleUserTabChange,
      handleUserFilterChange,
      // 사용자 섹션 서브필터
      isDayFilter,
      isQuarterFilter,
      isRestDaysFilter,
      isHandicapTypeFilter,
      isOverUnderTypeFilter,
      selectedDay,
      selectedDayType,
      selectedQuarter,
      selectedRestDays,
      selectedHandicapType,
      selectedHandicapCategory,
      DAYS,
      // Admin 섹션
      adminActiveTab,
      adminSelectedFilter,
      adminFilteredData,
      adminSelectedFilterKey,
      handleAdminTabChange,
      handleAdminFilterChange,
      resetUserFilter,
      resetAdminFilter,
      // 예측 관리
      predictionData,
      predictionForm1,
      predictionForm2,
      predictionForm3,
      isBasketballMen,
      hasPrediction1,
      hasPrediction2,
      hasPrediction3,
      teamList,
      handleSavePrediction,
      handleDeletePrediction
    }
  }
}
</script>

<style scoped>
.gender-selector {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gender-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.gender-selector select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

/* 스포츠/성별 선택 버튼 */
.sport-selector {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.sport-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sport-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sport-icon {
  font-size: 22px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.sport-name {
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}

.sport-buttons {
  display: flex;
  gap: 8px;
}

.sport-btn {
  padding: 10px 20px;
  border: 2px solid #dee2e6;
  border-radius: 25px;
  background-color: #ffffff;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.sport-btn:hover {
  border-color: #adb5bd;
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.sport-btn.active {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  color: #ffffff;
  border-color: #212529;
  box-shadow: 0 4px 12px rgba(33,37,41,0.3);
}

.sport-btn.active:hover {
  background: linear-gradient(135deg, #343a40 0%, #495057 100%);
}

.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 80px;
}

.add-data-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #000000;
  color: #ffffff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  z-index: 100;
}

.add-data-btn:hover {
  background-color: #333333;
  transform: scale(1.05);
}

.add-data-btn:active {
  transform: scale(0.95);
}

.last-update {
  padding: 12px 16px;
  font-size: 14px;
  color: #666666;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.delete-confirm-dialog {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
}

.delete-confirm-dialog h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

.delete-confirm-dialog p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666666;
}

.delete-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #000000;
}

.btn-cancel:hover {
  background-color: #e8e8e8;
}

.btn-confirm-delete {
  background-color: #ff4444;
  color: #ffffff;
}

.btn-confirm-delete:hover {
  background-color: #cc0000;
}

.section {
  margin-bottom: 40px;
  border-bottom: 2px solid #e0e0e0;
}

.section:last-of-type {
  border-bottom: none;
}

.section-header {
  padding: 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-header:hover {
  background-color: #f0f0f0;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

.section-title-description {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: #888888;
  font-style: italic;
}

.user-section {
  background-color: #ffffff;
}

.admin-section {
  background-color: #f9f9f9;
}

@media (min-width: 768px) {
  .add-data-btn {
    bottom: 24px;
    right: 24px;
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
  
  .section-header {
    padding: 20px 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
}

.prediction-management-section {
  margin: 20px 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.section-subtitle {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #666666;
  font-weight: 400;
}

.prediction-input-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.form-subtitle {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #007bff;
  padding-bottom: 8px;
  border-bottom: 2px solid #007bff;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row label {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.form-row select,
.form-row input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #000000;
}

.form-row select:focus,
.form-row input:focus {
  outline: none;
  border-color: #000000;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-save,
.btn-delete {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background-color: #000000;
  color: #ffffff;
}

.btn-save:hover {
  background-color: #333333;
}

.btn-delete {
  background-color: #dc3545;
  color: #ffffff;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-delete:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .prediction-management-section {
    margin: 24px;
    padding: 20px;
  }
  
  .form-row {
    flex-direction: row;
    align-items: center;
  }
  
  .form-row label {
    width: 120px;
    flex-shrink: 0;
  }
  
  .form-row select,
  .form-row input {
    flex: 1;
  }
}

/* 서브필터 스타일 */
.day-selector {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.day-selector-header {
  margin-bottom: 12px;
}

.day-selector-title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

.day-type-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.day-type-button {
  flex: 1;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.day-type-button:hover {
  border-color: #999999;
  background-color: #f5f5f5;
}

.day-type-button.active {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

.day-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.day-button {
  flex: 1;
  min-width: calc(14.28% - 7px);
  padding: 10px 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.day-button:hover {
  border-color: #999999;
  background-color: #f5f5f5;
}

.day-button.active {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

.quarter-selector {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.quarter-selector-header {
  margin-bottom: 12px;
}

.quarter-selector-title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

.quarter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quarter-button {
  flex: 1;
  min-width: calc(20% - 7px);
  padding: 10px 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.quarter-button:hover {
  border-color: #999999;
  background-color: #f5f5f5;
}

.quarter-button.active {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

.rest-days-selector {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.rest-days-selector-header {
  margin-bottom: 12px;
}

.rest-days-selector-title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

.rest-days-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rest-days-button {
  flex: 1;
  min-width: calc(20% - 7px);
  padding: 10px 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.rest-days-button:hover {
  border-color: #999999;
  background-color: #f5f5f5;
}

.rest-days-button.active {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

.handicap-type-selector {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.handicap-type-selector-header {
  margin-bottom: 12px;
}

.handicap-type-selector-title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

.handicap-type-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.handicap-type-button {
  flex: 1;
  padding: 10px 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.handicap-type-button:hover {
  border-color: #999999;
  background-color: #f5f5f5;
}

.handicap-type-button.active {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

/* Footer */
.site-footer {
  margin-top: 40px;
  padding: 20px 16px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.site-footer p {
  margin: 0;
  font-size: 12px;
  color: #888888;
}
</style>

