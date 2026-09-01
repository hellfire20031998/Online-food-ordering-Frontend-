import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      register: 'Register',
      login: 'Login',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      role: 'Role',
      already_have_account: 'Already have an account?',
      dont_have_account: "Don't have an account?",
      login_failed: 'Login failed',
      registration_failed: 'Registration failed',
      assign_role_to_restaurant: 'Assign Role to Restaurant',
      create_and_assign: 'Create and Assign',
    },
  },
  hi: {
    translation: {
      welcome: 'स्वागत है',
      register: 'पंजीकरण करें',
      login: 'लॉग इन करें',
      fullName: 'पूरा नाम',
      email: 'ईमेल',
      password: 'पासवर्ड',
      role: 'भूमिका',
      already_have_account: 'पहले से खाता है?',
      dont_have_account: 'खाता नहीं है?',
      login_failed: 'लॉगिन विफल रहा',
      registration_failed: 'पंजीकरण विफल रहा',
      assign_role_to_restaurant: 'रेस्तरां के लिए भूमिका सौंपें',
      create_and_assign: 'बनाएं और सौंपें',
    },
  },
};

i18n
  .use(LanguageDetector) // Detect saved/browser language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      // NavBar stores the chosen language under "lang".
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
