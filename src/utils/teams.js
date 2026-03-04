// 타이틀별 팀 목록 관리

// 영문 팀명 매핑
export const TEAM_NAMES_EN = {
  // 남자 농구
  '창원LG': 'Changwon LG',
  '서울SK': 'Seoul SK',
  '서울삼성': 'Seoul Samsung',
  '부산KCC': 'Busan KCC',
  '울산모비스': 'Ulsan Mobis',
  '원주DB': 'Wonju DB',
  '수원KT': 'Suwon KT',
  '대구한국가스공사': 'Daegu KOGAS',
  '안양정관장': 'Anyang KGC',
  '고양소노': 'Goyang Sono',
  // 여자 농구
  'KB스타즈': 'KB Stars',
  '삼성생명': 'Samsung Life',
  '하나은행': 'Hana Bank',
  'BNK썸': 'BNK Sum',
  '우리은행': 'Woori Bank',
  '신한은행': 'Shinhan Bank',
  // 남자 배구
  '대한항공': 'Korean Air',
  'KB손해보험': 'KB Insurance',
  '현대캐피탈': 'Hyundai Capital',
  'OK저축은행': 'OK Savings Bank',
  '한국전력': 'KEPCO',
  '우리카드': 'Woori Card',
  '삼성화재': 'Samsung Fire',
  // 여자 배구
  '도로공사': 'Expressway Corp',
  '페퍼저축은행': 'Pepper Bank',
  '현대건설': 'Hyundai E&C',
  'GS칼텍스': 'GS Caltex',
  '흥국생명': 'Heungkuk Life',
  '정관장': 'KGC',
  'IBK기업은행': 'IBK Bank'
}

/**
 * 팀명을 영문으로 변환
 * @param {String} teamName - 한글 팀명
 * @returns {String} 영문 팀명 (없으면 원래 이름 반환)
 */
export const getTeamNameEn = (teamName) => {
  return TEAM_NAMES_EN[teamName] || teamName
}

export const TEAM_LISTS = {
  'K-Basketball(남자)': [
    '창원LG',
    '서울SK',
    '서울삼성',
    '부산KCC',
    '울산모비스',
    '원주DB',
    '수원KT',
    '대구한국가스공사',
    '안양정관장',
    '고양소노'
  ],
  'K-Basketball(여자)': [
    'KB스타즈',
    '삼성생명',
    '하나은행',
    'BNK썸',
    '우리은행',
    '신한은행'
  ],
  'V-League(남자)': [
    '대한항공',
    'KB손해보험',
    '현대캐피탈',
    'OK저축은행',
    '한국전력',
    '우리카드',
    '삼성화재'
  ],
  'V-League(여자)': [
    '도로공사',
    '페퍼저축은행',
    '현대건설',
    'GS칼텍스',
    '흥국생명',
    '정관장',
    'IBK기업은행'
  ]
}

/**
 * 특정 타이틀의 팀 목록 가져오기
 * @param {String} title - 타이틀 이름
 * @returns {Array} 팀 목록
 */
export const getTeamsByTitle = (title) => {
  return TEAM_LISTS[title] || []
}

/**
 * 팀 목록이 있는지 확인
 * @param {String} title - 타이틀 이름
 * @returns {Boolean} 팀 목록 존재 여부
 */
export const hasTeamList = (title) => {
  const teams = getTeamsByTitle(title)
  return teams.length > 0
}


