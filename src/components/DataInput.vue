<template>
  <div class="data-input-container">
    <form @submit.prevent="handleSubmit" class="input-form">
      <div class="input-header">
        <h2>{{ isEditMode ? '데이터 수정' : '데이터 입력' }}</h2>
      </div>
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="form-group">
        <label>부문</label>
        <input 
          type="text" 
          :value="formData.gender" 
          disabled 
          class="disabled-input"
          style="background-color: #f5f5f5; color: #666; cursor: not-allowed;"
        />
        <small style="display: block; margin-top: 4px; color: #999; font-size: 12px;">
          현재 선택된 타이틀에 따라 자동 설정됩니다
        </small>
      </div>
      
      <div class="form-group">
        <label>경기일</label>
        <input
          v-model="formData.date"
          type="date"
          required
        />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>홈팀</label>
          <select
            v-if="availableTeams.length > 0"
            v-model="formData.homeTeam"
            required
          >
            <option value="">선택하세요</option>
            <option
              v-for="team in availableTeams"
              :key="team"
              :value="team"
              :disabled="team === formData.awayTeam"
            >
              {{ team }}
            </option>
          </select>
          <input
            v-else
            v-model="formData.homeTeam"
            type="text"
            placeholder="홈팀명을 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label>원정팀</label>
          <select
            v-if="availableTeams.length > 0"
            v-model="formData.awayTeam"
            required
          >
            <option value="">선택하세요</option>
            <option
              v-for="team in availableTeams"
              :key="team"
              :value="team"
              :disabled="team === formData.homeTeam"
            >
              {{ team }}
            </option>
          </select>
          <input
            v-else
            v-model="formData.awayTeam"
            type="text"
            placeholder="원정팀명을 입력하세요"
            required
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>홈팀 점수</label>
          <input
            v-model.number="formData.homeScore"
            type="number"
            min="0"
            placeholder="예: 84"
            required
          />
        </div>
        <div class="form-group">
          <label>원정팀 점수</label>
          <input
            v-model.number="formData.awayScore"
            type="number"
            min="0"
            placeholder="예: 79"
            required
          />
        </div>
      </div>
      
      <!-- 농구: 쿼터별 점수 -->
      <div v-if="sportType === 'basketball'" class="form-group">
        <label>쿼터별 점수 (선택사항)</label>
        <div class="quarter-scores">
          <div class="quarter-row">
            <span class="quarter-label">1쿼터</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeQ1"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awayQ1"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">2쿼터</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeQ2"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awayQ2"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">3쿼터</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeQ3"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awayQ3"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">4쿼터</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeQ4"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awayQ4"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">연장전</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeOvertimeScore"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awayOvertimeScore"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
        </div>
        <small class="form-hint">쿼터별 점수를 입력하면 해당 쿼터의 승률을 분석할 수 있습니다. 연장전은 선택사항입니다.</small>
      </div>
      
      <!-- 배구: 세트별 점수 -->
      <div v-else class="form-group">
        <label>세트별 점수 (선택사항)</label>
        <div class="quarter-scores">
          <div class="quarter-row">
            <span class="quarter-label">1세트</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeSet1"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awaySet1"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">2세트</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeSet2"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awaySet2"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">3세트</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeSet3"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awaySet3"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">4세트</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeSet4"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awaySet4"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
          <div class="quarter-row">
            <span class="quarter-label">5세트</span>
            <div class="quarter-inputs">
              <input
                v-model.number="formData.homeSet5"
                type="number"
                min="0"
                placeholder="홈"
                class="quarter-input"
              />
              <input
                v-model.number="formData.awaySet5"
                type="number"
                min="0"
                placeholder="원정"
                class="quarter-input"
              />
            </div>
          </div>
        </div>
        <small class="form-hint">세트별 점수를 입력하면 해당 세트의 승률을 분석할 수 있습니다.</small>
      </div>
      
      <div class="form-group">
        <label>핸디캡 (홈팀 기준)</label>
        <input
          v-model.number="formData.handicap"
          type="number"
          step="0.5"
          placeholder="예: -1.5 (홈 우위), +5.5 (원정 우위)"
          required
        />
        <small class="form-hint">음수면 홈팀이 Favorite, 양수면 원정팀이 Favorite입니다.</small>
      </div>
      
      <div class="form-group">
        <label>기준점</label>
        <input
          v-model.number="formData.overUnderLine"
          type="number"
          step="0.5"
          placeholder="예: 140"
        />
        <small class="form-hint">총점(홈팀 점수 + 원정팀 점수)이 기준점보다 크면 오버, 작으면 언더입니다. 비워두면 계산하지 않습니다.</small>
      </div>
      
      <div class="form-group">
        <label>낮/밤</label>
        <select v-model="formData.dayNight" required>
          <option value="Day">낮</option>
          <option value="Night">밤</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('close')">
          취소
        </button>
        <button type="submit" class="btn-submit">
          저장
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { getTeamsByTitle } from '../utils/teams.js'

