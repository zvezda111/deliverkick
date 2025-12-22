"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Language = 'en' | 'tr' | 'ru';

const translations = {
  en: {
    title: "How to Login",
    subtitle: "Follow these simple steps",
    login: {
      title: "Login to Kick",
      steps: [
        { img: "/photo_2025-12-21_22-04-58.jpg", text: "1. Open Kick.com", desc: "Open kick.com in your browser" },
        { img: "/photo_2025-12-21_22-05-01.jpg", text: "2. Click Login", desc: "Find the Login button in the top right" },
        { img: "/photo_2025-12-21_22-05-04.jpg", text: "3. Enter Credentials", desc: "Copy login and password shown below" },
        { img: "/photo_2025-12-21_22-05-06.jpg", text: "4. Enter Code", desc: "Copy 6-digit code (OTP) - it changes every 30 sec!" },
        { img: "/photo_2025-12-21_22-05-10.jpg", text: "✓ Done!", desc: "You have successfully logged into your account" }
      ]
    },
    skins: {
      title: "How to Get Skins",
      steps: [
        { img: "/photo_2025-12-21_22-05-14.jpg", text: "1. Open Drops & Rewards", desc: "Click on profile photo → \"Drops and Rewards\"" },
        { img: "/photo_2025-12-21_22-05-17.jpg", text: "2. Connect game", desc: "Find and click \"Connect\" tab" },
        { img: "/photo_2025-12-21_22-05-20.jpg", text: "3. Take skins", desc: "Return to the inventory kick.com and pick up the skins there" }
      ]
    },
    backToAccount: "← Back to Account"
  },
  tr: {
    title: "Nasıl Giriş Yapılır",
    subtitle: "Bu basit adımları takip edin",
    login: {
      title: "Kick'e Giriş",
      steps: [
        { img: "/photo_2025-12-21_22-04-58.jpg", text: "1. Kick.com'u Açın", desc: "Tarayıcınızda kick.com'u açın" },
        { img: "/photo_2025-12-21_22-05-01.jpg", text: "2. Login'e Tıklayın", desc: "Sağ üstteki Login butonunu bulun" },
        { img: "/photo_2025-12-21_22-05-04.jpg", text: "3. Bilgileri Girin", desc: "Aşağıda gösterilen kullanıcı adı ve şifreyi kopyalayın" },
        { img: "/photo_2025-12-21_22-05-06.jpg", text: "4. Kodu Girin", desc: "6 haneli kodu (OTP) kopyalayın - her 30 saniyede değişir!" },
        { img: "/photo_2025-12-21_22-05-10.jpg", text: "✓ Hazır!", desc: "Hesabınıza başarıyla giriş yaptınız" }
      ]
    },
    skins: {
      title: "Skin Nasıl Alınır",
      steps: [
        { img: "/photo_2025-12-21_22-05-14.jpg", text: "1. Drops & Rewards Açın", desc: "Profil fotoğrafına tıklayın → \"Drops and Rewards\"" },
        { img: "/photo_2025-12-21_22-05-17.jpg", text: "2. Oyunu Bağlayın", desc: "\"Connect\" a tıklayın ve adımları izleyin" },
        { img: "/photo_2025-12-21_22-05-20.jpg", text: "3. Derileri alın", desc: "kick.com envanterine geri dönün ve görünümleri oradan alın" }
      ]
    },
    backToAccount: "← Hesaba Dön"
  },
  ru: {
    title: "Как войти",
    subtitle: "Следуйте этим простым шагам",
    login: {
      title: "Вход в Kick",
      steps: [
        { img: "/photo_2025-12-21_22-04-58.jpg", text: "1. Откройте Kick.com", desc: "Откройте kick.com в браузере" },
        { img: "/photo_2025-12-21_22-05-01.jpg", text: "2. Нажмите Войти", desc: "Найдите кнопку Login справа вверху" },
        { img: "/photo_2025-12-21_22-05-04.jpg", text: "3. Введите данные", desc: "Скопируйте логин и пароль показанные ниже" },
        { img: "/photo_2025-12-21_22-05-06.jpg", text: "4. Введите код", desc: "Скопируйте 6-значный код (OTP) - он меняется каждые 30 сек!" },
        { img: "/photo_2025-12-21_22-05-10.jpg", text: "✓ Готово!", desc: "Вы успешно вошли в аккаунт" }
      ]
    },
    skins: {
      title: "Как получить скины",
      steps: [
        { img: "/photo_2025-12-21_22-05-14.jpg", text: "1. Откройте Drops & Rewards", desc: "Нажмите на фото профиля → \"Drops and Rewards\"" },
        { img: "/photo_2025-12-21_22-05-17.jpg", text: "2. Подключите игру", desc: "Нажмите \"Подключить\" и следуйте шагам" },
        { img: "/photo_2025-12-21_22-05-20.jpg", text: "3. Заберите скины", desc: "Вернитесь в инвентарь kick.com и заберите скины там" }
      ]
    },
    backToAccount: "← Назад к аккаунту"
  }
};

export default function GuidePage() {
  const [lang, setLang] = useState<Language>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('xaveria-lang') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const t = translations[lang];

  return (
    <main className="guide-page">
      <div className="guide-header">
        <div className="logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 8L24 4L36 8V20C36 29 30 36 24 44C18 36 12 29 12 20V8Z" stroke="#53FC18" strokeWidth="2.5" fill="none"/>
            <path d="M20 24L22.5 26.5L28 21" stroke="#53FC18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="guide-title">{t.title}</h1>
        <p className="guide-subtitle">{t.subtitle}</p>
      </div>

      <div className="guide-container">
        <section className="guide-section">
          <h2 className="section-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#53FC18" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#53FC18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#53FC18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.login.title}
          </h2>
          
          <div className="steps-grid">
            {t.login.steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">Шаг {i + 1}</div>
                <div className="step-image">
                  <Image src={step.img} alt={step.text} width={600} height={400} />
                </div>
                <h3 className="step-title">{step.text}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2 className="section-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#53FC18" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            {t.skins.title}
          </h2>
          
          <div className="steps-grid">
            {t.skins.steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">Шаг {i + 1}</div>
                <div className="step-image">
                  <Image src={step.img} alt={step.text} width={600} height={400} />
                </div>
                <h3 className="step-title">{step.text}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Link href="/" className="back-link">
          {t.backToAccount}
        </Link>
      </div>
    </main>
  );
}
