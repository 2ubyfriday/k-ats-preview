// 게임 데이터 계산 유틸리티

export const DAYS = [
  { key: 'sun', short: '일', label: '일요일' },
  { key: 'mon', short: '월', label: '월요일' },
  { key: 'tue', short: '화', label: '화요일' },
  { key: 'wed', short: '수', label: '수요일' },
  { key: 'thu', short: '목', label: '목요일' },
  { key: 'fri', short: '금', label: '금요일' },
  { key: 'sat', short: '토', label: '토요일' }
]

export const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '홈경기', value: 'homeTeam' },
  { label: '원정경기', value: 'awayTeam' },
  { label: '마이너스 핸디캡(마핸)', value: 'favorite' },
  { label: '플러스 핸디캡(플핸)', value: 'underdog' },
  { label: '홈경기 마이너스 핸디캡', value: 'homeFavorite' },
  { label: '홈경기 플러스 핸디캡', value: 'homeUnderdog' },
  { label: '원정경기 마이너스 핸디캡', value: 'awayFavorite' },
  { label: '원정경기 플러스 핸디캡', value: 'awayUnderdog' },
  ...DAYS.flatMap(day => ([
    { label: `As ${day.label} Home`, value: `day_${day.key}_home` },
    { label: `As ${day.label} Away`, value: `day_${day.key}_away` }
  ]))
]

/**
 * 요일 계산
 * @param {String} dateString - YYYY-MM-DD 형식의 날짜
 * @returns {Object} { short: '월', key: 'mon', label: '월요일' }
 */
export const getDayMeta = (dateString) => {
  const date = new Date(dateString)
  const dayIndex = date.getDay()
  return DAYS[dayIndex]
}

const createRecord = () => ({ wins: 0, losses: 0, ties: 0 })

const incrementRecord = (record, result) => {
  if (result === 'W') {
    record.wins += 1
  } else if (result === 'L') {
    record.losses += 1
  } else if (result === 'T') {
    record.ties += 1
  }
}

const recordToLabel = (record, alwaysShowTies = false) => {
  const wins = record.wins || 0
  const losses = record.losses || 0
  const ties = record.ties || 0
  
  if (alwaysShowTies || ties > 0) {
    return `${wins}-${losses}-${ties}`
  }
  return `${wins}-${losses}`
}

const calcRatio = (record) => {
  const total = record.wins + record.losses
  if (total === 0) return 0
  return record.wins / total
}

const createTeamTemplate = (teamName) => ({
  team: teamName,
  overall: createRecord(),
  ats: createRecord(),
  atsOverall: createRecord(),  // ATS가 W인 경우만 실제 승패 카운트
  // ATS 조건별 통계
  atsHomeTeam: createRecord(),  // 홈에서 ATS 성적
  atsAwayTeam: createRecord(),  // 원정에서 ATS 성적
  overUnder: createRecord(),  // Over/Under 기록 (전체)
  overUnderOverall: createRecord(),  // Over/Under가 W인 경우만 실제 승패 카운트
  // Over/Under 조건별 통계
  overUnderHomeTeam: createRecord(),  // 홈에서 오버/언더
  overUnderAwayTeam: createRecord(),  // 원정에서 오버/언더
  overUnderFavorite: createRecord(),  // Favorite일 때 오버/언더
  overUnderUnderdog: createRecord(),  // Underdog일 때 오버/언더
  overUnderHomeFavorite: createRecord(),  // 홈 Favorite일 때 오버/언더
  overUnderAwayFavorite: createRecord(),  // 원정 Favorite일 때 오버/언더
  overUnderHomeUnderdog: createRecord(),  // 홈 Underdog일 때 오버/언더
  overUnderAwayUnderdog: createRecord(),  // 원정 Underdog일 때 오버/언더
  homeTeam: createRecord(),  // 홈팀으로 뛴 경기 전체 (실제 승패)
  awayTeam: createRecord(),  // 원정팀으로 뛴 경기 전체 (실제 승패)
  favorite: createRecord(),  // Favorite일 때 실제 승패
  underdog: createRecord(),  // Underdog일 때 실제 승패
  homeFavorite: createRecord(),  // 홈 Favorite일 때 실제 승패
  homeUnderdog: createRecord(),  // 홈 Underdog일 때 실제 승패
  awayFavorite: createRecord(),  // 원정 Favorite일 때 실제 승패
  awayUnderdog: createRecord(),  // 원정 Underdog일 때 실제 승패
  // ATS Favorite/Underdog 통계
  atsFavorite: createRecord(),  // Favorite일 때 ATS 성적
  atsUnderdog: createRecord(),  // Underdog일 때 ATS 성적
  atsHomeFavorite: createRecord(),  // 홈 Favorite일 때 ATS 성적
  atsAwayFavorite: createRecord(),  // 원정 Favorite일 때 ATS 성적
  atsHomeUnderdog: createRecord(),  // 홈 Underdog일 때 ATS 성적
  atsAwayUnderdog: createRecord(),  // 원정 Underdog일 때 ATS 성적
  pointsFor: 0,      // 총 득점
  pointsAgainst: 0,  // 총 실점
  dayRecords: DAYS.reduce((acc, day) => {
    acc[day.key] = {
      home: createRecord(),
      away: createRecord()
    }
    return acc
  }, {}),
  // 쿼터별 통계 (농구)
  quarterRecords: {
    1: createRecord(),  // 1쿼터 승패
    2: createRecord(),  // 2쿼터 승패
    3: createRecord(),  // 3쿼터 승패
    4: createRecord(),  // 4쿼터 승패
    'overtime': createRecord()  // 연장전 승패
  },
  // 쿼터별 홈/원정 통계 (농구)
  quarterHomeRecords: {
    1: createRecord(),
    2: createRecord(),
    3: createRecord(),
    4: createRecord(),
    'overtime': createRecord()
  },
  quarterAwayRecords: {
    1: createRecord(),
    2: createRecord(),
    3: createRecord(),
    4: createRecord(),
    'overtime': createRecord()
  },
  // 세트별 통계 (배구)
  setRecords: {
    1: createRecord(),  // 1세트 승패
    2: createRecord(),  // 2세트 승패
    3: createRecord(),  // 3세트 승패
    4: createRecord(),  // 4세트 승패
    5: createRecord()   // 5세트 승패
  },
  // 세트별 홈/원정 통계 (배구)
  setHomeRecords: {
    1: createRecord(),
    2: createRecord(),
    3: createRecord(),
    4: createRecord(),
    5: createRecord()
  },
  setAwayRecords: {
    1: createRecord(),
    2: createRecord(),
    3: createRecord(),
    4: createRecord(),
    5: createRecord()
  },
  // 휴식일별 통계
  restDaysRecords: {
    0: createRecord(),  // 휴식없음 (백투백)
    1: createRecord(),  // 1일 휴식
    2: createRecord(),  // 2일 휴식
    3: createRecord(),  // 3일 휴식
    4: createRecord()   // 4+ 휴식
  }
})

