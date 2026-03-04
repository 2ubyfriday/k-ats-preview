<template>
  <div class="matchup-prediction">
    <h3 class="main-title">{{ isEnglish ? 'Fun Predictions (Home-based)' : '재미로 보는 예측 (홈기준)' }}</h3>
    
    <!-- 예측 경기가 없을 때 -->
    <div v-if="!hasPredictions" class="no-prediction">
      <span class="matchup-title">{{ isEnglish ? 'AI is analyzing the next game...' : '현재 다음경기를 AI가 열심히 분석중입니다' }}</span>
    </div>
    
    <!-- 경기 1 -->
    <div v-if="predictions[0]" class="prediction-game">
      <div class="prediction-header">
        <h4 v-if="predictions.length > 1" class="game-number">{{ isEnglish ? 'Game 1' : '경기 1' }}</h4>
        <span class="matchup-title">
          {{ getDisplayTeamName(predictions[0].homeTeam) }} {{ isEnglish ? '(Home)' : '(홈)' }} vs {{ getDisplayTeamName(predictions[0].awayTeam) }} {{ isEnglish ? '(Away)' : '(원정)' }}
        </span>
      </div>
      <div class="prediction-content">
        <div class="prediction-item">
          <span class="prediction-label">{{ isEnglish ? 'Win Prob.' : '승리 확률' }}</span>
          <span class="prediction-value">{{ predictions[0].winProbability }}%</span>
        </div>
        <div class="prediction-item" v-if="predictions[0].hasHandicap">
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }} <span class="input-value">({{ isEnglish ? 'Spread' : '핸디' }}: {{ predictions[0].handicap > 0 ? '+' : '' }}{{ predictions[0].handicap }})</span></span>
          <span class="prediction-value">{{ predictions[0].atsProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
        <div class="prediction-item" v-if="predictions[0].hasOverUnderLine">
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }} <span class="input-value">({{ isEnglish ? 'Line' : '기준' }}: {{ predictions[0].overUnderLine }})</span></span>
          <span class="prediction-value">{{ predictions[0].overProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
      </div>
    </div>
    
    <!-- 경기 2 (있으면) -->
    <div v-if="predictions[1]" class="prediction-game">
      <div class="prediction-header">
        <h4 class="game-number">{{ isEnglish ? 'Game 2' : '경기 2' }}</h4>
        <span class="matchup-title">
          {{ getDisplayTeamName(predictions[1].homeTeam) }} {{ isEnglish ? '(Home)' : '(홈)' }} vs {{ getDisplayTeamName(predictions[1].awayTeam) }} {{ isEnglish ? '(Away)' : '(원정)' }}
        </span>
      </div>
      <div class="prediction-content">
        <div class="prediction-item">
          <span class="prediction-label">{{ isEnglish ? 'Win Prob.' : '승리 확률' }}</span>
          <span class="prediction-value">{{ predictions[1].winProbability }}%</span>
        </div>
        <div class="prediction-item" v-if="predictions[1].hasHandicap">
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }} <span class="input-value">({{ isEnglish ? 'Spread' : '핸디' }}: {{ predictions[1].handicap > 0 ? '+' : '' }}{{ predictions[1].handicap }})</span></span>
          <span class="prediction-value">{{ predictions[1].atsProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
        <div class="prediction-item" v-if="predictions[1].hasOverUnderLine">
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }} <span class="input-value">({{ isEnglish ? 'Line' : '기준' }}: {{ predictions[1].overUnderLine }})</span></span>
          <span class="prediction-value">{{ predictions[1].overProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
      </div>
    </div>
    
    <!-- 경기 3 (있으면 - 농구 남자부) -->
    <div v-if="predictions[2]" class="prediction-game">
      <div class="prediction-header">
        <h4 class="game-number">{{ isEnglish ? 'Game 3' : '경기 3' }}</h4>
        <span class="matchup-title">
          {{ getDisplayTeamName(predictions[2].homeTeam) }} {{ isEnglish ? '(Home)' : '(홈)' }} vs {{ getDisplayTeamName(predictions[2].awayTeam) }} {{ isEnglish ? '(Away)' : '(원정)' }}
        </span>
      </div>
      <div class="prediction-content">
        <div class="prediction-item">
          <span class="prediction-label">{{ isEnglish ? 'Win Prob.' : '승리 확률' }}</span>
          <span class="prediction-value">{{ predictions[2].winProbability }}%</span>
        </div>
        <div class="prediction-item" v-if="predictions[2].hasHandicap">
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }} <span class="input-value">({{ isEnglish ? 'Spread' : '핸디' }}: {{ predictions[2].handicap > 0 ? '+' : '' }}{{ predictions[2].handicap }})</span></span>
          <span class="prediction-value">{{ predictions[2].atsProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'ATS Prob.' : 'ATS 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
        <div class="prediction-item" v-if="predictions[2].hasOverUnderLine">
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }} <span class="input-value">({{ isEnglish ? 'Line' : '기준' }}: {{ predictions[2].overUnderLine }})</span></span>
          <span class="prediction-value">{{ predictions[2].overProbability }}%</span>
        </div>
        <div class="prediction-item" v-else>
          <span class="prediction-label">{{ isEnglish ? 'Over Prob.' : '오버 확률' }}</span>
          <span class="prediction-value prediction-disabled">-</span>
        </div>
      </div>
    </div>
    
    <div class="prediction-note">
      <small>{{ isEnglish ? '* Predictions based on advanced statistical models (head-to-head, recent form, day patterns, weighted averages). For entertainment purposes only.' : '* 고급 통계 모델 기반 예측 (상대전적, 최근 폼, 요일 패턴, 가중 평균 반영). 참고용으로만 사용하세요.' }}</small>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import {
  calculateAdvancedWinProbability,
  calculateAdvancedATSProbability,
  calculateAdvancedOverProbability
} from '../utils/predictionEngine.js'
import { getTeamNameEn } from '../utils/teams.js'

