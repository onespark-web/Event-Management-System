/**
 * EventSphere - Final Outcome Script
 * Lead Developer: Aalekh Kaushik | B.Tech CSE | MITS Gwalior
 * Complete Client-Side Event Management Suite with Role-Based Access Control
 */

// --- Default Seed Data ---
const DEFAULT_EVENTS = [
    {
        id: 101,
        name: "Tech Fest 2026: Zenith",
        category: "Technical",
        date: "2026-10-20",
        time: "10:00",
        venue: "Seminar Hall 1",
        capacity: 180,
        organizer: "CSE Department",
        regType: "Free",
        desc: "Annual departmental technical symposium featuring paper presentations, project expos, and guest keynotes."
    },
    {
        id: 102,
        name: "CodeCraft Inter-College Hackathon",
        category: "Hackathon",
        date: "2026-11-12",
        time: "09:00",
        venue: "Central Auditorium",
        capacity: 250,
        organizer: "MITS ACM Chapter",
        regType: "Free",
        desc: "A 24-hour intense coding sprint tackling problem statements in AI, FinTech, and Green Computing."
    },
    {
        id: 103,
        name: "Full-Stack Web Dev Bootcamp",
        category: "Workshop",
        date: "2026-11-25",
        time: "14:00",
        venue: "Computer Lab 3",
        capacity: 65,
        organizer: "Google Developer Groups (GDG)",
        regType: "Paid",
        desc: "Hands-on guided workshop covering modern responsive UI design, RESTful APIs, and frontend state management."
    },
    {
        id: 104,
        name: "Industry 5.0 & AI Lecture",
        category: "Seminar",
        date: "2026-12-02",
        time: "11:30",
        venue: "Conference Room A",
        capacity: 120,
        organizer: "Placement & Training Cell",
        regType: "Free",
        desc: "Invited lecture from veteran tech leads discussing artificial intelligence transformation across engineering sectors."
    },
    {
        id: 105,
        name: "Tarangini Cultural Evening",
        category: "Cultural",
        date: "2026-12-15",
        time: "17:30",
        venue: "Open Air Amphitheatre",
        capacity: 450,
        organizer: "Student Activity Council (SAC)",
        regType: "Free",
        desc: "Annual music, dance, and theatrical showcase by university cultural clubs."
    }
];

// --- Pre-configured Accounts for Testing & Roles ---
const PRESET_ACCOUNTS = {
    admin: {
        id: "ADM-101",
        name: "Campus Administrator",
        email: "admin@mits.ac.in",
        role: "admin",
        roleLabel: "Administrator",
        permission: "Full Managerial Access (Add, Edit, Delete, Reset)",
        avatarText: "AD",
        avatarClass: "avatar-admin",
        pillClass: "pill-admin"
    },
    organizer: {
        id: "ORG-202",
        name: "Faculty Coordinator (CSE)",
        email: "organizer.cse@mits.ac.in",
        role: "organizer",
        roleLabel: "Event Organizer",
        permission: "Organizer Access (Create & Edit Events)",
        avatarText: "OR",
        avatarClass: "avatar-organizer",
        pillClass: "pill-organizer"
    },
    student: {
        id: "STU-303",
        name: "Student Attendee",
        email: "student.cse@mits.ac.in",
        role: "student",
        roleLabel: "Student / Viewer",
        permission: "Read-Only Access (View Details, Reserve Passes)",
        avatarText: "ST",
        avatarClass: "avatar-student",
        pillClass: "pill-student"
    }
};

const STORAGE_KEY = "eventsphere_final_data";
const AUTH_STORAGE_KEY = "eventsphere_auth_user";
const REGISTRATIONS_STORAGE_KEY = "eventsphere_registered_events";

// State
let events = loadEvents();
let currentUser = loadCurrentUser();
let registeredEventIds = loadRegistrations();
let currentView = "table"; // "table" or "cards"
let currentCategory = "all";
let currentSearch = "";
let currentSort = "date-asc";

// --- DOM References ---
const loginScreen = document.getElementById("loginScreen");
const appLayout = document.getElementById("appLayout");
const customLoginForm = document.getElementById("customLoginForm");
const loginRoleSelect = document.getElementById("loginRoleSelect");
const loginIdInput = document.getElementById("loginIdInput");
const loginEmailInput = document.getElementById("loginEmailInput");

// Header & Profile Popover Elements
const profileMenuContainer = document.getElementById("profileMenuContainer");
const profileTriggerBtn = document.getElementById("profileTriggerBtn");
const profileDropdown = document.getElementById("profileDropdown");
const headerProfileAvatar = document.getElementById("headerProfileAvatar");
const headerProfileId = document.getElementById("headerProfileId");
const headerProfileRole = document.getElementById("headerProfileRole");
const dropdownProfileAvatar = document.getElementById("dropdownProfileAvatar");
const dropdownProfileName = document.getElementById("dropdownProfileName");
const dropdownRolePill = document.getElementById("dropdownRolePill");
const profileIdDisplay = document.getElementById("profileIdDisplay");
const profileEmailDisplay = document.getElementById("profileEmailDisplay");
const profilePermissionDisplay = document.getElementById("profilePermissionDisplay");
const logoutBtn = document.getElementById("logoutBtn");

// Role Notice Banner
const roleNoticeBanner = document.getElementById("roleNoticeBanner");
const roleBannerIcon = document.getElementById("roleBannerIcon");
const roleBannerText = document.getElementById("roleBannerText");
const bannerSwitchRoleBtn = document.getElementById("bannerSwitchRoleBtn");

