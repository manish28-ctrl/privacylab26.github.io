
document.addEventListener("DOMContentLoaded", function () {

  const privacyLink = document.getElementById("privacy-notice-link");

  if (!privacyLink) {
    console.error("Privacy Notice link not found.");
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
  // 1. COUNTRY CONFIGURATION
  // ==========================================

  // TEMPORARY TESTING
  // Change IN to AE, QA, VN, MY or US.

  const countryCode = "QA";

  const COUNTRY_LANGUAGES = {

    AE: [
      "en-us",
      "ar-ae"
    ],

    QA: [
      "en-us",
      "ar-qa"
    ],

    IN: [
      "en-us",
      "gu",
      "mr",
      "te",
      "ta",
      "bn",
      "kn",
      "ml",
      "in-as",
      "pa",
      "in-or",
      "hi"
    ],

    VN: [
      "en-us",
      "vi"
    ],

    MY: [
      "en-us",
      "ms-my"
    ],

    US: [
      "en-us"
    ]

  };


  // ==========================================
  // 2. ONETRUST NOTICE DETAILS
  // ==========================================

  const noticeURL =
    "https://privacyportal-in-cdn.onetrust.com/storage-container/53ec83ca-0693-46f3-a55b-110c3f8f5a64/privacy-notices/bd09463e-b148-44d4-91e5-3ee9328b729a/draft/privacynotice.json";

  const allowedLanguages =
    COUNTRY_LANGUAGES[countryCode] ||
    COUNTRY_LANGUAGES.US;


  // ==========================================
  // 3. CREATE POPUP
  // ==========================================

  const popupHTML = `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>Privacy Notice</title>

  <style>

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 25px;
      background: #ffffff;
      color: #222222;
    }

    h2 {
      margin-top: 0;
    }

    /* Keep the native OneTrust dropdown */

    .ot-privacy-notice-language-dropdown-container {
      display: block !important;
      visibility: visible !important;
    }

    .otnotice {
      margin-top: 20px;
    }

  </style>

</head>

<body>

  <h2>Privacy Notice</h2>

  <!-- NATIVE ONETRUST LANGUAGE DROPDOWN -->

  <div class="ot-privacy-notice-language-dropdown-container"></div>

  <!-- ONETRUST NOTICE -->

  <div
    id="otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
    class="otnotice">
  </div>

  <!-- ONETRUST SDK -->

  <script
    src="https://privacyportal-in-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js"
    type="text/javascript"
    charset="UTF-8"
    id="otprivacy-notice-script">

    settings="eyJjb250ZW50QXBpVXJsIjoiaHR0cHM6Ly9wcml2YWN5cG9ydGFsLWluLm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL2VudGVycHJpc2Vwb2xpY3kvZGlnaXRhbHBvbGljeS9jb250ZW50IiwibWV0YWRhdGFBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtaW4ub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9"

  </script>

  <script>

  (function () {

    // ==========================================
    // 4. LANGUAGE FILTER CONFIGURATION
    // ==========================================

    const allowed = new Set(
      ${JSON.stringify(allowedLanguages)}
    );

    const container = document.querySelector(
      ".ot-privacy-notice-language-dropdown-container"
    );

    // English is selected only once during initialization.
    let defaultLanguageSet = false;

    let languageObserver = null;


    // ==========================================
    // 5. FILTER NATIVE ONETRUST DROPDOWN
    // ==========================================

    function filterOneTrustDropdown() {

      if (!container) return;

      const languageOptions = container.querySelectorAll(
        ".ot-digital-policy-language-option"
      );

      if (!languageOptions.length) return;


      // Show only the languages allowed for this country.

      languageOptions.forEach(function (option) {

        const languageCode = (
          option.getAttribute("data-option-value") || ""
        ).trim().toLowerCase();

        const isAllowed = allowed.has(languageCode);

        option.style.display = isAllowed ? "" : "none";

        option.setAttribute(
          "aria-hidden",
          String(!isAllowed)
        );

        option.tabIndex = isAllowed ? 0 : -1;

      });


      // ==========================================
      // 6. ENGLISH DEFAULT - ONLY ONCE
      // ==========================================

      if (!defaultLanguageSet) {

        const englishOption = Array.from(languageOptions).find(
          function (option) {

            return (
              option.getAttribute("data-option-value") === "en-us"
            );

          }
        );

        if (englishOption && allowed.has("en-us")) {

          const selectedLanguage = container.querySelector(
            ".ot-digital-policy-language-selected"
          );

          // Mark the default as handled before clicking.
          defaultLanguageSet = true;

          if (
            selectedLanguage &&
            !selectedLanguage.textContent.toLowerCase().includes("english")
          ) {

            englishOption.click();

            console.log(
              "English selected as default for:",
              countryCode
            );

          }

        }

      }


      // Diagnostic output

      console.log(
        "OneTrust languages filtered for:",
        countryCode,
        Array.from(languageOptions)
          .filter(function (option) {
            return allowed.has(
              option.getAttribute("data-option-value")
            );
          })
          .map(function (option) {
            return option.getAttribute("aria-label");
          })
      );

    }


    // ==========================================
    // 7. OBSERVE ONETRUST DYNAMIC RENDERING
    // ==========================================

    if (container) {

      languageObserver = new MutationObserver(function () {

        filterOneTrustDropdown();

      });

      languageObserver.observe(container, {
        childList: true,
        subtree: true
      });

    }


    // ==========================================
    // 8. LOAD ONETRUST PRIVACY NOTICE
    // ==========================================

    if (
      typeof OneTrust !== "undefined" &&
      OneTrust.NoticeApi
    ) {

      OneTrust.NoticeApi.Initialized.then(function () {

        OneTrust.NoticeApi.LoadNotices(
          [${JSON.stringify(noticeURL)}],
          true,
          "en-us"
        );

        // Apply filtering after OneTrust starts loading.
        filterOneTrustDropdown();

      }).catch(function (error) {

        console.error(
          "OneTrust initialization error:",
          error
        );

      });

    } else {

      console.error("OneTrust SDK is not available.");

    }

  })();

  </script>

</body>
</html>`;


  // ==========================================
  // 9. WRITE POPUP CONTENT
  // ==========================================

  privacyWindow.document.open();
  privacyWindow.document.write(popupHTML);
  privacyWindow.document.close();

}
