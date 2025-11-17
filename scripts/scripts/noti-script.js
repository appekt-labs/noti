(async () => {
    // Notification type
    /**
     * @typedef {object} Notification
     * @property {string} id
     * @property {string} title
     * @property {string} description
     * @property {string} type
     * @property {string} variant
     * @property {string} projectId
     * @property {string} createdAt
     * @property {string} updatedAt
     * @property {string} activeFrom
     * @property {string} activeTo
     * @property {object} [metadata] - JSONB field that may contain action information
     * @property {object} [metadata.action] - Action button configuration
     * @property {string} [metadata.action.name] - Button label text
     * @property {string} [metadata.action.link] - URL to navigate to
     * @property {string} [metadata.action.target] - Link target: 'blank' (new tab) or 'same' (same page)
     * @property {string} [metadata.action.color] - Button background color
     */

    // Config type
    /**
     * @typedef {object} Config
     * @property {string} endpoint
     * @property {string} projectId
     */

    let endpoint = "http://localhost:3000/api/v1"

    // --- Global State for One-at-a-Time Rule ---
    let isNotificationActive = false;
    // ---------------------------------------------


    // current script;
    const currenScript = document.currentScript;
    const scriptSrc = currenScript?.src;

    if (!scriptSrc) {
        console.error("Script must be loaded via a <script src='...'> tag.");
        return;
    }

    const scriptUrl = new URL(scriptSrc);

    // configs;
    let projectId = scriptUrl.searchParams.get("projectId");

    /**
     * @type {Config}
     */
    let config = {
        endpoint: endpoint,
        projectId: projectId
    }

    // --- Utility Functions ---

    /**
     * Introduces a delay.
     * @param {number} ms
     * @returns {Promise<void>}
     */
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Marks a notification ID as displayed in localStorage.
     * @param {string} id
     */
    function markAsDisplayed(id) {
        try {
            const displayed = JSON.parse(localStorage.getItem('displayed_noti') || '[]');
            if (!displayed.includes(id)) {
                displayed.push(id);
                localStorage.setItem('displayed_noti', JSON.stringify(displayed));
            }
        } catch (e) {
            console.warn("localStorage unavailable, cannot persist displayed state.");
        }
    }

    /**
     * Get colors based on notification variant.
     * @param {string} variant - 'info', 'warning', 'danger', 'success'
     * @returns {{background: string, color: string}}
     */
    function getVariantColors(variant) {
        switch (variant) {
            case 'info':
                return { background: '#cfe2ff', color: '#055160' };
            case 'warning':
                return { background: '#fff3cd', color: '#664d03' };
            case 'danger':
                return { background: '#f8d7da', color: '#842029' };
            case 'success':
                return { background: '#d1e7dd', color: '#0f5132' };
            default:
                return { background: '#e9ecef', color: '#495057' };
        }
    }

    /**
     * Get modal colors based on variant for modal styling.
     * @param {string} variant - 'info', 'warning', 'danger', 'success'
     * @returns {{bg: string, textColor: string, accentColor: string}}
     */
    function getModalVariantColors(variant) {
        const normalizedVariant = (variant || '').toLowerCase();
        switch (normalizedVariant) {
            case 'info':
                return {
                    bg: '#dbeafe',
                    textColor: '#1e40af',
                    accentColor: '#2563eb'
                };
            case 'warning':
                return {
                    bg: '#fef3c7',
                    textColor: '#92400e',
                    accentColor: '#d97706'
                };
            case 'danger':
                return {
                    bg: '#fee2e2',
                    textColor: '#991b1b',
                    accentColor: '#dc2626'
                };
            case 'success':
                return {
                    bg: '#d1fae5',
                    textColor: '#065f46',
                    accentColor: '#059669'
                };
            default:
                return {
                    bg: '#f3f4f6',
                    textColor: '#374151',
                    accentColor: '#6b7280'
                };
        }
    }


    // --- Rendering Functions ---

    /**
     * Renders a modal notification (manual close, blocking).
     * @param {Notification} noti
     */
    function renderModal(noti) {
        if (document.getElementById(`modal-${noti.id}`)) return;
        isNotificationActive = true; // Set active

        // Get variant colors for modal styling
        const variantColors = getModalVariantColors(noti.variant);

        // Check if action exists in metadata
        const hasAction = noti.metadata && noti.metadata.action && typeof noti.metadata.action === 'object';
        const actionData = hasAction ? noti.metadata.action : null;

        const modal = document.createElement('div');
        modal.id = `modal-${noti.id}`;
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            animation: fadeIn 0.2s ease-out;
        `;

        // Add fade-in animation
        if (!document.getElementById('noti-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'noti-modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const content = document.createElement('div');
        content.style.cssText = `
            background: ${variantColors.bg}; color: ${variantColors.textColor}; border-radius: 16px; padding: 0;
            max-width: 520px; width: 90%; max-height: 90vh; overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            font-size: 16px; line-height: 1.6; box-sizing: border-box; position: relative;
            animation: slideUp 0.3s ease-out;
            display: flex; flex-direction: column;
        `;

        const dismiss = async (e) => {
            if (e) {
                e.stopPropagation();
            }
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            markAsDisplayed(noti.id);
            isNotificationActive = false; // Clear active state
            // Wait 2 seconds before showing next notification
            await delay(2000);
            renderNotifications(); // Will get fresh list from localStorage
        };

        // Header with variant-colored background
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px 24px; background: ${variantColors.bg};
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0; border-radius: 16px 16px 0 0;
        `;

        const titleEl = document.createElement('h3');
        titleEl.textContent = noti.title;
        titleEl.style.cssText = `
            margin: 0; font-size: 20px; font-weight: 600; color: ${variantColors.textColor};
            line-height: 1.4; flex: 1; padding-right: 12px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.style.cssText = `
            background: rgba(0,0,0,0.1); border: none; font-size: 24px;
            color: ${variantColors.textColor}; cursor: pointer; padding: 0;
            width: 32px; height: 32px; display: flex; align-items: center;
            justify-content: center; border-radius: 8px; flex-shrink: 0;
            transition: all 0.2s ease; line-height: 1;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.15)';
            closeBtn.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.1)';
            closeBtn.style.transform = 'scale(1)';
        });
        closeBtn.addEventListener('click', dismiss);

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        // Body content
        const body = document.createElement('div');
        body.style.cssText = `
            padding: 24px; overflow-y: auto; flex: 1;
            color: ${variantColors.textColor}; background: ${variantColors.bg};
        `;
        const descEl = document.createElement('p');
        descEl.textContent = noti.description;
        descEl.style.cssText = 'margin: 0; line-height: 1.6; font-size: 15px;';
        body.appendChild(descEl);

        // Footer with buttons
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 16px 24px 24px 24px;
            display: flex; justify-content: ${hasAction ? 'space-between' : 'flex-end'};
            gap: 12px; flex-shrink: 0; background: ${variantColors.bg};
            border-radius: 0 0 16px 16px;
        `;

        // Action button (if exists)
        if (hasAction && actionData) {
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.textContent = actionData.name || 'Action';
            const actionColor = actionData.color || variantColors.accentColor;
            actionBtn.style.cssText = `
                background: ${actionColor}; color: white; border: none;
                padding: 10px 20px; border-radius: 8px; font-size: 14px;
                font-weight: 500; cursor: pointer; transition: all 0.2s ease;
                min-width: 100px;
            `;
            actionBtn.addEventListener('mouseenter', () => {
                actionBtn.style.opacity = '0.9';
                actionBtn.style.transform = 'translateY(-1px)';
            });
            actionBtn.addEventListener('mouseleave', () => {
                actionBtn.style.opacity = '1';
                actionBtn.style.transform = 'translateY(0)';
            });
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Handle action link navigation
                if (actionData.link) {
                    const target = (actionData.target || 'same').toLowerCase();
                    if (target === 'blank') {
                        // Open in new tab
                        window.open(actionData.link, '_blank', 'noopener,noreferrer');
                    } else {
                        // Open in same page (default)
                        window.location.href = actionData.link;
                    }
                }
                dismiss(e);
            });
            footer.appendChild(actionBtn);
        }

        // Close button in footer
        const footerCloseBtn = document.createElement('button');
        footerCloseBtn.type = 'button';
        footerCloseBtn.textContent = 'Close';
        footerCloseBtn.style.cssText = `
            background: rgba(255,255,255,0.9); color: ${variantColors.textColor};
            border: none;
            padding: 10px 20px; border-radius: 8px; font-size: 14px;
            font-weight: 500; cursor: pointer; transition: all 0.2s ease;
            min-width: 100px;
        `;
        footerCloseBtn.addEventListener('mouseenter', () => {
            footerCloseBtn.style.background = 'rgba(255,255,255,1)';
            footerCloseBtn.style.transform = 'translateY(-1px)';
        });
        footerCloseBtn.addEventListener('mouseleave', () => {
            footerCloseBtn.style.background = 'rgba(255,255,255,0.9)';
            footerCloseBtn.style.transform = 'translateY(0)';
        });
        footerCloseBtn.addEventListener('click', dismiss);
        footer.appendChild(footerCloseBtn);

        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                dismiss(e);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                dismiss(e);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /**
     * Renders a persistent banner notification (manual close, fixed top).
     * @param {Notification} noti
     */
    function renderBanner(noti) {
        const { background, color } = getVariantColors(noti.variant);

        if (document.getElementById(`annw-${noti.id}`)) return;
        isNotificationActive = true; // Set active

        const bannerEl = document.createElement('div');
        bannerEl.id = `annw-${noti.id}`;
        bannerEl.className = `annw-banner annw-variant-${noti.variant || 'default'}`;

        bannerEl.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; padding: 12px 20px;
            background: ${background}; color: ${color}; border-bottom: 1px solid rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px; line-height: 1.4; z-index: 9999; box-sizing: border-box;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        const dismiss = async (e) => {
            if (e) {
                e.stopPropagation();
            }
            if (bannerEl.parentNode) {
                document.body.removeChild(bannerEl);
            }
            markAsDisplayed(noti.id);
            isNotificationActive = false; // Clear active state
            // Wait 2 seconds before showing next notification
            await delay(2000);
            renderNotifications(); // Will get fresh list from localStorage
        };

        // Create content wrapper instead of using innerHTML
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
            display: flex; align-items: center; flex: 1; min-width: 0;
        `;

        const titleSpan = document.createElement('strong');
        titleSpan.textContent = noti.title;
        titleSpan.style.cssText = 'margin-right: 8px;';

        const descSpan = document.createElement('span');
        descSpan.textContent = noti.description;

        contentWrapper.appendChild(titleSpan);
        contentWrapper.appendChild(descSpan);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.style.cssText = `
            background: rgba(0,0,0,0.1); border: none; font-size: 20px; color: ${color};
            cursor: pointer; padding: 0; width: 28px; height: 28px; min-width: 28px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 4px; margin-left: 16px; transition: background 0.2s ease;
            line-height: 1;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.1)';
        });
        closeBtn.addEventListener('click', dismiss);

        bannerEl.appendChild(contentWrapper);
        bannerEl.appendChild(closeBtn);

        document.body.insertBefore(bannerEl, document.body.firstChild);
    }

    /**
     * Renders an alert notification (auto-close, fixed top-right, stackable).
     * @param {Notification} noti
     */
    function renderAlert(noti) {
        const { background, color } = getVariantColors(noti.variant);
        const AUTO_CLOSE_MS = 5000; // 5 seconds auto-close

        if (document.getElementById(`alert-${noti.id}`)) return;
        isNotificationActive = true; // Set active

        const alertEl = document.createElement('div');
        alertEl.id = `alert-${noti.id}`;
        alertEl.className = `annw-alert annw-variant-${noti.variant || 'default'}`;

        alertEl.style.cssText = `
            position: fixed; top: 20px; right: 20px; max-width: 300px;
            padding: 12px 20px; background: ${background}; color: ${color};
            border-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px; line-height: 1.4; z-index: 9999; box-sizing: border-box;
            opacity: 0; transition: opacity 0.3s ease-in;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute; top: 5px; right: 5px;
            background: none; border: none; font-size: 20px; color: ${color};
            cursor: pointer; padding: 0;
        `;

        const dismiss = async (e) => {
            if (e) {
                e.stopPropagation();
            }
            alertEl.style.opacity = '0';
            setTimeout(async () => {
                try {
                    if (alertEl.parentNode) {
                        document.body.removeChild(alertEl);
                    }
                    markAsDisplayed(noti.id);
                    isNotificationActive = false; // Clear active state
                    // Wait 2 seconds before showing next notification
                    await delay(2000);
                    renderNotifications(); // Will get fresh list from localStorage
                } catch (e) { /* already removed */ }
            }, 300);
        };

        closeBtn.addEventListener('click', dismiss);

        alertEl.innerHTML = `<strong>${noti.title}</strong><p style="margin: 4px 0 0 0;">${noti.description}</p>`;
        alertEl.appendChild(closeBtn);
        document.body.appendChild(alertEl);

        setTimeout(() => alertEl.style.opacity = '1', 10);
        setTimeout(dismiss, AUTO_CLOSE_MS);
    }

    /**
     * Fetches notifications from the API.
     * @param {Config} cfg
     * @returns {Promise<Notification[]>}
     */
    async function fetchNotifications(cfg) {
        // ... (Fetch logic remains unchanged) ...
        if (!cfg.projectId) {
            console.error("Project ID is missing from script URL parameters.");
            return [];
        }

        try {
            const resp = await fetch(`${cfg.endpoint}/projects/${cfg.projectId}/notifications`, {
                method: "GET"
            })

            if (!resp.ok) {
                console.error(`Failed to fetch notifications: ${resp.status} ${resp.statusText}`);
                return [];
            }

            /**
             * @type {Notification[]}
             */
            const results = await resp.json();
            console.log("results:", results);
            return results;
        } catch (e) {
            console.error("Error during fetch:", e);
            return [];
        }
    }


    /**
     * Checks if any notification is currently displayed in the DOM.
     * @returns {boolean}
     */
    function hasActiveNotification() {
        return !!(
            document.querySelector('[id^="modal-"]') ||
            document.querySelector('[id^="annw-"]') ||
            document.querySelector('[id^="alert-"]')
        );
    }

    /**
     * Gets the list of notifications that haven't been displayed yet, based on current localStorage.
     * @returns {Notification[]}
     */
    function getNotDisplayedNotifications() {
        const allReadyDisplayedNotifications = JSON.parse(localStorage.getItem("displayed_noti") || "[]");
        return notifications.filter((noti) => !allReadyDisplayedNotifications.includes(noti.id));
    }

    /**
     * Iterates and renders applicable notifications with a 2-second delay,
     * respecting the one-at-a-time rule.
     * Always uses fresh data from localStorage to determine which notifications to show.
     */
    async function renderNotifications() {
        const RENDER_DELAY_MS = 2000; // 2 second delay between notifications

        // If a notification is already active (either by flag or in DOM), stop processing.
        if (isNotificationActive || hasActiveNotification()) {
            return;
        }

        // Get fresh list of not-displayed notifications from localStorage
        const notDisplayedList = getNotDisplayedNotifications();

        // Only process the first notification
        if (notDisplayedList.length > 0) {
            const noti = notDisplayedList[0];

            switch (noti.type) {
                case 'modal':
                    renderModal(noti);
                    break;
                case 'banner':
                    renderBanner(noti);
                    break;
                case 'alert':
                    renderAlert(noti);
                    break;
                default:
                    console.warn(`Unknown notification type: ${noti.type}`);
            }
        }
    }

    // --- Execution Start ---

    let notifications = await fetchNotifications(config)

    console.log("notifications:", notifications);

    // render the first available notification (if any). The rest will be handled upon dismissal.
    // renderNotifications() will dynamically get the list from localStorage
    await renderNotifications();
})()