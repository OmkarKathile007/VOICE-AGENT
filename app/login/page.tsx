

'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* --- Types --- */
type Lang = "EN" | "HI" | "MR" | "TE";
type RoleKey = "FPO" | "SHG" | "Startup" | "Processor" | "Consumer";

/* --- i18n dictionary --- */
const DICT: Record<
  Lang,
  {
    ui: {
      welcome: string;
      chooseRole: string;
      login: string;
      continueAs: string;
      emailOnly: string;
      emailPlaceholder: string;
      passwordLabel: string;
      autofillBtn: string;
      requestOtp: string;
      loginBtn: (role: string) => string;
      register: string;
      terms: string;
      proTipTitle: string;
      needHelpCall: (phone: string) => string;
      validation: {
        enterEmail: string;
        invalidEmail: string;
        enterPassword: string;
        enterOtp: string;
      };
      otpSentMsg: (target: string) => string;
      otpVerifiedMsg: string;
      otpErrorMsg: string;
    };
    roles: Record<
      RoleKey,
      {
        title: string;
        subtitle: string;
        note: string;
      }
    >;
  }
> = {
  EN: {
    ui: {
      welcome: "Welcome Back",
      chooseRole: "Choose your role to continue on Krishi-Shetra",
      login: "Login",
      continueAs: "Continue as",
      emailOnly: "Email",
      emailPlaceholder: "name@domain.com",
      passwordLabel: "Password",
      autofillBtn: "Autofill Demo Data",
      requestOtp: "Request OTP",
      loginBtn: (role) => `Login as ${role}`,
      register: "Register / Create Account",
      terms: "Terms & Privacy",
      proTipTitle: "Pro tip:",
      needHelpCall: (phone) => `Need help? Call ${phone}`,
      validation: {
        enterEmail: "Please enter your email address.",
        invalidEmail: "Enter a valid email address.",
        enterPassword: "Please enter your password.",
        enterOtp: "Enter the 6 digit OTP.",
      },
      otpSentMsg: (target) => `OTP sent to ${target}.`,
      otpVerifiedMsg: "Email verified successfully.",
      otpErrorMsg: "Invalid OTP. Please try 123456.",
    },
    roles: {
      FPO: {
        title: "Farmer Producer Organization (FPO)",
        subtitle: "Collective to improve farmer incomes and market access",
        note: "FPOs: Register to access bulk procurement dashboards & certification support.",
      },
      SHG: {
        title: "Self-Help Group (SHG)",
        subtitle: "Community groups for aggregation & micro-business",
        note: "SHGs: Simple registration with Aadhaar verification for group-level onboarding.",
      },
      Startup: {
        title: "Startup",
        subtitle: "Value-add product creators & distributors",
        note: "Startups: create product listings, source verified millets, and apply for grants.",
      },
      Processor: {
        title: "Processor",
        subtitle: "Mills and processors sourcing millets",
        note: "Processors: access quality certificates & logistics integrations on onboarding.",
      },
      Consumer: {
        title: "Consumer",
        subtitle: "Buyers looking for nutritious millet products",
        note: "Consumers: explore millet products, trace origin & view nutrition info.",
      },
    },
  },

  HI: {
    ui: {
      welcome: "वापसी पर स्वागत है",
      chooseRole: "आगे बढ़ने के लिए अपनी भूमिका चुनें",
      login: "लॉगिन",
      continueAs: "के रूप में जारी रखें",
      emailOnly: "ईमेल",
      emailPlaceholder: "name@domain.com",
      passwordLabel: "पासवर्ड",
      autofillBtn: "डेमो डेटा भरें",
      requestOtp: "OTP अनुरोध करें",
      loginBtn: (role) => `${role} के रूप में लॉगिन`,
      register: "रजिस्टर / खाता बनाएं",
      terms: "नियम और गोपनीयता",
      proTipTitle: "प्रो टिप:",
      needHelpCall: (phone) => `मदद चाहिए? कॉल करें ${phone}`,
      validation: {
        enterEmail: "कृपया अपना ईमेल दर्ज करें।",
        invalidEmail: "मान्य ईमेल दर्ज करें।",
        enterPassword: "कृपया अपना पासवर्ड दर्ज करें।",
        enterOtp: "6 अंकों का OTP दर्ज करें।",
      },
      otpSentMsg: (target) => `OTP ${target} पर भेजा गया।`,
      otpVerifiedMsg: "ईमेल सफलतापूर्वक सत्यापित हुआ।",
      otpErrorMsg: "OTP सत्यापन असफल।",
    },
    roles: {
      FPO: { title: "किसान उत्पादक संगठन (FPO)", subtitle: "किसानों की आय और बाजार पहुंच बढ़ाने के लिए समूह", note: "FPOs: थोक खरीद डैशबोर्ड और सर्टिफिकेशन समर्थन के लिए रजिस्टर करें।" },
      SHG: { title: "स्व-सहायता समूह (SHG)", subtitle: "समूह जो समेकन और सूक्ष्म-व्यवसाय करते हैं", note: "SHGs: समूह-स्तर ऑनबोर्डिंग के लिए आसान Aadhaar सत्यापन।" },
      Startup: { title: "स्टार्टअप", subtitle: "वैल्यू-ऐड उत्पाद निर्माता और वितरक", note: "Startups: उत्पाद सूची बनाएँ, सत्यापित बाजु मिलेट्स स्रोत करें और अनुदान के लिए आवेदन करें।" },
      Processor: { title: "प्रोसेसर", subtitle: "मिल्स और मिलेट्स संसाधित करने वाले", note: "Processors: गुणवत्ता प्रमाण पत्र और लॉजिस्टिक्स इंटीग्रेशन का उपयोग करें।" },
      Consumer: { title: "उपभोक्ता", subtitle: "पोषक मिलेट उत्पादों के खरीदार", note: "Consumers: मिलेट उत्पाद देखें, उत्पत्ति ट्रेस करें और पोषण जानकारी देखें।" },
    },
  },

  MR: {
    ui: {
      welcome: "परत येताना स्वागत",
      chooseRole: "पुढे जाण्यासाठी आपली भूमिका निवडा",
      login: "लॉगिन",
      continueAs: "या म्हणून सुरू ठेवा",
      emailOnly: "ईमेल",
      emailPlaceholder: "name@domain.com",
      passwordLabel: "पासवर्ड",
      autofillBtn: "डेमो डेटा भरा",
      requestOtp: "OTP विनंती करा",
      loginBtn: (role) => `${role} म्हणून लॉगिन`,
      register: "नोंदणी / खाते तयार करा",
      terms: "नियम व गोपनीयता",
      proTipTitle: "टिप:",
      needHelpCall: (phone) => `मदतीसाठी कॉल करा ${phone}`,
      validation: {
        enterEmail: "कृपया आपला ईमेल प्रविष्ट करा.",
        invalidEmail: "वैध ईमेल प्रविष्ट करा.",
        enterPassword: "कृपया तुमचा पासवर्ड प्रविष्ट करा.",
        enterOtp: "6 अंकी OTP प्रविष्ट करा.",
      },
      otpSentMsg: (target) => `OTP ${target} वर पाठवले.`,
      otpVerifiedMsg: "ईमेल यशस्वीरित्या सत्यापित झाले.",
      otpErrorMsg: "OTP सत्यापन अयशस्वी.",
    },
    roles: {
      FPO: {
        title: "Farmer Producer Organization (FPO)",
        subtitle: "शेती उत्पादन व सुधारणा गट",
        note: "FPOs: थोक खरेदी डॅशबोर्ड व सर्टिफिकेशन साठी नोंदणी करा.",
      },
      SHG: {
        title: "Self-Help Group (SHG)",
        subtitle: "समूह – एग्रीगेशन व मायक्रो-बिझनेस",
        note: "SHGs: गट-स्तरीय ऑनबोर्डिंगसाठी Aadhaar सत्यापन.",
      },
      Startup: {
        title: "स्टार्टअप",
        subtitle: "वैल्यू-ऐड उत्पादक व वितरक",
        note: "Startups: उत्पादन सूची करा, प्रमाणित मिलेट्स स्रोत करा व अनुदानासाठी अर्ज करा.",
      },
      Processor: {
        title: "प्रोसेसर",
        subtitle: "मिल व संसाधक",
        note: "Processors: गुणवत्ता प्रमाणपत्र व लॉजिस्टिक्स इंटीग्रेशन वापरा.",
      },
      Consumer: {
        title: "ग्राहक",
        subtitle: "न्यूट्रिशियस मिलेट उत्पादने शोधणारे",
        note: "Consumers: मिलेट उत्पादने शोधा, उत्पत्ती ट्रेस करा व पोषण माहिती पहा.",
      },
    },
  },

  TE: {
    ui: {
      welcome: "మళ్లీ స్వాగతం",
      chooseRole: "కొనసాగడానికి మీ పాత్రను ఎంచుకోండి",
      login: "లాగిన్",
      continueAs: "ఈ పాత్రగా కొనసాగండి",
      emailOnly: "ఈమెయిల్",
      emailPlaceholder: "name@domain.com",
      passwordLabel: "పాస్‌వర్డ్",
      autofillBtn: "ఆటోఫిల్ డెమో డేటా",
      requestOtp: "OTP అభ్యర్థించండి",
      loginBtn: (role) => `${role}గా లాగిన్`,
      register: "రాజిస్టర్ / ఖాతాను సృష్టించండి",
      terms: "నియమాలు & గోప్యత",
      proTipTitle: "ప్రో చిట్కా:",
      needHelpCall: (phone) => `సహాయం కావాలా? కాల్ చేయండి ${phone}`,
      validation: {
        enterEmail: "దయచేసి మీ ఈమెయిల్ ఇవ్వండి.",
        invalidEmail: "చెల్లుబాటు అయ్యే ఈమెయిల్ ఇవ్వండి.",
        enterPassword: "దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి.",
        enterOtp: "6 అంకెల OTP నమోదు చేయండి.",
      },
      otpSentMsg: (target) => `OTPను ${target} కు పంపించబడింది.`,
      otpVerifiedMsg: "ఈమెయిల్ విజయవంతంగా ధృవీకరించబడింది.",
      otpErrorMsg: "OTP ధృవీకరణ విఫలమైంది.",
    },
    roles: {
      FPO: {
        title: "Farmer Producer Organization (FPO)",
        subtitle: "వ్యవసాయదారుల ఆదాయం మరియు మార్కెట్ యాక్సెస్ పెంచడానికి సమూహం",
        note: "FPOs: బల్క్ ప్రొక్యూర్‌మెంట్ డాష్‌బోర్డ్ & సర్టిఫికేషన్ మద్దతు కోసం రిజిస్టర్ అవ్వండి.",
      },
      SHG: {
        title: "Self-Help Group (SHG)",
        subtitle: "సమూహాలు సమీకరణ & సూక్ష్మ-వ్యవసాయ వ్యాపారాలకు",
        note: "SHGs: సమూహ-స్థాయి ఆన్‌బోర్డింగ్ కోసం Aadhaar ధృవీకరణ.",
      },
      Startup: {
        title: "స్టార్టప్",
        subtitle: "విలువ-జోడించిన ఉత్పత్తి సృష్టికర్తలు & పంపిణీదారులు",
        note: "Startups: ఉత్పత్తి జాబితాలు సృష్టించండి, ప్రమాణీకృత మిల్లెట్స్ మూలాలను పొందండి మరియు గ్రాంట్స్‌కి దరఖాస్తు చేయండి.",
      },
      Processor: {
        title: "ప్రాసెసర్",
        subtitle: "మిల్స్ మరియు మిల్లెట్స్ ప్రాసెసింగ్ సంస్థలు",
        note: "Processors: ఆన్‌బోర్డింగ్‌ సమయంలో నాణ్యత సర్టిఫికేట్లు & లాజిస్టిక్స్ అంతర్లీనతలను పొందండి.",
      },
      Consumer: {
        title: "కస్టమర్",
        subtitle: "పోషకమైన మిల్లెట్ ఉత్పత్తులను కంటే కొనే వారు",
        note: "Consumers: మిల్లెట్ ఉత్పత్తులను తెరవండి, మూలాన్ని ట్రేస్ చేయండి & పోషక సమాచారం చూడండి.",
      },
    },
  },
};

