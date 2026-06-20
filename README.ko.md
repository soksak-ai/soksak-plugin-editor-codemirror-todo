# soksak-plugin-editor-codemirror-todo

soksak CodeMirror 확장: `TODO` / `FIXME` / `XXX` 토큰 강조 + 일부 확장자 문법 매핑.
`soksak-plugin-editor-codemirror`의 확장이며 단독 플러그인이 아닙니다.

## 무엇

- 열린 모든 파일에서 `TODO` / `FIXME` / `XXX` 토큰 강조(accent 색 반투명 배경 + 외곽선 —
  현재 테마 추종).
- 확장자 문법 매핑: `.mjs`, `.cjs` → `js`, `.svelte` → `html`.

엔진은 `soksak-plugin-editor-codemirror`가 소유합니다(엔진 중립, 계약 A13). 이 플러그인은
에디터의 확장 프로토콜(`app.bus`의 `editor.ext.register`)로 등록합니다 — `editor.ext.ready`
페이로드로 넘어온 모듈로 CodeMirror 확장을 만들고, `hello`→`ready` 핸드셰이크로 활성화 순서를 처리.

## 의존성

`soksak-plugin-editor-codemirror` — CodeMirror 엔진·모듈·확장 프로토콜 제공. 이 플러그인을 켜면
스켈레톤이 의존성을 해소합니다.

## 권한

없음. 확장 프로토콜은 `app.bus`(플러그인 간 pub/sub)를 타며 권한이 필요 없습니다.

## 사용법

1. `soksak-plugin-editor-codemirror`(의존성 자동 해소)와 이 플러그인을 활성화합니다.
2. 아무 파일이나 열면 `TODO`/`FIXME`/`XXX`가 강조되고 `.mjs`/`.cjs`는 JavaScript, `.svelte`는
   HTML로 처리됩니다. 단어 경계만 매치(`TODOLIST`는 미강조).
3. 비활성화하면 강조·매핑이 즉시 제거됩니다.
