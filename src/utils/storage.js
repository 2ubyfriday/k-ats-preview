// localStorage를 사용한 데이터 관리 유틸리티

const STORAGE_KEY_GAMES = 'k-basketball-games-v2'
const STORAGE_KEY_STANDINGS = 'k-basketball-standings' // 하위 호환성을 위해 유지

// 게임 데이터 저장/로드
export const saveGamesData = (games) => {
  try {
    const jsonData = JSON.stringify(games)
    localStorage.setItem(STORAGE_KEY_GAMES, jsonData)
    console.log('✅ 데이터 저장 완료:', games.length, '개 경기')
    console.log('📍 저장 위치: localStorage 키 =', STORAGE_KEY_GAMES)
    console.log('🌐 현재 브라우저:', navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Edge') ? 'Edge' : '기타')
    return true
  } catch (error) {
    console.error('❌ 게임 데이터 저장 실패:', error)
    // localStorage 용량 초과 등의 경우
    if (error.name === 'QuotaExceededError') {
      alert('저장 공간이 부족합니다. 브라우저 캐시를 정리해주세요.')
    }
    return false
  }
}

export const loadGamesData = () => {
  try {
    // 최신 키로 먼저 시도
    let data = localStorage.getItem(STORAGE_KEY_GAMES)
    
    // 이전 버전 키도 확인 (하위 호환성)
    if (!data) {
      const oldKey = 'k-basketball-games'
      data = localStorage.getItem(oldKey)
      if (data) {
        console.log('⚠️ 이전 버전 데이터 발견, 마이그레이션 중...')
        // 이전 데이터를 새 키로 이동
        localStorage.setItem(STORAGE_KEY_GAMES, data)
        localStorage.removeItem(oldKey)
      }
    }
    
    const games = data ? JSON.parse(data) : []
    
    // 데이터 마이그레이션: overUnderLine 필드가 없는 경우 null로 설정
    let needsMigration = false
    const migratedGames = games.map(game => {
      if (!('overUnderLine' in game)) {
        needsMigration = true
        return {
          ...game,
          overUnderLine: null
        }
      }
      return game
    })
    
    if (needsMigration) {
      console.log('⚠️ 데이터 마이그레이션: overUnderLine 필드 추가')
      saveGamesData(migratedGames)
    }
    
    console.log('📂 데이터 로드 완료:', migratedGames.length, '개 경기')
    
    // 디버깅: localStorage에 있는 모든 키 확인
    console.log('🔍 localStorage 키 목록:', Object.keys(localStorage).filter(k => k.includes('basketball')))
    console.log('📍 로드 위치: localStorage 키 =', STORAGE_KEY_GAMES)
    console.log('🌐 현재 브라우저:', navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Edge') ? 'Edge' : '기타')
    
    // 디버깅: overUnderLine 필드 확인
    const gamesWithOverUnder = migratedGames.filter(g => g.overUnderLine !== null && g.overUnderLine !== undefined)
    console.log('📊 overUnderLine이 있는 경기:', gamesWithOverUnder.length, '개')
    
    // 디버깅: 각 경기의 상세 정보
    if (migratedGames.length > 0) {
      console.log('📋 로드된 경기 목록:')
      migratedGames.forEach((game, idx) => {
        console.log(`  ${idx + 1}. ${game.date} ${game.homeTeam} vs ${game.awayTeam} (ID: ${game.id})`)
      })
    }
    
    return migratedGames
  } catch (error) {
    console.error('❌ 게임 데이터 로드 실패:', error)
    return []
  }
}

// 하위 호환성을 위한 기존 함수들
export const saveStandingsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_STANDINGS, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('데이터 저장 실패:', error)
    return false
  }
}

export const loadStandingsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STANDINGS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('데이터 로드 실패:', error)
    return []
  }
}

export const clearStandingsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_STANDINGS)
    localStorage.removeItem(STORAGE_KEY_GAMES)
    return true
  } catch (error) {
    console.error('데이터 삭제 실패:', error)
    return false
  }
}

/**
 * 데이터 Export (JSON 파일로 다운로드)
 * @param {Array} games - 게임 데이터 배열
 */
