const BASE_URL = "http://localhost:8080";

export async function fetchRecommendation(location) {
  const res = await fetch(`${BASE_URL}/api/recommend?location=${location}`);
  return await res.json();
}

export async function askLoveAdvice(message) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  return await res.json();
}