export default {
  name: 'MatchupPrediction',
  props: {
    games: {
      type: Array,
      required: true
    },
    stats: {
      type: Array,
      required: true
    },
    predictionData: {
      type: [Object, Array],
      default: null
    },
    isEnglish: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 팀명 표시 (언어에 따라)
    const getDisplayTeamName = (teamName) => {
      if (props.isEnglish) {
        return getTeamNameEn(teamName)
      }
      return teamName
    }
    
    // 오늘 날짜 (YYYY-MM-DD 형식)
    const getTodayDate = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    const todayDate = getTodayDate()
    
    // 예측 데이터의 경기일이 오늘인지 확인
    const isTodayGame = (gameDate) => {
      if (!gameDate) return false
      // YYYY-MM-DD 형식으로 비교
      const normalizedDate = gameDate.split('T')[0]
      return normalizedDate === todayDate
    }
    
    // 전체 경기 정렬 (최신순)
    const sortedGames = computed(() => {
      try {
        if (!props.games || !Array.isArray(props.games)) return []
        return [...props.games].sort((a, b) => new Date(b.date) - new Date(a.date))
      } catch (e) {
        console.error('경기 정렬 오류:', e)
        return []
      }
    })
    
    // predictionData를 배열로 정규화
    const predictionArray = computed(() => {
      if (!props.predictionData) return []
      if (Array.isArray(props.predictionData)) return props.predictionData
      // 하위 호환: 객체면 배열로 변환
      return [props.predictionData]
    })
    
    const hasPredictions = computed(() => predictionArray.value.length > 0)
    
    // 각 경기별 계산
    const predictions = computed(() => {
      return predictionArray.value.map(game => {
        const homeTeam = game.homeTeam
        const awayTeam = game.awayTeam
        
        // 통계 찾기
        const homeTeamStats = props.stats?.find(team => team && team.team === homeTeam) || null
        const awayTeamStats = props.stats?.find(team => team && team.team === awayTeam) || null
        
        // 경기 필터링
        const homeTeamGames = sortedGames.value.filter(g => g && g.homeTeam === homeTeam)
        const awayTeamGames = sortedGames.value.filter(g => g && g.awayTeam === awayTeam)
        
        // 핸디캡/오버언더 입력 여부
        const hasHandicap = game.handicap !== null && game.handicap !== undefined && game.handicap !== ''
        const hasOverUnderLine = game.overUnderLine !== null && game.overUnderLine !== undefined && game.overUnderLine !== ''
        
        // 승리 확률
        const winProb = calculateAdvancedWinProbability({
          homeTeam,
          awayTeam,
          allGames: sortedGames.value,
          homeTeamStats,
          awayTeamStats,
          homeTeamGames,
          awayTeamGames,
          targetDayKey: null
        })
        
        // ATS 확률
        let atsProb = 0.50
        if (hasHandicap) {
          const handicap = game.handicap || 0
          const adjustmentPerPoint = 0.04
          atsProb = winProb + (handicap * adjustmentPerPoint)
          atsProb = Math.max(0.20, Math.min(0.80, atsProb))
        }
        
        // 오버 확률
        let overProb = 0.50
        if (hasOverUnderLine) {
          overProb = calculateAdvancedOverProbability({
            homeTeam,
            awayTeam,
            allGames: sortedGames.value,
            homeTeamStats,
            homeTeamGames
          })
        }
        
        return {
          homeTeam,
          awayTeam,
          hasHandicap,
          hasOverUnderLine,
          handicap: game.handicap,
          overUnderLine: game.overUnderLine,
          winProbability: (winProb * 100).toFixed(1),
          atsProbability: (atsProb * 100).toFixed(1),
          overProbability: (overProb * 100).toFixed(1),
          isToday: isTodayGame(game.gameDate)
        }
      })
    })
    
    return {
      predictions,
      hasPredictions,
      getDisplayTeamName
    }
  }
}
</script>

<style scoped>
.matchup-prediction {
  margin: 20px 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.main-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.no-prediction {
  padding: 20px;
  text-align: center;
}

.prediction-game {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.prediction-game:last-of-type {
  margin-bottom: 0;
}

.prediction-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.game-number {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #007bff;
}

.matchup-title {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.today-badge {
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background-color: #ef4444;
  border-radius: 4px;
  vertical-align: middle;
}

.prediction-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.prediction-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 100px;
}

.prediction-label {
  font-size: 12px;
  color: #666666;
  font-weight: 500;
}

.input-value {
  color: #007bff;
  font-weight: 600;
}

.prediction-value {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.prediction-value.prediction-disabled {
  font-size: 14px;
  font-weight: 500;
  color: #999999;
}

.prediction-note {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
}

.prediction-note small {
  font-size: 11px;
  color: #999999;
}

@media (min-width: 768px) {
  .matchup-prediction {
    margin: 24px;
    padding: 20px;
  }
  
  .main-title {
    font-size: 18px;
  }
  
  .game-number {
    font-size: 14px;
  }
  
  .matchup-title {
    font-size: 15px;
  }
  
  .prediction-value {
    font-size: 24px;
  }
  
  .prediction-game {
    padding: 20px;
  }
}
</style>

