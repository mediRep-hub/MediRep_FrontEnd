import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey:
        "BJMUUFoaLiKzz3eVeGRwFFzm63T5dKjZ1OC-IvDwU7TGWo0-A7ENiH7S3oJMU2t-k6bRw-U35dy0jz08mSHx4cs",
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);
    return token;
  } catch (error) {
    console.error("FCM error:", error);
    return null;
  }
};