export const exportGamesData = (games) => {
  try {
    const dataStr = JSON.stringify(games, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `basketball-games-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log('✅ 데이터 Export 완료:', games.length, '개 경기')
    return true
  } catch (error) {
    console.error('❌ 데이터 Export 실패:', error)
    return false
  }
}

/**
 * 데이터 Import (JSON 파일에서 가져오기)
 * @param {File} file - 업로드된 JSON 파일
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const importGamesData = (file) => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    // 엑셀 파일인 경우
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      importExcelData(file).then(resolve).catch(reject)
      return
    }
    
    // JSON 파일인 경우
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const games = JSON.parse(e.target.result)
        if (Array.isArray(games)) {
          console.log('✅ 데이터 Import 완료:', games.length, '개 경기')
          resolve(games)
        } else {
          reject(new Error('잘못된 데이터 형식입니다.'))
        }
      } catch (error) {
        console.error('❌ 데이터 Import 실패:', error)
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('파일 읽기 실패'))
    reader.readAsText(file)
  })
}

/**
 * 엑셀 날짜 숫자를 YYYY-MM-DD 형식으로 변환
 * @param {number} excelDateNum - 엑셀 날짜 시리얼 번호
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
const excelDateToYYYYMMDD = (excelDateNum) => {
  // 엑셀 날짜 시스템: 1900년 1월 1일 = 1
  // 하지만 실제로는 1899년 12월 30일 00:00:00 = 0 (엑셀의 버그)
  // 엑셀은 1900년을 윤년으로 잘못 처리하므로, 1900년 2월 29일 이후는 +1일 보정 필요
  
  // 로컬 타임존으로 날짜 계산 (타임존 문제 방지)
  const excelEpoch = new Date(1899, 11, 30) // 1899년 12월 30일 (로컬 시간)
  const days = Math.floor(excelDateNum)
  
  // 로컬 날짜로 직접 계산
  const date = new Date(excelEpoch)
  date.setDate(date.getDate() + days)
  
  // 로컬 날짜로 직접 포맷팅 (타임존 문제 방지)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환 (타임존 문제 방지)
 * @param {Date|string|number} dateInput - 날짜 입력
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
const formatDateToYYYYMMDD = (dateInput) => {
  let date
  
  if (dateInput instanceof Date) {
    // Date 객체인 경우 로컬 날짜로 직접 포맷팅
    const year = dateInput.getFullYear()
    const month = String(dateInput.getMonth() + 1).padStart(2, '0')
    const day = String(dateInput.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } else if (typeof dateInput === 'number') {
    // 숫자인 경우 엑셀 날짜로 간주
    return excelDateToYYYYMMDD(dateInput)
  } else if (typeof dateInput === 'string') {
    // 문자열 날짜 처리
    const cleaned = dateInput.replace(/\//g, '-').split(' ')[0].split('T')[0]
    // 이미 YYYY-MM-DD 형식인지 확인
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned
    }
    // 다른 형식인 경우 Date 객체로 변환
    date = new Date(cleaned)
    if (isNaN(date.getTime())) {
      return null
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } else {
    return null
  }
}

/**
 * 엑셀 파일에서 데이터 Import
 * @param {File} file - 업로드된 엑셀 파일
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const importExcelData = (file) => {
  return new Promise((resolve, reject) => {
    import('xlsx').then((XLSX) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // 첫 번째 시트 가져오기
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          
          // 날짜를 Date 객체로 파싱하도록 설정
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // 날짜를 문자열로 변환
            defval: null,
            dateNF: 'yyyy-mm-dd' // 날짜 형식 지정
          })
          
          // 엑셀 데이터를 게임 데이터 형식으로 변환
          const games = jsonData.map((row, index) => {
            // 날짜 형식 변환 (YYYY-MM-DD)
            let date = row['경기일']
            
            // 날짜 변환 처리
            if (date === null || date === undefined || date === '') {
              date = null
            } else if (typeof date === 'string') {
              // 문자열인 경우 직접 처리
              date = date.replace(/\//g, '-').split(' ')[0].split('T')[0]
              // YYYY-MM-DD 형식 검증
              if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                // 다른 형식인 경우 Date 객체로 변환 시도
                const parsedDate = new Date(date)
                if (!isNaN(parsedDate.getTime())) {
                  date = formatDateToYYYYMMDD(parsedDate)
                } else {
                  date = null
                }
              }
            } else {
              // Date 객체나 숫자인 경우
              date = formatDateToYYYYMMDD(date)
            }
            
            // 날짜가 null이면 스킵
            if (!date) {
              return null
            }
            
            // 요일 계산
            const dayMeta = getDayMeta(date)
            
            // 기준점(overUnderLine) 파싱 - 더 견고하게 처리
            let overUnderLine = null
            // 여러 가능한 컬럼명 시도
            const possibleKeys = ['기준점', 'Over/Under 라인', 'Over/Under라인', '오버언더라인', '오버언더 라인', 'Over Under 라인']
            for (const key of possibleKeys) {
              const value = row[key]
              if (value !== null && value !== undefined && value !== '') {
                // 숫자로 변환 시도
                const numValue = Number(value)
                if (!isNaN(numValue) && isFinite(numValue)) {
                  overUnderLine = numValue
                  break
                }
                // 문자열인 경우 숫자 추출 시도
                const strValue = String(value).trim()
                if (strValue && !isNaN(Number(strValue))) {
                  overUnderLine = Number(strValue)
                  break
                }
              }
            }
            
            // 디버깅: 기준점 파싱 결과 로그
            if (index < 3) { // 처음 3개만 로그
              console.log(`[엑셀 임포트] 경기 ${index + 1} 기준점 파싱:`, {
                원본데이터: row,
                가능한키들: possibleKeys.map(k => ({ key: k, value: row[k] })),
                최종결과: overUnderLine
              })
            }
            
            return {
              id: `${Date.now()}_${index}_${Math.random().toString(36).substring(2, 8)}`,
              date: date,
              dayOfWeek: dayMeta.short,
              dayKey: dayMeta.key,
              homeTeam: String(row['홈팀'] || '').trim(),
              awayTeam: String(row['원정팀'] || '').trim(),
              homeScore: Number(row['홈팀 점수'] || 0),
              awayScore: Number(row['원정팀 점수'] || 0),
              handicap: Number(row['핸디캡'] || 0),
              overUnderLine: overUnderLine,
              dayNight: String(row['낮/밤'] || 'Day').trim(),
              createdAt: new Date().toISOString()
            }
          }).filter(game => {
            // null이 아닌 게임이고 필수 필드가 있는 데이터만 필터링
            return game !== null && game.date && game.homeTeam && game.awayTeam
          })
          
          // 기준점이 있는 경기 수 확인
          const gamesWithOverUnder = games.filter(g => g.overUnderLine !== null && g.overUnderLine !== undefined)
          console.log('✅ 엑셀 Import 완료:', games.length, '개 경기')
          console.log('📊 기준점이 있는 경기:', gamesWithOverUnder.length, '개')
          if (games.length > 0 && gamesWithOverUnder.length === 0) {
            console.warn('⚠️ 경고: 모든 경기의 기준점이 없습니다. 엑셀 파일의 컬럼명을 확인해주세요.')
            console.log('🔍 엑셀 파일의 첫 번째 행 컬럼명:', Object.keys(jsonData[0] || {}))
          }
          
          resolve(games)
        } catch (error) {
          console.error('❌ 엑셀 Import 실패:', error)
          reject(new Error('엑셀 파일 읽기 실패: ' + error.message))
        }
      }
      reader.onerror = () => reject(new Error('파일 읽기 실패'))
      reader.readAsArrayBuffer(file)
    }).catch(error => {
      reject(new Error('xlsx 라이브러리 로드 실패: ' + error.message))
    })
  })
}

import { getDayMeta } from './gameCalculations.js'

/**
 * 데이터 Export (엑셀 파일로 다운로드)
 * @param {Array} games - 게임 데이터 배열
 */
export const exportGamesDataToExcel = (games) => {
  try {
    // xlsx 라이브러리 동적 import
    import('xlsx').then((XLSX) => {
      // 워크북 생성
      const wb = XLSX.utils.book_new()
      
      // 게임 데이터를 엑셀 형식으로 변환
      const excelData = games.map(game => ({
        '경기일': game.date,
        '요일': game.dayOfWeek,
        '홈팀': game.homeTeam,
        '원정팀': game.awayTeam,
        '홈팀 점수': game.homeScore,
        '원정팀 점수': game.awayScore,
        '핸디캡': game.handicap,
        '기준점': game.overUnderLine || '',
        '낮/밤': game.dayNight,
        '생성일시': game.createdAt ? new Date(game.createdAt).toLocaleString('ko-KR') : ''
      }))
      
      // 워크시트 생성
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // 컬럼 너비 설정
      const colWidths = [
        { wch: 12 }, // 경기일
        { wch: 5 },  // 요일
        { wch: 15 }, // 홈팀
        { wch: 15 }, // 원정팀
        { wch: 10 }, // 홈팀 점수
        { wch: 10 }, // 원정팀 점수
        { wch: 10 }, // 핸디캡
        { wch: 10 }, // 기준점
        { wch: 8 },  // 낮/밤
        { wch: 20 }  // 생성일시
      ]
      ws['!cols'] = colWidths
      
      // 워크시트를 워크북에 추가
      XLSX.utils.book_append_sheet(wb, ws, '경기 데이터')
      
      // 파일 다운로드
      const fileName = `basketball-games-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      console.log('✅ 엑셀 Export 완료:', games.length, '개 경기')
    }).catch(error => {
      console.error('❌ 엑셀 Export 실패:', error)
      alert('엑셀 파일 생성에 실패했습니다.')
    })
  } catch (error) {
    console.error('❌ 엑셀 Export 실패:', error)
    alert('엑셀 파일 생성에 실패했습니다.')
  }
}


