const http = require('http');
const fs = require('fs');

// 기본 상식 퀴즈 문제와 정답
const basicQuiz = [
    { question: "세계에서 가장 큰 대륙은?", options: ["A. 아시아", "B. 유럽", "C. 아프리카", "D. 북아메리카"], answer: "A" },
    { question: "태양계에서 행성의 개수는?", options: ["A. 7개", "B. 8개", "C. 9개", "D. 10개"], answer: "B" },
    { question: "물의 화학식은 무엇인가요?", options : ["A. H20", "B. CO2", "C.NaCl", "D. HCl"], answer: "A" },
    { question: "사람의 심장은 몇 개의 심실과 혈관으로 이루어져 있나요?", options : ["A. 2개의 심실과 3개의 혈관", "B. 3개의 심실과 4개의 혈관", "C. 4개의 심실과 2개의 혈관", "D. 4개의 심실과 4개의 혈관"], answer: "C" },
    { question: "원주율(π)의 값은 얼마인가요?", options : ["A. 3.14", "B. 3.141", "C. 3.1415", "D. 3.14159"], answer: "A" },
    { question: "전기를 통해 빛을 발하는 소자는 무엇인가요?", options : ["A. 전구", "B. 모터", "C. 콘덴서", "D. 저항"], answer: "A" },
    { question: "소리의 세기를 측정하는 단위는?", options : ["A. 데시벨", "B. 헤르츠", "C. 아르", "D. 와트"], answer: "A" },
    { question: "태양계에서 가장 큰 행성은?", options : ["A. 지구", "B. 목성", "C. 토성 ", "D. 해왕성"], answer: "B" },
    { question: "휴먼 에이즈(Human Age)라 불리는 21세기의 다음 세기는 몇 세기인가요?", options : ["A. 22세기", "B. 23세기", "C. 24세기", "D. 25세기"], answer: "C" },
    { question: "대한민국의 수도는 어디인가요?", options : ["A. 부산", "B. 대구", "C. 서울", "D. 인천"], answer: "C" },
    // 나머지 문제들 추가
];
const koreahistory = [
    { question: "조선시대 신분제도에서 양반에 해당하는 계급은?", options: ["A. 사대부", "B. 양반", "C. 상민", "D. 노비"], answer: "B" },
    { question: "조선시대 신라와 함께 '두 기와 두람'이라 불리우며 발전한 지역은?", options: ["A. 전라도", "B. 강원도", "C. 충청도", "D. 경상도"], answer: "A" },
    { question: "조선시대 왕들이 중앙집권을 강화하기 위해 실시한 제도는?", options: ["A. 훈민정음 창제", "B. 사문서 발간", "C. 읍참봉사제", "D. 정무행안처 설치"], answer: "C" },
    { question: "조선시대 정조가 세운 기백제도로 유명한 것은?", options: ["A. 관청의 실무화", "B. 벽촌문서제도", "C. 향리간첩사건", "D. 정조의 명량행안"], answer: "B" },
    { question: "조선시대 세종대왕이 편찬한 과학서적은?", options: ["A. 형례", "B. 서원경유조", "C. 훈민정음", "D. 식품경"], answer: "B" },
    { question: "조선 후기에 일어난 '인조 집혼' 사건은 어느 왕의 시대에 발생했는가?", options: ["A. 숙종", "B. 공양왕", "C. 현종", "D. 고종"], answer: "C" },
    { question: "조선시대 군사 제도 중 중앙군인을 대표하는 기관은?", options: ["A. 무신", "B. 수군", "C. 의병", "D. 조강포"], answer: "A" },
    { question: "고려시대 사회에서 발달한 성리학의 학파 중에서 이이(李珥)를 중심으로 한 학파는?", options: ["A. 성균관 학파", "B. 영남학파", "C. 동학파", "D. 서학파"], answer: "A" },
    { question: "고려시대 경술사의 존칭은?", options: ["A. 무신", "B. 경국대군", "C. 경위병", "D. 경감"], answer: "B" },
    { question: "고려시대 '임금의 기록'을 중심으로 한 정치적 활동을 펼친 인물은?", options: ["A. 권오", "B. 최무선", "C. 신덕원", "D. 강감찬"], answer: "A" },
]
const science = [
    { question: "원자핵 분열을 발견한 과학자는?", options: ["A. 알버트 아인슈타인", "B. 니콜라 테슬라", "C. 마리큐리", "D. 알란 튜링"], answer: "C" },
    { question: "DNA의 구조를 처음으로 제시한 과학자는?", options: ["A. 프린시스 크릭", "B. 로슬린 프랭클린", "C. 제임스 왓슨", "D. 리니우스 폴링"], answer: "C" },
    { question: "가장 강력한 지진의 진도를 측정하는 지진 진도 척도는?", options: ["A. 리히터 규모", "B. 모멘트 규모", "C. 멜 콜라이 규모", "D. 리처 스케일"], answer: "B" },
    { question: "현대 물리학에서 가장 기본적인 입자는?", options: ["A. 전자", "B. 중성사", "C. 프로톤", "D. 퀴어크"], answer: "A" },
    { question: "가장 높은 고도에 있는 대기권의 경계는?", options: ["A. 멸구권", "B. 중간권", "C. 대류권", "D. 중력파권"], answer: "A" },
    { question: "우주에서 가장 큰 별은 무엇인가?", options: ["A. 태양", "B. 베텔게우스", "C. 성운", "D. 은하"], answer: "B" },
    { question: "천체간의 거리를 측정하는 단위로 사용되는 광년은 무엇을 기준으로 산출되는가?", options: ["A. 지우과 태양 사이의 거리", "B. 지구와 달 사이의 거리", "C. 빛이 1년 동안 진행하는 거리", "D. 태양계 내 행성들 사이의 평균거리"], answer: "C" },
    { question: "원자를 구성하는 입자 중 전하를 가지고 있지 않은 것은?", options: ["A. 전자", "B. 중성자", "C. 양성자", "D. 퀴어크"], answer: "B" },
    { question: "현대 물리학에서 기본 입자로 인정되는 것 중 가장 질량이 큰 것은?", options: ["A. 전자", "B. 중성자", "C. 양성자", "D. 퀴어크"], answer: "C" },
    { question: "현대 물리학에서 우주의 가장 큰 원인 중 하나로 여겨지는 것은?", options: ["A. 다크매터", "B. 웜홀", "C. 블랙홀", "D. 양티매터"], answer: "A" },
]
const art = [
    {
        "question": "다음 중 어떤 예술 형태가 루네트라같은 장르에서 높은 평가를 받고 있나요?",
        "options": ["A. 조각", "B. 회화", "C. 음악", "D. 무용"],
        "answer": "B"
      },
      
      {
        "question": "미술사에서 '고전적인 양식'이란 무엇을 가리키나요?",
        "options": ["A. 현대 예술", "B. 전통 예술", "C. 실험적인 예술", "D. 추상 예술"],
        "answer": "B"
      }
      ,
      {
        "question": "아름다움의 정의는 개인마다 다르게 해석될 수 있습니다. 다음 중 아름다움을 평가하는 데 가장 중요한 것은 무엇인가요?",
        "options": ["A. 기술적 솜씨", "B. 감정적 효과", "C. 문화적 배경", "D. 재료의 특성"],
        "answer": "B"
      }
      ,
      {
        "question": "유명한 작가인 다빈치는 무엇으로 가장 잘 알려져 있나요?",
        "options": ["A. 음악가", "B. 화가", "C. 작가", "D. 건축가"],
        "answer": "B"
      }
      ,
      {
        "question": "팝 아트의 특징은 무엇인가요?",
        "options": ["A. 고전적인 양식에 대한 연구", "B. 대중 문화의 이미지와 소재 사용", "C. 정교한 기법과 명화의 재현", "D. 관습에 어긋나는 대담한 작품"],
        "answer": "B"
      }
      ,
      {
        "question": "현대 미술에서 '아방가르드'란 무엇을 의미하나요?",
        "options": ["A. 전통적인 형식에 대한 회귀", "B. 새로운 실험적 예술의 탐구", "C. 신비주의적인 주제의 탐구", "D. 예술적 규범에 대한 열린 도전"],
        "answer": "B"
      }
      ,
      {
        "question": "조각에서 '양식'이란 무엇을 의미하나요?",
        "options": ["A. 조각의 크기", "B. 조각의 모양과 구조", "C. 조각의 색상", "D. 조각의 표면 질감"],
        "answer": "B"
      }
      ,
      {
        "question": "아트 미술시장에서 '정통성'은 어떤 의미를 가지나요?",
        "options": ["A. 작품의 유명함", "B. 작가의 경력", "C. 작품의 오리지널리티", "D. 작품의 가치"],
        "answer": "C"
      }
      ,
      {
        "question": "무대 예술에서 '연기'의 핵심은 무엇인가요?",
        "options": ["A. 대사의 기억", "B. 캐릭터의 연출", "C. 감정의 전달", "D. 배경 설정"],
        "answer": "C"
      }
      ,
      {
        "question": "아시아 예술에서 '미술적 혼합'이란 무엇을 가리키나요?",
        "options": ["A. 서양 예술의 영향 받은 작품", "B. 동양 예술의 전통과 서양 예술의 현대적 접근의 결합", "C. 전통적인 예술 양식의 재현", "D. 동양 예술의 완벽한 숙련 기술"],
        "answer": "B"
      }
      ,
]
const sport = [
    
        {
          "question": "축구에서 골을 넣는 행위를 무엇이라고 합니까?",
          "options": ["A. 슈팅", "B. 패스", "C. 드리블", "D. 헤딩"],
          "answer": "A"
        },
        {
          "question": "농구에서 득점을 올릴 때 몇 점이 주로 기록됩니까?",
          "options": ["A. 1점", "B. 2점", "C. 3점", "D. 4점"],
          "answer": "B"
        },
        {
          "question": "테니스에서 경기에서 이기기 위해 필요한 승리 세트 수는 몇 개입니까?",
          "options": ["A. 1 세트", "B. 2 세트", "C. 3 세트", "D. 4 세트"],
          "answer": "C"
        },
        {
          "question": "야구에서 한 팀이 공격과 수비로 나뉘는 시간을 무엇이라고 합니까?",
          "options": ["A. 이닝", "B. 이월", "C. 이터널", "D. 이모저모"],
          "answer": "A"
        },
        {
          "question": "골프에서 가장 낮은 스코어를 가진 선수가 승리하는 형식은 무엇입니까?",
          "options": ["A. 스트로크 플레이", "B. 매치 플레이", "C. 스테이블포드", "D. 더블 볼"],
          "answer": "A"
        },
        {
          "question": "육상 경기에서 100m 달리기의 시작 라인은 무엇이라고 합니까?",
          "options": ["A. 릴레이 구역", "B. 피니쉬 라인", "C. 스타팅 블록", "D. 점프 라인"],
          "answer": "C"
        },
        {
          "question": "스노우보드에서 높은 점수를 얻기 위해 공중에서 수행되는 기술은 무엇입니까?",
          "options": ["A. 달리기", "B. 점프", "C. 골프", "D. 태권도"],
          "answer": "B"
        },
        {
          "question": "탁구에서 경기에서 먼저 서브를 치는 사람을 무엇이라고 합니까?",
          "options": ["A. 수비수", "B. 서브러", "C. 리시버", "D. 스트라이커"],
          "answer": "B"
        },
        {
          "question": "수영에서 가장 빠른 스타일은 무엇입니까?",
          "options": ["A. 자유형", "B. 점프", "C. 개구리포스키킥", "D. 철인3종"],
          "answer": "A"
        },
        {
          "question": "복싱에서 선수가 주먹을 어디에 맞추는 것이 가장 효과적입니까?",
          "options": ["A. 배", "B. 머리", "C. 허리", "D. 상체"],
          "answer": "A"
        }
    
      
]

