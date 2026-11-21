/**
 * EventSphere - Authentication & Home Page Script
 * Lead Developer: Aalekh Kaushik | B.Tech CSE | MITS Gwalior
 * Manages Home Page interactions, Tab switching, User Registration, and Login
 */

const AUTH_STORAGE_KEY = "eventsphere_auth_user";
const USERS_STORAGE_KEY = "eventsphere_registered_users";

// Default Preset System Accounts with Passwords
const PRESET_ACCOUNTS = {
    admin: {
        id: "ADM-101",
        password: "admin123",
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
        password: "organizer123",
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
        password: "student123",
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

// Initialize Registered Users Database if not present
function getRegisteredUsers() {
    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to read registered users:", e);
    }
    // Seed with preset accounts
    const initial = Object.values(PRESET_ACCOUNTS);
    saveRegisteredUsers(initial);
    return initial;
}

function saveRegisteredUsers(users) {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save registered users:", e);
    }
}

function getCurrentUser() {
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    try {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (e) {
        console.error("Failed to save current user:", e);
    }
}

// Toast Notification
function notify(message, type = "success") {
    const toastBox = document.getElementById("toastNotification");
    if (!toastBox) return;
    toastBox.textContent = message;
    toastBox.className = `toast-box show toast-${type}`;
    setTimeout(() => {
        toastBox.className = "toast-box";
    }, 3200);
}

// Role Visual Helpers
function getRoleMeta(role, id) {
    const cleanId = (id || "USR").trim();
    const avatar = cleanId.slice(0, 2).toUpperCase();
    if (role === "admin") {
        return {
            role: "admin",
            roleLabel: "Administrator",
            permission: "Full Managerial Access (Add, Edit, Delete, Reset)",
            avatarText: avatar,
            avatarClass: "avatar-admin",
            pillClass: "pill-admin"
        };
    } else if (role === "organizer") {
        return {
            role: "organizer",
            roleLabel: "Event Organizer",
            permission: "Organizer Access (Create & Edit Events)",
            avatarText: avatar,
            avatarClass: "avatar-organizer",
            pillClass: "pill-organizer"
        };
    } else {
        return {
            role: "student",
            roleLabel: "Student / Viewer",
            permission: "Read-Only Access (View Details, Reserve Passes)",
            avatarText: avatar,
            avatarClass: "avatar-student",
            pillClass: "pill-student"
        };
    }
}

// DOM Setup on Page Load
document.addEventListener("DOMContentLoaded", () => {
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabSignupBtn = document.getElementById("tabSignupBtn");
    const loginTabPane = document.getElementById("loginTabPane");
    const signupTabPane = document.getElementById("signupTabPane");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const activeSessionCard = document.getElementById("activeSessionCard");
    const activeSessionName = document.getElementById("activeSessionName");
    const activeSessionRole = document.getElementById("activeSessionRole");
    const activeSessionId = document.getElementById("activeSessionId");
    const activeSessionAvatar = document.getElementById("activeSessionAvatar");
    const homeLogoutBtn = document.getElementById("homeLogoutBtn");

    // Check Active Session
    function checkActiveSession() {
        const user = getCurrentUser();
        if (user && activeSessionCard) {
            activeSessionCard.classList.remove("hidden");
            if (activeSessionName) activeSessionName.textContent = user.name || "Authenticated User";
            if (activeSessionRole) activeSessionRole.textContent = user.roleLabel || user.role;
            if (activeSessionId) activeSessionId.textContent = `${user.id} (${user.email || ""})`;
            if (activeSessionAvatar) activeSessionAvatar.textContent = user.avatarText || user.id.slice(0, 2).toUpperCase();
        } else if (activeSessionCard) {
            activeSessionCard.classList.add("hidden");
        }
    }

    checkActiveSession();

    if (homeLogoutBtn) {
        homeLogoutBtn.addEventListener("click", () => {
            setCurrentUser(null);
            checkActiveSession();
            notify("You have been signed out.", "info");
        });
    }

    // Tab Switching
    if (tabLoginBtn && tabSignupBtn) {
        tabLoginBtn.addEventListener("click", () => {
            tabLoginBtn.classList.add("active");
            tabSignupBtn.classList.remove("active");
            loginTabPane.classList.remove("hidden");
            signupTabPane.classList.add("hidden");
        });

        tabSignupBtn.addEventListener("click", () => {
            tabSignupBtn.classList.add("active");
            tabLoginBtn.classList.remove("active");
            signupTabPane.classList.remove("hidden");
            loginTabPane.classList.add("hidden");
        });
    }

    // Password Visibility Toggles
    document.querySelectorAll(".toggle-password-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;
            if (input.type === "password") {
                input.type = "text";
                btn.textContent = "🙈";
                btn.title = "Hide password";
            } else {
                input.type = "password";
                btn.textContent = "👁️";
                btn.title = "Show password";
            }
        });
    });

    // Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const idOrEmail = document.getElementById("loginId").value.trim();
            const password = document.getElementById("loginPassword").value;
            const selectedRole = document.getElementById("loginRole").value;

            if (!idOrEmail) {
                notify("Please enter your Institutional ID or Email.", "danger");
                return;
            }
            if (!password) {
                notify("Please enter your password.", "danger");
                return;
            }

            const users = getRegisteredUsers();
            const matchedUser = users.find(u => 
                (u.id && u.id.toLowerCase() === idOrEmail.toLowerCase()) || 
                (u.email && u.email.toLowerCase() === idOrEmail.toLowerCase())
            );

            let sessionUser = null;

            if (matchedUser) {
                // Verify password
                if (matchedUser.password && matchedUser.password !== password) {
                    notify("Incorrect password. Try again or use preset accounts.", "danger");
                    return;
                }
                sessionUser = { ...matchedUser };
                if (selectedRole && selectedRole !== "auto" && selectedRole !== sessionUser.role) {
                    // Update role meta if explicitly changed
                    const meta = getRoleMeta(selectedRole, sessionUser.id);
                    Object.assign(sessionUser, meta);
                }
            } else {
                // If not in database, create user session for flexible testing
                let inferredRole = selectedRole !== "auto" ? selectedRole : "student";
                if (idOrEmail.toUpperCase().startsWith("ADM")) inferredRole = "admin";
                else if (idOrEmail.toUpperCase().startsWith("ORG")) inferredRole = "organizer";

                const meta = getRoleMeta(inferredRole, idOrEmail);
                sessionUser = {
                    id: idOrEmail.toUpperCase(),
                    name: `${meta.roleLabel} (${idOrEmail.toUpperCase()})`,
                    email: idOrEmail.includes("@") ? idOrEmail : `${idOrEmail.toLowerCase()}@mits.ac.in`,
                    password: password,
                    ...meta
                };

                // Add to registered users
                users.push(sessionUser);
                saveRegisteredUsers(users);
            }

            // Save active session
            setCurrentUser(sessionUser);
            notify(`Login successful! Entering dashboard as ${sessionUser.roleLabel}...`, "success");

            // Redirect to Dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 600);
        });
    }

    // Handle Sign Up Submit
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const id = document.getElementById("signupId").value.trim().toUpperCase();
            const email = document.getElementById("signupEmail").value.trim();
            const role = document.getElementById("signupRole").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("signupConfirmPassword").value;

            if (!name || !id || !email || !password) {
                notify("All fields are required to register.", "danger");
                return;
            }

            if (password !== confirmPassword) {
                notify("Passwords do not match. Please re-check.", "danger");
                return;
            }

            if (password.length < 4) {
                notify("Password must be at least 4 characters long.", "danger");
                return;
            }

            const users = getRegisteredUsers();
            const existing = users.find(u => u.id.toLowerCase() === id.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());

            if (existing) {
                notify(`An account with ID "${id}" or email "${email}" already exists. Please log in.`, "info");
                // Switch to login tab
                if (tabLoginBtn) tabLoginBtn.click();
                const loginIdField = document.getElementById("loginId");
                if (loginIdField) loginIdField.value = id;
                return;
            }

            const meta = getRoleMeta(role, id);
            const newUser = {
                id: id,
                name: name,
                email: email,
                password: password,
                ...meta
            };

            users.push(newUser);
            saveRegisteredUsers(users);

            // Log user in automatically
            setCurrentUser(newUser);
            notify(`Account created successfully! Welcome, ${name}. Moving to dashboard...`, "success");

            // Move to Dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);
        });
    }
});

// Quick 1-Click Role Login
window.quickLogin = function(role) {
    if (PRESET_ACCOUNTS[role]) {
        const user = PRESET_ACCOUNTS[role];
        setCurrentUser(user);
        notify(`Logging in as ${user.roleLabel} (${user.id}). Moving to dashboard...`, "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);
    }
};
