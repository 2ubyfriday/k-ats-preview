// API 인터페이스 - 현재는 localStorage 사용, 나중에 실제 DB API로 교체 가능

import { saveGamesData, loadGamesData } from './storage.js'

/**
 * 게임 데이터 저장 (DB 저장 인터페이스)
 * @param {Object} gameData - 게임 데이터
 * @returns {Promise<Object>} 저장된 게임 데이터
 */
export const saveGame = async (gameData) => {
  try {
    // 현재는 localStorage 사용
    const games = loadGamesData()
    games.push(gameData)
    saveGamesData(games)
    
    // 실제 DB 연동 시 아래와 같이 변경:
    // const response = await fetch('/api/games', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(gameData)
    // })
    // return await response.json()
    
    return Promise.resolve(gameData)
  } catch (error) {
    console.error('게임 저장 실패:', error)
    return Promise.reject(error)
  }
}

/**
 * 모든 게임 데이터 조회 (DB 조회 인터페이스)
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const getGames = async () => {
  try {
    // 현재는 localStorage 사용
    const games = loadGamesData()
    
    // 실제 DB 연동 시 아래와 같이 변경:
    // const response = await fetch('/api/games')
    // return await response.json()
    
    return Promise.resolve(games)
  } catch (error) {
    console.error('게임 조회 실패:', error)
    return Promise.reject(error)
  }
}

/**
 * 특정 팀의 게임 데이터 조회
 * @param {String} teamName - 팀명
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const getGamesByTeam = async (teamName) => {
  try {
    const games = loadGamesData()
    const filtered = games.filter(
      g => g.homeTeam === teamName || g.awayTeam === teamName
    )
    return Promise.resolve(filtered)
  } catch (error) {
    console.error('게임 조회 실패:', error)
    return Promise.reject(error)
  }
}

/**
 * 특정 날짜의 게임 데이터 조회
 * @param {String} date - YYYY-MM-DD 형식의 날짜
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const getGamesByDate = async (date) => {
  try {
    const games = loadGamesData()
    const filtered = games.filter(g => g.date === date)
    return Promise.resolve(filtered)
  } catch (error) {
    console.error('게임 조회 실패:', error)
    return Promise.reject(error)
  }
}

/**
 * 게임 데이터 삭제
 * @param {String} gameId - 게임 ID
 * @returns {Promise<Boolean>} 삭제 성공 여부
 */
export const deleteGame = async (gameId) => {
  try {
    const games = loadGamesData()
    const filtered = games.filter(g => g.id !== gameId)
    saveGamesData(filtered)
    return Promise.resolve(true)
  } catch (error) {
    console.error('게임 삭제 실패:', error)
    return Promise.reject(error)
  }
}

