// Wrapper sécurisé autour de localStorage
// Protège contre les throws en navigation privée / navigateurs restrictifs

const storage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn(`[storage] localStorage.getItem("${key}") indisponible :`, err.message);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn(`[storage] localStorage.setItem("${key}") indisponible :`, err.message);
      return false;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[storage] localStorage.removeItem("${key}") indisponible :`, err.message);
    }
  },
};

export default storage;
