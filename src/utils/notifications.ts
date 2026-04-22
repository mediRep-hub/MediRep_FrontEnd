import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFCMToken = async () => {
  try {
    console.log("🚀 STEP 1 support");

    const supported = await isSupported();
    if (!supported) return null;

    console.log("🔔 STEP 2 permission");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    console.log("⚙️ STEP 3 waiting SW");

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // 🔥 IMPORTANT FIX
    await navigator.serviceWorker.ready;

    console.log("📡 STEP 4 get token");

    const token = await getToken(messaging, {
      vapidKey:
        "BIrtm4sqdvgOvPsSIE4GGxo_v1urJCDylltNdZChPVXRICK0dywLjCFo6HaBy2SIxMK-GG5sWY1Zno-tDsnlUfM",
      serviceWorkerRegistration: registration,
    });

    console.log("📱 FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.log("❌ FCM ERROR:", error);
    return null;
  }
};