// Directory & View Controls
const eventsTableBody = document.getElementById("eventsTableBody");
const cardViewSection = document.getElementById("cardViewSection");
const tableViewSection = document.getElementById("tableViewSection");
const liveSearchInput = document.getElementById("liveSearchInput");
const categoryTabs = document.getElementById("categoryTabs");
const sortBySelect = document.getElementById("sortBySelect");
const directorySubtitle = document.getElementById("directorySubtitle");

// KPI Counters
const kpiTotalEvents = document.getElementById("kpiTotalEvents");
const kpiTotalCapacity = document.getElementById("kpiTotalCapacity");
const kpiTechCount = document.getElementById("kpiTechCount");
const kpiFreeCount = document.getElementById("kpiFreeCount");

// View Toggle Buttons
const tableViewBtn = document.getElementById("tableViewBtn");
const cardViewBtn = document.getElementById("cardViewBtn");

// Modals
const eventModal = document.getElementById("eventModal");
const eventModalForm = document.getElementById("eventModalForm");
const modalTitle = document.getElementById("modalTitle");
const modalBadge = document.getElementById("modalBadge");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const editModeFlag = document.getElementById("editModeFlag");

// Details Modal
const detailsModal = document.getElementById("detailsModal");
const detailContent = document.getElementById("detailContent");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const doneDetailBtn = document.getElementById("doneDetailBtn");

// Quick Actions
const exportCsvBtn = document.getElementById("exportCsvBtn");
const resetDemoBtn = document.getElementById("resetDemoBtn");
const toastBox = document.getElementById("toastNotification");

// Theme & Sound Toggle References
const themeToggleBtn = document.getElementById("themeToggleBtn");
const soundToggleBtn = document.getElementById("soundToggleBtn");
const soundIcon = document.getElementById("soundIcon");

// Digital VIP Boarding Pass Ticket References
const ticketModal = document.getElementById("ticketModal");
const closeTicketModalBtn = document.getElementById("closeTicketModalBtn");
const doneTicketBtn = document.getElementById("doneTicketBtn");
const printTicketBtn = document.getElementById("printTicketBtn");
const ticketEventName = document.getElementById("ticketEventName");
const ticketEventSub = document.getElementById("ticketEventSub");
const ticketAttendeeName = document.getElementById("ticketAttendeeName");
const ticketAttendeeId = document.getElementById("ticketAttendeeId");
const ticketDateTime = document.getElementById("ticketDateTime");
const ticketVenue = document.getElementById("ticketVenue");
const ticketPassCode = document.getElementById("ticketPassCode");

// --- Web Audio Synthesizer (Creative Sound Effects) ---
let soundEnabled = localStorage.getItem("eventsphere_sound") !== "false";
const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playTone(freq, duration, type = "sine") {
    if (!soundEnabled || !audioCtx) return;
    try {
        if (audioCtx.state === "suspended") audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function playSuccessChime() {
    if (!soundEnabled || !audioCtx) return;
    playTone(523.25, 0.12);
    setTimeout(() => playTone(659.25, 0.14), 100);
    setTimeout(() => playTone(783.99, 0.22), 200);
}

function playClickSound() {
    playTone(600, 0.04);
}

// --- Calendar Badge Helper ---
function renderCalendarBadge(dateStr) {
    if (!dateStr) return "";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const parts = dateStr.split("-");
    if (parts.length < 3) return "";
    const monthIdx = parseInt(parts[1], 10) - 1;
    const month = months[monthIdx] || "EVT";
    const day = parts[2];
    return `
        <div class="calendar-date-badge" title="Event Date: ${dateStr}">
            <span class="cal-month">${month}</span>
            <span class="cal-day">${day}</span>
        </div>
    `;
}

// --- Category Emoji Helper ---
function getCategoryEmoji(cat) {
    switch (cat) {
        case "Technical": return "⚡";
        case "Hackathon": return "🚀";
        case "Workshop": return "🛠️";
        case "Seminar": return "🎤";
        case "Cultural": return "🎭";
        case "Sports": return "⚽";
        default: return "📌";
    }
}

// --- Simulated Capacity Fill Rate Helper ---
function getCapacityFillMeta(evt) {
    const baseSeats = Number(evt.capacity) || 100;
    const seed = ((evt.id * 19) % 35) + 55; // 55% - 90%
    const registeredCount = Math.min(baseSeats, Math.round(baseSeats * (seed / 100)));
    const pct = Math.round((registeredCount / baseSeats) * 100);
    let fillClass = "fill-emerald";
    if (pct >= 85) fillClass = "fill-rose";
    else if (pct >= 70) fillClass = "fill-amber";
    return { registeredCount, pct, fillClass };
}

// --- KPI Smooth Number Animation ---
function animateValue(elem, start, end, duration = 600) {
    if (!elem) return;
    const numEnd = Number(end);
    if (isNaN(numEnd)) { elem.textContent = end; return; }
    const range = numEnd - start;
    if (range === 0) { elem.textContent = numEnd.toLocaleString(); return; }
    const startTime = performance.now();
    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = Math.floor(progress * range + start);
        elem.textContent = current.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            elem.textContent = numEnd.toLocaleString();
        }
    }
    requestAnimationFrame(step);
}

