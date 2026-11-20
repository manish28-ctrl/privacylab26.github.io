document.getElementById('privacy-notice-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    openPrivacyNotice();
});

function openPrivacyNotice() {
    // Open a new window
    const privacyWindow = window.open("", "Privacy Notice", "width=800,height=600");

    if (!privacyWindow) {
        alert("Failed to open new window. Please check your popup blocker settings.");
        return;
    }

    // Write the necessary HTML to the new window
    privacyWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Privacy Notice</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .otnotice { margin-top: 20px; }
            </style>
        </head>
        <body>
          

<!-- OneTrust Privacy Notice start -->

<!-- Custom country-specific language selector -->
<div class="privacy-language-selector">
  <label for="country-language-selector">
    Select Language:
  </label>

  <select id="country-language-selector"></select>
</div>

<!-- OneTrust Privacy Notice container -->
<div
  id="otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
  class="otnotice">
</div>

<!-- Country code injected by Node.js backend -->
<script>
  window.NOTICE_COUNTRY_CODE = "__COUNTRY_CODE__";
</script>

<!-- Original OneTrust SDK -->
<script
  src="https://privacyportal-in-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js"
  type="text/javascript"
  charset="UTF-8"
  id="otprivacy-notice-script">

  settings="eyJjb250ZW50QXBpVXJsIjoiaHR0cHM6Ly9wcml2YWN5cG9ydGFsLWluLm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL2VudGVycHJpc2Vwb2xpY3kvZGlnaXRhbHBvbGljeS9jb250ZW50IiwibWV0YWRhdGFBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtaW4ub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9"

</script>

<!-- Country-based language selection -->
<script type="text/javascript" charset="UTF-8">

(function () {

  const noticeURL =
    "https://privacyportal-in-cdn.onetrust.com/storage-container/53ec83ca-0693-46f3-a55b-110c3f8f5a64/privacy-notices/bd09463e-b148-44d4-91e5-3ee9328b729a/draft/privacynotice.json";

  // ==================================
  // COUNTRY LANGUAGE CONFIGURATION
  // Edit this section as required
  // ==================================

  const COUNTRY_LANGUAGE_CONFIG = {

    FR: {
      default: "fr",
      languages: [
        { code: "fr", label: "Français" },
        { code: "en", label: "English" }
      ]
    },

    IN: {
      default: "en",
      languages: [
        { code: "en", label: "English" },
        { code: "hi", label: "हिन्दी" },
        { code: "bn", label: "বাংলা" },
        { code: "te", label: "తెలుగు" },
        { code: "mr", label: "मराठी" },
        { code: "ta", label: "தமிழ்" },
        { code: "ur", label: "اردو" },
        { code: "gu", label: "ગુજરાતી" },
        { code: "kn", label: "ಕನ್ನಡ" },
        { code: "or", label: "ଓଡ଼ିଆ" },
        { code: "ml", label: "മലയാളം" }
      ]
    },

    AE: {
      default: "ar-ae",
      languages: [
        { code: "ar-ae", label: "العربية (الإمارات)" },
        { code: "ar-qa", label: "العربية (قطر)" },
        { code: "en", label: "English" }
      ]
    },

    QA: {
      default: "ar-qa",
      languages: [
        { code: "ar-qa", label: "العربية (قطر)" },
        { code: "ar-ae", label: "العربية (الإمارات)" },
        { code: "en", label: "English" }
      ]
    },

    US: {
      default: "en",
      languages: [
        { code: "en", label: "English" }
      ]
    },

    MY: {
      default: "ms",
      languages: [
        { code: "ms", label: "Bahasa Melayu" },
        { code: "en", label: "English" }
      ]
    },

    VN: {
      default: "vi",
      languages: [
        { code: "vi", label: "Tiếng Việt" },
        { code: "en", label: "English" }
      ]
    }

  };

  // ==================================
  // DETECT COUNTRY FROM NODE.JS
  // ==================================

  const countryCode =
    (window.NOTICE_COUNTRY_CODE || "").toUpperCase();

  // Fallback configuration
  const countryConfig =
    COUNTRY_LANGUAGE_CONFIG[countryCode] || {
      default: "en",
      languages: [
        { code: "en", label: "English" }
      ]
    };

  // ==================================
  // CREATE LANGUAGE DROPDOWN
  // ==================================

  const selector = document.getElementById(
    "country-language-selector"
  );

  countryConfig.languages.forEach(function (language) {

    const option = document.createElement("option");

    option.value = language.code;
    option.textContent = language.label;

    selector.appendChild(option);

  });

  selector.value = countryConfig.default;

  // ==================================
  // LOAD ONETRUST PRIVACY NOTICE
  // ==================================

  OneTrust.NoticeApi.Initialized.then(function () {

    function loadNotice(languageCode) {

      OneTrust.NoticeApi.LoadNotices(
        [noticeURL],
        true,
        languageCode
      );

      document.documentElement.lang = languageCode;

      document.documentElement.dir =
        languageCode.startsWith("ar") ? "rtl" : "ltr";

      console.log(
        "Country:", countryCode,
        "| Language:", languageCode
      );

    }

    // Initial language
    loadNotice(countryConfig.default);

    // Manual language switching
    selector.addEventListener("change", function () {

      loadNotice(this.value);

    });

  });

})();

</script>

<!-- OneTrust Privacy Notice end -->

        </body>
        </html>
    `);

    // Close the document to finish writing and render the content
    privacyWindow.document.close();
}