// 서버 생성
const server = http.createServer((req, res) => {
    // HTML 내용 설정
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<!DOCTYPE html>');
    res.write('<html lang="en">');
    res.write('<head>');
    res.write('<meta charset="UTF-8">');
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    res.write('<title>QUIZ with ChatGPT</title>');
    res.write('<style>');
    res.write(`
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-size: cover;
            color: #000000; /* 텍스트 색상 변경 */
        }
        h1 {
            text-align: center;
            font-size: 55px; /* 변경된 글자 크기 */
        }
        .button {
            margin: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 16px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .checkmark {
            display: inline-block;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #eee;
        }
        .checkmark:after {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #007bff;
            display: none;
        }
        input[type="checkbox"]:checked + .checkmark:after {
            display: block;
        }
    `);
    res.write('</style>');
    res.write('</head>');
    res.write('<body>');

    // 요청된 URL에 따라 다른 내용 출력
    if (req.url === '/' || req.url === '/main') { // '/' 또는 '/main'으로 접속했을 때의 동작 설정
        // 이미지 파일 읽기
        fs.readFile('gpt_1.jpg', (err, data) => {
            if (err) {
                console.error('파일 읽기 에러:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.write('<style>');
                res.write(`
                    body {
                        background-image: url('data:image/jpeg;base64,${Buffer.from(data).toString('base64')}');
                    }
                `);
                res.write('</style>');
                res.write('<h1 style="font-size: 55px;">QUIZ with ChatGPT</h1>'); // 변경된 글자 크기
                res.write('<a href="/tab1" class="button">기본 상식</a>');
                res.write('<a href="/tab2" class="button">한국사</a>');
                res.write('<a href="/tab3" class="button">예술</a>');
                res.write('<a href="/tab4" class="button">스포츠</a>');
                res.write('<a href="/tab5" class="button">과학기술</a>');
            }
            res.write('</body>');
            res.write('</html>');
            res.end();
        });
    } else if (req.url === '/tab1') {
      // 기본 상식 퀴즈 출력
      res.write('<div style="text-align: center; padding: 30px;">'); // 컨테이너 추가 및 패딩 설정
      
      // 빈 줄 추가
      for (let i = 0; i < 50; i++) 
        res.write('<br>');
  
      res.write('<h1 style="font-size: 200%;">기본 상식 퀴즈</h1>'); // 제목 출력
      for (let i = 0; i < 2; i++) 
      res.write('<br>');

      res.write('<form action="/result" method="post">');
      basicQuiz.forEach((quiz, index) => {
          res.write(`<p>${index + 1}. ${quiz.question}</p>`); // 문제 출력
          quiz.options.forEach(option => {
              res.write(`<input type="radio" name="question${index}" value="${option.split('.')[0]}">${option}<br>`); // 선택지 출력
          });
          res.write('<br>');
      });
      res.write('<br>');
      res.write('<button type="submit" class="button">결과 확인</button>');
      res.write('</form>');
      res.write('</div>'); // 컨테이너 닫기
      res.write('</body>');
      res.write('</html>');
      res.end();
  
  
    } else if (req.url === '/tab2') {
// 기본 상식 퀴즈 출력
res.write('<div style="text-align: center; padding: 30px;">'); // 컨테이너 추가 및 패딩 설정
      
// 빈 줄 추가
for (let i = 0; i < 50; i++) 
  res.write('<br>');

res.write('<h1 style="font-size: 200%;">한국사 퀴즈</h1>'); // 제목 출력
for (let i = 0; i < 2; i++) 
res.write('<br>');

res.write('<form action="/result" method="post">');
koreahistory.forEach((quiz, index) => {
    res.write(`<p>${index + 1}. ${quiz.question}</p>`); // 문제 출력
    quiz.options.forEach(option => {
        res.write(`<input type="radio" name="question${index}" value="${option.split('.')[0]}">${option}<br>`); // 선택지 출력
    });
    res.write('<br>');
});
res.write('<br>');
res.write('<button type="submit" class="button">결과 확인</button>');
res.write('</form>');
res.write('</div>'); // 컨테이너 닫기
res.write('</body>');
res.write('</html>');
res.end();


    } else if (req.url === '/tab3') {
// 기본 상식 퀴즈 출력
res.write('<div style="text-align: center; padding: 30px;">'); // 컨테이너 추가 및 패딩 설정
      
// 빈 줄 추가
for (let i = 0; i < 50; i++) 
  res.write('<br>');

res.write('<h1 style="font-size: 200%;">예술 퀴즈</h1>'); // 제목 출력
for (let i = 0; i < 2; i++) 
res.write('<br>');

res.write('<form action="/result" method="post">');
art.forEach((quiz, index) => {
    res.write(`<p>${index + 1}. ${quiz.question}</p>`); // 문제 출력
    quiz.options.forEach(option => {
        res.write(`<input type="radio" name="question${index}" value="${option.split('.')[0]}">${option}<br>`); // 선택지 출력
    });
    res.write('<br>');
});
res.write('<br>');
res.write('<button type="submit" class="button">결과 확인</button>');
res.write('</form>');
res.write('</div>'); // 컨테이너 닫기
res.write('</body>');
res.write('</html>');
res.end();


    } else if (req.url === '/tab4') {
res.write('<div style="text-align: center; padding: 30px;">'); // 컨테이너 추가 및 패딩 설정
      
// 빈 줄 추가
for (let i = 0; i < 50; i++) 
  res.write('<br>');

res.write('<h1 style="font-size: 200%;">스포츠 퀴즈</h1>'); // 제목 출력
for (let i = 0; i < 2; i++) 
res.write('<br>');

res.write('<form action="/result" method="post">');
sport.forEach((quiz, index) => {
    res.write(`<p>${index + 1}. ${quiz.question}</p>`); // 문제 출력
    quiz.options.forEach(option => {
        res.write(`<input type="radio" name="question${index}" value="${option.split('.')[0]}">${option}<br>`); // 선택지 출력
    });
    res.write('<br>');
});
res.write('<br>');
res.write('<button type="submit" class="button">결과 확인</button>');
res.write('</form>');
res.write('</div>'); // 컨테이너 닫기
res.write('</body>');
res.write('</html>');
res.end();


    } else if (req.url === '/tab5') {

res.write('<div style="text-align: center; padding: 30px;">'); // 컨테이너 추가 및 패딩 설정
for (let i = 0; i < 50; i++) 
  res.write('<br>');
res.write('<h1 style="font-size: 200%;">과학 퀴즈</h1>'); // 제목 출력
for (let i = 0; i < 2; i++) 
res.write('<br>');
res.write('<form action="/result" method="post">');
science.forEach((quiz, index) => {
    res.write(`<p>${index + 1}. ${quiz.question}</p>`); // 문제 출력
    quiz.options.forEach(option => {
        res.write(`<input type="radio" name="question${index}" value="${option.split('.')[0]}">${option}<br>`); // 선택지 출력
    });
    res.write('<br>');
});
res.write('<br>');
res.write('<button type="submit" class="button">결과 확인</button>');
res.write('</form>');
res.write('</div>'); // 컨테이너 닫기
res.write('</body>');
res.write('</html>');
res.end();

    } else if (req.url === '/result' && req.method === 'POST') { // 결과 확인 페이지
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const userAnswers = body.split('&'); // 사용자가 선택한 답안
            let correctAnswers = 0; // 정답 수 초기화
            let quizSet = null;
            if (req.headers.referer) {
              const referringUrl = req.headers.referer;
              if (referringUrl.includes('/tab1')) quizSet = basicQuiz;
              else if (referringUrl.includes('/tab2')) quizSet = koreahistory;
              else if (referringUrl.includes('/tab3')) quizSet = art;
              else if (referringUrl.includes('/tab4')) quizSet = sport;
              else if (referringUrl.includes('/tab5')) quizSet = science;
          }
            for (let i = 0; i < quizSet.length; i++) {
                const userAnswer = decodeURIComponent(userAnswers[i].split('=')[1]);
                if (userAnswer === quizSet[i].answer) { // 정답과 비교
                    correctAnswers++;
                }
            }
            const score = correctAnswers * 10;
            // 결과 출력
            res.write(`<h1>결과 : ${score}점</h1>`);
            res.write(`<p>총 ${quizSet.length}문제 중 ${correctAnswers}문제를 맞추셨습니다.</p>`);
            res.write(`<a href="/" class="button">처음으로 돌아가기</a>`);
            res.write('</div>')
            res.write('</body>');
            res.write('</html>');
            res.end();
        });
        
    } else {
        res.write('<h1>Page Not Found</h1>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
