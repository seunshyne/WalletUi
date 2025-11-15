import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("authStore", {
    state: () => {
        return {
            user: null,
            errors: {},
            message: "", // Changed from {} to string
        };
    },
    actions: {
        // Get authenticated user
        async getUser() {
            if (localStorage.getItem('token')) {
                try {
                    const res = await fetch('/api/user', {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        this.user = data;
                    }
                    console.log(data);
                } catch (error) {
                    console.error('Failed to get user:', error);
                }
            }
        },

        // Login or Register user
        async authenticate(apiRoute, formData) {
            // Clear previous state
            this.errors = {};
            this.message = '';

            try {
                console.log('🔍 Sending request to:', `/api/auth/${apiRoute}`);

                const res = await fetch(`/api/auth/${apiRoute}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();
                console.log('📡 API Response status:', res.status);
                console.log('📄 API Response data:', data);

                // Handle success case
                if (res.ok && data.token) {
                    console.log('🎉 SUCCESS: Registration successful');

                    // Store token
                    try {
                        localStorage.setItem('token', data.token);
                        console.log('💾 Token stored:', data.token ? 'Yes' : 'No');
                    } catch (storageError) {
                        console.error('❌ Token storage failed:', storageError);
                        this.errors = { storage: 'Failed to save session' };
                        return false;
                    }

                    // Update state
                    this.user = data.user;
                    this.message = data.message;
                    console.log('👤 User set:', data.user ? 'Yes' : 'No');
                    console.log('💬 Message:', this.message);

                    return true;
                } else {
                    // Handle error case
                    console.log('❌ API returned error');
                    this.errors = data.errors || data.error || { general: 'Authentication failed' };
                    return false;
                }

            } catch (error) {
                console.error('💥 Network error:', error);
                this.errors = { network: 'Connection failed. Please try again.' };
                return false;
            }
        },

        // Logout User
        async logout() {
            try {
                const res = await fetch('/api/auth/logout', {
                    method: 'post',
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    this.user = null;
                    this.errors = {};
                    localStorage.removeItem('token');


                    this.router.push({ name: "dashboard" });
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    },
});