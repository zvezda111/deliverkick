"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authenticator } from "otplib";
import Link from "next/link";
import CryptoJS from "crypto-js";

const STEP = 30;
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPT_KEY || "xaveria-default-key-change-in-production";

function decryptData(encryptedData: string): { login?: string; password?: string; secret?: string } | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

function useTotp(secret: string | null) {
  const [code, setCode] = useState<string>("------");
  const [remaining, setRemaining] = useState<number>(STEP);

  useEffect(() => {
    authenticator.options = { step: STEP, digits: 6 };

    const update = () => {
      const epoch = Math.floor(Date.now() / 1000);
      const rem = STEP - (epoch % STEP);
      setRemaining(rem);
      if (secret) {
        try {
          const next = authenticator.generate(secret);
          setCode(next);
        } catch {
          setCode("ERROR");
        }
      } else {
        setCode("------");
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [secret]);

  return { code, remaining };
}

const translations = {
  en: {
    welcome: "Welcome!",
    selectLang: "Select Your Language",
    chooseLang: "Dilinizi seçin • Выберите язык",
    account: "Your Account",
    subtitle: "Login, password and one-time code",
    login: "Login",
    password: "Password",
    totpLabel: "2FA Code (OTP)",
    copy: "Copy",
    copied: "Copied",
    security: "SECURE DELIVERY",
    guide: "📖 Instructions"
  },
  tr: {
    welcome: "Hoş geldiniz!",
    selectLang: "Dilinizi Seçin",
    chooseLang: "Dilinizi seçin • Выберите язык",
    account: "Hesabınız",
    subtitle: "Kullanıcı adı, şifre ve tek kullanımlık kod",
    login: "Kullanıcı Adı",
    password: "Şifre",
    totpLabel: "2FA Kodu (OTP)",
    copy: "Kopyala",
    copied: "Kopyalandı",
    security: "GÜVENLİ TESLİMAT",
    guide: "📖 Talimatlar"
  },
  ru: {
    welcome: "Добро пожаловать!",
    selectLang: "Выберите язык",
    chooseLang: "Dilinizi seçin • Выберите язык",
    account: "Ваш аккаунт",
    subtitle: "Логин, пароль и одноразовый код",
    login: "Логин",
    password: "Пароль",
    totpLabel: "2FA Код (OTP)",
    copy: "Копировать",
    copied: "Скопировано",
    security: "БЕЗОПАСНАЯ ДОСТАВКА",
    guide: "📖 Инструкция"
  }
};

type Language = 'en' | 'tr' | 'ru';

export default function Page() {
  const params = useSearchParams();
  
  const encryptedData = params.get("data");
  let decrypted = null;
  
  if (encryptedData) {
    decrypted = decryptData(encryptedData);
  }
  
  const user = decrypted?.login || params.get("login") || params.get("user");
  const pass = decrypted?.password || params.get("password") || params.get("pass");
  const secret = decrypted?.secret || params.get("secret") || params.get("totp");

  const hasData = !!(user || pass || secret);
  const [lang, setLang] = useState<Language>('en');
  const [showLangSelect, setShowLangSelect] = useState(true);
  const [guideCompleted, setGuideCompleted] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('xaveria-lang') as Language;
    const hasSeenGuide = false;
    
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    
  }, [hasData]);

  const { code, remaining } = useTotp(secret);
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [prevCode, setPrevCode] = useState(code);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (code !== prevCode && prevCode !== "------") {
      setPrevCode(code);
    }
  }, [code, prevCode]);

  const selectLanguage = (language: Language) => {
    setLang(language);
    localStorage.setItem('xaveria-lang', language);
    setShowLangSelect(false);
  };

  const onCopy = (text: string | null, label: string) => {
    if (!text || text === "------" || text === "ERROR") return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  };

  const t = translations[lang];

  if (showLangSelect && !guideCompleted) {
    return (
      <main className="page lang-select-page">
        <div className="logo logo-large">
          <svg width="80" height="80" viewBox="0 0 48 48" fill="none">
            <path d="M12 8L24 4L36 8V20C36 29 30 36 24 44C18 36 12 29 12 20V8Z" stroke="#53FC18" strokeWidth="2.5" fill="none"/>
            <path d="M20 24L22.5 26.5L28 21" stroke="#53FC18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        
        <p className="welcome-text">Welcome! / Hoş geldiniz! / Добро пожаловать!</p>

        <div className="lang-card">
          <div className="lang-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#53FC18" strokeWidth="2"/>
              <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#53FC18" strokeWidth="2"/>
              <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke="#53FC18" strokeWidth="2"/>
              <path d="M3 12H21" stroke="#53FC18" strokeWidth="2"/>
              <path d="M5 8H19" stroke="#53FC18" strokeWidth="2"/>
              <path d="M5 16H19" stroke="#53FC18" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="lang-title">Select Your Language</h2>
          <p className="lang-subtitle">Dilinizi seçin • Выберите язык</p>

          <div className="lang-options">
            <button className="lang-btn" onClick={() => selectLanguage('en')}>
              <span className="lang-flag">GB</span>
              <span className="lang-name">English</span>
            </button>
            <button className="lang-btn" onClick={() => selectLanguage('tr')}>
              <span className="lang-flag">TR</span>
              <span className="lang-name">Türkçe</span>
            </button>
            <button className="lang-btn" onClick={() => selectLanguage('ru')}>
              <span className="lang-flag">RU</span>
              <span className="lang-name">Русский</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!showLangSelect && !guideCompleted) {
    const allSteps = [
      { img: "/photo_2025-12-21_22-04-58.jpg", title: { en: "1. Open Kick.com", tr: "1. Kick.com'u Açın", ru: "1. Откройте Kick.com" }, desc: { en: "Open kick.com in your browser", tr: "Tarayıcınızda kick.com'u açın", ru: "Откройте kick.com в браузере" } },
      { img: "/photo_2025-12-21_22-05-01.jpg", title: { en: "2. Click Login", tr: "2. Login'e Tıklayın", ru: "2. Нажмите Войти" }, desc: { en: "Find the Login button in the top right", tr: "Sağ üstteki Login butonunu bulun", ru: "Найдите кнопку Login справа вверху" } },
      { img: "/photo_2025-12-21_22-05-04.jpg", title: { en: "3. Enter Credentials", tr: "3. Bilgileri Girin", ru: "3. Введите данные" }, desc: { en: "Copy login and password shown below", tr: "Aşağıda gösterilen kullanıcı adı ve şifreyi kopyalayın", ru: "Скопируйте логин и пароль показанные ниже" } },
      { img: "/photo_2025-12-21_22-05-06.jpg", title: { en: "4. Enter Code", tr: "4. Kodu Girin", ru: "4. Введите код" }, desc: { en: "Copy 6-digit code (OTP) - it changes every 30 sec!", tr: "6 haneli kodu (OTP) kopyalayın - her 30 saniyede değişir!", ru: "Скопируйте 6-значный код (OTP) - он меняется каждые 30 сек!" } },
      { img: "/photo_2025-12-21_22-05-10.jpg", title: { en: "✓ Done!", tr: "✓ Hazır!", ru: "✓ Готово!" }, desc: { en: "You have successfully logged into your account", tr: "Hesabınıza başarıyla giriş yaptınız", ru: "Вы успешно вошли в аккаунт" } },
      { img: "/photo_2025-12-21_22-05-14.jpg", title: { en: "1. Open Drops & Rewards", tr: "1. Drops & Rewards Açın", ru: "1. Откройте Drops & Rewards" }, desc: { en: "Click on profile photo → \"Drops and Rewards\"", tr: "Profil fotoğrafına tıklayın → \"Drops and Rewards\"", ru: "Нажмите на фото профиля → \"Drops and Rewards\"" } },
      { img: "/photo_2025-12-21_22-05-17.jpg", title: { en: "2. Connect game", tr: "2. Oyunu Bağlayın", ru: "2. Подключите игру" }, desc: { en: "Find and click \"Connect\" button", tr: "\"Connect\" sekmesini bulun ve tıklayın", ru: "Нажмите \"Подключить\" и следуйте шагам" } },
      { img: "/photo_2025-12-21_22-05-20.jpg", title: { en: "3. Take skins", tr: "3. Derileri alın", ru: "3. Заберите скины" }, desc: { en: "Return to the inventory kick.com and pick up the skins there", tr: "kick.com envanterine geri dönün ve görünümleri oradan alın", ru: "Вернитесь в инвентарь kick.com и заберите скины там" } }
    ];

    const totalSteps = allSteps.length;
    const currentSlide = allSteps[currentStep];

    const nextStep = () => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setGuideCompleted(true);
      }
    };

    const prevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const skipAll = () => {
      localStorage.setItem('xaveria-guide-seen', 'true');
      setGuideCompleted(true);
    };

    return (
      <main className="slider-page">
        <div className="slider-header">
          <div className="slider-icon">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
              <path d="M12 8L24 4L36 8V20C36 29 30 36 24 44C18 36 12 29 12 20V8Z" stroke="#FFA500" strokeWidth="2.5" fill="none"/>
              <circle cx="34" cy="14" r="6" fill="#FFA500"/>
            </svg>
          </div>
          <h1 className="slider-title">{lang === 'en' ? 'How to Login' : lang === 'tr' ? 'Nasıl Giriş Yapılır' : 'Как войти'}</h1>
          <p className="slider-subtitle">{lang === 'en' ? 'Follow these simple steps' : lang === 'tr' ? 'Bu basit adımları takip edin' : 'Следуйте этим простым шагам'}</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}></div>
            </div>
            <div className="progress-text">
              {lang === 'en' ? `Step ${currentStep + 1} of ${totalSteps}` : lang === 'tr' ? `Adım ${currentStep + 1} / ${totalSteps}` : `Шаг ${currentStep + 1} из ${totalSteps}`}
            </div>
          </div>
        </div>

        <div className="slider-content">
          <div className="slide-image">
            <img src={currentSlide.img} alt={`Step ${currentStep + 1}`} />
          </div>

          <div className="slide-info">
            <h2 className="slide-title">{currentSlide.title[lang]}</h2>
            <p className="slide-desc">{currentSlide.desc[lang]}</p>
          </div>
        </div>

        <div className="slider-controls">
          <button className="control-btn back-btn" onClick={prevStep} disabled={currentStep === 0}>
            ← {lang === 'en' ? 'Back' : lang === 'tr' ? 'Geri' : 'Назад'}
          </button>
          <button className="control-btn skip-btn" onClick={skipAll}>
            {lang === 'en' ? 'Skip' : lang === 'tr' ? 'Atla' : 'Пропустить'}
          </button>
          <button className="control-btn next-btn" onClick={nextStep}>
            {currentStep === totalSteps - 1 
              ? (lang === 'en' ? 'Show Account' : lang === 'tr' ? 'Hesabı Göster' : 'Показать аккаунт')
              : (lang === 'en' ? 'Next' : lang === 'tr' ? 'İleri' : 'Далее')
            } →
          </button>
        </div>
      </main>
    );
  }

  const displayPass = showPass ? (pass || "—") : (pass ? "•".repeat(pass.length) : "—");

  return (
    <main className="page">
      <div className="logo">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 8L24 4L36 8V20C36 29 30 36 24 44C18 36 12 29 12 20V8Z" stroke="#53FC18" strokeWidth="2.5" fill="none"/>
          <path d="M20 24L22.5 26.5L28 21" stroke="#53FC18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      

      {hasData && (
        <button className="help-btn" onClick={() => setShowGuideModal(true)}>
          ❓ {lang === 'en' ? 'How to use?' : lang === 'tr' ? 'Nasıl kullanılır?' : 'Как использовать?'}
        </button>
      )}

      <div className="card">
        <h2 className="card-title">{t.account}</h2>
        <p className="card-subtitle">{t.subtitle}</p>

        <div className="field">
          <label>{t.login}</label>
          <div className="input-group">
            <input type="text" value={user || ""} readOnly />
            <button className={`icon-btn ${copied === 'login' ? 'copied' : ''}`} onClick={() => onCopy(user, 'login')} title="Копировать">
              {copied === 'login' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 13V5C3 3.9 3.9 3 5 3H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="field">
          <label>{t.password}</label>
          <div className="input-group">
            <input type="text" value={displayPass} readOnly />
            <button className="icon-btn" onClick={() => setShowPass(!showPass)} title="Показать/скрыть">
              {showPass ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3L17 17M10 7.5C11.38 7.5 12.5 8.62 12.5 10M7.5 10C7.5 11.38 8.62 12.5 10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 17C14.5 17 18 10 18 10C18 10 16 7 13 5M10 3C5.5 3 2 10 2 10C2 10 3 12 5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 3C5.5 3 2 10 2 10C2 10 5.5 17 10 17C14.5 17 18 10 18 10C18 10 14.5 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
            <button className={`icon-btn ${copied === 'pass' ? 'copied' : ''}`} onClick={() => onCopy(pass, 'pass')} title="Копировать">
              {copied === 'pass' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 13V5C3 3.9 3.9 3 5 3H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="totp-block">
          <div className="totp-header">
            <span>{t.totpLabel}</span>
            <div className="timer">
              <svg className="timer-circle" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="none" stroke="#1a3d1a" strokeWidth="2"/>
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="#53FC18"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - remaining / STEP)}`}
                  transform="rotate(-90 16 16)"
                  strokeLinecap="round"
                />
              </svg>
              <span className="timer-text">{remaining}s</span>
            </div>
          </div>
          <div className="totp-code-wrapper">
            <div className={`totp-code ${code !== prevCode ? 'updated' : ''}`}>{code}</div>
            <button className={`icon-btn copy-totp ${copied === 'totp' ? 'copied' : ''}`} onClick={() => onCopy(code, 'totp')} title="Копировать">
              {copied === 'totp' ? (
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 13V5C3 3.9 3.9 3 5 3H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <div className="toast">
              ✓ {copied === 'login' ? t.login : copied === 'pass' ? t.password : t.totpLabel} {t.copied.toLowerCase()}
            </div>
          )}
        </div>
      </div>

      {showGuideModal && (
        <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowGuideModal(false)}>×</button>
            <h2 className="modal-title">
              {lang === 'en' ? 'Quick Guide' : lang === 'tr' ? 'Hızlı Rehber' : 'Быстрая инструкция'}
            </h2>
            <div className="modal-steps">
              <div className="modal-step">
                <div className="modal-step-number">1</div>
                <div className="modal-step-text">
                  <strong>{lang === 'en' ? 'Copy Login' : lang === 'tr' ? 'Kullanıcı Adını Kopyalayın' : 'Скопируйте логин'}</strong>
                  <p>{lang === 'en' ? 'Click the copy button next to login' : lang === 'tr' ? 'Kullanıcı adının yanındaki kopyala butonuna tıklayın' : 'Нажмите кнопку копирования рядом с логином'}</p>
                </div>
              </div>
              <div className="modal-step">
                <div className="modal-step-number">2</div>
                <div className="modal-step-text">
                  <strong>{lang === 'en' ? 'Copy Password' : lang === 'tr' ? 'Şifre Kopyalayın' : 'Скопируйте пароль'}</strong>
                  <p>{lang === 'en' ? 'Click eye icon to show, then copy' : lang === 'tr' ? 'Göz simgesine tıklayın, sonra kopyalayın' : 'Нажмите на глаз, затем скопируйте'}</p>
                </div>
              </div>
              <div className="modal-step">
                <div className="modal-step-number">3</div>
                <div className="modal-step-text">
                  <strong>{lang === 'en' ? 'Copy TOTP Code' : lang === 'tr' ? 'TOTP Kodunu Kopyalayın' : 'Скопируйте TOTP код'}</strong>
                  <p>{lang === 'en' ? 'Copy the 6-digit code (updates every 30s)' : lang === 'tr' ? '6 haneli kodu kopyalayın (her 30s güncellenir)' : 'Скопируйте 6-значный код (обновляется каждые 30с)'}</p>
                </div>
              </div>
              <div className="modal-step">
                <div className="modal-step-number">4</div>
                <div className="modal-step-text">
                  <strong>{lang === 'en' ? 'Login to Kick.com' : lang === 'tr' ? 'Kick.com\'a giriş yapın' : 'Войдите на Kick.com'}</strong>
                  <p>{lang === 'en' ? 'Use these credentials on kick.com' : lang === 'tr' ? 'Bu bilgileri kick.com\'da kullanın' : 'Используйте эти данные на kick.com'}</p>
                </div>
              </div>
            </div>
            <button className="modal-ok" onClick={() => setShowGuideModal(false)}>
              {lang === 'en' ? 'Got it!' : lang === 'tr' ? 'Anlaşıldı!' : 'Понятно!'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
