
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


// ==========================================
// 1. AUTOMATIC IP COUNTRY DETECTION
// ==========================================

async function getVisitorCountry() {

  const controller = new AbortController();

  const timeout = setTimeout(function () {
    controller.abort();
  }, 8000);

  try {

    const response = await fetch("https://ipwho.is/", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("IP lookup HTTP error: " + response.status);
    }

    const data = await response.json();

    console.log("IP API RESPONSE:", data);
    console.log("DETECTED IP:", data.ip);
    console.log("DETECTED COUNTRY:", data.country);
    console.log("DETECTED COUNTRY CODE:", data.country_code);

    if (data.success && data.country_code) {

      const detectedCountry = data.country_code.toUpperCase();

      console.log("Visitor country detected:", detectedCountry);

      return detectedCountry;

    }

    throw new Error("Country code unavailable from IP API");

  } catch (error) {

    console.error("Country detection failed:", error);

    // English-only fallback if IP detection fails
    return "US";

  } finally {

    clearTimeout(timeout);

  }

}


// ==========================================
// 2. OPEN PRIVACY NOTICE POPUP
// ==========================================

async function openPrivacyNotice() {

  // Open synchronously to avoid popup blockers
  const privacyWindow = window.open(
    "",
    "PrivacyNotice",
    "width=1000,height=750,resizable=yes,scrollbars=yes"
  );

  if (!privacyWindow) {
    alert("Please allow popups for this website.");
    return;
  }

  // Display loading message while detecting country
  privacyWindow.document.open();
  privacyWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Privacy Notice</title>
      </head>
      <body style="font-family:Arial;padding:30px;">
        <h2>Loading Privacy Notice...</h2>
        <p>Detecting your location and available languages.</p>
      </body>
    </html>
  `);
  privacyWindow.document.close();


  // ==========================================
  // 3. COUNTRY CONFIGURATION
  // ==========================================

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


  // Detect visitor country
  const countryCode = await getVisitorCountry();

  console.log("FINAL COUNTRY CODE:", countryCode);


  // Select languages for detected country
  const allowedLanguages =
    COUNTRY_LANGUAGES[countryCode] ||
    COUNTRY_LANGUAGES.US;

  console.log("ALLOWED LANGUAGES:", allowedLanguages);


  // ==========================================
  // 4. ONETRUST NOTICE DETAILS
  // ==========================================

  const noticeURL =
    "https://privacyportal-in-cdn.onetrust.com/storage-container/53ec83ca-0693-46f3-a55b-110c3f8f5a64/privacy-notices/bd09463e-b148-44d4-91e5-3ee9328b729a/draft/privacynotice.json";

  const settingsValue =
    "eyJjb250ZW50QXBpVXJsIjoiaHR0cHM6Ly9wcml2YWN5cG9ydGFsLWluLm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL2VudGVycHJpc2Vwb2xpY3kvZGlnaXRhbHBvbGljeS9jb250ZW50IiwibWV0YWRhdGFBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtaW4ub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9";


  // ==========================================
  // 5. CREATE PRIVACY NOTICE POPUP HTML
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
    id="otprivacy-notice-script"
    settings="${settingsValue}">
  <\/script>

  <script>

  (function () {

    // ==========================================
    // 6. COUNTRY AND LANGUAGE CONFIGURATION
    // ==========================================

    // Pass detected country into the popup window
    const visitorCountry = ${JSON.stringify(countryCode)};

    const allowed = new Set(
      ${JSON.stringify(allowedLanguages)}
    );

    const noticeURL = ${JSON.stringify(noticeURL)};

    console.log("Popup country:", visitorCountry);
    console.log("Popup allowed languages:", Array.from(allowed));


    const container = document.querySelector(
      ".ot-privacy-notice-language-dropdown-container"
    );

    let defaultLanguageSet = false;


    // ==========================================
    // 7. FILTER NATIVE ONETRUST DROPDOWN
    // ==========================================

    function filterOneTrustDropdown() {

      if (!container) return;

      const languageOptions = container.querySelectorAll(
        ".ot-digital-policy-language-option"
      );

      if (!languageOptions.length) return;


      // Show only languages permitted for this country

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
      // 8. ENGLISH DEFAULT - ONLY ONCE
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

          if (selectedLanguage) {

            defaultLanguageSet = true;

            if (
              !selectedLanguage.textContent
                .toLowerCase()
                .includes("english")
            ) {

              englishOption.click();

              console.log(
                "English selected as default for:",
                visitorCountry
              );

            }

          }

        }

      }


      // ==========================================
      // 9. DIAGNOSTIC OUTPUT
      // ==========================================

      console.log(
        "OneTrust languages filtered for:",
        visitorCountry,
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
    // 10. OBSERVE ONETRUST DYNAMIC RENDERING
    // ==========================================

    if (container) {

      const languageObserver = new MutationObserver(function () {

        filterOneTrustDropdown();

      });

      languageObserver.observe(container, {
        childList: true,
        subtree: true
      });

    }


    // ==========================================
    // 11. LOAD ONETRUST PRIVACY NOTICE
    // ==========================================

    if (
      typeof OneTrust !== "undefined" &&
      OneTrust.NoticeApi
    ) {

      OneTrust.NoticeApi.Initialized.then(function () {

        OneTrust.NoticeApi.LoadNotices(
          [noticeURL],
          true,
          "en-us"
        );

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

  <\/script>

</body>
</html>`;


  // ==========================================
  // 12. WRITE POPUP CONTENT
  // ==========================================

  if (privacyWindow.closed) {
    return;
  }

  privacyWindow.document.open();
  privacyWindow.document.write(popupHTML);
  privacyWindow.document.close();

}
