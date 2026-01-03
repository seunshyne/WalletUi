import { defineStore } from "pinia";

import router from "@/router";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: null,
        wallet: null,
        errors: {},
        message: "",
    }),
    actions: {
        async getUser() {
            if (!localStorage.getItem("token")) return;


            try {
                const res = await fetch("/api/user", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")} ` },
                });
                const data = await res.json();

                if (res.ok) {
                    this.user = data.user ?? data; // in case API returns user directly
                    await this.fetchWallet();
                } else {
                    console.error("Failed to get user:", data);
                }
            } catch (err) {
                console.error("Failed to get user:", err);
            }
        },

        async authenticate(apiRoute, formData) {
            this.errors = {};
            this.message = "";

            try {
                const res = await fetch(`/api/auth/${apiRoute} `, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();

                // Handle login response

                if (apiRoute === "login") {

                    // Unverified email (returned as 403)
                    if (res.status === 403 && data.status === "unverified") {
                        router.push({
                            name: "verify-email",
                            query: { email: data.email || formData.email }
                        });
                        return { success: false, status: "unverified" };
                    }

                    // Successful login
                    if (res.ok && data.token) {
                        localStorage.setItem("token", data.token);
                        this.user = data.user;
                        this.wallet = data.wallet || null;
                        this.message = data.message || "Login successful";
                        this.status = data.status || null;
                        router.push({ name: "dashboard" });
                        return { success: true, type: "login" };
                    }
                    // Other login errors
                    this.errors = data.errors || data.error || { general: "Login failed" };
                    this.message = data.message || "";
                    return { success: false };

                }

                // Handle Register response
                if (apiRoute === "register") {
                    if (res.ok) {
                        this.message = data.message || "Registration successful. Please check your inbox to verify email.";
                        router.push({
                            name: "verify-email",
                            query: { email: formData.email }
                        });
                        return { success: true, type: "register" };
                    } else {
                        // Registration errors
                        this.errors = data.errors || data.error || { general: "Registration failed" };
                        this.message = data.message || "";
                        return { success: false };
                    }
                }

            } catch (err) {

                console.error("Network error:", err);
                this.errors = { network: "Connection failed. Please try again." };
                return false;
            }
        },

        async resendVerification(email) {
            if (!email) throw new Error("Email is required to resend verification");

            const res = await fetch("/api/email/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend email");
            }
            // Success
            return data.message || "Verification email resent successfully";
        },

        async logout() {
            try {
                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")} ` },
                });
                if (res.ok) {
                    this.user = null;
                    this.wallet = null;
                    this.errors = {};
                    localStorage.removeItem("token");
                    router.push({ name: "login" });
                }
            } catch (err) {
                console.error("Logout error:", err);
            }
        },

        async fetchWallet() {
            if (!localStorage.getItem("token")) return null;

            try {
                const res = await fetch("/api/wallet", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")} ` },
                });
                const data = await res.json();

                if (res.ok) {
                    // Ensure wallet object is present
                    this.wallet = data.wallet ?? data;
                    return this.wallet;
                } else {
                    console.error("Failed to fetch wallet:", data);
                    return null;
                }
            } catch (err) {
                console.error("Failed to fetch wallet:", err);
                return null;
            }
        },

        updateWalletBalance(newBalance) {
            if (this.wallet) {
                this.wallet.balance = newBalance;
            }
        },

    },
    getters: {
        isAuthenticated: (state) => !!localStorage.getItem("token") && !!state.user,
        getUserWallet: (state) => state.wallet,
        getWalletBalance: (state) => state.wallet?.balance ?? 0,
        getWalletAddress: (state) => state.wallet?.address ?? "",
        getWalletCurrency: (state) => state.wallet?.currency ?? "NGN",
    },
});