// --- Category Distribution Breakdown Mix Updater ---
function updateCategoryMix() {
    const bar = document.getElementById("categoryMixBar");
    const legend = document.getElementById("categoryMixLegend");
    const badge = document.getElementById("mixTotalBadge");
    if (!bar || !legend) return;

    if (events.length === 0) {
        bar.innerHTML = "";
        legend.innerHTML = "<span>No events to calculate mix.</span>";
        if (badge) badge.textContent = "0 Events";
        return;
    }

    const counts = {};
    events.forEach(e => {
        counts[e.category] = (counts[e.category] || 0) + 1;
    });

    const categoryStyles = {
        "Technical": { class: "mix-tech", color: "#4f46e5" },
        "Hackathon": { class: "mix-hack", color: "#10b981" },
        "Workshop": { class: "mix-work", color: "#f59e0b" },
        "Seminar": { class: "mix-semi", color: "#a855f7" },
        "Cultural": { class: "mix-cult", color: "#f43f5e" },
        "Sports": { class: "mix-spor", color: "#ea580c" }
    };

    let barHtml = "";
    let legendHtml = "";

    Object.entries(counts).forEach(([cat, count]) => {
        const pct = Math.round((count / events.length) * 100);
        const style = categoryStyles[cat] || { class: "mix-tech", color: "#4f46e5" };
        barHtml += `<div class="mix-segment ${style.class}" style="width: ${pct}%;" title="${cat}: ${count} events (${pct}%)"></div>`;
        legendHtml += `
            <div class="legend-item">
                <span class="legend-dot" style="background: ${style.color};"></span>
                <span>${getCategoryEmoji(cat)} ${cat}: <strong>${count}</strong> (${pct}%)</span>
            </div>
        `;
    });

    bar.innerHTML = barHtml;
    legend.innerHTML = legendHtml;
    if (badge) badge.textContent = `${events.length} Total Registered`;
}

// --- Digital VIP Boarding Pass Modal ---
function hideTicketModal() {
    if (ticketModal) {
        ticketModal.classList.add("hidden");
        ticketModal.setAttribute("aria-hidden", "true");
    }
}

window.openTicketModal = function(id) {
    const target = events.find(e => e.id === id);
    if (!target || !currentUser) return;

    if (ticketEventName) ticketEventName.textContent = target.name;
    if (ticketEventSub) ticketEventSub.textContent = `${target.category} • ${target.venue} • Pass Type: ${target.regType}`;
    if (ticketAttendeeName) ticketAttendeeName.textContent = currentUser.name || "Student Attendee";
    if (ticketAttendeeId) ticketAttendeeId.textContent = `${currentUser.id} (${currentUser.email || "student.cse@mits.ac.in"})`;
    if (ticketDateTime) ticketDateTime.textContent = `${target.date} at ${formatTime(target.time)}`;
    if (ticketVenue) ticketVenue.textContent = target.venue;

    const passCode = `MITS-2026-${target.id}-${currentUser.id.replace(/[^A-Z0-9]/gi, "")}`;
    if (ticketPassCode) ticketPassCode.textContent = passCode;

    playSuccessChime();

    if (ticketModal) {
        ticketModal.classList.remove("hidden");
        ticketModal.setAttribute("aria-hidden", "false");
    }
};

if (closeTicketModalBtn) closeTicketModalBtn.addEventListener("click", hideTicketModal);
if (doneTicketBtn) doneTicketBtn.addEventListener("click", hideTicketModal);
if (printTicketBtn) {
    printTicketBtn.addEventListener("click", () => {
        window.print();
    });
}

// --- Theme & Sound Management on Dashboard ---
function applyDashboardTheme(dark) {
    if (dark) {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<span class="theme-icon">☀️</span> <span class="theme-label">Light</span>`;
            themeToggleBtn.title = "Switch to Light Mode";
        }
    } else {
        document.documentElement.removeAttribute("data-theme");
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<span class="theme-icon">🌙</span> <span class="theme-label">Dark</span>`;
            themeToggleBtn.title = "Switch to Dark Mode";
        }
    }
}

function updateSoundIcon() {
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? "🔔" : "🔕";
        if (soundToggleBtn) {
            soundToggleBtn.title = soundEnabled ? "Sound Effects: ON (Click to mute)" : "Sound Effects: OFF (Click to unmute)";
        }
    }
}

function initDashboardTheme() {
    const storedTheme = localStorage.getItem("eventsphere_theme");
    const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    applyDashboardTheme(isDark);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            playClickSound();
            const currentDark = document.documentElement.getAttribute("data-theme") === "dark";
            const nextDark = !currentDark;
            localStorage.setItem("eventsphere_theme", nextDark ? "dark" : "light");
            applyDashboardTheme(nextDark);
            notify(nextDark ? "Dark mode activated 🌙" : "Light mode activated ☀️", "info");
        });
    }

    if (soundToggleBtn) {
        updateSoundIcon();
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem("eventsphere_sound", soundEnabled ? "true" : "false");
            updateSoundIcon();
            if (soundEnabled) playClickSound();
            notify(soundEnabled ? "Audio effects enabled 🔔" : "Audio muted 🔕", "info");
        });
    }
}

// --- Persistence Helpers ---
function loadEvents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [...DEFAULT_EVENTS];
    } catch (e) {
        return [...DEFAULT_EVENTS];
    }
}

function saveEvents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
        console.error("Storage error:", e);
    }
}

