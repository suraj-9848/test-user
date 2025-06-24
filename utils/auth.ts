// Deprecated: validateOAuthUser is no longer needed. All backend auth is handled via /api/auth/exchange.
// This file can be removed if not used elsewhere.

// export async function validateOAuthUser(sessionJwt: string) {
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
//   try {
//     const response = await fetch(`${baseURL}/api/auth/google-login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${sessionJwt}`,
//       },
//     });
//
//     if (!response.ok) {
//       // Not a valid user or some error
//       return { valid: false, error: await response.json() };
//     }
//
//     const data = await response.json();
//     return { valid: true, data: data };
//   } catch (error) {
//     return { valid: false, error };
//   }
// }
