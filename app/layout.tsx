export const metadata = {
  title: "Аккаунт",
  description: "Логин, пароль и одноразовый код"
};

import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
