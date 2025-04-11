# 유전자's 가계부
![image](https://github.com/user-attachments/assets/423d5bb3-91d9-4d8a-a28d-25cfccebd141)

### 1. 프로젝트 소개
```
Vue 3, Pinia 를 활용해 만든 가계부 웹 애플리케이션입니다.
수입/지출 등록, 월별 요약, 시각화 그래프, 캘린더를 통해
사용자가 자신의 재정 상태를 쉽게 파악할 수 있도록 설계하였습니다.
```

>개발 기간: 2025.04.07. ~ 2025.04.11.


### 2. 주요 기능
- 수입/지출 기록 : 날짜, 금액, 카테고리, 메도 등의 세부 정보 입력하여 기록
- 거래 내역 조회 : 필터 기능을 통해 특정 조건에 맞는 거래 내역 조회
- 월별 재정 요약 : 각 월의 수입, 지출, 순이익을 시각화하여 요약 표시 (차트, 캘린더)

### 3. 사용 기술
- Frontend : Vue 3, Composition API, vue-router, axios, components, pinia
- Backend : json server (db)
- 상태 관리 : Pinia
- 스타일 : CSS
- 기획 : google sheets, figma
- 협업 : discord, google, zep


### 4. 실행 방법
```
npm i
npx json-server db.json
npm run dev
```

### 5. 화면
- 로그인
![image](https://github.com/user-attachments/assets/e440d64a-a8d6-4321-ae4a-697fc5735ebf)

- 홈 화면
![image](https://github.com/user-attachments/assets/7757d71d-3d35-4e0e-8003-717f487579b3)

- 거래 상세 내역
![image](https://github.com/user-attachments/assets/7a4ea877-681e-449c-8193-116d69dcca38)

- 수입/지출 분석 차트
![image](https://github.com/user-attachments/assets/0367e3ed-392c-4497-a51b-dc13d88441c6)


- 재정 요약 캘린더
![image](https://github.com/user-attachments/assets/dab3bcd5-83d3-40f5-a767-3f2cd161c4d2)


### 6. 팀 소개
  #### 팀명: 유전자

  |팀원이름|구현기능|역할|깃허브ID|
  |----|-----|-----|-----|
  |나동건| 수입/지출 분석 차트  |팀장| [@doongeon](https://github.com/doongeon) |
  |김은민| 거래 내역 CRUD |팀원| [@07-augst](https://github.com/07-augst) |
  |박세연| 홈화면(요약카드) |팀원| [@se-3-yeon](https://github.com/se-3-yeon) |
  |정혜인| 월별 재정 요약 캘린더, 로그인 |팀원| [@Ahranah](https://github.com/Ahranah) |
  |하수연| 상단바, 사이드바  |팀원| [@suyeon-0203](https://github.com/suyeon-0203) |
  |한충훈| 프로필 화면, 빠른추가 버튼|팀원| [@Euangeliov](https://github.com/Euangeliov) |
  
---
## 💻 코드 작성 규칙 

1. 파일 이름

PascalCase로 작성 합니다.

```
Header.vue
TodoList.vue
```

1. **.vue** 파일 작성시

```
<script setup>
// import 작성

// ref, reactive, inject, pinia, props ... 변수

// 함수
</script>

<template>
  <div></div>
</template>

<style></style>
```

2. **composition API**를 사용합니다.

```
<script setup>

</script>
```

## git 규칙

### 브랜치

- main: 서비스
- release: main에 올리기전 테스트용
- develop: 개발 브랜치
- feature/[개발기능]: 개인 작업 브랜치

### 사용

브랜치 생성할떄

```
git chekout develop
git checkout -b feature/[개발기능]
```

푸쉬할때

```
git push origin feature/[개발기능]
```

github 사이트에서 develop 브랜치로 PR을 보냅니다.

### 커밋 컨밴션

내용은 한글로 작성합니다.

- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등)
- design: 사용자 UI 디자인 변경 (CSS 등)
- refactor: 리팩토링
- rename: 파일 혹은 폴더명을 수정만 한 경우
- remove: 파일을 삭제만 한 경우

**예시**
feat: 가계부기능 추가
fix: 거래