/* --- Helpers --- */
const PHONE = "+91-9876543210";

export default function RoleLoginI18n() {
  const router = useRouter();

  const getInitialLang = (): Lang => {
    if (typeof window === "undefined") return "EN";
    const stored = localStorage.getItem("shreeLang");
    if (stored && DICT[stored as Lang]) return stored as Lang;
    return "EN";
  };
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const dict = DICT[lang] ?? DICT.EN;

  useEffect(() => {
    try {
      localStorage.setItem("shreeLang", lang);
    } catch {}
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const ROLE_KEYS: RoleKey[] = ["FPO", "SHG", "Startup", "Processor", "Consumer"];
  const [selectedRole, setSelectedRole] = useState<RoleKey>("FPO");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const ui = useMemo(() => dict.ui, [dict]);

  // Autofill Handler for the Demo!
  const handleAutofill = () => {
    setEmail("admin@krishishetra.in");
    setPassword("KrishiWin2026!");
    setOtp("123456");
    setError(null);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!email.trim()) return setError(ui.validation.enterEmail);
    if (!isValidEmail(email)) return setError(ui.validation.invalidEmail);
    if (!password.trim()) return setError(ui.validation.enterPassword);
    
    // Check OTP only if they clicked request OTP
    if (otpRequested && otp !== "123456") {
      return setError(ui.otpErrorMsg);
    }

    setLoading(true);
    // MOCK SECURE BACKEND DELAY (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    // Role-based redirect logic
    if (selectedRole === "Consumer") {
      router.push("/products");
    } else if (selectedRole === "Processor") {
      window.location.href = "http://localhost:8081";
    } else if (selectedRole === "SHG") {
      window.location.href = "https://shree-anna-certify.lovable.app";
    } else if (selectedRole === "Startup") {
      window.location.href = "https://krishi-sphere-nexus.lovable.app";
    } else {
      router.push("/agent/voice");
    }
  };

  const sendOtp = async () => {
    if (!email.trim()) return setError(ui.validation.enterEmail);
    if (!isValidEmail(email)) return setError(ui.validation.invalidEmail);

    setError(null);
    setLoading(true);
    // MOCK NETWORK DELAY (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    setOtpRequested(true);
    alert(ui.otpSentMsg(email));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6ea] to-[#f7fff5] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-emerald-100">

        {/* LEFT SECTION - Stakeholder Roles */}
        <aside className="relative bg-emerald-50 p-10 md:pl-14 md:pr-10 border-r border-emerald-100">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">{ui.welcome}</h1>
            <p className="mt-2 text-sm text-emerald-700 font-medium">{ui.chooseRole}</p>

            <div className="mt-8 space-y-4">
              {ROLE_KEYS.map((key) => {
                const active = key === selectedRole;
                const meta = dict.roles[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all border
                      ${active
                        ? "bg-emerald-100 border-emerald-400 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-white border-transparent hover:border-emerald-200 hover:shadow-sm"
                      }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${active ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                      {key === "FPO" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 2L19 7v7c0 4-3 7-7 7s-7-3-7-7V7l7-5z" stroke="currentColor" strokeWidth="2"/></svg>}
                      {key === "SHG" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2"/></svg>}
                      {key === "Startup" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2"/></svg>}
                      {key === "Processor" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/></svg>}
                      {key === "Consumer" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M7 7h10l1 9H6L7 7z" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="19" r="1" fill="currentColor"/><circle cx="16" cy="19" r="1" fill="currentColor"/></svg>}
                    </div>

                    <div className="flex-1">
                      <div className={`text-sm font-bold ${active ? "text-emerald-900" : "text-slate-700"}`}>{meta.title}</div>
                      <div className="text-xs text-emerald-700/80 mt-1 leading-relaxed">{meta.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-xs text-emerald-700 font-medium">
              🌾 <strong className="text-emerald-900">{ui.proTipTitle}</strong> Select the role that best represents you.
            </div>
          </div>
        </aside>

        {/* RIGHT SECTION - Login */}
        <main className="p-10 md:p-12 bg-white flex flex-col justify-center">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-extrabold text-slate-900">{ui.login}</h2>
                {/* AUTOFILL BUTTON */}
                <button 
                  type="button" 
                  onClick={handleAutofill}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-200 transition-colors"
                >
                  {ui.autofillBtn}
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {ui.continueAs} <span className="font-bold text-emerald-700">{dict.roles[selectedRole].title}</span>
              </p>
            </div>
            
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="appearance-none border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="EN">English</option>
              <option value="HI">हिंदी</option>
              <option value="MR">मराठी</option>
              <option value="TE">తెలుగు</option>
            </select>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-bold text-slate-700 mb-2">
                {ui.emailOnly}
              </label>
              <input
                id="identifier"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ui.emailPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                {ui.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* OTP Section (Optional Demo Feature) */}
            <div>
               <div className="flex justify-between items-center mb-2">
                 <label htmlFor="otp" className="block text-sm font-bold text-slate-700">Security Code (Optional)</label>
                 <span className="text-xs font-medium text-emerald-600 cursor-pointer hover:underline" onClick={sendOtp}>
                   {loading ? "Sending..." : ui.requestOtp}
                 </span>
               </div>
               <input
                 id="otp"
                 type="text"
                 maxLength={6}
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 placeholder="6-digit OTP"
                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all tracking-widest"
               />
               {otpRequested && <p className="mt-2 text-xs font-medium text-emerald-600">{ui.otpSentMsg(email)}</p>}
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{error}</div>}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white py-4 font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                   <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Authenticating...</>
                ) : (
                  ui.loginBtn(dict.roles[selectedRole].title)
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 font-medium pt-4 border-t border-slate-100">
              <div>
                New to Krishi-Shetra?{" "}
                <button type="button" className="text-emerald-600 font-bold hover:underline">
                  {ui.register}
                </button>
              </div>
              <button type="button" className="hover:text-slate-800">{ui.terms}</button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 font-medium border border-slate-200">
            {dict.roles[selectedRole].note}
          </div>
        </main>
      </div>
    </div>
  );
}