export default {
  name: 'DataInput',
  props: {
    editData: {
      type: Object,
      default: null
    },
    currentTitle: {
      type: String,
      default: 'K-Basketball(여자)'
    },
    currentGender: {
      type: String,
      default: '여자부'
    },
    sportType: {
      type: String,
      default: 'basketball' // 'basketball' or 'volleyball'
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0]
    
    const isEditMode = computed(() => !!props.editData)
    
    // 현재 타이틀에 해당하는 팀 목록
    const availableTeams = computed(() => {
      return getTeamsByTitle(props.currentTitle)
    })
    
    const formData = ref({
      gender: props.currentGender,
      date: today,
      homeTeam: '',
      awayTeam: '',
      homeScore: null,
      awayScore: null,
      // 농구 쿼터
      homeQ1: null,
      homeQ2: null,
      homeQ3: null,
      homeQ4: null,
      awayQ1: null,
      awayQ2: null,
      awayQ3: null,
      awayQ4: null,
      homeOvertimeScore: null,
      awayOvertimeScore: null,
      // 배구 세트
      homeSet1: null,
      homeSet2: null,
      homeSet3: null,
      homeSet4: null,
      homeSet5: null,
      awaySet1: null,
      awaySet2: null,
      awaySet3: null,
      awaySet4: null,
      awaySet5: null,
      handicap: null,
      overUnderLine: null,
      dayNight: 'Day'
    })
    
    // currentGender가 변경되면 formData.gender도 업데이트 (항상)
    watch(() => props.currentGender, (newGender) => {
      formData.value.gender = newGender
    }, { immediate: true })
    
    // 수정 모드일 때 기존 데이터 로드
    watch(() => props.editData, (newData) => {
      if (newData) {
        formData.value = {
          gender: newData.gender || '여자부',
          date: newData.date,
          homeTeam: newData.homeTeam,
          awayTeam: newData.awayTeam,
          homeScore: newData.homeScore,
          awayScore: newData.awayScore,
          // 농구 쿼터
          homeQ1: newData.homeQ1 || null,
          homeQ2: newData.homeQ2 || null,
          homeQ3: newData.homeQ3 || null,
          homeQ4: newData.homeQ4 || null,
          awayQ1: newData.awayQ1 || null,
          awayQ2: newData.awayQ2 || null,
          awayQ3: newData.awayQ3 || null,
          awayQ4: newData.awayQ4 || null,
          homeOvertimeScore: newData.homeOvertimeScore || null,
          awayOvertimeScore: newData.awayOvertimeScore || null,
          // 배구 세트
          homeSet1: newData.homeSet1 || null,
          homeSet2: newData.homeSet2 || null,
          homeSet3: newData.homeSet3 || null,
          homeSet4: newData.homeSet4 || null,
          homeSet5: newData.homeSet5 || null,
          awaySet1: newData.awaySet1 || null,
          awaySet2: newData.awaySet2 || null,
          awaySet3: newData.awaySet3 || null,
          awaySet4: newData.awaySet4 || null,
          awaySet5: newData.awaySet5 || null,
          handicap: newData.handicap,
          overUnderLine: newData.overUnderLine || null,
          dayNight: newData.dayNight
        }
      }
    }, { immediate: true })
    
    const handleSubmit = () => {
      // 디버깅: 세트 데이터 확인
      console.log('📝 DataInput handleSubmit - formData:', JSON.stringify(formData.value, null, 2))
      console.log('📝 세트 데이터:', {
        homeSet1: formData.value.homeSet1,
        homeSet2: formData.value.homeSet2,
        homeSet3: formData.value.homeSet3,
        awaySet1: formData.value.awaySet1,
        awaySet2: formData.value.awaySet2,
        awaySet3: formData.value.awaySet3
      })
      
      // 쿼터별 점수와 연장전 점수의 합이 총 득점과 일치하는지 검증
      const homeQuarterSum = (formData.value.homeQ1 || 0) + 
                            (formData.value.homeQ2 || 0) + 
                            (formData.value.homeQ3 || 0) + 
                            (formData.value.homeQ4 || 0) + 
                            (formData.value.homeOvertimeScore || 0)
      
      const awayQuarterSum = (formData.value.awayQ1 || 0) + 
                            (formData.value.awayQ2 || 0) + 
                            (formData.value.awayQ3 || 0) + 
                            (formData.value.awayQ4 || 0) + 
                            (formData.value.awayOvertimeScore || 0)
      
      // 쿼터별 점수가 하나라도 입력된 경우에만 검증
      const hasHomeQuarterData = formData.value.homeQ1 !== null || 
                                 formData.value.homeQ2 !== null || 
                                 formData.value.homeQ3 !== null || 
                                 formData.value.homeQ4 !== null || 
                                 formData.value.homeOvertimeScore !== null
      
      const hasAwayQuarterData = formData.value.awayQ1 !== null || 
                                 formData.value.awayQ2 !== null || 
                                 formData.value.awayQ3 !== null || 
                                 formData.value.awayQ4 !== null || 
                                 formData.value.awayOvertimeScore !== null
      
      // 홈팀 점수 검증
      if (hasHomeQuarterData && formData.value.homeScore !== null) {
        if (homeQuarterSum !== formData.value.homeScore) {
          alert(`${formData.value.homeTeam || '홈팀'}의 점수의 합이 다릅니다. 입력된 점수를 확인해주세요.\n\n총 득점: ${formData.value.homeScore}\n쿼터별 합계: ${homeQuarterSum}`)
          return
        }
      }
      
      // 원정팀 점수 검증
      if (hasAwayQuarterData && formData.value.awayScore !== null) {
        if (awayQuarterSum !== formData.value.awayScore) {
          alert(`${formData.value.awayTeam || '원정팀'}의 점수의 합이 다릅니다. 입력된 점수를 확인해주세요.\n\n총 득점: ${formData.value.awayScore}\n쿼터별 합계: ${awayQuarterSum}`)
          return
        }
      }
      
      // 배구 세트별 점수 유효성 검증
      if (props.sportType === 'volleyball') {
        let calculatedHomeSetWins = 0
        let calculatedAwaySetWins = 0
        let hasSetData = false
        let setDetails = []
        
        for (let s = 1; s <= 5; s++) {
          const homeSet = formData.value[`homeSet${s}`]
          const awaySet = formData.value[`awaySet${s}`]
          
          // 두 값 모두 입력된 경우에만 계산
          if (homeSet !== null && homeSet !== undefined && 
              awaySet !== null && awaySet !== undefined) {
            hasSetData = true
            if (homeSet > awaySet) {
              calculatedHomeSetWins++
              setDetails.push(`${s}세트: ${homeSet}-${awaySet} (홈 승)`)
            } else if (awaySet > homeSet) {
              calculatedAwaySetWins++
              setDetails.push(`${s}세트: ${homeSet}-${awaySet} (원정 승)`)
            } else {
              setDetails.push(`${s}세트: ${homeSet}-${awaySet} (동점)`)
            }
          }
        }
        
        // 세트 데이터가 있을 때만 검증
        if (hasSetData && formData.value.homeScore !== null && formData.value.awayScore !== null) {
          const inputHomeScore = Number(formData.value.homeScore)
          const inputAwayScore = Number(formData.value.awayScore)
          
          if (calculatedHomeSetWins !== inputHomeScore || calculatedAwaySetWins !== inputAwayScore) {
            alert(
              `⚠️ 세트 승리 수가 일치하지 않습니다!\n\n` +
              `📊 입력된 점수: ${inputHomeScore}-${inputAwayScore} (홈-원정)\n` +
              `📊 세트별 계산: ${calculatedHomeSetWins}-${calculatedAwaySetWins} (홈-원정)\n\n` +
              `📋 세트별 결과:\n${setDetails.join('\n')}\n\n` +
              `입력된 세트별 점수를 확인해주세요.`
            )
            return
          }
        }
      }
      
      const submitData = { ...formData.value }
      if (isEditMode.value && props.editData) {
        submitData.id = props.editData.id
      }
      emit('submit', submitData)
      // 폼 초기화
      formData.value = {
        gender: props.currentGender,
        date: today,
        homeTeam: '',
        awayTeam: '',
        homeScore: null,
        awayScore: null,
        // 농구 쿼터
        homeQ1: null,
        homeQ2: null,
        homeQ3: null,
        homeQ4: null,
        awayQ1: null,
        awayQ2: null,
        awayQ3: null,
        awayQ4: null,
        homeOvertimeScore: null,
        awayOvertimeScore: null,
        // 배구 세트
        homeSet1: null,
        homeSet2: null,
        homeSet3: null,
        homeSet4: null,
        homeSet5: null,
        awaySet1: null,
        awaySet2: null,
        awaySet3: null,
        awaySet4: null,
        awaySet5: null,
        handicap: null,
        overUnderLine: null,
        dayNight: 'Day'
      }
      emit('close')
    }
    
    return {
      formData,
      handleSubmit,
      isEditMode,
      availableTeams,
      sportType: computed(() => props.sportType)
    }
  }
}
</script>

<style scoped>
.data-input-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.input-form {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 95vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.input-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  flex: 1;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #666666;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 12px;
  right: 12px;
  transition: all 0.2s;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.close-btn:hover {
  color: #000000;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.1);
}

.input-form::-webkit-scrollbar {
  width: 6px;
}

.input-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.input-form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.input-form::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #000000;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}

.quarter-scores {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  padding: 8px 0;
}

.quarter-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quarter-label {
  width: 60px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  flex-shrink: 0;
}

.quarter-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
}

.quarter-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #000000;
}

.quarter-input:focus {
  outline: none;
  border-color: #000000;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px;
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

.btn-submit {
  background-color: #000000;
  color: #ffffff;
}

.btn-submit:hover {
  background-color: #333333;
}

@media (min-width: 768px) {
  .input-form {
    padding: 32px;
    max-width: 500px;
  }
}
</style>


