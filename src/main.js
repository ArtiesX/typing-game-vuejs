import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaLock, FaKeyboard, FaCrown, RiSettingsFill, GiPerspectiveDiceSixFacesRandom, BiMoonStarsFill, FaUserCircle, BiSunFill, RiComputerLine, IoTime, IoText, MdRestartaltRound  } from "oh-vue-icons/icons";
import './style.css'
import App from './App.vue'
import router from './router'

addIcons(FaLock, FaKeyboard, FaCrown, RiSettingsFill, GiPerspectiveDiceSixFacesRandom, BiMoonStarsFill, BiSunFill, RiComputerLine, FaUserCircle, IoTime, IoText,MdRestartaltRound)
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('v-icon', OhVueIcon);
app.mount("#app")