/**
 * 게임 데이터 포맷팅
 * @param {Object} gameData - 입력된 게임 데이터
 * @returns {Object} 저장할 게임 객체
 */
export const formatGameData = (gameData) => {
  const day = getDayMeta(gameData.date)
  return {
    id: gameData.id || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    date: gameData.date,
    dayOfWeek: day.short,
    dayKey: day.key,
    homeTeam: gameData.homeTeam.trim(),
    awayTeam: gameData.awayTeam.trim(),
    homeScore: Number(gameData.homeScore),
    awayScore: Number(gameData.awayScore),
    // 농구 쿼터별 점수
    homeQ1: gameData.homeQ1 !== null && gameData.homeQ1 !== undefined ? Number(gameData.homeQ1) : null,
    homeQ2: gameData.homeQ2 !== null && gameData.homeQ2 !== undefined ? Number(gameData.homeQ2) : null,
    homeQ3: gameData.homeQ3 !== null && gameData.homeQ3 !== undefined ? Number(gameData.homeQ3) : null,
    homeQ4: gameData.homeQ4 !== null && gameData.homeQ4 !== undefined ? Number(gameData.homeQ4) : null,
    awayQ1: gameData.awayQ1 !== null && gameData.awayQ1 !== undefined ? Number(gameData.awayQ1) : null,
    awayQ2: gameData.awayQ2 !== null && gameData.awayQ2 !== undefined ? Number(gameData.awayQ2) : null,
    awayQ3: gameData.awayQ3 !== null && gameData.awayQ3 !== undefined ? Number(gameData.awayQ3) : null,
    awayQ4: gameData.awayQ4 !== null && gameData.awayQ4 !== undefined ? Number(gameData.awayQ4) : null,
    homeOvertimeScore: gameData.homeOvertimeScore !== null && gameData.homeOvertimeScore !== undefined ? Number(gameData.homeOvertimeScore) : null,
    awayOvertimeScore: gameData.awayOvertimeScore !== null && gameData.awayOvertimeScore !== undefined ? Number(gameData.awayOvertimeScore) : null,
    // 배구 세트별 점수
    homeSet1: gameData.homeSet1 !== null && gameData.homeSet1 !== undefined ? Number(gameData.homeSet1) : null,
    homeSet2: gameData.homeSet2 !== null && gameData.homeSet2 !== undefined ? Number(gameData.homeSet2) : null,
    homeSet3: gameData.homeSet3 !== null && gameData.homeSet3 !== undefined ? Number(gameData.homeSet3) : null,
    homeSet4: gameData.homeSet4 !== null && gameData.homeSet4 !== undefined ? Number(gameData.homeSet4) : null,
    homeSet5: gameData.homeSet5 !== null && gameData.homeSet5 !== undefined ? Number(gameData.homeSet5) : null,
    awaySet1: gameData.awaySet1 !== null && gameData.awaySet1 !== undefined ? Number(gameData.awaySet1) : null,
    awaySet2: gameData.awaySet2 !== null && gameData.awaySet2 !== undefined ? Number(gameData.awaySet2) : null,
    awaySet3: gameData.awaySet3 !== null && gameData.awaySet3 !== undefined ? Number(gameData.awaySet3) : null,
    awaySet4: gameData.awaySet4 !== null && gameData.awaySet4 !== undefined ? Number(gameData.awaySet4) : null,
    awaySet5: gameData.awaySet5 !== null && gameData.awaySet5 !== undefined ? Number(gameData.awaySet5) : null,
    handicap: Number(gameData.handicap),
    overUnderLine: gameData.overUnderLine ? Number(gameData.overUnderLine) : null,
    dayNight: gameData.dayNight,
    gender: gameData.gender || '여자부', // 기본값은 여자부 (하위 호환성)
    createdAt: gameData.createdAt || new Date().toISOString()
  }
}

/**
 * 배구 경기인지 확인
 * @param {Object} game - 게임 데이터
 * @returns {Boolean} 배구 경기 여부
 */
const isVolleyballGame = (game) => {
  // 세트 점수가 있으면 배구 경기로 간주
  return game.homeSet1 !== null && game.homeSet1 !== undefined
}

/**
 * 배구 총 점수 계산 (모든 세트의 점수 합계)
 * @param {Object} game - 게임 데이터
 * @returns {Number} 총 점수
 */