function loadCurrentUser() {
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function saveCurrentUser(user) {
    try {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (e) {
        console.error("Auth storage error:", e);
    }
}

function loadRegistrations() {
    try {
        const stored = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveRegistrations() {
    try {
        localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registeredEventIds));
    } catch (e) {
        console.error("Registrations storage error:", e);
    }
}

function notify(message, type = "success") {
    toastBox.textContent = message;
    toastBox.className = `toast-box show toast-${type}`;
    setTimeout(() => {
        toastBox.className = "toast-box";
    }, 3200);
}

// --- Role-Based Access Control (RBAC) & Session Management ---
function updateAuthUI() {
    if (!currentUser) {
        if (loginScreen) loginScreen.classList.remove("hidden");
        if (appLayout) appLayout.classList.add("hidden");
        // Strict guard for dashboard page
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.replace("index.html");
        }
        return;
    }

    if (loginScreen) loginScreen.classList.add("hidden");
    if (appLayout) appLayout.classList.remove("hidden");

    // Update Profile Trigger Button (Avatar + ID + Role)
    headerProfileAvatar.textContent = currentUser.avatarText || currentUser.id.slice(0, 2).toUpperCase();
    headerProfileAvatar.className = `profile-avatar ${currentUser.avatarClass || "avatar-student"}`;
    headerProfileId.textContent = currentUser.id;
    headerProfileRole.textContent = currentUser.roleLabel || currentUser.role;

    // Update Profile Dropdown Card (Consists of ID and Email Address as requested)
    dropdownProfileAvatar.textContent = currentUser.avatarText || currentUser.id.slice(0, 2).toUpperCase();
    dropdownProfileAvatar.className = `profile-avatar large ${currentUser.avatarClass || "avatar-student"}`;
    dropdownProfileName.textContent = currentUser.name || "Authenticated User";
    dropdownRolePill.textContent = currentUser.roleLabel || currentUser.role;
    dropdownRolePill.className = `role-pill ${currentUser.pillClass || "pill-student"}`;

    profileIdDisplay.textContent = currentUser.id;
    profileEmailDisplay.textContent = currentUser.email;
    profilePermissionDisplay.textContent = currentUser.permission || "Standard User";

    // Enforce UI Permission Visibility
    if (currentUser.role === "student") {
        // Students: Can view directory and reserve passes
        openAddModalBtn.style.display = "inline-flex";
        openAddModalBtn.title = "Student Mode (View-Only). Click to switch to Organizer.";
        resetDemoBtn.style.display = "none";
        roleNoticeBanner.className = "role-notice-banner student-mode";
        roleBannerIcon.textContent = "🎓";
        roleBannerText.innerHTML = `<strong>Student Mode Active</strong> (ID: <code>${currentUser.id}</code> &bull; Email: <code>${currentUser.email}</code>) &mdash; Protected View-Only Mode. You can browse schedules, view specifications, and reserve passes. Switch to Organizer or Admin to add new events.`;
    } else if (currentUser.role === "organizer") {
        // Organizers: Can add & edit events
        openAddModalBtn.style.display = "inline-flex";
        openAddModalBtn.title = "Create New Event";
        resetDemoBtn.style.display = "none";
        roleNoticeBanner.className = "role-notice-banner organizer-mode";
        roleBannerIcon.textContent = "📅";
        roleBannerText.innerHTML = `<strong>Event Organizer Mode</strong> (ID: <code>${currentUser.id}</code> &bull; Email: <code>${currentUser.email}</code>) &mdash; Department privileges active. You can create new events and update existing event details.`;
    } else {
        // Admin: Full control
        openAddModalBtn.style.display = "inline-flex";
        openAddModalBtn.title = "Create New Event";
        resetDemoBtn.style.display = "inline-flex";
        roleNoticeBanner.className = "role-notice-banner admin-mode";
        roleBannerIcon.textContent = "🛡️";
        roleBannerText.innerHTML = `<strong>Administrator Mode</strong> (ID: <code>${currentUser.id}</code> &bull; Email: <code>${currentUser.email}</code>) &mdash; Complete managerial access active with creation, editing, deletion, and system reset privileges.`;
    }

    // Highlight active role pill in profile switcher
    document.querySelectorAll(".btn-role-pill").forEach(pill => {
        if (pill.dataset.role === currentUser.role) {
            pill.classList.add("active");
        } else {
            pill.classList.remove("active");
        }
    });
}

function loginUser(userObj) {
    currentUser = userObj;
    saveCurrentUser(currentUser);
    updateAuthUI();
    render();
    notify(`Welcome! Logged in as ${currentUser.roleLabel} (${currentUser.id}).`, "success");
}

function logoutUser() {
    currentUser = null;
    saveCurrentUser(null);
    if (profileDropdown) profileDropdown.classList.add("hidden");
    if (profileTriggerBtn) profileTriggerBtn.setAttribute("aria-expanded", "false");
    notify("Logged out. Redirecting to Home...", "info");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 350);
}

window.quickLogin = function(role) {
    if (PRESET_ACCOUNTS[role]) {
        loginUser(PRESET_ACCOUNTS[role]);
    }
};

// Custom Login Form Listener
if (customLoginForm) {
    customLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const role = loginRoleSelect.value;
        const id = loginIdInput.value.trim();
        const email = loginEmailInput.value.trim();

        if (!id || !email) {
            notify("Please enter both ID and Email.", "danger");
            return;
        }

        const roleTemplate = PRESET_ACCOUNTS[role] || PRESET_ACCOUNTS.student;
        const customUser = {
            id: id,
            email: email,
            name: role === "student" ? `Student User (${id})` : (role === "organizer" ? `Organizer (${id})` : `Administrator (${id})`),
            role: role,
            roleLabel: roleTemplate.roleLabel,
            permission: roleTemplate.permission,
            avatarText: id.slice(0, 2).toUpperCase(),
            avatarClass: roleTemplate.avatarClass,
            pillClass: roleTemplate.pillClass
        };

        loginUser(customUser);
        customLoginForm.reset();
    });
}

