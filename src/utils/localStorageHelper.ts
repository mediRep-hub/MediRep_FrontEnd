export function setItem<T>(key: string, value: T, callback?: () => void): void {
  if (typeof window === "undefined") return;

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);

    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
}

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return null;
  }
}
