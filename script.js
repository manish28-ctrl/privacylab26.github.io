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
          


<!-- ==========================================
     ONETRUST PRIVACY NOTICE
     Country-based language selector
========================================== -->

<div class="privacy-language-selector">
  <label for="country-language-selector">Select Language:</label>
  <select id="country-language-selector"></select>
</div>

<div
  id="otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
  class="otnotice">
</div>

<!--
  IMPORTANT:
  Your backend must replace __COUNTRY_CODE__
  with the visitor's ISO country code, such as IN, AE, QA.
  Do not leave this placeholder unchanged in production.
-->
<script>
  window.NOTICE_COUNTRY_CODE = "IN";
</script>

<!-- OneTrust Privacy Notice SDK -->
<script
  src="https://privacyportal-in-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js"
  type="text/javascript"
  charset="UTF-8"
  id="otprivacy-notice-script">

  settings="eyJjb250ZW50QXBpVXJsIjoiaHR0cHM6Ly9wcml2YWN5cG9ydGFsLWluLm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL2VudGVycHJpc2Vwb2xpY3kvZGlnaXRhbHBvbGljeS9jb250ZW50IiwibWV0YWRhdGFBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwtaW4ub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L21ldGEtZGF0YSJ9"

</script>

<script type="text/javascript" charset="UTF-8">

(function () {

  // ==========================================
  // 1. COUNTRY-LANGUAGE CONFIGURATION
  // ==========================================

  const COUNTRY_LANGUAGES = {

    // United Arab Emirates
    AE: [
      { code: "ar-ae", label: "UAE Arabic" },
      { code: "en", label: "English" }
    ],

    // Qatar
    QA: [
      { code: "ar-qa", label: "Qatar Arabic" },
      { code: "en", label: "English" }
    ],

    // India
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

    // Vietnam
    VN: [
      { code: "vi", label: "Vietnamese" },
      { code: "en", label: "English" }
    ],

    // Malaysia
    MY: [
      { code: "ms", label: "Malay" },
      { code: "en", label: "English" }
    ],

    // United States
    US: [
      { code: "en", label: "English" }
    ]

  };


  // ==========================================
  // 2. DEFAULT LANGUAGE CONFIGURATION
  // ==========================================

  const DEFAULT_LANGUAGE = {
    code: "en",
    label: "English"
  };

  const countryCode = (
    window.NOTICE_COUNTRY_CODE || ""
  ).trim().toUpperCase();

  const availableLanguages =
    COUNTRY_LANGUAGES[countryCode] ||
    [DEFAULT_LANGUAGE];


  // ==========================================
  // 3. ONE TRUST NOTICE CONFIGURATION
  // ==========================================

  const noticeURL =
    "https://privacyportal-in-cdn.onetrust.com/storage-container/53ec83ca-0693-46f3-a55b-110c3f8f5a64/privacy-notices/bd09463e-b148-44d4-91e5-3ee9328b729a/draft/privacynotice.json";

  const selector = document.getElementById(
    "country-language-selector"
  );

  const noticeContainer = document.getElementById(
    "otnotice-bd09463e-b148-44d4-91e5-3ee9328b729a"
  );


  // ==========================================
  // 4. POPULATE LANGUAGE DROPDOWN
  // ==========================================

  availableLanguages.forEach(function (language) {

    const option = document.createElement("option");

    option.value = language.code;
    option.textContent = language.label;

    selector.appendChild(option);

  });


  // ==========================================
  // 5. SELECT DEFAULT LANGUAGE
  // ==========================================

  selector.value = availableLanguages[0].code;


  // ==========================================
  // 6. LOAD ONETRUST PRIVACY NOTICE
  // ==========================================

  function loadPrivacyNotice(languageCode) {

    if (languageCode.startsWith("ar")) {
      noticeContainer.setAttribute("dir", "rtl");
    } else {
      noticeContainer.setAttribute("dir", "ltr");
    }

    OneTrust.NoticeApi.LoadNotices(
      [noticeURL],
      true,
      languageCode
    );

  }


  // ==========================================
  // 7. INITIALIZE ONETRUST
  // ==========================================

  OneTrust.NoticeApi.Initialized.then(function () {

    loadPrivacyNotice(selector.value);

  });


  // ==========================================
  // 8. HANDLE LANGUAGE CHANGE
  // ==========================================

  selector.addEventListener("change", function () {

    loadPrivacyNotice(this.value);

  });

})();

</script>

<!-- ==========================================
     END ONETRUST PRIVACY NOTICE
========================================== -->


        </body>
        </html>
    `);

    // Close the document to finish writing and render the content
    privacyWindow.document.close();
}