// Profile Dropdown Toggle
if (profileTriggerBtn) {
    profileTriggerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = profileDropdown.classList.contains("hidden");
        if (isHidden) {
            profileDropdown.classList.remove("hidden");
            profileTriggerBtn.setAttribute("aria-expanded", "true");
        } else {
            profileDropdown.classList.add("hidden");
            profileTriggerBtn.setAttribute("aria-expanded", "false");
        }
    });
}

// Close Dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (profileMenuContainer && !profileMenuContainer.contains(e.target)) {
        profileDropdown.classList.add("hidden");
        profileTriggerBtn.setAttribute("aria-expanded", "false");
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
}

// 1-Click Role Switcher for Testing & Demo
window.switchUserRole = function(role) {
    if (!PRESET_ACCOUNTS[role]) return;
    playClickSound();
    currentUser = { ...PRESET_ACCOUNTS[role] };
    saveCurrentUser(currentUser);
    updateAuthUI();
    render();
    notify(`Switched active session to ${currentUser.roleLabel} (${currentUser.id})!`, "success");
    if (profileDropdown) profileDropdown.classList.add("hidden");
    if (profileTriggerBtn) profileTriggerBtn.setAttribute("aria-expanded", "false");
};

if (bannerSwitchRoleBtn) {
    bannerSwitchRoleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profileDropdown) {
            const isHidden = profileDropdown.classList.contains("hidden");
            if (isHidden) {
                profileDropdown.classList.remove("hidden");
                if (profileTriggerBtn) profileTriggerBtn.setAttribute("aria-expanded", "true");
            } else {
                profileDropdown.classList.add("hidden");
                if (profileTriggerBtn) profileTriggerBtn.setAttribute("aria-expanded", "false");
            }
        }
    });
}

// Student Pass Reservation Workflow
window.toggleRegistration = function(id) {
    if (!currentUser || currentUser.role !== "student") {
        notify("Only students can reserve event passes.", "info");
        return;
    }

    const idx = registeredEventIds.indexOf(id);
    const target = events.find(e => e.id === id);
    const eventName = target ? target.name : `Event #${id}`;

    if (idx === -1) {
        registeredEventIds.push(id);
        saveRegistrations();
        render();
        notify(`Pass reserved successfully for "${eventName}"! Opening digital ticket...`, "success");
        setTimeout(() => {
            window.openTicketModal(id);
        }, 350);
    } else {
        registeredEventIds.splice(idx, 1);
        saveRegistrations();
        render();
        playClickSound();
        notify(`Registration cancelled for "${eventName}".`, "info");
    }
};

// --- KPI Updates with Animation & Mix Chart ---
let lastKpis = { total: 0, cap: 0, tech: 0, free: 0 };
function updateKpis() {
    const totalCount = events.length;
    const totalCap = events.reduce((sum, e) => sum + Number(e.capacity || 0), 0);
    const techCount = events.filter(e => e.category === "Technical" || e.category === "Hackathon").length;
    const freeCount = events.filter(e => e.regType === "Free").length;

    animateValue(kpiTotalEvents, lastKpis.total, totalCount, 400);
    animateValue(kpiTotalCapacity, lastKpis.cap, totalCap, 400);
    animateValue(kpiTechCount, lastKpis.tech, techCount, 400);
    animateValue(kpiFreeCount, lastKpis.free, freeCount, 400);

    lastKpis = { total: totalCount, cap: totalCap, tech: techCount, free: freeCount };

    updateCategoryMix();
}

// --- Category Badge Mapper ---
function getCategoryClass(cat) {
    switch (cat) {
        case "Technical": return "cat-tech";
        case "Hackathon": return "cat-hack";
        case "Workshop": return "cat-work";
        case "Seminar": return "cat-semi";
        case "Cultural": return "cat-cult";
        case "Sports": return "cat-spor";
        default: return "cat-tech";
    }
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formatted = ((hour + 11) % 12 + 1);
    return `${formatted}:${m} ${suffix}`;
}

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, t => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[t] || t));
}

// --- Query, Sort & Filter Engine ---
function getProcessedEvents() {
    let list = [...events];

    // 1. Search Query
    if (currentSearch) {
        const q = currentSearch.toLowerCase();
        list = list.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            (e.organizer && e.organizer.toLowerCase().includes(q)) ||
            e.id.toString().includes(q)
        );
    }

    // 2. Category Filter
    if (currentCategory !== "all") {
        list = list.filter(e => e.category === currentCategory);
    }

    // 3. Sorting
    list.sort((a, b) => {
        if (currentSort === "date-asc") return new Date(a.date) - new Date(b.date);
        if (currentSort === "date-desc") return new Date(b.date) - new Date(a.date);
        if (currentSort === "capacity-desc") return Number(b.capacity) - Number(a.capacity);
        if (currentSort === "name-asc") return a.name.localeCompare(b.name);
        return 0;
    });

    return list;
}

