// Firestore를 사용한 데이터 관리 유틸리티

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

const COLLECTION_NAME = 'games'
const PREDICTION_DOC_ID = 'current_prediction' // 예측 데이터는 단일 문서로 관리 (gender별로 분리)

/**
 * 게임 데이터를 Firestore에 저장
 * @param {Array} games - 게임 데이터 배열
 * @returns {Promise<boolean>} 저장 성공 여부
 */
export const saveGamesData = async (games) => {
  try {
    // 각 게임을 개별 문서로 저장
    const promises = games.map(async (game) => {
      // gender 필드가 반드시 있어야 함
      if (!game.gender) {
        console.error('❌ gender 필드가 없는 게임 데이터:', game)
        throw new Error('gender 필드가 필수입니다.')
      }
      
      const gameRef = doc(db, COLLECTION_NAME, game.id)
      const gameDataToSave = {
        ...game,
        gender: game.gender, // gender 필드 명시적으로 포함
        updatedAt: new Date().toISOString()
      }
      console.log('💾 Firestore 저장 - 게임 ID:', game.id, 'gender:', gameDataToSave.gender, '홈팀:', gameDataToSave.homeTeam, '원정팀:', gameDataToSave.awayTeam)
      await setDoc(gameRef, gameDataToSave, { merge: true })
    })
    
    await Promise.all(promises)
    console.log('✅ Firestore 데이터 저장 완료:', games.length, '개 경기')
    return true
  } catch (error) {
    console.error('❌ Firestore 데이터 저장 실패:', error)
    alert('데이터 저장에 실패했습니다: ' + error.message)
    return false
  }
}

/**
 * Firestore에서 게임 데이터 로드 (일회성)
 * @param {String} gender - '여자부' 또는 '남자부' (선택사항, 없으면 전체)
 * @returns {Promise<Array>} 게임 데이터 배열
 */
export const loadGamesData = async (gender = null) => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME)
    
    // 먼저 전체 데이터를 로드하여 gender 필드가 없는 데이터를 마이그레이션
    // (서버 사이드 필터링은 gender 필드가 있어야 하므로, 먼저 마이그레이션 필요)
    const allGamesQuery = query(gamesRef, orderBy('date', 'desc'))
    const allGamesSnapshot = await getDocs(allGamesQuery)
    
    const allGames = []
    allGamesSnapshot.forEach((doc) => {
      const gameData = {
        id: doc.id,
        ...doc.data()
      }
      allGames.push(gameData)
    })
    
    // 데이터 마이그레이션: overUnderLine, gender 필드가 없는 경우 기본값 설정
    let needsMigration = false
    const migratedGames = allGames.map(game => {
      const updated = { ...game }
      if (!('overUnderLine' in game)) {
        needsMigration = true
        updated.overUnderLine = null
      }
      if (!('gender' in game) || !updated.gender) {
        needsMigration = true
        updated.gender = '여자부' // 기존 데이터는 모두 여자부로 마이그레이션
      }
      return updated
    })
    
    // 마이그레이션이 필요한 경우 저장
    if (needsMigration && migratedGames.length > 0) {
      console.log('⚠️ 데이터 마이그레이션: overUnderLine, gender 필드 추가 -', migratedGames.length, '개 경기')
      await saveGamesData(migratedGames)
    }
    
    // gender 필터 적용
    const filteredGames = gender 
      ? migratedGames.filter(game => game.gender === gender)
      : migratedGames
    
    if (gender) {
      console.log('🔍 Gender 필터 적용:', gender, '- 전체:', migratedGames.length, '개, 필터링 후:', filteredGames.length, '개')
    }
    
    console.log('📂 Firestore 데이터 로드 완료:', filteredGames.length, '개 경기', gender ? `(필터: ${gender})` : '')
    return filteredGames
  } catch (error) {
    // 인덱스가 아직 빌드 중인 경우 클라이언트 사이드 필터링으로 fallback
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      console.warn('⚠️ 인덱스가 아직 빌드 중입니다. 클라이언트 사이드 필터링으로 fallback합니다.')
      try {
        const gamesRef = collection(db, COLLECTION_NAME)
        const q = query(gamesRef, orderBy('date', 'desc'))
        const querySnapshot = await getDocs(q)
        const allGames = []
        querySnapshot.forEach((doc) => {
          allGames.push({ id: doc.id, ...doc.data() })
        })
        const migratedGames = allGames.map(game => ({
          ...game,
          overUnderLine: game.overUnderLine ?? null,
          gender: game.gender || '여자부'
        }))
        const filteredGames = gender 
          ? migratedGames.filter(game => game.gender === gender)
          : migratedGames
        console.log('📂 Firestore 데이터 로드 완료 (fallback):', filteredGames.length, '개 경기', gender ? `(클라이언트 필터: ${gender})` : '')
        return filteredGames
      } catch (fallbackError) {
        console.error('❌ Fallback 로드도 실패:', fallbackError)
        return []
      }
    }
    console.error('❌ Firestore 데이터 로드 실패:', error)
    return []
  }
}

