<template>
  <div class="game-input-table">
    <div class="table-header">
      <h3>입력 데이터</h3>
      <span class="description">관리자가 입력한 최신 경기 기록</span>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>경기일</th>
            <th>요일</th>
            <th>홈팀</th>
            <th>원정팀</th>
            <th>홈점수</th>
            <th>원정점수</th>
            <!-- 농구: 쿼터 -->
            <template v-if="sportType === 'basketball'">
              <th>1쿼터</th>
              <th>2쿼터</th>
              <th>3쿼터</th>
              <th>4쿼터</th>
              <th>연장전</th>
            </template>
            <!-- 배구: 세트 -->
            <template v-else>
              <th>1세트</th>
              <th>2세트</th>
              <th>3세트</th>
              <th>4세트</th>
              <th>5세트</th>
              <th>세트총점</th>
            </template>
            <th>{{ sportType === 'volleyball' ? '세트핸디' : '핸디캡' }}</th>
            <th>기준점</th>
            <th>낮/밤</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.id">
            <td>{{ game.date }}</td>
            <td>{{ game.dayOfWeek }}</td>
            <td>{{ game.homeTeam }}</td>
            <td>{{ game.awayTeam }}</td>
            <td>{{ game.homeScore }}</td>
            <td>{{ game.awayScore }}</td>
            <!-- 농구: 쿼터 점수 -->
            <template v-if="sportType === 'basketball'">
              <td>{{ formatQuarter(game.homeQ1, game.awayQ1) }}</td>
              <td>{{ formatQuarter(game.homeQ2, game.awayQ2) }}</td>
              <td>{{ formatQuarter(game.homeQ3, game.awayQ3) }}</td>
              <td>{{ formatQuarter(game.homeQ4, game.awayQ4) }}</td>
              <td>{{ formatQuarter(game.homeOvertimeScore, game.awayOvertimeScore) }}</td>
            </template>
            <!-- 배구: 세트 점수 -->
            <template v-else>
              <td>{{ formatQuarter(game.homeSet1, game.awaySet1) }}</td>
              <td>{{ formatQuarter(game.homeSet2, game.awaySet2) }}</td>
              <td>{{ formatQuarter(game.homeSet3, game.awaySet3) }}</td>
              <td>{{ formatQuarter(game.homeSet4, game.awaySet4) }}</td>
              <td>{{ formatQuarter(game.homeSet5, game.awaySet5) }}</td>
              <td>{{ formatSetTotal(game) }}</td>
            </template>
            <td>{{ formatHandicap(game.handicap) }}</td>
            <td>{{ game.overUnderLine || '-' }}</td>
            <td>{{ game.dayNight }}</td>
            <td class="action-cell">
              <button class="btn-edit" @click="$emit('edit', game)">수정</button>
              <button class="btn-delete" @click="$emit('delete', game.id)">삭제</button>
            </td>
          </tr>
          <tr v-if="games.length === 0">
            <td :colspan="sportType === 'volleyball' ? 17 : 15" class="empty">입력된 데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameInputTable',
  props: {
    games: {
      type: Array,
      required: true
    },
    sportType: {
      type: String,
      default: 'basketball' // 'basketball' or 'volleyball'
    }
  },
  methods: {
    formatHandicap(value) {
      if (value === null || value === undefined) return '-'
      return value > 0 ? `+${value}` : `${value}`
    },
    formatQuarter(homeQ, awayQ) {
      if ((homeQ === null || homeQ === undefined) && (awayQ === null || awayQ === undefined)) {
        return '-'
      }
      const home = homeQ !== null && homeQ !== undefined ? homeQ : '-'
      const away = awayQ !== null && awayQ !== undefined ? awayQ : '-'
      return `${home} / ${away}`
    },
    formatSetTotal(game) {
      // 배구 세트 총점 계산 (모든 세트 점수의 합)
      const homeTotal = (game.homeSet1 || 0) + (game.homeSet2 || 0) + (game.homeSet3 || 0) + 
                        (game.homeSet4 || 0) + (game.homeSet5 || 0)
      const awayTotal = (game.awaySet1 || 0) + (game.awaySet2 || 0) + (game.awaySet3 || 0) + 
                        (game.awaySet4 || 0) + (game.awaySet5 || 0)
      if (homeTotal === 0 && awayTotal === 0) return '-'
      return `${homeTotal} / ${awayTotal}`
    }
  }
}
</script>

<style scoped>
.game-input-table {
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.table-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.description {
  font-size: 12px;
  color: #888888;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px; /* 약 10개 행 높이 (각 행 약 50px + 헤더) */
  -webkit-overflow-scrolling: touch;
}

.table-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th,
td {
  padding: 10px 12px;
  font-size: 13px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  color: #000000;
}

th {
  background-color: #fafafa;
  font-weight: 600;
  color: #666666;
}

td:nth-child(3),
td:nth-child(4) {
  text-align: left;
}

.empty {
  text-align: center;
  color: #999999;
  font-size: 14px;
}

.action-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #000000;
  color: #ffffff;
}

.btn-edit:hover {
  background-color: #333333;
}

.btn-delete {
  background-color: #ff4444;
  color: #ffffff;
}

.btn-delete:hover {
  background-color: #cc0000;
}
</style>