// --- Render Engine with Strict Role Permissions ---
function render() {
    const list = getProcessedEvents();
    directorySubtitle.textContent = `Showing ${list.length} of ${events.length} listed events`;

    const isStudent = currentUser && currentUser.role === "student";
    const isOrganizer = currentUser && currentUser.role === "organizer";

    // 1. Render Table View
    eventsTableBody.innerHTML = "";
    if (list.length === 0) {
        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-tertiary);">
                    No events matched your current search filters.
                </td>
            </tr>
        `;
    } else {
        list.forEach(evt => {
            const tr = document.createElement("tr");
            const catBadge = getCategoryClass(evt.category);
            const passBadge = evt.regType === "Free" ? "pass-free" : "pass-paid";
            const calBadge = renderCalendarBadge(evt.date);
            const fillMeta = getCapacityFillMeta(evt);
            const catIcon = getCategoryEmoji(evt.category);

            // Determine action buttons based on user role
            let actionButtonsHTML = "";
            if (isStudent) {
                // Students only see View Details (misuse protected - no edit or delete)
                const isReg = registeredEventIds.includes(evt.id);
                actionButtonsHTML = `
                    <button type="button" class="btn-sm btn-view" onclick="openDetails(${evt.id})" title="View Specifications">Details</button>
                    <button type="button" class="btn-register-action ${isReg ? 'registered' : ''}" onclick="toggleRegistration(${evt.id})">${isReg ? '&#10004; Registered' : 'Reserve Pass'}</button>
                    ${isReg ? `<button type="button" class="btn-sm" onclick="openTicketModal(${evt.id})" title="View Digital Pass Ticket" style="background: var(--purple-light); color: var(--purple); font-weight: 700;">🎟️ Pass</button>` : ''}
                `;
            } else if (isOrganizer) {
                // Organizer can View and Edit
                actionButtonsHTML = `
                    <button type="button" class="btn-sm btn-view" onclick="openDetails(${evt.id})">View</button>
                    <button type="button" class="btn-sm btn-edit" onclick="openEditModal(${evt.id})">Edit</button>
                `;
            } else {
                // Admin has full control
                actionButtonsHTML = `
                    <button type="button" class="btn-sm btn-view" onclick="openDetails(${evt.id})">View</button>
                    <button type="button" class="btn-sm btn-edit" onclick="openEditModal(${evt.id})">Edit</button>
                    <button type="button" class="btn-sm btn-delete" onclick="deleteEvent(${evt.id})">Delete</button>
                `;
            }

            tr.innerHTML = `
                <td><strong>#${evt.id}</strong></td>
                <td class="title-cell">
                    <strong>${escapeHTML(evt.name)}</strong>
                    <small>${escapeHTML(evt.organizer || "MITS Faculty Coordinator")}</small>
                </td>
                <td><span class="badge-pill ${catBadge}">${catIcon} ${evt.category}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                        ${calBadge}
                        <div>
                            <div><strong>${evt.date}</strong></div>
                            <small style="color: var(--text-tertiary);">${formatTime(evt.time)}</small>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(evt.venue)}</td>
                <td>
                    <div>
                        <strong>${evt.capacity}</strong> Seats
                        <div class="capacity-track" style="height: 4px; width: 68px; margin-top: 4px;" title="${fillMeta.registeredCount} booked (${fillMeta.pct}%)">
                            <div class="capacity-fill ${fillMeta.fillClass}" style="width: ${fillMeta.pct}%;"></div>
                        </div>
                    </div>
                </td>
                <td><span class="badge-pill ${passBadge}">${evt.regType}</span></td>
                <td class="actions-cell">
                    ${actionButtonsHTML}
                </td>
            `;
            eventsTableBody.appendChild(tr);
        });
    }

    // 2. Render Cards View
    cardViewSection.innerHTML = "";
    if (list.length === 0) {
        cardViewSection.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-tertiary); background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--border);">
                No events found matching your criteria.
            </div>
        `;
    } else {
        list.forEach(evt => {
            const card = document.createElement("div");
            card.className = "event-card";
            const catBadge = getCategoryClass(evt.category);
            const passBadge = evt.regType === "Free" ? "pass-free" : "pass-paid";
            const calBadge = renderCalendarBadge(evt.date);
            const fillMeta = getCapacityFillMeta(evt);
            const catIcon = getCategoryEmoji(evt.category);

            let cardActionButtonsHTML = "";
            if (isStudent) {
                // Students only see Details & Register (misuse protected)
                const isReg = registeredEventIds.includes(evt.id);
                cardActionButtonsHTML = `
                    <button type="button" class="btn btn-secondary btn-sm" onclick="openDetails(${evt.id})">Details</button>
                    <button type="button" class="btn-register-action ${isReg ? 'registered' : ''}" onclick="toggleRegistration(${evt.id})">${isReg ? '&#10004; Registered' : 'Reserve Pass'}</button>
                    ${isReg ? `<button type="button" class="btn btn-sm" onclick="openTicketModal(${evt.id})" title="View Digital Pass Ticket" style="background: linear-gradient(135deg, var(--primary), var(--purple)); color: #fff; font-weight: 700;">🎟️ Pass</button>` : ''}
                `;
            } else if (isOrganizer) {
                cardActionButtonsHTML = `
                    <button type="button" class="btn btn-secondary btn-sm" onclick="openDetails(${evt.id})">Details</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="openEditModal(${evt.id})">Edit</button>
                `;
            } else {
                cardActionButtonsHTML = `
                    <button type="button" class="btn btn-secondary btn-sm" onclick="openDetails(${evt.id})">Details</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="openEditModal(${evt.id})">Edit</button>
                    <button type="button" class="btn btn-delete btn-sm" onclick="deleteEvent(${evt.id})">Delete</button>
                `;
            }

            card.innerHTML = `
                <div>
                    <div class="card-top">
                        <div style="display: flex; align-items: center; gap: 0.65rem;">
                            ${calBadge}
                            <div>
                                <span class="card-id">#${evt.id}</span>
                                <h4 class="card-title" style="margin: 0; font-size: 1.05rem;">${escapeHTML(evt.name)}</h4>
                            </div>
                        </div>
                        <span class="badge-pill ${catBadge}">${catIcon} ${evt.category}</span>
                    </div>
                    <p class="card-desc" style="margin-top: 0.65rem;">${escapeHTML(evt.desc || "No description provided.")}</p>
                    <div class="card-meta-list">
                        <div>&#128197; <strong>Schedule:</strong> ${evt.date} (${formatTime(evt.time)})</div>
                        <div>&#128205; <strong>Venue:</strong> ${escapeHTML(evt.venue)}</div>
                        <div>&#127891; <strong>Organizer:</strong> ${escapeHTML(evt.organizer || "MITS CSE Department")}</div>
                        <div class="capacity-bar-wrap">
                            <div class="capacity-bar-header">
                                <span>Capacity: <strong>${evt.capacity} Seats</strong> (${fillMeta.registeredCount} booked)</span>
                                <span style="font-weight: 700; color: var(--text-primary);">${fillMeta.pct}% Full</span>
                            </div>
                            <div class="capacity-track">
                                <div class="capacity-fill ${fillMeta.fillClass}" style="width: ${fillMeta.pct}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    ${cardActionButtonsHTML}
                </div>
            `;
            cardViewSection.appendChild(card);
        });
    }

    updateKpis();
}

