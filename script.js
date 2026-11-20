
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

  // TESTING ONLY:
  // Change IN to AE, QA, VN, MY or US to test.
  // Replace this with your backend-provided country
  // code when implementing automatic GeoIP detection.

  const countryCode = "IN";

  const COUNTRY_LANGUAGES = {

    AE: [
      "UAE Arabic",
      "Arabic (United Arab Emirates)",
      "English",
      "en",
      "ar-ae"
    ],

    QA: [
      "Qatar Arabic",
      "Arabic (Qatar)",
      "English",
      "en",
      "ar-qa"
    ],

    IN: [
      "Gujarati", "gu",
      "Marathi", "mr",
      "Telugu", "te",
      "Tamil", "ta",
      "Bengali", "bn",
      "Kannada", "kn",
      "Malayalam", "ml",
      "Assamese", "as",
      "Punjabi", "pa",
      "Oriya", "Odia", "or", "od",
      "Hindi", "hi",
      "English", "en"
    ],

    VN: [
      "Vietnamese",
      "vi",
      "English",
      "en"
    ],

    MY: [
      "Malay",
      "ms",
      "English",
      "en"
    ],

    US: [
      "English",
      "en"
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

    /* Keep the native OneTrust dropdown.
       Do not create another custom selector. */

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

    const allowed = ${JSON.stringify(allowedLanguages)}.map(
      value => String(value).trim().toLowerCase()
    );

    const container = document.querySelector(
      ".ot-privacy-notice-language-dropdown-container"
    );

    let filtering = false;

    function normalize(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\\s+/g, " ");
    }

    function filterOneTrustDropdown() {

      if (filtering) return;

      const dropdowns = container.querySelectorAll("select");

      if (!dropdowns.length) return;

      filtering = true;

      dropdowns.forEach(function (dropdown) {

        const options = Array.from(dropdown.options);

        const matchedOptions = options.filter(function (option) {

          const value = normalize(option.value);
          const label = normalize(option.textContent);

          return allowed.includes(value) ||
                 allowed.includes(label);

        });

        // Never empty the native dropdown if the
        // actual OneTrust option identifiers differ.
        if (matchedOptions.length === 0) {

          console.warn(
            "No matching OneTrust languages found.",
            options.map(option => ({
              text: option.textContent,
              value: option.value
            }))
          );

          return;

        }

        options.forEach(function (option) {

          const value = normalize(option.value);
          const label = normalize(option.textContent);

          const isAllowed =
            allowed.includes(value) ||
            allowed.includes(label);

          option.hidden = !isAllowed;
          option.disabled = !isAllowed;

        });

        // If the currently selected option is not allowed,
        // select the first available allowed language.
        const currentValue = normalize(dropdown.value);

        const currentAllowed = matchedOptions.some(function (option) {
          return normalize(option.value) === currentValue;
        });

        if (!currentAllowed) {

          dropdown.value = matchedOptions[0].value;

          dropdown.dispatchEvent(
            new Event("change", { bubbles: true })
          );

        }

        console.log(
          "OneTrust language options filtered for:",
          countryCode,
          matchedOptions.map(option => option.textContent)
        );

      });

      filtering = false;

    }


    // Watch OneTrust's native dropdown container.
    // OneTrust may render its dropdown asynchronously.

    const observer = new MutationObserver(function () {

      filtering = false;
      filterOneTrustDropdown();

    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });


    // Initial attempt after OneTrust initialization.

    if (
      typeof OneTrust !== "undefined" &&
      OneTrust.NoticeApi
    ) {

      OneTrust.NoticeApi.Initialized.then(function () {

        OneTrust.NoticeApi.LoadNotices([${JSON.stringify(noticeURL)}]);

        filterOneTrustDropdown();

      }).catch(function (error) {

        console.error("OneTrust initialization error:", error);

      });

    } else {

      console.error("OneTrust SDK is not available.");

    }

  })();

  </script>

</body>
</html>`;

  privacyWindow.document.open();
  privacyWindow.document.write(popupHTML);
  privacyWindow.document.close();

}
