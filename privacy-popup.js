
(function () {

    const COMPONENT_PATH = "./";

    let popupLoaded = false;
    let loadingPromise = null;

    // Load popup HTML and CSS
    async function loadPrivacyPopup() {

        if (popupLoaded) return;

        if (loadingPromise) return loadingPromise;

        loadingPromise = (async function () {

            // Load CSS
            if (!document.getElementById("privacyPopupStyles")) {

                const css = document.createElement("link");

                css.id = "privacyPopupStyles";
                css.rel = "stylesheet";
                css.href = COMPONENT_PATH + "privacy-popup.css";

                document.head.appendChild(css);

                await new Promise((resolve, reject) => {
                    css.onload = resolve;
                    css.onerror = reject;
                });
            }

            // Load HTML
            const response = await fetch(
                COMPONENT_PATH + "privacy-popup.html"
            );

            if (!response.ok) {
                throw new Error("Unable to load Privacy Choices HTML");
            }

            const html = await response.text();

            const container = document.createElement("div");
            container.innerHTML = html;

            document.body.appendChild(container);

            initializePrivacyPopup();

            popupLoaded = true;

        })();

        try {
            await loadingPromise;
        } catch (error) {
            loadingPromise = null;
            console.error("Privacy Popup Error:", error);
            throw error;
        }
    }


    // Open popup
    async function openPrivacyModal() {

        try {

            await loadPrivacyPopup();

            const popup = document.getElementById(
                "privacyChoicesPopup"
            );

            popup.style.display = "block";

            document.body.style.overflow = "hidden";

            document.getElementById("pcClose").focus();

        } catch (error) {

            console.error(error);

        }
    }


    // Close popup
    function closePrivacyModal() {

        const popup = document.getElementById(
            "privacyChoicesPopup"
        );

        if (popup) {
            popup.style.display = "none";
        }

        document.body.style.overflow = "";
    }


    // Initialize popup events
    function initializePrivacyPopup() {

        const close = document.getElementById("pcClose");
        const overlay = document.getElementById("pcOverlay");

        const cookieOptOut = document.getElementById(
            "pcCookieOptOut"
        );

        const otherOptOut = document.getElementById(
            "pcOtherOptOut"
        );

        close.addEventListener("click", closePrivacyModal);

        overlay.addEventListener("click", closePrivacyModal);

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                document.getElementById("privacyChoicesPopup")
                    .style.display === "block"
            ) {
                closePrivacyModal();
            }

        });


        // First option: Cookie and tracker opt-out
        cookieOptOut.addEventListener("click", function () {

            submitPrivacyChoice("cookies");

        });


        // Second option: Other information-sharing opt-out
        otherOptOut.addEventListener("click", function () {

            submitPrivacyChoice("other-sharing");

        });

    }


    // Handle preference selection
    function submitPrivacyChoice(choice) {

        const status = document.getElementById("pcStatus");

        window.dispatchEvent(
            new CustomEvent("privacy-choice", {
                detail: {
                    choice: choice,
                    timestamp: new Date().toISOString()
                }
            })
        );

        status.style.display = "block";

        status.textContent =
            choice === "cookies"
                ? "Your cookie and tracker opt-out preference has been submitted."
                : "Your information-sharing opt-out preference has been submitted.";

        console.log("Selected privacy choice:", choice);

    }


    // Public function
    window.openPrivacyChoices = openPrivacyModal;

    // Footer click handler
    document.addEventListener("click", function (event) {

        const link = event.target.closest("#openPrivacyChoices");

        if (!link) return;

        event.preventDefault();

        openPrivacyModal();

    });

})();
