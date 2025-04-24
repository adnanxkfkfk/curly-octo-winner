const FIREBASE_BASE = "https://fran-eb915-default-rtdb.asia-southeast1.firebasedatabase.app";

export const saveToFirebase = async (path: string, data: any) => {
  const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const patchFirebase = async (path: string, data: any) => {
  const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getFirebase = async (path: string) => {
  const res = await fetch(`${FIREBASE_BASE}/${path}.json`);
  return res.json();
};