const calculateVolleyballTotalScore = (game) => {
  let total = 0
  for (let s = 1; s <= 5; s++) {
    const homeSetKey = `homeSet${s}`
    const awaySetKey = `awaySet${s}`
    if (game[homeSetKey] !== null && game[homeSetKey] !== undefined) {
      total += game[homeSetKey]
    }
    if (game[awaySetKey] !== null && game[awaySetKey] !== undefined) {
      total += game[awaySetKey]
    }
  }
  return total
}

const determineResults = (game) => {
  // 연장전 점수를 포함한 최종 점수 계산
  const homeOvertime = game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined ? game.homeOvertimeScore : 0
  const awayOvertime = game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined ? game.awayOvertimeScore : 0
  const finalHomeScore = game.homeScore + homeOvertime
  const finalAwayScore = game.awayScore + awayOvertime
  
  const homeWin = finalHomeScore > finalAwayScore
  const awayWin = finalAwayScore > finalHomeScore
  
  const homeResult = homeWin ? 'W' : 'L'
  const awayResult = awayWin ? 'W' : 'L'
  
  // ATS 계산: 핸디캡을 적용한 점수로 승패 결정 (연장전 점수 포함)
  const homeScoreWithHandicap = finalHomeScore + game.handicap
  let homeAtsResult = 'L'  // 기본값은 패
  if (homeScoreWithHandicap > finalAwayScore) {
    homeAtsResult = 'W'  // 핸디캡 적용 후 승리
  } else if (homeScoreWithHandicap < finalAwayScore) {
    homeAtsResult = 'L'  // 핸디캡 적용 후 패배 (명시적으로 설정)
  } else {
    homeAtsResult = 'Push'  // 핸디캡 적용 후 무승부
  }
  // 원정팀의 ATS 결과는 홈팀과 반대
  const awayAtsResult = homeAtsResult === 'W' ? 'L' : (homeAtsResult === 'L' ? 'W' : 'Push')
  
  // Over/Under 계산
  let homeOverUnderResult = null
  let awayOverUnderResult = null
  if (game.overUnderLine !== null && game.overUnderLine !== undefined) {
    // 배구인 경우 모든 세트의 점수 합계 사용, 그 외는 기존 방식
    let totalScore
    if (isVolleyballGame(game)) {
      totalScore = calculateVolleyballTotalScore(game)
    } else {
      // 농구 등: 기존 방식 (연장전 점수 포함)
      totalScore = finalHomeScore + finalAwayScore
    }
    
    if (totalScore > game.overUnderLine) {
      homeOverUnderResult = 'W'  // Over
      awayOverUnderResult = 'W'  // Over
    } else if (totalScore < game.overUnderLine) {
      homeOverUnderResult = 'L'  // Under
      awayOverUnderResult = 'L'  // Under
    } else {
      // Push (정확히 라인과 같으면)
      homeOverUnderResult = 'Push'
      awayOverUnderResult = 'Push'
    }
  }
  
  let favorite = null
  if (game.handicap !== 0) {
    favorite = game.handicap < 0 ? 'home' : 'away'
  }
  
  return {
    homeResult,
    awayResult,
    homeAtsResult,
    awayAtsResult,
    homeOverUnderResult,
    awayOverUnderResult,
    favorite
  }
}

/**
 * 팀별 통계 계산
 * @param {Array} games - 게임 데이터 배열
 * @returns {Array} 팀별 통계
 */
/**
 * 휴식일 계산 (이전 경기와의 날짜 차이)
 * @param {String} currentDate - 현재 경기 날짜 (YYYY-MM-DD)
 * @param {String} previousDate - 이전 경기 날짜 (YYYY-MM-DD)
 * @returns {Number} 휴식일 카테고리 (0: 백투백, 1: 1일, 2: 2일, 3: 3일, 4: 4+일)
 */
const calculateRestDays = (currentDate, previousDate) => {
  if (!previousDate) return null // 첫 경기인 경우
  
  const current = new Date(currentDate)
  const previous = new Date(previousDate)
  const diffTime = current - previous
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // 스포츠 기준: 22일 경기 > 23일 경기 = 백투백 (휴식없음)
  // 22일 경기 > 24일 경기 = 1일 휴식 (경기 후 하루 쉼)
  // 즉, 날짜 차이에서 1을 빼야 실제 휴식일이 됨
  if (diffDays <= 1) return 0 // 백투백 (같은 날 또는 다음날)
  if (diffDays === 2) return 1 // 1일 휴식 (경기 후 하루 쉼)
  if (diffDays === 3) return 2 // 2일 휴식 (경기 후 이틀 쉼)
  if (diffDays === 4) return 3 // 3일 휴식 (경기 후 3일 쉼)
  if (diffDays >= 5) return 4 // 4+ 휴식 (경기 후 4일 이상 쉼)
  
  return null
}

