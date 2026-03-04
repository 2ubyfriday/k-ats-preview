<template>
  <div class="standings-table-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>순위</th>
            <th>팀명</th>
            <template v-for="col in visibleColumns" :key="col.key">
              <th :class="highlightClass(col.key)">{{ col.label }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in data" :key="team.team">
            <td>{{ getRank(team, index) }}</td>
            <td class="team-name">{{ team.team }}</td>
            <template v-for="col in visibleColumns" :key="`${team.team}-${col.key}`">
              <td :class="highlightClass(col.key)">{{ getColumnValue(team, col.key, col.isPercent) }}</td>
            </template>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="2 + visibleColumns.length" class="empty">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { DAYS } from '../utils/gameCalculations.js'

export default {
  name: 'StandingsTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    highlightKey: {
      type: String,
      default: 'overall'
    },
    filterOnly: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const days = DAYS
    
    const highlightClass = (key) => {
      return props.highlightKey === key ? 'highlight' : ''
    }
    
    // 필터에 따라 표시할 컬럼 결정
    const visibleColumns = computed(() => {
      const key = props.highlightKey
      const columns = []
      
      // filterOnly 모드인 경우 선택한 필터에 해당하는 컬럼만 표시
      if (props.filterOnly) {
        // "All" 필터 선택 시 (현재 탭에 해당하는 컬럼만)
        if (key === 'overall') {
          columns.push({ key: 'overall', label: '승/패' })
          columns.push({ key: 'overallWinPercent', label: '승률', isPercent: true })
        } else if (key === 'ats') {
          columns.push({ key: 'ats', label: '핸디적용 W/L' })
          columns.push({ key: 'atsCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsHomeTeam') {
          columns.push({ key: 'atsHomeTeam', label: '핸디적용 W/L' })
          columns.push({ key: 'atsHomeTeamCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsAwayTeam') {
          columns.push({ key: 'atsAwayTeam', label: '핸디적용 W/L' })
          columns.push({ key: 'atsAwayTeamCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsFavorite') {
          columns.push({ key: 'atsFavorite', label: '핸디적용 W/L' })
          columns.push({ key: 'atsFavoriteCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsUnderdog') {
          columns.push({ key: 'atsUnderdog', label: '핸디적용 W/L' })
          columns.push({ key: 'atsUnderdogCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsHomeFavorite') {
          columns.push({ key: 'atsHomeFavorite', label: '핸디적용 W/L' })
          columns.push({ key: 'atsHomeFavoriteCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsAwayFavorite') {
          columns.push({ key: 'atsAwayFavorite', label: '핸디적용 W/L' })
          columns.push({ key: 'atsAwayFavoriteCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsHomeUnderdog') {
          columns.push({ key: 'atsHomeUnderdog', label: '핸디적용 W/L' })
          columns.push({ key: 'atsHomeUnderdogCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'atsAwayUnderdog') {
          columns.push({ key: 'atsAwayUnderdog', label: '핸디적용 W/L' })
          columns.push({ key: 'atsAwayUnderdogCoverPercent', label: 'Cover%', isPercent: true })
        } else if (key === 'overUnder') {
          columns.push({ key: 'overUnder', label: 'Under/Over' })
          columns.push({ key: 'overUnderPercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderHomeTeam') {
          columns.push({ key: 'overUnderHomeTeam', label: 'Under/Over' })
          columns.push({ key: 'overUnderHomeTeamPercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderAwayTeam') {
          columns.push({ key: 'overUnderAwayTeam', label: 'Under/Over' })
          columns.push({ key: 'overUnderAwayTeamPercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderFavorite') {
          columns.push({ key: 'overUnderFavorite', label: 'Under/Over' })
          columns.push({ key: 'overUnderFavoritePercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderUnderdog') {
          columns.push({ key: 'overUnderUnderdog', label: 'Under/Over' })
          columns.push({ key: 'overUnderUnderdogPercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderHomeFavorite') {
          columns.push({ key: 'overUnderHomeFavorite', label: 'Under/Over' })
          columns.push({ key: 'overUnderHomeFavoritePercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderAwayFavorite') {
          columns.push({ key: 'overUnderAwayFavorite', label: 'Under/Over' })
          columns.push({ key: 'overUnderAwayFavoritePercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderHomeUnderdog') {
          columns.push({ key: 'overUnderHomeUnderdog', label: 'Under/Over' })
          columns.push({ key: 'overUnderHomeUnderdogPercent', label: 'Over%', isPercent: true })
        } else if (key === 'overUnderAwayUnderdog') {
          columns.push({ key: 'overUnderAwayUnderdog', label: 'Under/Over' })
          columns.push({ key: 'overUnderAwayUnderdogPercent', label: 'Over%', isPercent: true })
        } else if (key === 'homeTeam') {
          columns.push({ key: 'homeTeam', label: '승/패' })
          columns.push({ key: 'homeTeamWinPercent', label: '승률', isPercent: true })
        } else if (key === 'awayTeam') {
          columns.push({ key: 'awayTeam', label: '승/패' })
          columns.push({ key: 'awayTeamWinPercent', label: '승률', isPercent: true })
        } else if (key === 'favorite') {
          columns.push({ key: 'favorite', label: '승/패' })
          columns.push({ key: 'favoriteWinPercent', label: '승률', isPercent: true })
        } else if (key === 'underdog') {
          columns.push({ key: 'underdog', label: '승/패' })
          columns.push({ key: 'underdogWinPercent', label: '승률', isPercent: true })
        } else if (key === 'homeFavorite') {
          columns.push({ key: 'homeFavorite', label: '승/패' })
          columns.push({ key: 'homeFavoriteWinPercent', label: '승률', isPercent: true })
        } else if (key === 'homeUnderdog') {
          columns.push({ key: 'homeUnderdog', label: '승/패' })
          columns.push({ key: 'homeUnderdogWinPercent', label: '승률', isPercent: true })
        } else if (key === 'awayFavorite') {
          columns.push({ key: 'awayFavorite', label: '승/패' })
          columns.push({ key: 'awayFavoriteWinPercent', label: '승률', isPercent: true })
        } else if (key === 'awayUnderdog') {
          columns.push({ key: 'awayUnderdog', label: '승/패' })
          columns.push({ key: 'awayUnderdogWinPercent', label: '승률', isPercent: true })
        } else if (key.startsWith('day_')) {
          // 요일 필터인 경우
          const dayKey = key.replace('day_', '').replace('_home', '').replace('_away', '')
          const isHome = key.includes('_home')
          const isAway = key.includes('_away')
          const day = days.find(d => d.key === dayKey)
          if (day) {
            columns.push({ 
              key: key, 
              label: '승/패'
            })
            // 요일별 승률도 추가
            const winPercentKey = `${key}WinPercent`
            columns.push({ 
              key: winPercentKey, 
              label: '승률', 
              isPercent: true 
            })
          }
        } else if (key.startsWith('quarter_')) {
          // 쿼터 필터인 경우
          const quarterNum = key.replace('quarter_', '')
          columns.push({ 
            key: key, 
            label: '승/패/무'
          })
          // 쿼터별 승률도 추가
          const winPercentKey = `${key}WinPercent`
          columns.push({ 
            key: winPercentKey, 
            label: '승률', 
            isPercent: true 
          })
        } else if (key.startsWith('restDays_')) {
          // 휴식일 필터인 경우
          const restDaysNum = key.replace('restDays_', '')
          const restDaysLabels = {
            '0': '휴식없음',
            '1': '1일 휴식',
            '2': '2일 휴식',
            '3': '3일 휴식',
            '4': '4+ 휴식'
          }
          columns.push({ 
            key: key, 
            label: '승/패'
          })
          // 휴식일별 승률도 추가
          const winPercentKey = `${key}WinPercent`
          columns.push({ 
            key: winPercentKey, 
            label: '승률', 
            isPercent: true 
          })
        }
      } else {
        // filterOnly가 false인 경우 (Admin 섹션) - 항상 기본 컬럼 표시 + 필터에 따른 추가 컬럼
        // 기본 컬럼 (항상 표시)
        columns.push({ key: 'overall', label: 'W/L' })
        columns.push({ key: 'ats', label: 'ATS W/L' })
        columns.push({ key: 'overUnder', label: 'Under/Over' })
        
        // 필터에 따라 추가 컬럼 표시
        if (key === 'homeTeam') {
          columns.push({ key: 'homeTeam', label: 'As Home Team' })
        } else if (key === 'awayTeam') {
          columns.push({ key: 'awayTeam', label: 'As Away Team' })
        } else if (key === 'favorite') {
          columns.push({ key: 'favorite', label: 'As Favorite' })
        } else if (key === 'underdog') {
          columns.push({ key: 'underdog', label: 'As Underdog' })
        } else if (key === 'homeFavorite') {
          columns.push({ key: 'homeFavorite', label: 'As Home favorite' })
        } else if (key === 'homeUnderdog') {
          columns.push({ key: 'homeUnderdog', label: 'As Home Underdog' })
        } else if (key === 'awayFavorite') {
          columns.push({ key: 'awayFavorite', label: 'As Away favorite' })
        } else if (key === 'awayUnderdog') {
          columns.push({ key: 'awayUnderdog', label: 'As Away Underdog' })
        } else if (key.startsWith('day_')) {
          // 요일 필터인 경우
          const dayKey = key.replace('day_', '').replace('_home', '').replace('_away', '')
          const isHome = key.includes('_home')
          const day = days.find(d => d.key === dayKey)
          if (day) {
            columns.push({ 
              key: key, 
              label: `${day.label} (${isHome ? 'Home' : 'Away'})` 
            })
          }
        } else {
          // All 또는 기본 필터인 경우 모든 추가 컬럼 표시
          columns.push({ key: 'homeTeam', label: 'As Home Team' })
          columns.push({ key: 'awayTeam', label: 'As Away Team' })
          columns.push({ key: 'favorite', label: 'As Favorite' })
          columns.push({ key: 'underdog', label: 'As Underdog' })
          columns.push({ key: 'homeFavorite', label: 'As Home favorite' })
          columns.push({ key: 'homeUnderdog', label: 'As Home Underdog' })
          columns.push({ key: 'awayFavorite', label: 'As Away favorite' })
          columns.push({ key: 'awayUnderdog', label: 'As Away Underdog' })
          // 요일별 컬럼도 모두 표시
          days.forEach(day => {
            columns.push({ key: `day_${day.key}_home`, label: `${day.label} (Home)` })
            columns.push({ key: `day_${day.key}_away`, label: `${day.label} (Away)` })
          })
        }
      }
      
      return columns
    })
    
    // 컬럼 값 가져오기
    const getColumnValue = (team, colKey, isPercent = false) => {
      if (isPercent) {
        // Win% 표시
        if (colKey === 'overallWinPercent') {
          const ratio = team.records.overall?.ratio || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'homeTeamWinPercent') {
          const ratio = team.metrics.homeTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'awayTeamWinPercent') {
          const ratio = team.metrics.awayTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'favoriteWinPercent') {
          const ratio = team.metrics.favorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'underdogWinPercent') {
          const ratio = team.metrics.underdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'homeFavoriteWinPercent') {
          const ratio = team.metrics.homeFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'homeUnderdogWinPercent') {
          const ratio = team.metrics.homeUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'awayFavoriteWinPercent') {
          const ratio = team.metrics.awayFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'awayUnderdogWinPercent') {
          const ratio = team.metrics.awayUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        // 요일별 Win% 처리
        if (colKey.endsWith('WinPercent') && colKey.startsWith('day_')) {
          const metricKey = colKey.replace('WinPercent', '')
          const ratio = team.metrics[metricKey] || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        // 쿼터별 Win% 처리
        if (colKey.endsWith('WinPercent') && colKey.startsWith('quarter_')) {
          const metricKey = colKey.replace('WinPercent', '')
          const ratio = team.metrics[metricKey] || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        // 휴식일별 Win% 처리
        if (colKey.endsWith('WinPercent') && colKey.startsWith('restDays_')) {
          const metricKey = colKey.replace('WinPercent', '')
          const ratio = team.metrics[metricKey] || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        // Cover% 표시 (ATS 극복 확률)
        if (colKey === 'atsCoverPercent') {
          const ratio = team.metrics.ats || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsHomeTeamCoverPercent') {
          const ratio = team.metrics.atsHomeTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsAwayTeamCoverPercent') {
          const ratio = team.metrics.atsAwayTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsFavoriteCoverPercent') {
          const ratio = team.metrics.atsFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsUnderdogCoverPercent') {
          const ratio = team.metrics.atsUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsHomeFavoriteCoverPercent') {
          const ratio = team.metrics.atsHomeFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsAwayFavoriteCoverPercent') {
          const ratio = team.metrics.atsAwayFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsHomeUnderdogCoverPercent') {
          const ratio = team.metrics.atsHomeUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'atsAwayUnderdogCoverPercent') {
          const ratio = team.metrics.atsAwayUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        // Over% 표시 (오버 확률)
        if (colKey === 'overUnderPercent') {
          const ratio = team.metrics.overUnder || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderHomeTeamPercent') {
          const ratio = team.metrics.overUnderHomeTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderAwayTeamPercent') {
          const ratio = team.metrics.overUnderAwayTeam || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderFavoritePercent') {
          const ratio = team.metrics.overUnderFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderUnderdogPercent') {
          const ratio = team.metrics.overUnderUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderHomeFavoritePercent') {
          const ratio = team.metrics.overUnderHomeFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderAwayFavoritePercent') {
          const ratio = team.metrics.overUnderAwayFavorite || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderHomeUnderdogPercent') {
          const ratio = team.metrics.overUnderHomeUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
        if (colKey === 'overUnderAwayUnderdogPercent') {
          const ratio = team.metrics.overUnderAwayUnderdog || 0
          return ratio > 0 ? `${(ratio * 100).toFixed(1)}%` : '0.0%'
        }
      }
      
      if (colKey.startsWith('day_')) {
        const dayKey = colKey.replace('day_', '').replace('_home', '').replace('_away', '')
        const isHome = colKey.includes('_home')
        const isAway = colKey.includes('_away')
        
        // 전체 선택 (day_${dayKey} 형식)
        if (!isHome && !isAway && colKey === `day_${dayKey}`) {
          return team.dayRecords[dayKey]?.all?.label || '-'
        }
        
        // 홈/원정 선택
        return isHome 
          ? (team.dayRecords[dayKey]?.home.label || '-')
          : (team.dayRecords[dayKey]?.away.label || '-')
      }
      
      // 쿼터별 필터 처리
      if (colKey.startsWith('quarter_')) {
        return team.records[colKey]?.label || '-'
      }
      
      // 휴식일별 필터 처리
      if (colKey.startsWith('restDays_')) {
        return team.records[colKey]?.label || '-'
      }
      
      // ATS 관련 필터는 metrics에서 가져오기
      if (colKey.startsWith('ats')) {
        // records에 해당 키가 있는지 확인
        if (team.records[colKey]) {
          return team.records[colKey].label || '-'
        }
        // records에 없으면 metrics에서 ratio를 가져와서 계산
        const ratio = team.metrics[colKey] || 0
        if (ratio > 0) {
          // wins와 losses를 역산하기는 어려우므로, records에 저장된 값을 사용
          // 일단 '-'로 표시하고 나중에 records에 추가
          return '-'
        }
        return '-'
      }
      
      // Over/Under 관련 필터도 metrics에서 가져오기
      if (colKey.startsWith('overUnder')) {
        if (team.records[colKey]) {
          return team.records[colKey].label || '-'
        }
        return '-'
      }
      
      return team.records[colKey]?.label || '-'
    }
    
    // 순위 배열 미리 계산
    const ranks = computed(() => {
      const key = props.highlightKey
      const ranksArray = []
      
      props.data.forEach((team, index) => {
        if (index === 0) {
          ranksArray.push(1)
        } else {
          const prevTeam = props.data[index - 1]
          const currentRatio = team.metrics[key] || 0
          const currentMargin = team.pointMargin || 0
          const prevRatio = prevTeam.metrics[key] || 0
          const prevMargin = prevTeam.pointMargin || 0
          
          // 승률과 골득실 마진이 모두 같으면 같은 순위 (부동소수점 비교를 위해 작은 차이는 무시)
          const ratioEqual = Math.abs(currentRatio - prevRatio) < 0.0001
          const marginEqual = Math.abs(currentMargin - prevMargin) < 0.1
          
          if (ratioEqual && marginEqual) {
            ranksArray.push(ranksArray[index - 1])
          } else {
            // 다르면 다음 순위
            ranksArray.push(index + 1)
          }
        }
      })
      
      return ranksArray
    })
    
    // 순위 가져오기
    const getRank = (team, index) => {
      return ranks.value[index] || (index + 1)
    }
    
    return {
      days,
      highlightClass,
      getRank,
      visibleColumns,
      getColumnValue
    }
  }
}
</script>

<style scoped>
.standings-table-container {
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 6px;
  font-size: 12px;
  text-align: center;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  background-color: #fafafa;
  font-weight: 600;
  color: #666666;
}

/* 순위 컬럼 너비 조절 */
th:first-child,
td:first-child {
  width: 45px;
  min-width: 45px;
  max-width: 45px;
  padding: 8px 4px;
}

/* 팀명 컬럼 너비 조절 */
th:nth-child(2),
td.team-name {
  width: 100px;
  min-width: 100px;
  max-width: 120px;
  text-align: left;
  font-weight: 600;
  padding: 8px 8px;
}

/* 데이터 컬럼 너비 조절 */
th:nth-child(n+3),
td:nth-child(n+3) {
  width: 70px;
  min-width: 70px;
  max-width: 80px;
  padding: 8px 6px;
}

.highlight {
  background-color: #fff1ce;
  color: #c47d00;
  font-weight: 700;
}

.empty {
  text-align: center;
  color: #999999;
  font-size: 14px;
}

@media (min-width: 768px) {
  th,
  td {
    font-size: 13px;
  }
}
</style>