// --- View Switcher ---
tableViewBtn.addEventListener("click", () => {
    playClickSound();
    currentView = "table";
    tableViewBtn.classList.add("active");
    cardViewBtn.classList.remove("active");
    tableViewSection.classList.remove("hidden");
    cardViewSection.classList.add("hidden");
});

cardViewBtn.addEventListener("click", () => {
    playClickSound();
    currentView = "cards";
    cardViewBtn.classList.add("active");
    tableViewBtn.classList.remove("active");
    cardViewSection.classList.remove("hidden");
    tableViewSection.classList.add("hidden");
});

// --- Search, Filter & Sort Listeners ---
liveSearchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    render();
});

categoryTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    playClickSound();
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    render();
});

sortBySelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
});

// --- Modal Workflows with Security Guards ---
function showModal() {
    eventModal.classList.remove("hidden");
    eventModal.setAttribute("aria-hidden", "false");
}

function hideModal() {
    eventModal.classList.add("hidden");
    eventModal.setAttribute("aria-hidden", "true");
    eventModalForm.reset();
}

openAddModalBtn.addEventListener("click", () => {
    playClickSound();
    if (currentUser && currentUser.role === "student") {
        if (confirm("Notice: Student accounts are restricted to View-Only mode.\n\nWould you like to switch to Faculty Organizer mode now to schedule new campus events?")) {
            switchUserRole("organizer");
            setTimeout(() => {
                editModeFlag.value = "false";
                modalTitle.textContent = "Add New Event";
                modalBadge.textContent = "Create";
                document.getElementById("formEventId").disabled = false;
                showModal();
            }, 100);
        } else {
            notify("Access Restricted: Switch to Faculty Organizer or Admin to create events.", "info");
        }
        return;
    }
    editModeFlag.value = "false";
    modalTitle.textContent = "Add New Event";
    modalBadge.textContent = "Create";
    document.getElementById("formEventId").disabled = false;
    showModal();
});

closeModalBtn.addEventListener("click", hideModal);
cancelModalBtn.addEventListener("click", hideModal);

window.openEditModal = function(id) {
    playClickSound();
    if (currentUser && currentUser.role === "student") {
        if (confirm("Notice: Students are in read-only mode and cannot edit events.\n\nWould you like to switch to Faculty Organizer mode now to edit this event?")) {
            switchUserRole("organizer");
            setTimeout(() => {
                window.openEditModal(id);
            }, 100);
        } else {
            notify("Access Restricted: Students are in read-only mode and cannot edit events.", "danger");
        }
        return;
    }

    const target = events.find(e => e.id === id);
    if (!target) return;

    editModeFlag.value = "true";
    modalTitle.textContent = `Update Event #${target.id}`;
    modalBadge.textContent = "Edit Mode";

    const idInput = document.getElementById("formEventId");
    idInput.value = target.id;
    idInput.disabled = true; // Protect ID from modification

    document.getElementById("formEventName").value = target.name;
    document.getElementById("formEventCategory").value = target.category;
    document.getElementById("formEventDate").value = target.date;
    document.getElementById("formEventTime").value = target.time || "10:00";
    document.getElementById("formEventVenue").value = target.venue;
    document.getElementById("formEventCapacity").value = target.capacity;
    document.getElementById("formEventOrganizer").value = target.organizer || "";
    document.getElementById("formEventDesc").value = target.desc || "";

    const regRadio = document.querySelector(`input[name="formRegType"][value="${target.regType}"]`);
    if (regRadio) regRadio.checked = true;

    showModal();
};

eventModalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (currentUser && currentUser.role === "student") {
        notify("Access Denied: Students are not permitted to save or modify events.", "danger");
        hideModal();
        return;
    }

    const isEdit = editModeFlag.value === "true";
    const id = parseInt(document.getElementById("formEventId").value, 10);
    const name = document.getElementById("formEventName").value.trim();
    const category = document.getElementById("formEventCategory").value;
    const date = document.getElementById("formEventDate").value;
    const time = document.getElementById("formEventTime").value;
    const venue = document.getElementById("formEventVenue").value.trim();
    const capacity = parseInt(document.getElementById("formEventCapacity").value, 10);
    const organizer = document.getElementById("formEventOrganizer").value.trim();
    const desc = document.getElementById("formEventDesc").value.trim();
    const regType = document.querySelector('input[name="formRegType"]:checked').value;

    if (!isEdit) {
        // Uniqueness validation
        if (events.some(evt => evt.id === id)) {
            notify(`Event ID #${id} is already in use. Please enter a unique ID.`, "danger");
            return;
        }

        const newEvent = { id, name, category, date, time, venue, capacity, organizer, desc, regType };
        events.push(newEvent);
        notify(`Event "${name}" added successfully!`, "success");
    } else {
        const idx = events.findIndex(evt => evt.id === id);
        if (idx !== -1) {
            events[idx] = { id, name, category, date, time, venue, capacity, organizer, desc, regType };
            notify(`Event #${id} updated successfully!`, "success");
        }
    }

    saveEvents();
    render();
    hideModal();
});

