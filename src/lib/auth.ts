export function getIsAdmin(): boolean {
  try {
    return localStorage.getItem("isAdmin") === "true";
  } catch {
    return false;
  }
}

export function setIsAdmin(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
  } catch {
    // ignore
  }
}
