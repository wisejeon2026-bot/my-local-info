const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // 환경변수 확인
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
      process.exit(1);
    }

    // 1단계: 최신 데이터 확인
    const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
    if (!fs.existsSync(dataPath)) {
      console.error('오류: local-info.json 파일이 존재하지 않습니다.');
      process.exit(1);
    }

    const localInfo = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const events = localInfo.events || [];
    const benefits = localInfo.benefits || [];
    const allItems = [...events, ...benefits];

    if (allItems.length === 0) {
      console.log('처리할 수 있는 공공서비스 데이터가 없습니다.');
      return;
    }

    // ID가 가장 높은 최신 항목 선택
    const latestItem = allItems.reduce((latest, item) => {
      return (!latest || (item.id || 0) > (latest.id || 0)) ? item : latest;
    }, null);

    console.log(`최신 데이터 분석 중: [ID ${latestItem.id}] ${latestItem.name}`);

    // 기존 블로그 글들과 비교하여 중복 여부 확인
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    let alreadyExists = false;

    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      for (const file of files) {
        const fileContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        // 파일에 새 항목의 명칭이 들어있는지 체크하여 중복 방지
        if (fileContent.includes(latestItem.name)) {
          alreadyExists = true;
          break;
        }
      }
    }

    if (alreadyExists) {
      console.log('이미 작성된 글입니다');
      return;
    }

    // 2단계: Gemini AI로 블로그 글 생성
    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    console.log('Gemini API를 사용하여 블로그 게시물을 작성하는 중...');
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

    // 마크다운 마크업 기호 정제
    text = text.replace(/```markdown/gi, '').replace(/```/gi, '').trim();

    // 3단계: 파일명 추출 및 본문 분리
    const filenameRegex = /FILENAME:\s*([^\s\n]+)/i;
    const match = text.match(filenameRegex);

    let filename = `${today}-post.md`;
    let finalContent = text;

    if (match) {
      const proposedFilename = match[1].trim();
      filename = proposedFilename.endsWith('.md') ? proposedFilename : `${proposedFilename}.md`;
      // 본문에서 FILENAME 줄을 깨끗하게 제거
      finalContent = text.replace(/FILENAME:\s*[^\n]*/gi, '').trim();
    }

    // 디렉토리가 존재하지 않는다면 생성
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // 완성된 포스트를 파일로 기록
    const savePath = path.join(postsDir, filename);
    fs.writeFileSync(savePath, finalContent, 'utf-8');

    console.log(`성공: 블로그 글이 생성되었습니다. (${filename})`);

  } catch (error) {
    console.error('오류 발생: 블로그 글을 생성하는 중 에러가 발생하여 작업을 중단했습니다. 기존 포스트는 안전하게 보존되었습니다.');
    console.error(error);
    process.exit(1);
  }
}

main();
