
document.addEventListener("DOMContentLoaded", function () {

  const privacyLink = document.getElementById("privacy-notice-link");

  if (!privacyLink) {
    console.error("Privacy Notice footer link not found.");
    return;
  }

  privacyLink.addEventListener("click", function (event) {
    event.preventDefault();
    openPrivacyNotice();
  });

});


function openPrivacyNotice() {

  const privacyWindow = window.open(
    "",
    "PrivacyNotice",
    "width=1000,height=750,resizable=yes,scrollbars=yes"
  );

  if (!privacyWindow) {
    alert("Please allow popups for this website.");
    return;
  }

  // ==========================================
  // COUNTRY CONFIGURATION
  // ==========================================

  // TESTING ONLY: Change this to AE, QA, VN, MY or US
  // to test the corresponding language dropdown.
  const countryCode = "IN";

  const COUNTRY_LANGUAGES = {

    AE: [
      { code: "ar-ae", label: "UAE Arabic" },
      { code: "en", label: "English" }
    ],

    QA: [
      { code: "ar-qa", label: "Qatar Arabic" },
      { code: "en", label: "English" }
    ],

    IN: [
      { code: "gu", label: "Gujarati" },
      { code: "mr", label: "Marathi" },
      { code: "te", label: "Telugu" },
      { code: "ta", label: "Tamil" },
      { code: "bn", label: "Bengali" },
      { code: "kn", label: "Kannada" },
      { code: "ml", label: "Malayalam" },
      { code: "as", label: "Assamese" },
      { code: "pa", label: "Punjabi" },
      { code: "or", label: "Oriya" },
      { code: "hi", label: "Hindi" },
      { code: "en", label: "English" }
    ],

    VN: [
      { code: "vi", label: "Vietnamese" },
      { code: "en", label: "English" }
    ],

    MY: [
      { code: "ms", label: "Malay" },
      { code: "en", label: "English" }
    ],

    US: [
      { code: "en", label: "English" }
    ]

  };

  const languages =
    COUNTRY_LANGUAGES[countryCode] ||
    [{ code: "en", label: "English" }];

  // ==========================================
  // ONETRUST NOTICE URL
  // ==========================================

  const noticeURL =
    "https://privacyportal-in-cdn.onetrust.com/storage-container/53ec83ca-0693-46f3-a55b-110c3f8f5a64/privacy-notices/bd09463e-b148-44d4-91e5-3ee9328b729a/draft/privacynotice.json";

  // ==========================================
  // CREATE POPUP HTML
  // ==========================================

  const optionsHTML = languages.map(function (language) {
    return `<option value="${language.code}">${language.label}</option>`;
  }).join("");

  const popupHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Privacy Notice</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 25px;
      background: #ffffff;
      color: #222222;
    }

    .privacy-language-selector {
      margin-bottom: 25px;
    }

    .privacy-language-selector label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #country-language-selector {
      width: 260px;
      max-width: 100%;
      padding: 11px;
      border: 1px solid #999999;
      border-radius: 4px;
      background: #ffffff;
      font-size: 14px;
    }

    .otnotice {
      margin-top: 20px;
    }

    #notice-error {
      color: #b00020;
      margin-top: 15px;
    }
  </style>

</head>

<body>

  <h2>Privacy Notice</h2>

  <div class="privacy-language-selector">

    <label for="country-language-selector">
      Select Language:
    </label>

    <select id="country-language-selector">
      ${optionsHTML}
    </select>

  </div>

  <div
    id="otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
    class="otnotice">
  </div>

  <p id="notice-error"></p>

  <script
    src="https://privacyportal-in-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js"
    type="text/javascript"
    charset="UTF-8"
    id="otprivacy-notice-script">

    settings="eyJjb250ZW50QXBpVXJsIjoiaHR0cHM6Ly9wcml2YWN5cG9ydGFsLWluLm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL2VudGVycHJpc2Vwb2xpY3kvZGlnaXRhbHBvbGljeS9jb250ZW50IiwibWV0YWRhdGFBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtaW4ub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9"

  </script>

  <script>

    (function () {

      const selector = document.getElementById(
        "country-language-selector"
      );

      const noticeContainer = document.getElementById(
        "otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
      );

      const errorElement = document.getElementById("notice-error");

      function loadNotice(languageCode) {

        noticeContainer.setAttribute(
          "dir",
          languageCode.startsWith("ar") ? "rtl" : "ltr"
        );

        errorElement.textContent = "";

        try {

          OneTrust.NoticeApi.LoadNotices(
            [${JSON.stringify(noticeURL)}],
            true,
            languageCode
          );

        } catch (error) {

          console.error("OneTrust notice loading error:", error);

          errorElement.textContent =
            "Unable to load the Privacy Notice. Check the browser console.";

        }

      }

      if (
        typeof OneTrust === "undefined" ||
        !OneTrust.NoticeApi
      ) {

        errorElement.textContent =
          "OneTrust SDK failed to load. Check the browser console.";

        return;

      }

      OneTrust.NoticeApi.Initialized.then(function () {

        loadNotice(selector.value);

      }).catch(function (error) {

        console.error("OneTrust initialization failed:", error);

        errorElement.textContent =
          "OneTrust initialization failed.";

      });

      selector.addEventListener("change", function () {

        loadNotice(this.value);

      });

    })();

  </script>

</body>
</html>`;

  privacyWindow.document.open();
  privacyWindow.document.write(popupHTML);
  privacyWindow.document.close();

}