export const calculateTeamStats = (games = []) => {
  const teamStats = {}
  
  // 경기를 날짜순으로 정렬 (오래된 것부터)
  const sortedGames = [...games].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    if (dateA.getTime() === dateB.getTime()) {
      // 같은 날짜면 생성 시간순
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    }
    return dateA - dateB
  })
  
  // 각 팀의 마지막 경기 날짜 추적
  const teamLastGameDate = {}
  
  sortedGames.forEach(game => {
    if (!teamStats[game.homeTeam]) {
      teamStats[game.homeTeam] = createTeamTemplate(game.homeTeam)
    }
    if (!teamStats[game.awayTeam]) {
      teamStats[game.awayTeam] = createTeamTemplate(game.awayTeam)
    }
    
    const { homeResult, awayResult, homeAtsResult, awayAtsResult, homeOverUnderResult, awayOverUnderResult, favorite } = determineResults(game)
    
    // 골득실 마진 계산 (연장전 점수 포함)
    const homeOvertime = game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined ? game.homeOvertimeScore : 0
    const awayOvertime = game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined ? game.awayOvertimeScore : 0
    const finalHomeScore = game.homeScore + homeOvertime
    const finalAwayScore = game.awayScore + awayOvertime
    teamStats[game.homeTeam].pointsFor += finalHomeScore
    teamStats[game.homeTeam].pointsAgainst += finalAwayScore
    teamStats[game.awayTeam].pointsFor += finalAwayScore
    teamStats[game.awayTeam].pointsAgainst += finalHomeScore
    
    // 기본 W/L
    incrementRecord(teamStats[game.homeTeam].overall, homeResult)
    incrementRecord(teamStats[game.awayTeam].overall, awayResult)
    
    // ATS
    if (homeAtsResult !== 'Push') {
      // 전체 ATS
      incrementRecord(teamStats[game.homeTeam].ats, homeAtsResult)
      incrementRecord(teamStats[game.awayTeam].ats, awayAtsResult)
      
      // 홈/원정별 ATS
      incrementRecord(teamStats[game.homeTeam].atsHomeTeam, homeAtsResult)
      incrementRecord(teamStats[game.awayTeam].atsAwayTeam, awayAtsResult)
      
      // Favorite/Underdog별 ATS
      if (favorite === 'home') {
        incrementRecord(teamStats[game.homeTeam].atsFavorite, homeAtsResult)
        incrementRecord(teamStats[game.homeTeam].atsHomeFavorite, homeAtsResult)
        incrementRecord(teamStats[game.awayTeam].atsUnderdog, awayAtsResult)
        incrementRecord(teamStats[game.awayTeam].atsAwayUnderdog, awayAtsResult)
      } else if (favorite === 'away') {
        incrementRecord(teamStats[game.awayTeam].atsFavorite, awayAtsResult)
        incrementRecord(teamStats[game.awayTeam].atsAwayFavorite, awayAtsResult)
        incrementRecord(teamStats[game.homeTeam].atsUnderdog, homeAtsResult)
        incrementRecord(teamStats[game.homeTeam].atsHomeUnderdog, homeAtsResult)
      }
      
      // W/L (ATS 적용): ATS가 W인 경우만 실제 승패를 카운트
      if (homeAtsResult === 'W') {
        incrementRecord(teamStats[game.homeTeam].atsOverall, homeResult)
      }
      if (awayAtsResult === 'W') {
        incrementRecord(teamStats[game.awayTeam].atsOverall, awayResult)
      }
    }
    
    // Over/Under
    if (homeOverUnderResult !== null && homeOverUnderResult !== 'Push') {
      // 전체 Over/Under
      incrementRecord(teamStats[game.homeTeam].overUnder, homeOverUnderResult)
      incrementRecord(teamStats[game.awayTeam].overUnder, awayOverUnderResult)
      
      // 홈/원정별 Over/Under
      incrementRecord(teamStats[game.homeTeam].overUnderHomeTeam, homeOverUnderResult)
      incrementRecord(teamStats[game.awayTeam].overUnderAwayTeam, awayOverUnderResult)
      
      // Favorite/Underdog별 Over/Under
      if (favorite === 'home') {
        incrementRecord(teamStats[game.homeTeam].overUnderFavorite, homeOverUnderResult)
        incrementRecord(teamStats[game.homeTeam].overUnderHomeFavorite, homeOverUnderResult)
        incrementRecord(teamStats[game.awayTeam].overUnderUnderdog, awayOverUnderResult)
        incrementRecord(teamStats[game.awayTeam].overUnderAwayUnderdog, awayOverUnderResult)
      } else if (favorite === 'away') {
        incrementRecord(teamStats[game.awayTeam].overUnderFavorite, awayOverUnderResult)
        incrementRecord(teamStats[game.awayTeam].overUnderAwayFavorite, awayOverUnderResult)
        incrementRecord(teamStats[game.homeTeam].overUnderUnderdog, homeOverUnderResult)
        incrementRecord(teamStats[game.homeTeam].overUnderHomeUnderdog, homeOverUnderResult)
      }
      
      // W/L (Under/Over 적용): Over/Under가 W인 경우만 실제 승패를 카운트
      if (homeOverUnderResult === 'W') {
        incrementRecord(teamStats[game.homeTeam].overUnderOverall, homeResult)
      }
      if (awayOverUnderResult === 'W') {
        incrementRecord(teamStats[game.awayTeam].overUnderOverall, awayResult)
      }
    }
    
    // Favorite / Underdog
    if (favorite === 'home') {
      incrementRecord(teamStats[game.homeTeam].favorite, homeResult)
      incrementRecord(teamStats[game.awayTeam].underdog, awayResult)
      incrementRecord(teamStats[game.homeTeam].homeFavorite, homeResult)
      incrementRecord(teamStats[game.awayTeam].awayUnderdog, awayResult)
    } else if (favorite === 'away') {
      incrementRecord(teamStats[game.awayTeam].favorite, awayResult)
      incrementRecord(teamStats[game.homeTeam].underdog, homeResult)
      incrementRecord(teamStats[game.awayTeam].awayFavorite, awayResult)
      incrementRecord(teamStats[game.homeTeam].homeUnderdog, homeResult)
    } else {
      // 핸디캡 0일 경우 Favorite/Underdog 카운트하지 않음
    }
    
    // Home/Away 전체 통계
    incrementRecord(teamStats[game.homeTeam].homeTeam, homeResult)
    incrementRecord(teamStats[game.awayTeam].awayTeam, awayResult)
    
    // Home/Away 세부 통계 (요일별, Favorite와 상관없이)
    incrementRecord(teamStats[game.homeTeam].dayRecords[game.dayKey].home, homeResult)
    incrementRecord(teamStats[game.awayTeam].dayRecords[game.dayKey].away, awayResult)
    
    // 휴식일별 통계
    const homeRestDays = calculateRestDays(game.date, teamLastGameDate[game.homeTeam])
    const awayRestDays = calculateRestDays(game.date, teamLastGameDate[game.awayTeam])
    
    if (homeRestDays !== null) {
      incrementRecord(teamStats[game.homeTeam].restDaysRecords[homeRestDays], homeResult)
    }
    if (awayRestDays !== null) {
      incrementRecord(teamStats[game.awayTeam].restDaysRecords[awayRestDays], awayResult)
    }
    
    // 마지막 경기 날짜 업데이트
    teamLastGameDate[game.homeTeam] = game.date
    teamLastGameDate[game.awayTeam] = game.date
    
    // 쿼터별 통계
    for (let q = 1; q <= 4; q++) {
      const homeQKey = `homeQ${q}`
      const awayQKey = `awayQ${q}`
      if (game[homeQKey] !== null && game[homeQKey] !== undefined && 
          game[awayQKey] !== null && game[awayQKey] !== undefined) {
        const homeQ = game[homeQKey]
        const awayQ = game[awayQKey]
        let homeQuarterResult = 'L'
        let awayQuarterResult = 'L'
        
        if (homeQ > awayQ) {
          homeQuarterResult = 'W'
          awayQuarterResult = 'L'
        } else if (homeQ < awayQ) {
          homeQuarterResult = 'L'
          awayQuarterResult = 'W'
        } else {
          // 점수가 같으면 무승부
          homeQuarterResult = 'T'
          awayQuarterResult = 'T'
        }
        
        // 전체 쿼터별 통계
        incrementRecord(teamStats[game.homeTeam].quarterRecords[q], homeQuarterResult)
        incrementRecord(teamStats[game.awayTeam].quarterRecords[q], awayQuarterResult)
        
        // 홈/원정별 쿼터 통계
        incrementRecord(teamStats[game.homeTeam].quarterHomeRecords[q], homeQuarterResult)
        incrementRecord(teamStats[game.awayTeam].quarterAwayRecords[q], awayQuarterResult)
      }
    }
    
    // 연장전 통계
    if (game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined && 
        game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined) {
      const homeOT = game.homeOvertimeScore
      const awayOT = game.awayOvertimeScore
      let homeOvertimeResult = 'L'
      let awayOvertimeResult = 'L'
      
      if (homeOT > awayOT) {
        homeOvertimeResult = 'W'
        awayOvertimeResult = 'L'
      } else if (homeOT < awayOT) {
        homeOvertimeResult = 'L'
        awayOvertimeResult = 'W'
      } else {
        // 점수가 같으면 무승부
        homeOvertimeResult = 'T'
        awayOvertimeResult = 'T'
      }
      
      // 전체 연장전 통계
      incrementRecord(teamStats[game.homeTeam].quarterRecords['overtime'], homeOvertimeResult)
      incrementRecord(teamStats[game.awayTeam].quarterRecords['overtime'], awayOvertimeResult)
      
      // 홈/원정별 연장전 통계
      incrementRecord(teamStats[game.homeTeam].quarterHomeRecords['overtime'], homeOvertimeResult)
      incrementRecord(teamStats[game.awayTeam].quarterAwayRecords['overtime'], awayOvertimeResult)
    }
    
    // 배구 세트별 통계
    for (let s = 1; s <= 5; s++) {
      const homeSetKey = `homeSet${s}`
      const awaySetKey = `awaySet${s}`
      if (game[homeSetKey] !== null && game[homeSetKey] !== undefined && 
          game[awaySetKey] !== null && game[awaySetKey] !== undefined) {
        const homeSet = game[homeSetKey]
        const awaySet = game[awaySetKey]
        let homeSetResult = 'L'
        let awaySetResult = 'L'
        
        if (homeSet > awaySet) {
          homeSetResult = 'W'
          awaySetResult = 'L'
        } else if (homeSet < awaySet) {
          homeSetResult = 'L'
          awaySetResult = 'W'
        } else {
          // 점수가 같으면 무승부 (배구에서는 드물지만)
          homeSetResult = 'T'
          awaySetResult = 'T'
        }
        
        // 전체 세트별 통계
        incrementRecord(teamStats[game.homeTeam].setRecords[s], homeSetResult)
        incrementRecord(teamStats[game.awayTeam].setRecords[s], awaySetResult)
        
        // 홈/원정별 세트 통계
        incrementRecord(teamStats[game.homeTeam].setHomeRecords[s], homeSetResult)
        incrementRecord(teamStats[game.awayTeam].setAwayRecords[s], awaySetResult)
      }
    }
  })
  
  return Object.values(teamStats).map(team => {
    const dayRecords = Object.keys(team.dayRecords).reduce((acc, key) => {
      // 홈과 원정을 합친 전체 기록
      const totalRecord = {
        wins: team.dayRecords[key].home.wins + team.dayRecords[key].away.wins,
        losses: team.dayRecords[key].home.losses + team.dayRecords[key].away.losses
      }
      
      acc[key] = {
        home: {
          label: recordToLabel(team.dayRecords[key].home),
          ratio: calcRatio(team.dayRecords[key].home)
        },
        away: {
          label: recordToLabel(team.dayRecords[key].away),
          ratio: calcRatio(team.dayRecords[key].away)
        },
        all: {
          label: recordToLabel(totalRecord),
          ratio: calcRatio(totalRecord)
        }
      }
      return acc
    }, {})
    
    const pointMargin = team.pointsFor - team.pointsAgainst
    
    const formatted = {
      team: team.team,
      records: {
        overall: { label: recordToLabel(team.overall), ratio: calcRatio(team.overall) },
        ats: { label: recordToLabel(team.ats), ratio: calcRatio(team.ats) },
        atsOverall: { label: recordToLabel(team.atsOverall), ratio: calcRatio(team.atsOverall) },
        // ATS 조건별 records
        atsHomeTeam: team.atsHomeTeam ? { label: recordToLabel(team.atsHomeTeam), ratio: calcRatio(team.atsHomeTeam) } : { label: '0-0', ratio: 0 },
        atsAwayTeam: team.atsAwayTeam ? { label: recordToLabel(team.atsAwayTeam), ratio: calcRatio(team.atsAwayTeam) } : { label: '0-0', ratio: 0 },
        atsFavorite: team.atsFavorite ? { label: recordToLabel(team.atsFavorite), ratio: calcRatio(team.atsFavorite) } : { label: '0-0', ratio: 0 },
        atsUnderdog: team.atsUnderdog ? { label: recordToLabel(team.atsUnderdog), ratio: calcRatio(team.atsUnderdog) } : { label: '0-0', ratio: 0 },
        atsHomeFavorite: team.atsHomeFavorite ? { label: recordToLabel(team.atsHomeFavorite), ratio: calcRatio(team.atsHomeFavorite) } : { label: '0-0', ratio: 0 },
        atsAwayFavorite: team.atsAwayFavorite ? { label: recordToLabel(team.atsAwayFavorite), ratio: calcRatio(team.atsAwayFavorite) } : { label: '0-0', ratio: 0 },
        atsHomeUnderdog: team.atsHomeUnderdog ? { label: recordToLabel(team.atsHomeUnderdog), ratio: calcRatio(team.atsHomeUnderdog) } : { label: '0-0', ratio: 0 },
        atsAwayUnderdog: team.atsAwayUnderdog ? { label: recordToLabel(team.atsAwayUnderdog), ratio: calcRatio(team.atsAwayUnderdog) } : { label: '0-0', ratio: 0 },
        overUnder: { label: recordToLabel(team.overUnder), ratio: calcRatio(team.overUnder) },
        overUnderOverall: { label: recordToLabel(team.overUnderOverall), ratio: calcRatio(team.overUnderOverall) },
        // Over/Under 조건별 records
        overUnderHomeTeam: team.overUnderHomeTeam ? { label: recordToLabel(team.overUnderHomeTeam), ratio: calcRatio(team.overUnderHomeTeam) } : { label: '0-0', ratio: 0 },
        overUnderAwayTeam: team.overUnderAwayTeam ? { label: recordToLabel(team.overUnderAwayTeam), ratio: calcRatio(team.overUnderAwayTeam) } : { label: '0-0', ratio: 0 },
        overUnderFavorite: team.overUnderFavorite ? { label: recordToLabel(team.overUnderFavorite), ratio: calcRatio(team.overUnderFavorite) } : { label: '0-0', ratio: 0 },
        overUnderUnderdog: team.overUnderUnderdog ? { label: recordToLabel(team.overUnderUnderdog), ratio: calcRatio(team.overUnderUnderdog) } : { label: '0-0', ratio: 0 },
        overUnderHomeFavorite: team.overUnderHomeFavorite ? { label: recordToLabel(team.overUnderHomeFavorite), ratio: calcRatio(team.overUnderHomeFavorite) } : { label: '0-0', ratio: 0 },
        overUnderAwayFavorite: team.overUnderAwayFavorite ? { label: recordToLabel(team.overUnderAwayFavorite), ratio: calcRatio(team.overUnderAwayFavorite) } : { label: '0-0', ratio: 0 },
        overUnderHomeUnderdog: team.overUnderHomeUnderdog ? { label: recordToLabel(team.overUnderHomeUnderdog), ratio: calcRatio(team.overUnderHomeUnderdog) } : { label: '0-0', ratio: 0 },
        overUnderAwayUnderdog: team.overUnderAwayUnderdog ? { label: recordToLabel(team.overUnderAwayUnderdog), ratio: calcRatio(team.overUnderAwayUnderdog) } : { label: '0-0', ratio: 0 },
        homeTeam: { label: recordToLabel(team.homeTeam), ratio: calcRatio(team.homeTeam) },
        awayTeam: { label: recordToLabel(team.awayTeam), ratio: calcRatio(team.awayTeam) },
        favorite: { label: recordToLabel(team.favorite), ratio: calcRatio(team.favorite) },
        underdog: { label: recordToLabel(team.underdog), ratio: calcRatio(team.underdog) },
        homeFavorite: { label: recordToLabel(team.homeFavorite), ratio: calcRatio(team.homeFavorite) },
        homeUnderdog: { label: recordToLabel(team.homeUnderdog), ratio: calcRatio(team.homeUnderdog) },
        awayFavorite: { label: recordToLabel(team.awayFavorite), ratio: calcRatio(team.awayFavorite) },
        awayUnderdog: { label: recordToLabel(team.awayUnderdog), ratio: calcRatio(team.awayUnderdog) }
      },
      dayRecords,
      pointMargin,  // 골득실 마진
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
      metrics: {}
    }
    
    formatted.metrics = {
      overall: formatted.records.overall.ratio,
      ats: formatted.records.ats.ratio,
      atsOverall: formatted.records.atsOverall.ratio,
      // ATS 조건별 메트릭
      atsHomeTeam: team.atsHomeTeam ? calcRatio(team.atsHomeTeam) : 0,
      atsAwayTeam: team.atsAwayTeam ? calcRatio(team.atsAwayTeam) : 0,
      atsFavorite: team.atsFavorite ? calcRatio(team.atsFavorite) : 0,
      atsUnderdog: team.atsUnderdog ? calcRatio(team.atsUnderdog) : 0,
      atsHomeFavorite: team.atsHomeFavorite ? calcRatio(team.atsHomeFavorite) : 0,
      atsAwayFavorite: team.atsAwayFavorite ? calcRatio(team.atsAwayFavorite) : 0,
      atsHomeUnderdog: team.atsHomeUnderdog ? calcRatio(team.atsHomeUnderdog) : 0,
      atsAwayUnderdog: team.atsAwayUnderdog ? calcRatio(team.atsAwayUnderdog) : 0,
      overUnder: formatted.records.overUnder.ratio,
      overUnderOverall: formatted.records.overUnderOverall.ratio,
      // Over/Under 조건별 메트릭
      overUnderHomeTeam: team.overUnderHomeTeam ? calcRatio(team.overUnderHomeTeam) : 0,
      overUnderAwayTeam: team.overUnderAwayTeam ? calcRatio(team.overUnderAwayTeam) : 0,
      overUnderFavorite: team.overUnderFavorite ? calcRatio(team.overUnderFavorite) : 0,
      overUnderUnderdog: team.overUnderUnderdog ? calcRatio(team.overUnderUnderdog) : 0,
      overUnderHomeFavorite: team.overUnderHomeFavorite ? calcRatio(team.overUnderHomeFavorite) : 0,
      overUnderAwayFavorite: team.overUnderAwayFavorite ? calcRatio(team.overUnderAwayFavorite) : 0,
      overUnderHomeUnderdog: team.overUnderHomeUnderdog ? calcRatio(team.overUnderHomeUnderdog) : 0,
      overUnderAwayUnderdog: team.overUnderAwayUnderdog ? calcRatio(team.overUnderAwayUnderdog) : 0,
      homeTeam: formatted.records.homeTeam.ratio,
      awayTeam: formatted.records.awayTeam.ratio,
      favorite: formatted.records.favorite.ratio,
      underdog: formatted.records.underdog.ratio,
      homeFavorite: formatted.records.homeFavorite.ratio,
      homeUnderdog: formatted.records.homeUnderdog.ratio,
      awayFavorite: formatted.records.awayFavorite.ratio,
      awayUnderdog: formatted.records.awayUnderdog.ratio,
      ...Object.keys(dayRecords).reduce((acc, key) => {
        acc[`day_${key}`] = dayRecords[key].all.ratio // 전체 (홈+원정)
        acc[`day_${key}_home`] = dayRecords[key].home.ratio
        acc[`day_${key}_away`] = dayRecords[key].away.ratio
        return acc
      }, {}),
      // 쿼터별 메트릭 (농구)
      quarter_1: calcRatio(team.quarterRecords[1]),
      quarter_2: calcRatio(team.quarterRecords[2]),
      quarter_3: calcRatio(team.quarterRecords[3]),
      quarter_4: calcRatio(team.quarterRecords[4]),
      quarter_overtime: calcRatio(team.quarterRecords['overtime']),
      // 쿼터별 홈 메트릭
      quarter_1_home: calcRatio(team.quarterHomeRecords[1]),
      quarter_2_home: calcRatio(team.quarterHomeRecords[2]),
      quarter_3_home: calcRatio(team.quarterHomeRecords[3]),
      quarter_4_home: calcRatio(team.quarterHomeRecords[4]),
      quarter_overtime_home: calcRatio(team.quarterHomeRecords['overtime']),
      // 쿼터별 원정 메트릭
      quarter_1_away: calcRatio(team.quarterAwayRecords[1]),
      quarter_2_away: calcRatio(team.quarterAwayRecords[2]),
      quarter_3_away: calcRatio(team.quarterAwayRecords[3]),
      quarter_4_away: calcRatio(team.quarterAwayRecords[4]),
      quarter_overtime_away: calcRatio(team.quarterAwayRecords['overtime']),
      // 세트별 메트릭 (배구)
      set_1: calcRatio(team.setRecords[1]),
      set_2: calcRatio(team.setRecords[2]),
      set_3: calcRatio(team.setRecords[3]),
      set_4: calcRatio(team.setRecords[4]),
      set_5: calcRatio(team.setRecords[5]),
      // 세트별 홈 메트릭
      set_1_home: calcRatio(team.setHomeRecords[1]),
      set_2_home: calcRatio(team.setHomeRecords[2]),
      set_3_home: calcRatio(team.setHomeRecords[3]),
      set_4_home: calcRatio(team.setHomeRecords[4]),
      set_5_home: calcRatio(team.setHomeRecords[5]),
      // 세트별 원정 메트릭
      set_1_away: calcRatio(team.setAwayRecords[1]),
      set_2_away: calcRatio(team.setAwayRecords[2]),
      set_3_away: calcRatio(team.setAwayRecords[3]),
      set_4_away: calcRatio(team.setAwayRecords[4]),
      set_5_away: calcRatio(team.setAwayRecords[5]),
      // 휴식일별 메트릭
      restDays_0: calcRatio(team.restDaysRecords[0]),  // 휴식없음
      restDays_1: calcRatio(team.restDaysRecords[1]),  // 1일 휴식
      restDays_2: calcRatio(team.restDaysRecords[2]),  // 2일 휴식
      restDays_3: calcRatio(team.restDaysRecords[3]),  // 3일 휴식
      restDays_4: calcRatio(team.restDaysRecords[4])   // 4+ 휴식
    }
    
    // 쿼터별 records 추가 (항상 무승부 포함)
    formatted.records.quarter_1 = { label: recordToLabel(team.quarterRecords[1], true), ratio: calcRatio(team.quarterRecords[1]) }
    formatted.records.quarter_2 = { label: recordToLabel(team.quarterRecords[2], true), ratio: calcRatio(team.quarterRecords[2]) }
    formatted.records.quarter_3 = { label: recordToLabel(team.quarterRecords[3], true), ratio: calcRatio(team.quarterRecords[3]) }
    formatted.records.quarter_4 = { label: recordToLabel(team.quarterRecords[4], true), ratio: calcRatio(team.quarterRecords[4]) }
    formatted.records.quarter_overtime = { label: recordToLabel(team.quarterRecords['overtime'], true), ratio: calcRatio(team.quarterRecords['overtime']) }
    
    // 쿼터별 홈 records 추가
    formatted.records.quarter_1_home = { label: recordToLabel(team.quarterHomeRecords[1], true), ratio: calcRatio(team.quarterHomeRecords[1]) }
    formatted.records.quarter_2_home = { label: recordToLabel(team.quarterHomeRecords[2], true), ratio: calcRatio(team.quarterHomeRecords[2]) }
    formatted.records.quarter_3_home = { label: recordToLabel(team.quarterHomeRecords[3], true), ratio: calcRatio(team.quarterHomeRecords[3]) }
    formatted.records.quarter_4_home = { label: recordToLabel(team.quarterHomeRecords[4], true), ratio: calcRatio(team.quarterHomeRecords[4]) }
    formatted.records.quarter_overtime_home = { label: recordToLabel(team.quarterHomeRecords['overtime'], true), ratio: calcRatio(team.quarterHomeRecords['overtime']) }
    
    // 쿼터별 원정 records 추가
    formatted.records.quarter_1_away = { label: recordToLabel(team.quarterAwayRecords[1], true), ratio: calcRatio(team.quarterAwayRecords[1]) }
    formatted.records.quarter_2_away = { label: recordToLabel(team.quarterAwayRecords[2], true), ratio: calcRatio(team.quarterAwayRecords[2]) }
    formatted.records.quarter_3_away = { label: recordToLabel(team.quarterAwayRecords[3], true), ratio: calcRatio(team.quarterAwayRecords[3]) }
    formatted.records.quarter_4_away = { label: recordToLabel(team.quarterAwayRecords[4], true), ratio: calcRatio(team.quarterAwayRecords[4]) }
    formatted.records.quarter_overtime_away = { label: recordToLabel(team.quarterAwayRecords['overtime'], true), ratio: calcRatio(team.quarterAwayRecords['overtime']) }
    
    // 세트별 records 추가 (배구)
    formatted.records.set_1 = { label: recordToLabel(team.setRecords[1], true), ratio: calcRatio(team.setRecords[1]) }
    formatted.records.set_2 = { label: recordToLabel(team.setRecords[2], true), ratio: calcRatio(team.setRecords[2]) }
    formatted.records.set_3 = { label: recordToLabel(team.setRecords[3], true), ratio: calcRatio(team.setRecords[3]) }
    formatted.records.set_4 = { label: recordToLabel(team.setRecords[4], true), ratio: calcRatio(team.setRecords[4]) }
    formatted.records.set_5 = { label: recordToLabel(team.setRecords[5], true), ratio: calcRatio(team.setRecords[5]) }
    
    // 세트별 홈 records 추가
    formatted.records.set_1_home = { label: recordToLabel(team.setHomeRecords[1], true), ratio: calcRatio(team.setHomeRecords[1]) }
    formatted.records.set_2_home = { label: recordToLabel(team.setHomeRecords[2], true), ratio: calcRatio(team.setHomeRecords[2]) }
    formatted.records.set_3_home = { label: recordToLabel(team.setHomeRecords[3], true), ratio: calcRatio(team.setHomeRecords[3]) }
    formatted.records.set_4_home = { label: recordToLabel(team.setHomeRecords[4], true), ratio: calcRatio(team.setHomeRecords[4]) }
    formatted.records.set_5_home = { label: recordToLabel(team.setHomeRecords[5], true), ratio: calcRatio(team.setHomeRecords[5]) }
    
    // 세트별 원정 records 추가
    formatted.records.set_1_away = { label: recordToLabel(team.setAwayRecords[1], true), ratio: calcRatio(team.setAwayRecords[1]) }
    formatted.records.set_2_away = { label: recordToLabel(team.setAwayRecords[2], true), ratio: calcRatio(team.setAwayRecords[2]) }
    formatted.records.set_3_away = { label: recordToLabel(team.setAwayRecords[3], true), ratio: calcRatio(team.setAwayRecords[3]) }
    formatted.records.set_4_away = { label: recordToLabel(team.setAwayRecords[4], true), ratio: calcRatio(team.setAwayRecords[4]) }
    formatted.records.set_5_away = { label: recordToLabel(team.setAwayRecords[5], true), ratio: calcRatio(team.setAwayRecords[5]) }
    
    // 휴식일별 records 추가
    formatted.records.restDays_0 = { label: recordToLabel(team.restDaysRecords[0]), ratio: calcRatio(team.restDaysRecords[0]) }
    formatted.records.restDays_1 = { label: recordToLabel(team.restDaysRecords[1]), ratio: calcRatio(team.restDaysRecords[1]) }
    formatted.records.restDays_2 = { label: recordToLabel(team.restDaysRecords[2]), ratio: calcRatio(team.restDaysRecords[2]) }
    formatted.records.restDays_3 = { label: recordToLabel(team.restDaysRecords[3]), ratio: calcRatio(team.restDaysRecords[3]) }
    formatted.records.restDays_4 = { label: recordToLabel(team.restDaysRecords[4]), ratio: calcRatio(team.restDaysRecords[4]) }
    
    return formatted
  })
}
