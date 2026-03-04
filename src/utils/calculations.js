// 게임 결과를 기반으로 통계를 계산하는 유틸리티 함수

/**
 * 게임 결과를 기반으로 Win/Loss, ATS, Under/Over 통계를 계산
 * @param {Array} games - 게임 결과 배열
 * @param {String} filter - 필터 타입 ('All Game', 'Home', 'Away')
 * @returns {Object} 각 카테고리별 통계
 */
export const calculateStatistics = (games, filter = 'All Game') => {
  // 팀별로 그룹화
  const teamStats = {}
  
  games.forEach(game => {
    const { homeTeam, awayTeam, homeScore, awayScore, spread, totalLine, homeOvertimeScore, awayOvertimeScore } = game
    // 연장전 점수를 포함한 최종 점수 계산
    const homeOvertime = homeOvertimeScore !== null && homeOvertimeScore !== undefined ? homeOvertimeScore : 0
    const awayOvertime = awayOvertimeScore !== null && awayOvertimeScore !== undefined ? awayOvertimeScore : 0
    const finalHomeScore = homeScore + homeOvertime
    const finalAwayScore = awayScore + awayOvertime
    
    // 홈팀 통계
    if (!teamStats[homeTeam]) {
      teamStats[homeTeam] = {
        team: homeTeam,
        winLoss: { wins: 0, losses: 0, games: [] },
        ats: { wins: 0, losses: 0, games: [] },
        underOver: { overs: 0, unders: 0, games: [] }
      }
    }
    
    // 어웨이팀 통계
    if (!teamStats[awayTeam]) {
      teamStats[awayTeam] = {
        team: awayTeam,
        winLoss: { wins: 0, losses: 0, games: [] },
        ats: { wins: 0, losses: 0, games: [] },
        underOver: { overs: 0, unders: 0, games: [] }
      }
    }
    
    // 필터에 따라 게임 포함 여부 결정
    const includeHomeTeam = filter === 'All Game' || filter === 'Home'
    const includeAwayTeam = filter === 'All Game' || filter === 'Away'
    
    // Win/Loss 계산 (연장전 점수 포함)
    if (finalHomeScore > finalAwayScore) {
      if (includeHomeTeam) {
        teamStats[homeTeam].winLoss.wins++
        teamStats[homeTeam].winLoss.games.push({ ...game, isHome: true })
      }
      if (includeAwayTeam) {
        teamStats[awayTeam].winLoss.losses++
        teamStats[awayTeam].winLoss.games.push({ ...game, isHome: false })
      }
    } else if (finalAwayScore > finalHomeScore) {
      if (includeAwayTeam) {
        teamStats[awayTeam].winLoss.wins++
        teamStats[awayTeam].winLoss.games.push({ ...game, isHome: false })
      }
      if (includeHomeTeam) {
        teamStats[homeTeam].winLoss.losses++
        teamStats[homeTeam].winLoss.games.push({ ...game, isHome: true })
      }
    }
    
    // ATS 계산 (스프레드가 있는 경우, 연장전 점수 포함)
    if (spread !== null && spread !== undefined) {
      const homeScoreWithSpread = finalHomeScore + spread
      if (homeScoreWithSpread > finalAwayScore) {
        if (includeHomeTeam) {
          teamStats[homeTeam].ats.wins++
          teamStats[homeTeam].ats.games.push({ ...game, isHome: true })
        }
        if (includeAwayTeam) {
          teamStats[awayTeam].ats.losses++
          teamStats[awayTeam].ats.games.push({ ...game, isHome: false })
        }
      } else if (finalAwayScore > homeScoreWithSpread) {
        if (includeAwayTeam) {
          teamStats[awayTeam].ats.wins++
          teamStats[awayTeam].ats.games.push({ ...game, isHome: false })
        }
        if (includeHomeTeam) {
          teamStats[homeTeam].ats.losses++
          teamStats[homeTeam].ats.games.push({ ...game, isHome: true })
        }
      }
      // 푸시는 무시 (정확히 같으면 둘 다 카운트하지 않음)
    }
    
    // Under/Over 계산 (토탈 라인이 있는 경우)
    if (totalLine !== null && totalLine !== undefined) {
      // 배구인 경우 모든 세트의 점수 합계 사용
      let totalScore
      const isVolleyball = game.homeSet1 !== null && game.homeSet1 !== undefined
      if (isVolleyball) {
        totalScore = 0
        for (let s = 1; s <= 5; s++) {
          const homeSetKey = `homeSet${s}`
          const awaySetKey = `awaySet${s}`
          if (game[homeSetKey] !== null && game[homeSetKey] !== undefined) {
            totalScore += game[homeSetKey]
          }
          if (game[awaySetKey] !== null && game[awaySetKey] !== undefined) {
            totalScore += game[awaySetKey]
          }
        }
      } else {
        // 농구 등: 연장전 점수 포함
        totalScore = finalHomeScore + finalAwayScore
      }
      
      if (totalScore > totalLine) {
        if (includeHomeTeam) {
          teamStats[homeTeam].underOver.overs++
          teamStats[homeTeam].underOver.games.push({ ...game, isHome: true })
        }
        if (includeAwayTeam) {
          teamStats[awayTeam].underOver.overs++
          teamStats[awayTeam].underOver.games.push({ ...game, isHome: false })
        }
      } else if (totalScore < totalLine) {
        if (includeHomeTeam) {
          teamStats[homeTeam].underOver.unders++
          teamStats[homeTeam].underOver.games.push({ ...game, isHome: true })
        }
        if (includeAwayTeam) {
          teamStats[awayTeam].underOver.unders++
          teamStats[awayTeam].underOver.games.push({ ...game, isHome: false })
        }
      }
      // 푸시는 무시
    }
  })
  
  // 결과 포맷팅
  const result = {
    winLoss: [],
    ats: [],
    underOver: []
  }
  
  Object.values(teamStats).forEach(stat => {
    // Win/Loss
    const winLossRecord = `${stat.winLoss.wins}-${stat.winLoss.losses}`
    const winLossPd = calculatePD(stat.winLoss.wins, stat.winLoss.losses)
    result.winLoss.push({
      team: stat.team,
      record: winLossRecord,
      pd: winLossPd,
      category: 'Win/Loss'
    })
    
    // ATS
    if (stat.ats.wins > 0 || stat.ats.losses > 0) {
      const atsRecord = `${stat.ats.wins}-${stat.ats.losses}`
      const atsPd = calculatePD(stat.ats.wins, stat.ats.losses)
      result.ats.push({
        team: stat.team,
        record: atsRecord,
        pd: atsPd,
        category: 'ATS'
      })
    }
    
    // Under/Over
    if (stat.underOver.overs > 0 || stat.underOver.unders > 0) {
      const uoRecord = `${stat.underOver.overs}-${stat.underOver.unders}`
      const uoPd = calculatePD(stat.underOver.overs, stat.underOver.unders)
      result.underOver.push({
        team: stat.team,
        record: uoRecord,
        pd: uoPd,
        category: 'Under/Over'
      })
    }
  })
  
  return result
}

/**
 * 승률 기반 PD 계산
 * @param {Number} wins - 승수
 * @param {Number} losses - 패수
 * @returns {String} PD 값 (예: +2.3, -1.2, 0)
 */
const calculatePD = (wins, losses) => {
  const total = wins + losses
  if (total === 0) return '0'
  
  const winRate = wins / total
  const expectedWinRate = 0.5 // 50% 기준
  const pd = (winRate - expectedWinRate) * 10 // 스케일 조정
  
  if (pd > 0) {
    return `+${pd.toFixed(1)}`
  } else if (pd < 0) {
    return pd.toFixed(1)
  }
  return '0'
}

/**
 * 게임 결과를 저장 형식으로 변환
 * @param {Object} gameData - 입력된 게임 데이터
 * @returns {Object} 저장할 게임 객체
 */
export const formatGameData = (gameData) => {
  return {
    id: Date.now().toString(), // 고유 ID
    date: gameData.date,
    homeTeam: gameData.homeTeam,
    awayTeam: gameData.awayTeam,
    homeScore: gameData.homeScore,
    awayScore: gameData.awayScore,
    spread: gameData.spread,
    totalLine: gameData.totalLine,
    createdAt: new Date().toISOString()
  }
}

