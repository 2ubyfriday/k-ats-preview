<template>
  <div class="app-container">
    <StatusBar />
    <Header 
      :season="currentSeason"
      :titles="availableTitles"
      :current-title="selectedTitle"
      :hide-export-import="true"
      @change-language="handleLanguageChange"
      @title-change="handleTitleChange"
    />
    
    <!-- 사용자 섹션 -->
    <div class="section user-section">
      <div class="section-header">
        <div class="section-title-description">
          <span v-if="userActiveTab === '승/패'">일반 승리, 패배에 대한 데이터가 보여짐</span>
          <span v-else-if="userActiveTab === '핸디캡 승/패'">핸디캡 적용시 데이터가 보여짐</span>
          <span v-else-if="userActiveTab === '언더/오버'">언더/오버</span>
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
      <!-- 쿼터별 필터 선택 시 쿼터 버튼 표시 -->
      <div v-if="isQuarterFilter" class="quarter-selector">
        <div class="quarter-selector-header">
          <span class="quarter-selector-title">쿼터 선택</span>
        </div>
        <div class="quarter-buttons">
          <button
            v-for="q in [1, 2, 3, 4]"
            :key="q"
            :class="['quarter-button', { active: selectedQuarter === q }]"
            @click="handleQuarterSelect(q)"
          >
            {{ q }}쿼터
          </button>
          <button
            :class="['quarter-button', { active: selectedQuarter === 'overtime' }]"
            @click="handleQuarterSelect('overtime')"
          >
            연장전
          </button>
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
            @click="handleRestDaysSelect(0)"
          >
            휴식없음
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 1 }]"
            @click="handleRestDaysSelect(1)"
          >
            1일 휴식
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 2 }]"
            @click="handleRestDaysSelect(2)"
          >
            2일 휴식
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 3 }]"
            @click="handleRestDaysSelect(3)"
          >
            3일 휴식
          </button>
          <button
            :class="['rest-days-button', { active: selectedRestDays === 4 }]"
            @click="handleRestDaysSelect(4)"
          >
            4+ 휴식
          </button>
        </div>
      </div>
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
            @click="handleDaySelect(day.key, selectedDayType)"
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
            @click="handleDayTypeSelect('all')"
          >
            전체
          </button>
          <button
            :class="['day-type-button', { active: selectedDayType === 'home' }]"
            @click="handleDayTypeSelect('home')"
          >
            홈
          </button>
          <button
            :class="['day-type-button', { active: selectedDayType === 'away' }]"
            @click="handleDayTypeSelect('away')"
          >
            원정
          </button>
        </div>
      </div>
      <!-- 핸디캡 타입별 필터 선택 시 홈/원정 버튼 표시 -->
      <div v-if="isHandicapTypeFilter" class="handicap-type-selector">
        <div class="handicap-type-selector-header">
          <span class="handicap-type-selector-title">마이너스 핸디캡 / 플러스 핸디캡</span>
        </div>
        <div class="handicap-type-buttons">
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'favorite' }]"
            @click="handleHandicapCategorySelect('favorite')"
          >
            마이너스 핸디캡
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapCategory === 'underdog' }]"
            @click="handleHandicapCategorySelect('underdog')"
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
            @click="handleHandicapTypeSelect('home')"
          >
            홈
          </button>
          <button
            :class="['handicap-type-button', { active: selectedHandicapType === 'away' }]"
            @click="handleHandicapTypeSelect('away')"
          >
            원정
          </button>
        </div>
      </div>
      <StandingsTable 
        :data="userFilteredData"
        :highlight-key="userSelectedFilterKey"
        :filter-only="true"
      />
    </div>
    
    <!-- 시간대별 메뉴 추천 카드 -->
    <div class="promo-card" @click="recommendMeal">
      <div class="promo-content">
        <span class="promo-text">{{ mealTimeText }}</span>
      </div>
    </div>
    
    <MatchupPrediction 
      v-if="gamesData.length > 0 && statsData.length > 0"
      :games="gamesData"
      :stats="statsData"
      :prediction-data="predictionData"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import StatusBar from '../components/StatusBar.vue'
import Header from '../components/Header.vue'
import NavigationTabs from '../components/NavigationTabs.vue'
import FilterDropdown from '../components/FilterDropdown.vue'
import StandingsTable from '../components/StandingsTable.vue'
import MatchupPrediction from '../components/MatchupPrediction.vue'
import { loadGamesData, subscribeToGamesData, subscribeToPredictionData } from '../utils/firebaseStorage.js'
import { calculateTeamStats, FILTERS, DAYS } from '../utils/gameCalculations.js'