// --- Details Modal (Read-Only Inspection for all, with student registration) ---
window.openDetails = function(id) {
    const target = events.find(e => e.id === id);
    if (!target) return;

    const isReg = registeredEventIds.includes(target.id);
    let studentRegSection = "";
    if (currentUser && currentUser.role === "student") {
        studentRegSection = `
            <div style="margin-top: 1rem; padding: 0.85rem; background: var(--bg-subtle); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                <div>
                    <strong style="font-size: 0.85rem; display: block; color: var(--text-primary);">Student Pass Reservation:</strong>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${isReg ? 'You hold a confirmed seat for this event.' : 'Seats available. Reserve your free/entry pass now.'}</span>
                </div>
                <button type="button" class="btn-register-action ${isReg ? 'registered' : ''}" onclick="toggleRegistration(${target.id}); openDetails(${target.id});">
                    ${isReg ? '&#10004; Registered (Click to cancel)' : 'Reserve Seat Now'}
                </button>
            </div>
        `;
    }

    detailContent.innerHTML = `
        <div class="detail-row">
            <span>Event ID:</span>
            <span>#${target.id}</span>
        </div>
        <div class="detail-row">
            <span>Title:</span>
            <span>${escapeHTML(target.name)}</span>
        </div>
        <div class="detail-row">
            <span>Category:</span>
            <span><span class="badge-pill ${getCategoryClass(target.category)}">${target.category}</span></span>
        </div>
        <div class="detail-row">
            <span>Date & Time:</span>
            <span>${target.date} at ${formatTime(target.time)}</span>
        </div>
        <div class="detail-row">
            <span>Venue:</span>
            <span>${escapeHTML(target.venue)}</span>
        </div>
        <div class="detail-row">
            <span>Max Capacity:</span>
            <span>${target.capacity} Registered Seats</span>
        </div>
        <div class="detail-row">
            <span>Pass Type:</span>
            <span>${target.regType} Entry</span>
        </div>
        <div class="detail-row">
            <span>Organizer:</span>
            <span>${escapeHTML(target.organizer || "MITS CSE Department")}</span>
        </div>
        <div style="margin-top: 0.5rem;">
            <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Summary / Overview:</span>
            <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--text-primary); line-height: 1.4;">${escapeHTML(target.desc || "No additional notes provided.")}</p>
        </div>
        ${studentRegSection}
    `;

    detailsModal.classList.remove("hidden");
    detailsModal.setAttribute("aria-hidden", "false");
};

function hideDetailsModal() {
    detailsModal.classList.add("hidden");
    detailsModal.setAttribute("aria-hidden", "true");
}

closeDetailModalBtn.addEventListener("click", hideDetailsModal);
doneDetailBtn.addEventListener("click", hideDetailsModal);

// --- Delete Workflow with Admin Guard ---
window.deleteEvent = function(id) {
    if (!currentUser || currentUser.role !== "admin") {
        notify("Access Restricted: Only Administrators are permitted to delete events.", "danger");
        return;
    }

    const target = events.find(e => e.id === id);
    if (!target) return;

    if (confirm(`Confirm deletion of "${target.name}" (ID #${target.id})? This action cannot be undone.`)) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        render();
        notify(`Event #${id} deleted from directory.`, "danger");
    }
};

// --- Export CSV ---
exportCsvBtn.addEventListener("click", () => {
    if (events.length === 0) {
        notify("No event records available to export.", "info");
        return;
    }

    const headers = ["ID", "Name", "Category", "Date", "Time", "Venue", "Capacity", "Organizer", "RegistrationType", "Description"];
    const rows = events.map(e => [
        e.id,
        `"${(e.name || "").replace(/"/g, '""')}"`,
        e.category,
        e.date,
        e.time,
        `"${(e.venue || "").replace(/"/g, '""')}"`,
        e.capacity,
        `"${(e.organizer || "").replace(/"/g, '""')}"`,
        e.regType,
        `"${(e.desc || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EventSphere_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify("Event directory exported to CSV successfully!", "success");
});

// --- Reset to Demo Data with Admin Guard ---
resetDemoBtn.addEventListener("click", () => {
    if (!currentUser || currentUser.role !== "admin") {
        notify("Access Restricted: Only Administrators can reset the system demo data.", "danger");
        return;
    }

    if (confirm("Reset the entire event directory to initial demo events?")) {
        events = [...DEFAULT_EVENTS];
        saveEvents();
        render();
        notify("Demo events restored.", "info");
    }
});

// --- Global Keyboard Shortcuts ---
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideModal();
        hideDetailsModal();
        hideTicketModal();
        if (profileDropdown) profileDropdown.classList.add("hidden");
    }
});

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    initDashboardTheme();
    // If no user is logged in, default to null so the Login Homepage is shown
    updateAuthUI();
    render();
});
