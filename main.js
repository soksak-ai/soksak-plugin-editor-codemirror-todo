// 코드 하이라이트+ — TODO/FIXME/XXX 토큰을 모든 파일에서 강조하는 전역 CM6 확장 + 확장자 문법 매핑.
// 에디터 엔진은 코어가 아니라 soksak-plugin-editor 가 소유한다(엔진 중립 A13). 이 플러그인은 manifest
// dependencies 로 에디터를 보장받고, 에디터 확장 프로토콜(app.bus)로 등록한다:
//   - language: mjs/cjs→js, svelte→html (직렬화 가능 — 즉시 등록)
//   - cmext: TODO 강조 확장 — 호스트 CM 모듈이 필요하므로 "editor.ext.ready" 의 modules 로 만든다.
// CM 모듈을 자체 번들하지 않는다(§0-7) — 에디터가 ready 페이로드로 넘겨준 modules 만 쓴다.

const CMEXT_ID = "soksak-plugin-code-highlight.todo";

function buildTodoExtension(modules) {
  const { MatchDecorator, Decoration, ViewPlugin, EditorView } = modules.view;

  const matcher = new MatchDecorator({
    regexp: /\b(?:TODO|FIXME|XXX)\b/g,
    decoration: Decoration.mark({ class: "cm-soksak-todo" }),
  });

  const todoHighlighter = ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = matcher.createDeco(view);
      }
      update(update) {
        this.decorations = matcher.updateDeco(update, this.decorations);
      }
    },
    { decorations: (v) => v.decorations },
  );

  const theme = EditorView.baseTheme({
    ".cm-soksak-todo": {
      backgroundColor: "color-mix(in srgb, var(--acc) 16%, transparent)",
      outline: "1px solid color-mix(in srgb, var(--acc) 45%, transparent)",
      borderRadius: "2px",
    },
  });

  return [todoHighlighter, theme];
}

export default {
  activate(ctx) {
    const app = ctx.app;

    // 언어 매핑(직렬화 가능) — 에디터가 이미 떴든 아니든 즉시 등록 + ready 에 재등록.
    const LANGS = [
      { ext: "mjs", lang: "js" },
      { ext: "cjs", lang: "js" },
      { ext: "svelte", lang: "html" },
    ];
    const registerLangs = () => {
      for (const l of LANGS) {
        app.bus.emit("editor.ext.register", { kind: "language", ext: l.ext, lang: l.lang });
      }
    };

    // CM 확장 — 호스트 모듈이 필요하므로 ready 페이로드의 modules 로 만든다.
    const registerCmext = (modules) => {
      if (!modules) return;
      app.bus.emit("editor.ext.register", {
        kind: "cmext",
        id: CMEXT_ID,
        extension: buildTodoExtension(modules),
      });
    };

    // ready 에 (재)등록 + hello 핸드셰이크(에디터가 먼저 떴으면 ready 를 못 받으므로 hello→ready 유도).
    ctx.subscriptions.push(
      app.bus.on("editor.ext.ready", (payload) => {
        registerLangs();
        registerCmext(payload && payload.modules);
      }),
    );
    app.bus.emit("editor.ext.hello", {});

    // 비활성 시 해제.
    ctx.subscriptions.push({
      dispose: () => {
        for (const l of LANGS) {
          app.bus.emit("editor.ext.unregister", { kind: "language", ext: l.ext });
        }
        app.bus.emit("editor.ext.unregister", { kind: "cmext", id: CMEXT_ID });
      },
    });
  },

  deactivate() {
    // 해제는 ctx.subscriptions 가 수행.
  },
};