export default {
  name: 'UserView',
  components: {
    StatusBar,
    Header,
    NavigationTabs,
    FilterDropdown,
    StandingsTable,
    MatchupPrediction
  },
  setup() {
    const currentSeason = ref('2025~2026')
    
    // 타이틀 관리
    const availableTitles = ref([
      'K-Basketball(Man)',
      'K-Basketball(여자부)'
    ])
    const selectedTitle = ref('K-Basketball(여자부)')
    
    // 타이틀에 따라 자동으로 gender 결정
    const selectedGender = computed(() => {
      if (selectedTitle.value === 'K-Basketball(Man)') {
        return '남자부'
      } else {
        return '여자부'
      }
    })
    
    const tabs = ['승/패', '핸디캡 승/패', '언더/오버']
    
    // 섹션별 필터 옵션
    const getFilterOptionsForTab = (tab) => {
      if (tab === '승/패') {
        return [
          '전체',
          '홈경기',
          '원정경기',
          '요일별',
          '쿼터별',
          '휴식일별'
        ]
      } else if (tab === '핸디캡 승/패') {
        return [
          '전체',
          '홈경기',
          '원정경기',
          '기타 상황별'
        ]
      } else if (tab === '언더/오버') {
        return [
          'All',
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
      return ['All']
    }
    
    // 사용자 섹션 필터 옵션
    const userFilterOptions = computed(() => getFilterOptionsForTab(userActiveTab.value))
    
    // 오늘 요일 가져오기
    const getTodayDayKey = () => {
      const today = new Date()
      const dayIndex = today.getDay()
      return DAYS[dayIndex].key
    }
    
    // 사용자 섹션 상태
    const userActiveTab = ref('승/패')
    const userSelectedFilter = ref('전체')
    const selectedDay = ref(getTodayDayKey()) // 선택된 요일 (기본값: 오늘 요일)
    const selectedDayType = ref('all') // 'all', 'home', 또는 'away' (기본값: 'all')
    const selectedQuarter = ref(1) // 선택된 쿼터 (1, 2, 3, 4, 'overtime') (기본값: 1)
    const selectedRestDays = ref(0) // 선택된 휴식일 (0: 백투백, 1: 1일, 2: 2일, 3: 3일, 4: 4+) (기본값: 0)
    const selectedHandicapType = ref('home') // 'home' 또는 'away' (기본값: 'home')
    const selectedHandicapCategory = ref('favorite') // 'favorite' (마이너스) 또는 'underdog' (플러스) (기본값: 'favorite')
    
    // 게임 데이터 저장
    const gamesData = ref([])
    
    // 예측 데이터
    const predictionData = ref(null)
    
    // 배정의 랭겜 전적 데이터
    const rankedGames = ref([])
    
    // 랭겜 전적 데이터 로드
    const loadRankedGames = async () => {
      try {
        // fow.lol에서 데이터 가져오기 시도
        // CORS 문제로 직접 fetch가 안 될 수 있으므로, 서버 사이드에서 처리하거나 프록시 사용 필요
        const url = 'https://www.fow.lol/find/kr/%EC%A3%84%EA%B0%801%EB%8F%84%EC%97%86%EB%8A%94%EC%82%AC%EB%9E%8C-KR1'
        
        // 직접 fetch는 CORS 문제로 실패할 가능성이 높음
        // 임시로 하드코딩된 데이터 사용
        // 실제로는 서버 사이드에서 크롤링하거나 API를 통해 데이터를 가져와야 함
        
        // TODO: 서버 사이드 API 또는 프록시를 통해 데이터 가져오기
        // const response = await fetch('/api/ranked-games')
        // const data = await response.json()
        
        // 하드코딩 데이터
        rankedGames.value = [
          { result: '패', champion: '트페', kills: 6, deaths: 8, assists: 6, kda: '1.50' },
          { result: '패', champion: '말파', kills: 3, deaths: 3, assists: 7, kda: '3.33' },
          { result: '패', champion: '리신', kills: 0, deaths: 7, assists: 2, kda: '0.29' }
        ]
      } catch (error) {
        console.error('랭겜 전적 로드 실패:', error)
        rankedGames.value = []
      }
    }
    
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
      
      // 새로운 실시간 리스너 설정
      unsubscribeGames = subscribeToGamesData((games) => {
        gamesData.value = games
      }, currentGender)
    }
    
    // 예측 데이터 실시간 구독 설정
    const setupPredictionListener = () => {
      if (unsubscribePrediction) {
        unsubscribePrediction()
        unsubscribePrediction = null
      }
      
      unsubscribePrediction = subscribeToPredictionData((data) => {
        predictionData.value = data
      }, selectedGender.value)
    }
    
    // 데이터 로드
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
    watch(selectedTitle, () => {
      // 실시간 리스너를 먼저 재설정 (새로운 gender 필터 적용)
      setupRealtimeListener()
      // 데이터 로드
      loadData()
      // 예측 데이터 리스너 설정
      setupPredictionListener()
    })
    
    onMounted(() => {
      loadData()
      setupPredictionListener()
      loadRankedGames()
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
    
    const statsData = computed(() => calculateTeamStats(gamesData.value))
    
    // 요일별 필터인지 확인
    const isDayFilter = computed(() => {
      return userActiveTab.value === '승/패' && userSelectedFilter.value === '요일별'
    })
    
    // 쿼터별 필터인지 확인
    const isQuarterFilter = computed(() => {
      return userActiveTab.value === '승/패' && userSelectedFilter.value === '쿼터별'
    })
    
    // 휴식일별 필터인지 확인
    const isRestDaysFilter = computed(() => {
      return userActiveTab.value === '승/패' && userSelectedFilter.value === '휴식일별'
    })
    
    // 핸디캡 타입 선택 필터인지 확인 (마이너스/플러스 핸디캡 선택 시)
    const isHandicapTypeFilter = computed(() => {
      const cleanFilter = userSelectedFilter.value.replace(/<[^>]*>/g, '').trim()
      return userActiveTab.value === '핸디캡 승/패' && 
             (cleanFilter === '기타 상황별' || userSelectedFilter.value === '기타 상황별' || userSelectedFilter.value.includes('기타 상황별'))
    })
    
    // 기타 상황별 필터 선택 시 기본값 강제 설정
    watch([userActiveTab, userSelectedFilter], () => {
      if (userActiveTab.value === '핸디캡 승/패') {
        const cleanFilter = userSelectedFilter.value.replace(/<[^>]*>/g, '').trim()
        if (cleanFilter === '기타 상황별' || userSelectedFilter.value === '기타 상황별' || userSelectedFilter.value.includes('기타 상황별')) {
          // 즉시 설정
          selectedHandicapCategory.value = 'favorite' // 마이너스 핸디캡 기본 선택
          selectedHandicapType.value = 'home' // 홈 기본 선택
        }
      }
    }, { immediate: true })
    
    // 사용자 섹션 필터 키
    const userSelectedFilterKey = computed(() => {
      if (userSelectedFilter.value === '전체') {
        const tabToFilterMap = {
          '승/패': 'overall',
          '핸디캡 승/패': 'ats',
          '언더/오버': 'overUnder'
        }
        return tabToFilterMap[userActiveTab.value] || 'overall'
      }
      
      // 요일별 필터 처리
      if (userActiveTab.value === '승/패' && userSelectedFilter.value === '요일별') {
        if (selectedDay.value) {
          if (selectedDayType.value === 'all') {
            // 전체 선택 시: day_sun 형식으로 반환 (홈/원정 구분 없음)
            return `day_${selectedDay.value}`
          } else if (selectedDayType.value === 'home' || selectedDayType.value === 'away') {
            return `day_${selectedDay.value}_${selectedDayType.value}`
          }
        }
        return 'overall' // 요일이 선택되지 않았으면 전체
      }
      
      // 쿼터별 필터 처리
      if (userActiveTab.value === '승/패' && userSelectedFilter.value === '쿼터별') {
        if (selectedQuarter.value === 'overtime') {
          return 'quarter_overtime'
        }
        return `quarter_${selectedQuarter.value}`
      }
      
      // 휴식일별 필터 처리
      if (userActiveTab.value === '승/패' && userSelectedFilter.value === '휴식일별') {
        return `restDays_${selectedRestDays.value}`
      }
      
      // 홈경기/원정경기 필터 처리
      if (userActiveTab.value === '승/패') {
        if (userSelectedFilter.value === '홈경기') {
          return 'homeTeam'
        } else if (userSelectedFilter.value === '원정경기') {
          return 'awayTeam'
        }
      }
      
      if (userActiveTab.value === '핸디캡 승/패') {
        // 기타 상황별 필터는 FILTERS에 없으므로 먼저 처리
        if (userSelectedFilter.value === '기타 상황별' || userSelectedFilter.value.includes('기타 상황별')) {
          // 기타 상황별 선택 시 마이너스/플러스와 홈/원정 조합에 따라 필터 키 반환
          if (selectedHandicapCategory.value === 'favorite') {
            // 마이너스 핸디캡
            if (selectedHandicapType.value === 'home') {
              return 'atsHomeFavorite'
            } else if (selectedHandicapType.value === 'away') {
              return 'atsAwayFavorite'
            }
          } else if (selectedHandicapCategory.value === 'underdog') {
            // 플러스 핸디캡
            if (selectedHandicapType.value === 'home') {
              return 'atsHomeUnderdog'
            } else if (selectedHandicapType.value === 'away') {
              return 'atsAwayUnderdog'
            }
          }
          return 'ats' // 기본값
        }
        
        const match = FILTERS.find(filter => {
          // HTML 태그 제거하여 비교
          const cleanFilterLabel = filter.label.replace(/<[^>]*>/g, '').trim()
          const cleanSelectedFilter = userSelectedFilter.value.replace(/<[^>]*>/g, '').trim()
          return filter.label === userSelectedFilter.value || cleanFilterLabel === cleanSelectedFilter
        })
        if (!match) return 'overall'
        
        const filterValue = match.value
        
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
      
      if (userActiveTab.value === '언더/오버') {
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
        const ratioA = a.metrics[key] || 0
        const ratioB = b.metrics[key] || 0
        
        if (ratioB !== ratioA) {
          return ratioB - ratioA
        }
        
        const marginA = a.pointMargin || 0
        const marginB = b.pointMargin || 0
        
        return marginB - marginA
      })
    })
    
    const handleLanguageChange = () => {
      console.log('Language change')
    }
    
    const handleTitleChange = (title) => {
      selectedTitle.value = title
      // 타이틀 변경 시 gender도 자동으로 변경됨 (computed)
      // 데이터도 자동으로 다시 로드됨 (watch)
      console.log('타이틀 변경:', title, '→ gender:', selectedGender.value)
    }
    
    const handleUserTabChange = (tab) => {
      userActiveTab.value = tab
      // 탭 변경 시 항상 필터를 "전체"로 초기화
      userSelectedFilter.value = '전체'
      selectedDay.value = getTodayDayKey()
      selectedDayType.value = 'all'
      selectedQuarter.value = 1
      selectedRestDays.value = 0
    }
    
    const handleUserFilterChange = (filter) => {
      // 기타 상황별 필터 선택 시 먼저 기본값 설정
      const cleanFilter = filter.replace(/<[^>]*>/g, '').trim()
      if (cleanFilter === '기타 상황별' || filter === '기타 상황별' || filter.includes('기타 상황별')) {
        selectedHandicapCategory.value = 'favorite' // 마이너스 핸디캡 기본 선택
        selectedHandicapType.value = 'home' // 홈 기본 선택
      }
      
      userSelectedFilter.value = filter
      
      // 요일별 필터가 아니면 요일 선택 초기화
      if (filter !== '요일별') {
        selectedDay.value = getTodayDayKey()
        selectedDayType.value = 'all'
      } else {
        // 요일별 필터 선택 시 기본값 설정
        selectedDay.value = getTodayDayKey()
        selectedDayType.value = 'all'
      }
      // 쿼터별 필터 선택 시 기본값 설정
      if (filter === '쿼터별') {
        selectedQuarter.value = 1
      }
      // 휴식일별 필터 선택 시 기본값 설정
      if (filter === '휴식일별') {
        selectedRestDays.value = 0
      }
    }
    
    const handleQuarterSelect = (quarter) => {
      selectedQuarter.value = quarter
    }
    
    const handleRestDaysSelect = (restDays) => {
      selectedRestDays.value = restDays
    }
    
    const handleDayTypeSelect = (dayType) => {
      selectedDayType.value = dayType
      // 요일 타입 변경 시에도 요일은 유지
    }
    
    const handleHandicapTypeSelect = (handicapType) => {
      selectedHandicapType.value = handicapType
    }
    
    const handleHandicapCategorySelect = (category) => {
      selectedHandicapCategory.value = category
    }
    
    const handleDaySelect = (dayKey, dayType) => {
      selectedDay.value = dayKey
      // 요일 선택 시에도 타입은 유지
    }
    
    const resetUserFilter = () => {
      userSelectedFilter.value = '전체'
      userActiveTab.value = '승/패'
      selectedDay.value = getTodayDayKey()
      selectedDayType.value = 'all'
      selectedQuarter.value = 1
      selectedRestDays.value = 0
      selectedHandicapCategory.value = 'favorite'
      selectedHandicapType.value = 'home'
    }
    
    // 현재 시간대에 맞는 식사 시간 판단
    const getMealTime = () => {
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const totalMinutes = hour * 60 + minute
      
      // 02:01 ~ 09:00: 아침메뉴
      if ((hour === 2 && minute >= 1) || (hour >= 3 && hour < 9) || (hour === 9 && minute === 0)) {
        return 'breakfast'
      }
      // 09:01 ~ 13:00: 점심메뉴
      else if ((hour === 9 && minute >= 1) || (hour >= 10 && hour < 13) || (hour === 13 && minute === 0)) {
        return 'lunch'
      }
      // 13:01 ~ 16:00: 간식
      else if ((hour === 13 && minute >= 1) || (hour >= 14 && hour < 16) || (hour === 16 && minute === 0)) {
        return 'snack'
      }
      // 16:01 ~ 20:00: 저녁
      else if ((hour === 16 && minute >= 1) || (hour >= 17 && hour < 20) || (hour === 20 && minute === 0)) {
        return 'dinner'
      }
      // 20:01 ~ 02:00: 야식
      else {
        return 'lateNight'
      }
    }
    
    // 시간대별 텍스트
    const mealTimeText = computed(() => {
      const mealTime = getMealTime()
      const texts = {
        breakfast: '아침메뉴 뭐먹지?',
        lunch: '점심메뉴 뭐먹지?',
        snack: '간식 뭐먹지?',
        dinner: '저녁 뭐먹지?',
        lateNight: '야식 뭐먹지?'
      }
      return texts[mealTime] || '점심메뉴 뭐먹지?'
    })
    
    // 시간대별 메뉴 추천 함수
    const recommendMeal = () => {
      const mealTime = getMealTime()
      
      const breakfastMenus = [
        '샌드위치',
        '토스트',
        '베이글',
        '크로와상',
        '팬케이크',
        '와플',
        '계란후라이',
        '스크램블에그',
        '오믈렛',
        '계란찜',
        '죽',
        '미역국',
        '된장국',
        '김밥',
        '삼明治',
        '바게트',
        '브런치',
        '시리얼',
        '요거트',
        '과일'
      ]
      
      const lunchMenus = [
        '김치찌개',
        '된장찌개',
        '부대찌개',
        '순두부찌개',
        '제육볶음',
        '불고기',
        '삼겹살',
        '갈비탕',
        '설렁탕',
        '순대국',
        '육개장',
        '비빔밥',
        '돌솥비빔밥',
        '냉면',
        '물냉면',
        '비빔냉면',
        '짜장면',
        '짬뽕',
        '볶음밥',
        '탕수육',
        '양장피',
        '마파두부',
        '짜장밥',
        '짬뽕밥',
        '우동',
        '라면',
        '오므라이스',
        '카레라이스',
        '돈까스',
        '초밥',
        '회',
        '삼계탕',
        '닭볶음탕',
        '보쌈',
        '족발',
        '쌈밥'
      ]
      
      const snackMenus = [
        '떡볶이',
        '순대',
        '어묵',
        '호떡',
        '붕어빵',
        '계란빵',
        '와플',
        '아이스크림',
        '빙수',
        '도넛',
        '쿠키',
        '케이크',
        '마카롱',
        '크로플',
        '츄러스',
        '팝콘',
        '과자',
        '초콜릿',
        '젤리',
        '푸딩',
        '요거트',
        '과일',
        '견과류',
        '빵',
        '샌드위치'
      ]
      
      const dinnerMenus = [
        '삼겹살',
        '갈비',
        '불고기',
        '닭볶음탕',
        '보쌈',
        '족발',
        '냉삼',
        '삼계탕',
        '갈비탕',
        '설렁탕',
        '육개장',
        '순대국',
        '김치찌개',
        '된장찌개',
        '부대찌개',
        '순두부찌개',
        '제육볶음',
        '비빔밥',
        '돌솥비빔밥',
        '초밥',
        '회',
        '회덮밥',
        '파스타',
        '스테이크',
        '치킨',
        '피자',
        '햄버거',
        '라면',
        '짜장면',
        '짬뽕',
        '볶음밥',
        '우동',
        '라멘',
        '우육면',
        '마라탕',
        '훠궈'
      ]
      
      const lateNightMenus = [
        '치킨',
        '피자',
        '떡볶이',
        '순대',
        '라면',
        '우동',
        '짜장면',
        '짬뽕',
        '족발',
        '보쌈',
        '냉삼',
        '삼겹살',
        '곱창',
        '막창',
        '닭발',
        '회',
        '초밥',
        '마라탕',
        '훠궈',
        '야식세트',
        '편의점도시락',
        '햄버거',
        '타코야키',
        '오뎅',
        '어묵',
        '호떡',
        '붕어빵',
        '계란빵'
      ]
      
      let menus = []
      let mealType = ''
      
      switch (mealTime) {
        case 'breakfast':
          menus = breakfastMenus
          mealType = '아침'
          break
        case 'lunch':
          menus = lunchMenus
          mealType = '점심'
          break
        case 'snack':
          menus = snackMenus
          mealType = '간식'
          break
        case 'dinner':
          menus = dinnerMenus
          mealType = '저녁'
          break
        case 'lateNight':
          menus = lateNightMenus
          mealType = '야식'
          break
        default:
          menus = lunchMenus
          mealType = '점심'
      }
      
      const randomMenu = menus[Math.floor(Math.random() * menus.length)]
      alert(`오늘 ${mealType} 추천: ${randomMenu} 🍽️`)
    }
    
    return {
      currentSeason,
      availableTitles,
      selectedTitle,
      selectedGender,
      tabs,
      userFilterOptions,
      userActiveTab,
      userSelectedFilter,
      userFilteredData,
      userSelectedFilterKey,
      gamesData,
      statsData,
      handleLanguageChange,
      handleTitleChange,
      handleUserTabChange,
      handleUserFilterChange,
      handleDayTypeSelect,
      handleDaySelect,
      handleQuarterSelect,
      handleRestDaysSelect,
      resetUserFilter,
      isDayFilter,
      isQuarterFilter,
      isRestDaysFilter,
      isHandicapTypeFilter,
      selectedDay,
      selectedDayType,
      selectedQuarter,
      selectedHandicapType,
      selectedHandicapCategory,
      handleHandicapTypeSelect,
      handleHandicapCategorySelect,
      selectedRestDays,
      DAYS,
      predictionData,
      rankedGames,
      recommendMeal,
      mealTimeText
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

.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 80px;
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

.tab-description {
  padding: 12px 16px;
  font-size: 13px;
  color: #666666;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

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

@media (min-width: 768px) {
  .section-header {
    padding: 20px 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .day-selector {
    padding: 20px 24px;
  }
  
  .day-selector-title {
    font-size: 16px;
  }
  
  .day-type-button,
  .day-button {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .quarter-selector {
    padding: 20px 24px;
  }
  
  .quarter-selector-title {
    font-size: 16px;
  }
  
  .quarter-button {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .rest-days-selector {
    padding: 20px 24px;
  }
  
  .rest-days-selector-title {
    font-size: 16px;
  }
  
  .rest-days-button {
    font-size: 16px;
    padding: 12px 16px;
  }
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
  text-align: center;
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

.filter-hint {
  font-size: 11px;
  color: #999999;
  font-weight: 400;
  font-style: italic;
}

.promo-card {
  margin: 20px 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.promo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.promo-card:active {
  transform: translateY(0);
}

.promo-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-text {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

.ranked-stats-card {
  margin: 20px 16px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ranked-stats-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.ranked-stats-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.ranked-stats-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranked-games-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranked-game-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.ranked-game-result {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.ranked-game-result.승 {
  background-color: #28a745;
}

.ranked-game-result.패 {
  background-color: #dc3545;
}

.ranked-game-result.무 {
  background-color: #ffc107;
  color: #000000;
}

.ranked-game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ranked-game-champion {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.ranked-game-details {
  font-size: 12px;
  color: #666666;
}

.ranked-games-loading {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-size: 14px;
}

@media (min-width: 768px) {
  .promo-card,
  .ranked-stats-card {
    margin: 24px;
    padding: 20px;
  }
  
  .promo-text {
    font-size: 18px;
  }
  
  .ranked-stats-header h3 {
    font-size: 18px;
  }
}
</style>

