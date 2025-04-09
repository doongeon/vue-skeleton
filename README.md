# 가계부

## 코드 작성 규칙

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