/**
 * Firestore 게임 데이터 실시간 구독
 * @param {Function} callback - 데이터 변경 시 호출될 콜백 함수 (games 배열을 인자로 받음)
 * @param {String} gender - '여자부' 또는 '남자부' (선택사항, 없으면 전체)
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToGamesData = (callback, gender = null) => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME)
    
    // 전체 데이터를 구독하여 마이그레이션 후 필터링
    // (서버 사이드 필터링은 gender 필드가 있어야 하므로, 먼저 마이그레이션 필요)
    const q = query(gamesRef, orderBy('date', 'desc'))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const games = []
      querySnapshot.forEach((doc) => {
        const gameData = {
          id: doc.id,
          ...doc.data()
        }
        games.push(gameData)
      })
      
      // 데이터 마이그레이션: overUnderLine, gender 필드가 없는 경우 기본값 설정
      const migratedGames = games.map(game => {
        const updated = { ...game }
        if (!('overUnderLine' in game)) {
          updated.overUnderLine = null
        }
        if (!('gender' in game) || !updated.gender) {
          updated.gender = '여자부' // 기존 데이터는 모두 여자부로 마이그레이션
        }
        return updated
      })
      
      // 마이그레이션이 필요한 경우 저장 (비동기이지만 콜백은 계속 진행)
      const needsMigration = migratedGames.some(game => 
        !('overUnderLine' in game) || !('gender' in game) || !game.gender
      )
      if (needsMigration) {
        console.log('⚠️ 실시간 데이터 마이그레이션 필요 -', migratedGames.length, '개 경기')
        saveGamesData(migratedGames).catch(err => {
          console.error('❌ 마이그레이션 저장 실패:', err)
        })
      }
      
      // gender 필터 적용 (클라이언트 사이드)
      const filteredGames = gender 
        ? migratedGames.filter(game => game.gender === gender)
        : migratedGames
      
      console.log('🔄 실시간 데이터 업데이트:', filteredGames.length, '개 경기', gender ? `(필터: ${gender})` : '(필터 없음)')
      callback(filteredGames)
    }, (error) => {
      // 인덱스가 아직 빌드 중인 경우 클라이언트 사이드 필터링으로 fallback
      if (error.code === 'failed-precondition' && error.message && error.message.includes('index')) {
        console.warn('⚠️ 인덱스가 아직 빌드 중입니다. 클라이언트 사이드 필터링으로 fallback합니다.')
        const fallbackQ = query(gamesRef, orderBy('date', 'desc'))
        const fallbackUnsubscribe = onSnapshot(fallbackQ, (querySnapshot) => {
          const games = []
          querySnapshot.forEach((doc) => {
            games.push({ id: doc.id, ...doc.data() })
          })
          const migratedGames = games.map(game => ({
            ...game,
            overUnderLine: game.overUnderLine ?? null,
            gender: game.gender || '여자부'
          }))
          const filteredGames = gender 
            ? migratedGames.filter(game => game.gender === gender)
            : migratedGames
          console.log('🔄 실시간 데이터 업데이트 (fallback):', filteredGames.length, '개 경기', gender ? `(클라이언트 필터: ${gender})` : '')
          callback(filteredGames)
        }, (fallbackError) => {
          console.error('❌ Fallback 실시간 데이터 구독 오류:', fallbackError)
          callback([])
        })
        return fallbackUnsubscribe
      }
      console.error('❌ 실시간 데이터 구독 오류:', error)
      callback([])
    })
    
    return unsubscribe
  } catch (error) {
    console.error('❌ 실시간 데이터 구독 설정 실패:', error)
    return () => {} // 빈 함수 반환 (에러 시에도 안전하게 처리)
  }
}

/**
 * 단일 게임 추가
 * @param {Object} game - 게임 데이터
 * @returns {Promise<string>} 생성된 문서 ID
 */
