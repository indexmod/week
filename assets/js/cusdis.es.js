window.CUSDIS = {};
const makeIframeContent = (target) => {
  const host = target.dataset.host || "https://cusdis.com";
  const iframeJsPath = target.dataset.iframe || `${host}/js/iframe.umd.js`;
  const cssPath = `${host}/js/style.css`;

  // Обновленный HTML с кастомными стилями
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="${cssPath}">
    <base target="_parent" />
    <script>
      window.CUSDIS_LOCALE = ${JSON.stringify(window.CUSDIS_LOCALE)};
      window.__DATA__ = ${JSON.stringify(target.dataset)};
    <\/script>
    <style>
      :root {
        color-scheme: light;
      }
      /* Кастомные стили для виджета */
      body {
        font-family: "Courier New", Courier, monospace;
        background-color: transparent;
        color: #ffffff;
        overflow: hidden; /* Запрет скролла */
      }
      .cusdis-thread {
        padding: 20px;
      }
      .cusdis-btn {
        font-family: "Courier New", Courier, monospace;
        background-color: #4CAF50;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
      }
      .cusdis-input {
        font-family: "Courier New", Courier, monospace;
        background-color: #333;
        color: #fff;
        border: 1px solid #4CAF50;
        border-radius: 5px;
        padding: 5px;
      }
      .cusdis-input::placeholder {
        color: #aaa;
      }
      .cusdis-comment {
        font-family: "Courier New", Courier, monospace;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.5); /* Прозрачный фон */
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${iframeJsPath}" type="module"><\/script>
  </body>
</html>`;
};

let singleTonIframe;

function createIframe(target) {
  if (!singleTonIframe) {
    singleTonIframe = document.createElement("iframe");
    listenEvent(singleTonIframe, target);
  }
  singleTonIframe.srcdoc = makeIframeContent(target);

  // Устанавливаем фиксированные размеры и запрет скролла
  singleTonIframe.style.width = "600px";
  singleTonIframe.style.height = "400px";
  singleTonIframe.style.border = "0";
  singleTonIframe.style.overflow = "hidden";
  singleTonIframe.style.backgroundColor = "transparent"; // Прозрачный фон для iframe

  return singleTonIframe;
}

function postMessage(event, data) {
  if (singleTonIframe) {
    singleTonIframe.contentWindow.postMessage(
      JSON.stringify({
        from: "cusdis",
        event,
        data,
      })
    );
  }
}

function listenEvent(iframe, target) {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const onMessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from === "cusdis") {
        switch (msg.event) {
          case "onload":
            if (target.dataset.theme === "auto") {
              postMessage("setTheme", darkModeQuery.matches ? "dark" : "light");
            }
            break;
          case "resize":
            iframe.style.height = msg.data + "px";
            break;
        }
      }
    } catch (e2) {}
  };

  window.addEventListener("message", onMessage);

  function onChangeColorScheme(e) {
    const isDarkMode = e.matches;
    if (target.dataset.theme === "auto") {
      postMessage("setTheme", isDarkMode ? "dark" : "light");
    }
  }

  darkModeQuery.addEventListener("change", onChangeColorScheme);

  return () => {
    darkModeQuery.removeEventListener("change", onChangeColorScheme);
    window.removeEventListener("message", onMessage);
  };
}

function render(target) {
  if (target) {
    target.innerHTML = "";
    const iframe = createIframe(target);
    target.appendChild(iframe);
  }
}

window.renderCusdis = render;
window.CUSDIS.renderTo = render;
window.CUSDIS.setTheme = function (theme) {
  postMessage("setTheme", theme);
};

function initial() {
  let target;
  if (window.cusdisElementId) {
    target = document.querySelector(`#${window.cusdisElementId}`);
  } else if (document.querySelector("#cusdis_thread")) {
    target = document.querySelector("#cusdis_thread");
  } else if (document.querySelector("#cusdis")) {
    console.warn("id `cusdis` is deprecated. Please use `cusdis_thread` instead");
    target = document.querySelector("#cusdis");
  }
  if (window.CUSDIS_PREVENT_INITIAL_RENDER === true) return;
  if (target) {
    render(target);
  }
}

window.CUSDIS.initial = initial;
initial();
