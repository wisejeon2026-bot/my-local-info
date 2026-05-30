const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // 환경변수 확인
    const publicApiKey = process.env.PUBLIC_DATA_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!publicApiKey) {
      console.error('오류: PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.');
      process.exit(1);
    }
    if (!geminiApiKey) {
      console.error('오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
      process.exit(1);
    }

    // 1단계: 공공데이터포털 API에서 데이터 가져오기
    // 공공데이터포털의 특수한 인증키 인코딩 방식을 고려하여 안전하게 인코딩 처리
    const decodedApiKey = decodeURIComponent(publicApiKey);
    const encodedApiKey = encodeURIComponent(decodedApiKey);
    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodedApiKey}`;

    console.log('공공데이터포털 API에서 데이터를 가져오는 중...');
    const response = await fetch(publicDataUrl);
    if (!response.ok) {
      throw new Error(`공공데이터 API 호출 실패: ${response.statusText} (${response.status})`);
    }

    const result = await response.json();
    const items = result.data || [];
    if (items.length === 0) {
      console.log('공공데이터 API로부터 받은 데이터가 비어 있습니다.');
      return;
    }

    // "성남", "경기" 키워드 기반 필터링 헬퍼 함수
    const filterByKeyword = (list, keyword) => {
      return list.filter(item => {
        const serviceName = item['서비스명'] || item['name'] || '';
        const summary = item['서비스목적요약'] || item['purpose'] || '';
        const target = item['지원대상'] || item['target'] || '';
        const agency = item['소관기관명'] || item['agency'] || '';

        return (
          serviceName.includes(keyword) ||
          summary.includes(keyword) ||
          target.includes(keyword) ||
          agency.includes(keyword)
        );
      });
    };

    // 필터링 적용 (성남 -> 경기 -> 전체 데이터 순서)
    let filtered = filterByKeyword(items, '성남');
    if (filtered.length === 0) {
      console.log('"성남" 키워드가 포함된 데이터를 찾지 못해 "경기" 키워드로 다시 검색합니다.');
      filtered = filterByKeyword(items, '경기');
    }
    if (filtered.length === 0) {
      console.log('"경기" 키워드가 포함된 데이터도 찾지 못해 전체 데이터를 사용합니다.');
      filtered = items;
    }

    // 2단계: 기존 데이터와 비교
    const filePath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    let existingData = { events: [], benefits: [] };

    if (fs.existsSync(filePath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (err) {
        console.warn('주의: 기존 local-info.json을 파싱하는 과정에서 오류가 발생했습니다. 새 구조로 시작합니다.', err);
      }
    }

    // 기존 데이터의 모든 name(서비스명) 수집
    const existingNames = new Set([
      ...(existingData.events || []).map(item => item.name),
      ...(existingData.benefits || []).map(item => item.name)
    ]);

    // 기존에 존재하지 않는 새로운 후보 데이터 추출
    const newDataCandidates = filtered.filter(item => {
      const name = item['서비스명'] || item['name'];
      return name && !existingNames.has(name);
    });

    if (newDataCandidates.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    // 처리할 새 공공데이터 항목 1개 선정
    const candidate = newDataCandidates[0];
    console.log(`선정된 신규 공공데이터: ${candidate['서비스명'] || candidate['name']}`);

    // 3단계: Gemini AI로 새 항목 1개만 가공
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜 (${today})를 넣어. endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(candidate, null, 2)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    console.log('Gemini API를 호출하여 데이터를 가공하는 중...');
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.statusText} (${geminiResponse.status})`);
    }

    const geminiResult = await geminiResponse.json();
    if (!geminiResult.candidates || geminiResult.candidates.length === 0) {
      throw new Error('Gemini API로부터 올바른 응답을 받지 못했습니다.');
    }

    let text = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 코드블록 제거 및 정제
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

    let newInfo;
    try {
      newInfo = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Gemini 응답 JSON 파싱 실패. 원본 텍스트: ${text}`);
    }

    // 4단계: 기존 데이터에 추가
    // 고유 ID 결정을 위해 전체 데이터에서 최대 ID 계산
    const allItems = [...(existingData.events || []), ...(existingData.benefits || [])];
    const maxId = allItems.reduce((max, item) => Math.max(max, item.id || 0), 0);
    const nextId = maxId + 1;

    // 카테고리 필드 매핑 및 표시용 날짜 포맷팅
    const categoryType = newInfo.category === '행사' ? '행사/축제' : '지원금/혜택';
    const dateStr = newInfo.endDate === '상시'
      ? `${newInfo.startDate} ~ 상시`
      : `${newInfo.startDate} ~ ${newInfo.endDate}`;

    const finalItem = {
      id: nextId,
      name: newInfo.name || candidate['서비스명'] || candidate['name'],
      category: categoryType,
      date: dateStr,
      location: newInfo.location || candidate['소관기관명'] || '정보 없음',
      target: newInfo.target || candidate['지원대상'] || '누구나',
      summary: newInfo.summary || candidate['서비스목적요약'] || '',
      link: newInfo.link || candidate['상세조회URL'] || '#'
    };

    // 카테고리에 맞춰 해당 배열에 저장
    if (newInfo.category === '행사') {
      if (!existingData.events) existingData.events = [];
      existingData.events.push(finalItem);
    } else {
      if (!existingData.benefits) existingData.benefits = [];
      existingData.benefits.push(finalItem);
    }

    // 변경된 데이터를 파일에 기록 (에러 없이 성공 시에만)
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log(`성공: 새로운 데이터가 추가되었습니다. (${finalItem.name})`);

  } catch (error) {
    console.error('오류 발생: 스크립트가 실행되는 도중 에러가 발생했습니다. 기존 데이터는 안전하게 보존되었습니다.');
    console.error(error);
    process.exit(1);
  }
}

main();