export const addGame = async (game) => {
  try {
    const gamesRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(gamesRef, {
      ...game,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('✅ 게임 추가 완료:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('❌ 게임 추가 실패:', error)
    throw error
  }
}

/**
 * 단일 게임 업데이트
 * @param {string} gameId - 게임 ID
 * @param {Object} gameData - 업데이트할 게임 데이터
 * @returns {Promise<boolean>} 업데이트 성공 여부
 */
export const updateGame = async (gameId, gameData) => {
  try {
    const gameRef = doc(db, COLLECTION_NAME, gameId)
    await updateDoc(gameRef, {
      ...gameData,
      updatedAt: new Date().toISOString()
    })
    console.log('✅ 게임 업데이트 완료:', gameId)
    return true
  } catch (error) {
    console.error('❌ 게임 업데이트 실패:', error)
    return false
  }
}

/**
 * 단일 게임 삭제
 * @param {string} gameId - 게임 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export const deleteGame = async (gameId) => {
  try {
    const gameRef = doc(db, COLLECTION_NAME, gameId)
    await deleteDoc(gameRef)
    console.log('✅ 게임 삭제 완료:', gameId)
    return true
  } catch (error) {
    console.error('❌ 게임 삭제 실패:', error)
    return false
  }
}

// 하위 호환성을 위한 기존 함수들 (사용하지 않지만 유지)
export const saveStandingsData = () => {
  console.warn('saveStandingsData는 Firestore에서 사용되지 않습니다.')
  return true
}

export const loadStandingsData = () => {
  console.warn('loadStandingsData는 Firestore에서 사용되지 않습니다.')
  return []
}

export const clearStandingsData = async () => {
  try {
    // 모든 게임 데이터 삭제
    const gamesRef = collection(db, COLLECTION_NAME)
    const querySnapshot = await getDocs(gamesRef)
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    console.log('✅ 모든 데이터 삭제 완료')
    return true
  } catch (error) {
    console.error('❌ 데이터 삭제 실패:', error)
    return false
  }
}

// Export/Import 함수들은 기존과 동일하게 유지 (로컬 파일 다운로드/업로드)
// storage.js에서 직접 import하여 재export
import { 
  exportGamesData as exportGamesDataLocal,
  importGamesData as importGamesDataLocal,
  exportGamesDataToExcel as exportGamesDataToExcelLocal,
  importExcelData as importExcelDataLocal
} from './storage.js'

export const exportGamesData = exportGamesDataLocal
export const importGamesData = importGamesDataLocal
export const exportGamesDataToExcel = exportGamesDataToExcelLocal
export const importExcelData = importExcelDataLocal

/**
 * 예측 경기 데이터 저장 (덮어쓰기)
 * @param {Object} predictionData - 예측 데이터 { homeTeam, awayTeam, handicap, overUnderLine, gender }
 * @returns {Promise<boolean>} 저장 성공 여부
 */
export const savePredictionData = async (predictionData) => {
  try {
    const gender = predictionData.gender || '여자부'
    const games = predictionData.games || []
    
    const predictionRef = doc(db, 'predictions', `${PREDICTION_DOC_ID}_${gender}`)
    await setDoc(predictionRef, {
      games,
      gender,
      updatedAt: new Date().toISOString()
    })
    console.log('✅ 예측 데이터 저장 완료:', gender, '경기 수:', games.length)
    return true
  } catch (error) {
    console.error('❌ 예측 데이터 저장 실패:', error)
    throw error
  }
}

/**
 * 예측 경기 데이터 로드
 * @param {String} gender - '여자부' 또는 '남자부' (기본값: '여자부')
 * @returns {Promise<Array>} 예측 데이터 배열
 */
export const loadPredictionData = async (gender = '여자부') => {
  try {
    const predictionRef = doc(db, 'predictions', `${PREDICTION_DOC_ID}_${gender}`)
    const docSnap = await getDoc(predictionRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      // 배열로 반환 (하위 호환)
      return data.games || []
    }
    return []
  } catch (error) {
    console.error('❌ 예측 데이터 로드 실패:', error)
    return null
  }
}

/**
 * 예측 경기 데이터 실시간 구독
 * @param {Function} callback - 데이터 변경 시 호출될 콜백 함수
 * @param {String} gender - '여자부' 또는 '남자부' (기본값: '여자부')
 * @returns {Function} 구독 해제 함수
 */
export const subscribeToPredictionData = (callback, gender = '여자부') => {
  try {
    const predictionRef = doc(db, 'predictions', `${PREDICTION_DOC_ID}_${gender}`)
    
    const unsubscribe = onSnapshot(predictionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        // 배열로 반환 (하위 호환)
        callback(data.games || [])
      } else {
        callback([])
      }
    }, (error) => {
      console.error('❌ 예측 데이터 실시간 구독 오류:', error)
      callback([])
    })
    
    return unsubscribe
  } catch (error) {
    console.error('❌ 예측 데이터 실시간 구독 설정 실패:', error)
    return () => {}
  }
}

/**
 * 예측 경기 데이터 삭제
 * @param {String} gender - '여자부' 또는 '남자부' (기본값: '여자부')
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export const deletePredictionData = async (gender = '여자부') => {
  try {
    const predictionRef = doc(db, 'predictions', `${PREDICTION_DOC_ID}_${gender}`)
    await deleteDoc(predictionRef)
    console.log('✅ 예측 데이터 삭제 완료:', gender)
    return true
  } catch (error) {
    console.error('❌ 예측 데이터 삭제 실패:', error)
    throw error
  }
}

