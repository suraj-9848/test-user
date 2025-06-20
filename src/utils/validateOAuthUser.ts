export async function validateOAuthUser(sessionJwt: string) {
  try {
    const response = await fetch("http://localhost:4000/auth/validate-oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionJwt}`,
      },
    });

    if (!response.ok) {
      // Not a valid user or some error
      return { valid: false, error: await response.json() };
    }

    const data = await response.json();
    return { valid: true, user: data.user };
  } catch (error) {
    return { valid: false, error };
  }
} 