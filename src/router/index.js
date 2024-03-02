import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
// Mode View 
import NormalMode from '@/views/NormalMode.vue';
import SpecialMode from '@/views/SpecialMode.vue';
import Leaderboard from '@/views/Leaderboard.vue';
// Dashboard
// Auth 
import LoginView from '@/views/auth/Login.vue';
import SignUpView from '@/views/auth/Signup.vue';
import ProfileView from '@/views/auth/Profile.vue';
// Admin View
import AdminDashBoard from '@/views/admin/AdminDashboard.vue';
import AdminUser from '@/views/admin/AdminUser.vue';

// Not Found view
import NotFound from '@/views/error/NotFound.vue'
import MainMobile from '@/views/error/MainMobile.vue';

const routes = [{
        path: "/",
        name: "normal",
        component: NormalMode,
    },
    {
        path: "/special",
        name: "special",
        component: SpecialMode,
    },
    {
        path: '/leaderboard',
        name: "leaderboard",
        component: Leaderboard,
    },
  
    {
        path: "/profile",
        name: "profile",
        component: ProfileView,
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
    },

    {
        path: "/signup",
        name: "signup",
        component: SignUpView,
    },

    {
        path: "/mobile",
        name: "mobile",
        component: MainMobile,
    },
    {
        path: "/admin/dashboard",
        name: "admin-dashboard",
        component: AdminDashBoard,
    },
    {
        path: "/admin/users",
        name: "admin-users",
        component: AdminUser,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
const isMobile = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width <= 760) {
        return true;
    } else {
        return false;
    }
}


router.beforeEach(async(to, from, next) => {
    const authStore = useAuthStore();
    await authStore.checkAuthState();
    if (isMobile() && to.name !== "mobile") {
        next({ name: "mobile" });
    } else if (!isMobile() && to.name === 'mobile') {
        next({ name: "normal" });
    } else if (!isMobile() && to.name.includes('admin') && !authStore.isAdmin) {
        next({ name: "normal" });
    } else if (!isMobile() && to.name !== 'login' && to.name !== 'signup' && !authStore.isLoggedIn) {
        next({ name: "login" });
    } else if (!isMobile() && (to.name === 'login' || to.name === 'signup') && authStore.isLoggedIn) {
        next({ name: 'normal' });
    } else if (!isMobile() && !to.name.includes('admin') && authStore.isLoggedIn && authStore.isAdmin) {
        next({ name: 'admin-dashboard' });
    } else {
        next();
    }
})



export default router;
