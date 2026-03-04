// 고급 예측 엔진 (Phase 1: 고급 통계 모델)

/**
 * 최근 경기에 더 높은 가중치를 부여하는 가중 평균 계산
 * @param {Array} games - 경기 배열 (최신순)
 * @param {Function} getValue - 각 경기에서 값을 추출하는 함수
 * @param {Number} recentWeight - 최근 경기 가중치 (기본값: 2.0)
 * @returns {Number} 가중 평균 (0~1)
 */
export function calculateWeightedAverage(games, getValue, recentWeight = 2.0) {
  if (!games || games.length === 0) return 0
  
  let totalWeight = 0
  let weightedSum = 0
  
  games.forEach((game, index) => {
    const value = getValue(game)
    if (value !== null && value !== undefined) {
      // 최근 경기일수록 높은 가중치 (지수 감쇠)
      const weight = Math.pow(recentWeight, games.length - index - 1)
      weightedSum += value * weight
      totalWeight += weight
    }
  })
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * 두 팀 간의 상대전적 계산
 * @param {Array} games - 전체 경기 배열
 * @param {String} team1 - 첫 번째 팀
 * @param {String} team2 - 두 번째 팀
 * @param {Boolean} team1IsHome - team1이 홈팀인지 여부
 * @returns {Object} { team1WinRate, totalGames, recentGames }
 */
export function calculateHeadToHead(games, team1, team2, team1IsHome = true) {
  if (!games || games.length === 0) return { team1WinRate: 0, totalGames: 0, recentGames: [] }
  
  // 두 팀이 맞붙은 경기 필터링
  const headToHeadGames = games.filter(game => {
    if (!game) return false
    const isMatch = (game.homeTeam === team1 && game.awayTeam === team2) ||
                    (game.homeTeam === team2 && game.awayTeam === team1)
    return isMatch
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
  
  if (headToHeadGames.length === 0) {
    return { team1WinRate: 0, totalGames: 0, recentGames: [] }
  }
  
  // team1의 승리 횟수 계산
  const team1Wins = headToHeadGames.filter(game => {
    const isTeam1Home = game.homeTeam === team1
    const team1Score = isTeam1Home ? game.homeScore : game.awayScore
    const team2Score = isTeam1Home ? game.awayScore : game.homeScore
    return team1Score > team2Score
  }).length
  
  const team1WinRate = team1Wins / headToHeadGames.length
  
  // 최근 5경기만 반환
  const recentGames = headToHeadGames.slice(0, 5)
  
  return {
    team1WinRate,
    totalGames: headToHeadGames.length,
    recentGames
  }
}

/**
 * 요일별 성적 패턴 계산
 * @param {Array} games - 경기 배열
 * @param {String} team - 팀명
 * @param {Boolean} isHome - 홈팀인지 여부
 * @param {String} targetDayKey - 목표 요일 키 (예: 'mon', 'tue')
 * @returns {Number} 요일별 승률 (0~1)
 */
export function calculateDayPattern(games, team, isHome, targetDayKey) {
  if (!games || games.length === 0) return 0
  
  // 해당 요일에 해당 팀이 홈/원정으로 경기한 경기 필터링
  const dayGames = games.filter(game => {
    if (!game) return false
    const isTeamMatch = isHome ? game.homeTeam === team : game.awayTeam === team
    const isDayMatch = game.dayKey === targetDayKey
    return isTeamMatch && isDayMatch
  })
  
  if (dayGames.length === 0) return 0
  
  // 승리 횟수 계산
  const wins = dayGames.filter(game => {
    const teamScore = isHome ? game.homeScore : game.awayScore
    const opponentScore = isHome ? game.awayScore : game.homeScore
    return teamScore > opponentScore
  }).length
  
  return wins / dayGames.length
}

/**
 * 시즌 진행도 계산 (0~1)
 * @param {Array} games - 전체 경기 배열
 * @returns {Number} 시즌 진행도 (0: 초반, 1: 후반)
 */
export function calculateSeasonProgress(games) {
  if (!games || games.length === 0) return 0.5 // 기본값: 중반
  
  // 날짜 범위 계산
  const dates = games.map(g => new Date(g.date)).filter(d => !isNaN(d.getTime()))
  if (dates.length === 0) return 0.5
  
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))
  const today = new Date()
  
  // 시즌 시작일과 종료일 추정 (실제로는 설정에서 가져와야 함)
  const seasonStart = minDate
  const seasonEnd = new Date(seasonStart)
  seasonEnd.setMonth(seasonEnd.getMonth() + 6) // 약 6개월 시즌 가정
  
  const totalDays = seasonEnd - seasonStart
  const elapsedDays = today - seasonStart
  
  const progress = Math.min(1, Math.max(0, elapsedDays / totalDays))
  return progress
}

/**
 * 최근 폼 계산 (최근 N경기 성적)
 * @param {Array} games - 경기 배열 (최신순)
 * @param {String} team - 팀명
 * @param {Boolean} isHome - 홈팀인지 여부
 * @param {Number} recentCount - 최근 경기 수 (기본값: 5)
 * @returns {Object} { winRate, avgScore, avgOpponentScore }
 */
export function calculateRecentForm(games, team, isHome, recentCount = 5) {
  if (!games || games.length === 0) {
    return { winRate: 0, avgScore: 0, avgOpponentScore: 0, games: [] }
  }
  
  // 해당 팀의 경기 필터링
  const teamGames = games.filter(game => {
    if (!game) return false
    return isHome ? game.homeTeam === team : game.awayTeam === team
  }).slice(0, recentCount) // 최근 N경기만
  
  if (teamGames.length === 0) {
    return { winRate: 0, avgScore: 0, avgOpponentScore: 0, games: [] }
  }
  
  let wins = 0
  let totalScore = 0
  let totalOpponentScore = 0
  
  teamGames.forEach(game => {
    const teamScore = isHome ? game.homeScore : game.awayScore
    const opponentScore = isHome ? game.awayScore : game.homeScore
    
    totalScore += teamScore
    totalOpponentScore += opponentScore
    
    if (teamScore > opponentScore) {
      wins++
    }
  })
  
  return {
    winRate: wins / teamGames.length,
    avgScore: totalScore / teamGames.length,
    avgOpponentScore: totalOpponentScore / teamGames.length,
    games: teamGames
  }
}

/**
 * 종합 승리 확률 계산 (Phase 1 고급 통계 모델)
 * @param {Object} params - 계산 파라미터
 * @returns {Number} 승리 확률 (0~1)
 */
export function calculateAdvancedWinProbability({
  homeTeam,
  awayTeam,
  allGames,
  homeTeamStats,
  awayTeamStats,
  homeTeamGames,
  awayTeamGames,
  targetDayKey
}) {
  // 홈 어드밴티지 기본값 (데이터 없을 때 사용)
  const HOME_ADVANTAGE_BASE = 0.52
  
  // 1. 기본 홈/원정 승률 (데이터 없으면 기본값 사용)
  const homeHomeWinRate = homeTeamStats?.records?.homeTeam?.ratio ?? HOME_ADVANTAGE_BASE
  const awayAwayWinRate = awayTeamStats?.records?.awayTeam?.ratio ?? 0.48
  const awayAwayLossRate = 1 - awayAwayWinRate
  
  // 계산에 사용할 요소들과 가중치
  let factors = []
  let totalWeight = 0
  
  // 2. 상대전적 (데이터 있을 때만)
  const headToHead = calculateHeadToHead(allGames, homeTeam, awayTeam, true)
  if (headToHead.totalGames > 0) {
    factors.push({ value: headToHead.team1WinRate, weight: 0.25 })
    totalWeight += 0.25
  }
  
  // 3. 최근 폼 (데이터 있을 때만)
  const homeRecentForm = calculateRecentForm(homeTeamGames, homeTeam, true, 5)
  const awayRecentForm = calculateRecentForm(awayTeamGames, awayTeam, false, 5)
  if (homeRecentForm.games.length > 0 || awayRecentForm.games.length > 0) {
    const homeForm = homeRecentForm.games.length > 0 ? homeRecentForm.winRate : HOME_ADVANTAGE_BASE
    const awayForm = awayRecentForm.games.length > 0 ? awayRecentForm.winRate : 0.48
    const formValue = (homeForm + (1 - awayForm)) / 2
    factors.push({ value: formValue, weight: 0.25 })
    totalWeight += 0.25
  }
  
  // 4. 요일별 패턴 (데이터 있을 때만)
  if (targetDayKey && homeTeamGames.length > 0) {
    const homeDayWinRate = calculateDayPattern(homeTeamGames, homeTeam, true, targetDayKey)
    const awayDayWinRate = calculateDayPattern(awayTeamGames, awayTeam, false, targetDayKey)
    if (homeDayWinRate > 0 || awayDayWinRate > 0) {
      const dayValue = (homeDayWinRate + (1 - awayDayWinRate)) / 2
      factors.push({ value: dayValue, weight: 0.15 })
      totalWeight += 0.15
    }
  }
  
  // 5. 가중 평균 (최근 경기 더 중요)
  if (homeTeamGames.length > 0 || awayTeamGames.length > 0) {
    const homeWeightedWinRate = homeTeamGames.length > 0 
      ? calculateWeightedAverage(homeTeamGames.slice(0, 10), (game) => game.homeScore > game.awayScore ? 1 : 0, 1.5)
      : HOME_ADVANTAGE_BASE
    const awayWeightedWinRate = awayTeamGames.length > 0
      ? calculateWeightedAverage(awayTeamGames.slice(0, 10), (game) => game.awayScore > game.homeScore ? 1 : 0, 1.5)
      : 0.48
    const weightedValue = (homeWeightedWinRate + (1 - awayWeightedWinRate)) / 2
    factors.push({ value: weightedValue, weight: 0.2 })
    totalWeight += 0.2
  }
  
  // 6. 기본 통계 (항상 포함)
  const baseValue = (homeHomeWinRate + awayAwayLossRate) / 2
  factors.push({ value: baseValue, weight: 0.15 })
  totalWeight += 0.15
  
  // 종합 확률 계산 (가중 평균)
  let totalProbability = 0
  if (totalWeight > 0) {
    factors.forEach(f => {
      totalProbability += (f.value * f.weight) / totalWeight
    })
  } else {
    // 데이터가 전혀 없으면 홈 어드밴티지 기본값
    totalProbability = HOME_ADVANTAGE_BASE
  }
  
  // 극단적인 값 방지 (최소 15%, 최대 85%)
  totalProbability = Math.max(0.15, Math.min(0.85, totalProbability))
  
  return totalProbability
}

/**
 * 종합 ATS 확률 계산
 */
export function calculateAdvancedATSProbability({
  homeTeam,
  awayTeam,
  allGames,
  homeTeamStats,
  homeTeamGames
}) {
  // 기본값 (데이터 없을 때)
  const DEFAULT_ATS_RATE = 0.50
  
  // 1. 홈팀의 홈 ATS 승률
  const homeHomeAtsGames = homeTeamGames.filter(game => {
    if (!game || game.handicap === null || game.handicap === undefined) return false
    // 연장전 점수 포함한 최종 점수
    const homeOvertime = game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined ? game.homeOvertimeScore : 0
    const awayOvertime = game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined ? game.awayOvertimeScore : 0
    const finalHomeScore = (game.homeScore || 0) + homeOvertime
    const finalAwayScore = (game.awayScore || 0) + awayOvertime
    const homeScoreWithHandicap = finalHomeScore + (game.handicap || 0)
    return homeScoreWithHandicap !== finalAwayScore // Push 제외
  })
  
  if (homeHomeAtsGames.length === 0) {
    // 전체 ATS 승률 사용, 없으면 기본값
    const ratio = homeTeamStats?.records?.ats?.ratio
    return ratio !== null && ratio !== undefined ? ratio : DEFAULT_ATS_RATE
  }
  
  // 2. 최근 폼 반영 (가중 평균)
  const recentAtsGames = homeHomeAtsGames.slice(0, 10)
  const atsWinRate = calculateWeightedAverage(
    recentAtsGames,
    (game) => {
      // 연장전 점수 포함한 최종 점수
      const homeOvertime = game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined ? game.homeOvertimeScore : 0
      const awayOvertime = game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined ? game.awayOvertimeScore : 0
      const finalHomeScore = (game.homeScore || 0) + homeOvertime
      const finalAwayScore = (game.awayScore || 0) + awayOvertime
      const homeScoreWithHandicap = finalHomeScore + (game.handicap || 0)
      return homeScoreWithHandicap > finalAwayScore ? 1 : 0
    },
    1.5
  )
  
  // 3. 전체 ATS 승률과 가중 평균 (70:30)
  const overallAtsRate = homeTeamStats?.records?.ats?.ratio ?? DEFAULT_ATS_RATE
  const finalRate = atsWinRate * 0.7 + overallAtsRate * 0.3
  
  // 극단적인 값 방지 (최소 20%, 최대 80%)
  return Math.max(0.20, Math.min(0.80, finalRate))
}

/**
 * 종합 오버 확률 계산
 */
export function calculateAdvancedOverProbability({
  homeTeam,
  awayTeam,
  allGames,
  homeTeamStats,
  homeTeamGames
}) {
  // 기본값 (데이터 없을 때)
  const DEFAULT_OVER_RATE = 0.50
  
  // 1. 홈팀의 홈 경기 오버 확률
  const homeOverGames = homeTeamGames.filter(game => {
    if (!game) return false
    const line = game.overUnderLine
    return line !== null && line !== undefined && line !== ''
  })
  
  if (homeOverGames.length === 0) {
    // 전체 오버 확률 사용, 없으면 기본값
    const ratio = homeTeamStats?.records?.overUnder?.ratio
    return ratio !== null && ratio !== undefined ? ratio : DEFAULT_OVER_RATE
  }
  
  // 2. 최근 폼 반영 (가중 평균)
  const recentOverGames = homeOverGames.slice(0, 10)
  const overRate = calculateWeightedAverage(
    recentOverGames,
    (game) => {
      // 연장전 점수 포함한 최종 점수
      const homeOvertime = game.homeOvertimeScore !== null && game.homeOvertimeScore !== undefined ? game.homeOvertimeScore : 0
      const awayOvertime = game.awayOvertimeScore !== null && game.awayOvertimeScore !== undefined ? game.awayOvertimeScore : 0
      const finalHomeScore = (game.homeScore || 0) + homeOvertime
      const finalAwayScore = (game.awayScore || 0) + awayOvertime
      const totalScore = finalHomeScore + finalAwayScore
      const line = Number(game.overUnderLine) || 0
      return totalScore > line ? 1 : 0
    },
    1.5
  )
  
  // 3. 전체 오버 확률과 가중 평균 (70:30)
  const overallOverRate = homeTeamStats?.records?.overUnder?.ratio ?? DEFAULT_OVER_RATE
  const finalRate = overRate * 0.7 + overallOverRate * 0.3
  
  // 극단적인 값 방지 (최소 20%, 최대 80%)
  return Math.max(0.20, Math.min(0.80, finalRate))
}




