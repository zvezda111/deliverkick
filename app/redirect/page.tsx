"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

export default function RedirectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const creds = useMemo(() => {
    const user = params.get("user") || params.get("login") || "";
    const pass = params.get("pass") || params.get("password") || "";
    const totp = params.get("totp") || params.get("secret") || "";
    return { user, pass, totp };
  }, [params]);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY;
    if (!key) {
      setError("Missing NEXT_PUBLIC_ENCRYPT_KEY. Set it in .env.local.");
      return;
    }
    if (!creds.user || !creds.pass || !creds.totp) {
      setError("Missing required query params: user/pass/totp.");
      return;
    }
    try {
      const payload = JSON.stringify(creds);
      const enc = CryptoJS.AES.encrypt(payload, key).toString();
      const url = "/?data=" + encodeURIComponent(enc);
      router.replace(url);
    } catch (e) {
      setError("Encryption failed. Check data and key.");
    }
  }, [creds, router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#0b0f12",
      color: "#cdeae0",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        {!error ? (
          <>
            <div style={{ fontSize: 24, marginBottom: 12 }}>Redirecting to account…</div>
            <div style={{ opacity: 0.7 }}>Please wait a moment</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, marginBottom: 8 }}>Cannot redirect</div>
            <div style={{ color: "#ff6b6b" }}>{error}</div>
          </>
        )}
      </div>
    </div>
  );
}
