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

                //LOGIN
                if (res.ok && apiRoute === "login" && data.token) {
                    localStorage.setItem("token", data.token);
                    this.user = data.user;
                    this.wallet = data.wallet;
                    return { success: true, type: 'login' };
                }
                //REGISTER
                if (res.ok && apiRoute === "register") {
                    this.message = data.message || "Registration successful. Please verify your email.";
                    return { success: true, type: 'register' };
                }

                this.errors = data.errors || data.error || { general: "Authentication failed" };
                return { success: false };

            } catch (err) {
                console.error("Network error:", err);
                this.errors = { network: "Connection failed. Please try again." };
                return { success: false };
            }
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
