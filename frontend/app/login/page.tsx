'use client';

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Lang = "EN" | "HI" | "MR" | "TE";
type RoleKey = "FPO" | "SHG" | "Startup" | "Processor" | "Consumer";

const DICT: Record<Lang, {
  ui: {
    welcome: string; chooseRole: string; login: string; continueAs: string;
    emailOnly: string; emailPlaceholder: string; passwordLabel: string;
    autofillBtn: string; loginBtn: (role: string) => string; register: string;
    terms: string; proTipTitle: string; needHelpCall: (phone: string) => string;
    validation: { enterEmail: string; invalidEmail: string; enterPassword: string };
    registerTitle: string; nameLabel: string; namePlaceholder: string;
  };
  roles: Record<RoleKey, { title: string; subtitle: string; note: string }>;
}> = {
  EN: {
    ui: {
      welcome: "Welcome Back", chooseRole: "Choose your role to continue on Krishi-Shetra",
      login: "Login", continueAs: "Continue as", emailOnly: "Email",
      emailPlaceholder: "name@domain.com", passwordLabel: "Password",
      autofillBtn: "Autofill Demo", loginBtn: (role) => `Login as ${role}`,
      register: "Register / Create Account", terms: "Terms & Privacy",
      proTipTitle: "Pro tip:", needHelpCall: (phone) => `Need help? Call ${phone}`,
      validation: { enterEmail: "Please enter your email.", invalidEmail: "Enter a valid email.", enterPassword: "Please enter your password." },
      registerTitle: "Create Account", nameLabel: "Full Name", namePlaceholder: "Your name",
    },
    roles: {
      FPO: { title: "Farmer Producer Organization (FPO)", subtitle: "Collective to improve farmer incomes and market access", note: "FPOs: Register to access bulk procurement dashboards & certification support." },
      SHG: { title: "Self-Help Group (SHG)", subtitle: "Community groups for aggregation & micro-business", note: "SHGs: Simple registration with Aadhaar verification for group-level onboarding." },
      Startup: { title: "Startup", subtitle: "Value-add product creators & distributors", note: "Startups: create product listings, source verified millets, and apply for grants." },
      Processor: { title: "Processor", subtitle: "Mills and processors sourcing millets", note: "Processors: access quality certificates & logistics integrations on onboarding." },
      Consumer: { title: "Consumer", subtitle: "Buyers looking for nutritious millet products", note: "Consumers: explore millet products, trace origin & view nutrition info." },
    },
  },
  HI: {
    ui: {
      welcome: "वापसी पर स्वागत है", chooseRole: "आगे बढ़ने के लिए अपनी भूमिका चुनें",
      login: "लॉगिन", continueAs: "के रूप में जारी रखें", emailOnly: "ईमेल",
      emailPlaceholder: "name@domain.com", passwordLabel: "पासवर्ड",
      autofillBtn: "डेमो डेटा भरें", loginBtn: (role) => `${role} के रूप में लॉगिन`,
      register: "रजिस्टर / खाता बनाएं", terms: "नियम और गोपनीयता",
      proTipTitle: "प्रो टिप:", needHelpCall: (phone) => `मदद चाहिए? कॉल करें ${phone}`,
      validation: { enterEmail: "कृपया अपना ईमेल दर्ज करें।", invalidEmail: "मान्य ईमेल दर्ज करें।", enterPassword: "कृपया अपना पासवर्ड दर्ज करें।" },
      registerTitle: "खाता बनाएं", nameLabel: "पूरा नाम", namePlaceholder: "आपका नाम",
    },
    roles: {
      FPO: { title: "किसान उत्पादक संगठन (FPO)", subtitle: "किसानों की आय और बाजार पहुंच बढ़ाने के लिए समूह", note: "FPOs: थोक खरीद डैशबोर्ड और सर्टिफिकेशन समर्थन के लिए रजिस्टर करें।" },
      SHG: { title: "स्व-सहायता समूह (SHG)", subtitle: "समूह जो समेकन और सूक्ष्म-व्यवसाय करते हैं", note: "SHGs: समूह-स्तर ऑनबोर्डिंग के लिए आसान Aadhaar सत्यापन।" },
      Startup: { title: "स्टार्टअप", subtitle: "वैल्यू-ऐड उत्पाद निर्माता और वितरक", note: "Startups: उत्पाद सूची बनाएँ, सत्यापित मिलेट्स स्रोत करें।" },
      Processor: { title: "प्रोसेसर", subtitle: "मिल्स और मिलेट्स संसाधित करने वाले", note: "Processors: गुणवत्ता प्रमाण पत्र और लॉजिस्टिक्स इंटीग्रेशन का उपयोग करें।" },
      Consumer: { title: "उपभोक्ता", subtitle: "पोषक मिलेट उत्पादों के खरीदार", note: "Consumers: मिलेट उत्पाद देखें, उत्पत्ति ट्रेस करें।" },
    },
  },
  MR: {
    ui: {
      welcome: "परत येताना स्वागत", chooseRole: "पुढे जाण्यासाठी आपली भूमिका निवडा",
      login: "लॉगिन", continueAs: "या म्हणून सुरू ठेवा", emailOnly: "ईमेल",
      emailPlaceholder: "name@domain.com", passwordLabel: "पासवर्ड",
      autofillBtn: "डेमो डेटा भरा", loginBtn: (role) => `${role} म्हणून लॉगिन`,
      register: "नोंदणी / खाते तयार करा", terms: "नियम व गोपनीयता",
      proTipTitle: "टिप:", needHelpCall: (phone) => `मदतीसाठी कॉल करा ${phone}`,
      validation: { enterEmail: "कृपया आपला ईमेल प्रविष्ट करा.", invalidEmail: "वैध ईमेल प्रविष्ट करा.", enterPassword: "कृपया तुमचा पासवर्ड प्रविष्ट करा." },
      registerTitle: "खाते तयार करा", nameLabel: "पूर्ण नाव", namePlaceholder: "तुमचे नाव",
    },
    roles: {
      FPO: { title: "Farmer Producer Organization (FPO)", subtitle: "शेती उत्पादन व सुधारणा गट", note: "FPOs: थोक खरेदी डॅशबोर्ड व सर्टिफिकेशन साठी नोंदणी करा." },
      SHG: { title: "Self-Help Group (SHG)", subtitle: "समूह – एग्रीगेशन व मायक्रो-बिझनेस", note: "SHGs: गट-स्तरीय ऑनबोर्डिंगसाठी Aadhaar सत्यापन." },
      Startup: { title: "स्टार्टअप", subtitle: "वैल्यू-ऐड उत्पादक व वितरक", note: "Startups: उत्पादन सूची करा, प्रमाणित मिलेट्स स्रोत करा." },
      Processor: { title: "प्रोसेसर", subtitle: "मिल व संसाधक", note: "Processors: गुणवत्ता प्रमाणपत्र व लॉजिस्टिक्स इंटीग्रेशन वापरा." },
      Consumer: { title: "ग्राहक", subtitle: "न्यूट्रिशियस मिलेट उत्पादने शोधणारे", note: "Consumers: मिलेट उत्पादने शोधा, उत्पत्ती ट्रेस करा." },
    },
  },
  TE: {
    ui: {
      welcome: "మళ్లీ స్వాగతం", chooseRole: "కొనసాగడానికి మీ పాత్రను ఎంచుకోండి",
      login: "లాగిన్", continueAs: "ఈ పాత్రగా కొనసాగండి", emailOnly: "ఈమెయిల్",
      emailPlaceholder: "name@domain.com", passwordLabel: "పాస్‌వర్డ్",
      autofillBtn: "ఆటోఫిల్ డెమో", loginBtn: (role) => `${role}గా లాగిన్`,
      register: "రాజిస్టర్ / ఖాతాను సృష్టించండి", terms: "నియమాలు & గోప్యత",
      proTipTitle: "ప్రో చిట్కా:", needHelpCall: (phone) => `సహాయం కావాలా? కాల్ చేయండి ${phone}`,
      validation: { enterEmail: "దయచేసి మీ ఈమెయిల్ ఇవ్వండి.", invalidEmail: "చెల్లుబాటు అయ్యే ఈమెయిల్ ఇవ్వండి.", enterPassword: "దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి." },
      registerTitle: "ఖాతాను సృష్టించండి", nameLabel: "పూర్తి పేరు", namePlaceholder: "మీ పేరు",
    },
    roles: {
      FPO: { title: "Farmer Producer Organization (FPO)", subtitle: "వ్యవసాయదారుల ఆదాయం పెంచడానికి సమూహం", note: "FPOs: బల్క్ ప్రొక్యూర్‌మెంట్ డాష్‌బోర్డ్ కోసం రిజిస్టర్ అవ్వండి." },
      SHG: { title: "Self-Help Group (SHG)", subtitle: "సమూహాలు సమీకరణ కోసం", note: "SHGs: సమూహ-స్థాయి ఆన్‌బోర్డింగ్ కోసం Aadhaar ధృవీకరణ." },
      Startup: { title: "స్టార్టప్", subtitle: "విలువ-జోడించిన ఉత్పత్తి సృష్టికర్తలు", note: "Startups: ఉత్పత్తి జాబితాలు సృష్టించండి." },
      Processor: { title: "ప్రాసెసర్", subtitle: "మిల్స్ మరియు మిల్లెట్స్ ప్రాసెసింగ్", note: "Processors: నాణ్యత సర్టిఫికేట్లు పొందండి." },
      Consumer: { title: "కస్టమర్", subtitle: "మిల్లెట్ ఉత్పత్తులను కొనే వారు", note: "Consumers: మిల్లెట్ ఉత్పత్తులను తెరవండి." },
    },
  },
};

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const getInitialLang = (): Lang => {
    if (typeof window === 'undefined') return 'EN';
    const stored = localStorage.getItem('shreeLang');
    return (stored && DICT[stored as Lang]) ? stored as Lang : 'EN';
  };

  const [lang, setLang] = useState<Lang>(getInitialLang);
  const dict = DICT[lang] ?? DICT.EN;
  const ui = useMemo(() => dict.ui, [dict]);

  const ROLE_KEYS: RoleKey[] = ["FPO", "SHG", "Startup", "Processor", "Consumer"];
  const [selectedRole, setSelectedRole] = useState<RoleKey>("FPO");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutofill = () => {
    setEmail('demo@krishishetra.in');
    setPassword('demo123');
    setName('Demo User');
    setError(null);
  };

  const redirectAfterAuth = (role: string) => {
    if (role === 'Consumer') router.push('/products');
    else if (role === 'Processor') window.location.href = 'http://localhost:8081';
    else if (role === 'SHG') window.location.href = 'https://shree-anna-certify.lovable.app';
    else if (role === 'Startup') window.location.href = 'https://krishi-sphere-nexus.lovable.app';
    else router.push('/agent/voice');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return setError(ui.validation.enterEmail);
    if (!isValidEmail(email)) return setError(ui.validation.invalidEmail);
    if (!password.trim()) return setError(ui.validation.enterPassword);

    setLoading(true);
    try {
      if (isRegister) {
        const data = await register(email, password, name || email.split('@')[0], selectedRole);
        redirectAfterAuth(data.role);
      } else {
        const data = await login(email, password);
        redirectAfterAuth(data.role);
      }
    } catch (err: any) {
      setError(err.message ?? 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#eaf6ea] to-[#f7fff5] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-emerald-100">

        {/* LEFT — Role selector */}
        <aside className="relative bg-emerald-50 p-10 md:pl-14 md:pr-10 border-r border-emerald-100">
          <div className="absolute inset-0 bg-linear-to-b from-emerald-100/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">{ui.welcome}</h1>
            <p className="mt-2 text-sm text-emerald-700 font-medium">{ui.chooseRole}</p>
            <div className="mt-8 space-y-4">
              {ROLE_KEYS.map((key) => {
                const active = key === selectedRole;
                const meta = dict.roles[key];
                return (
                  <button key={key} type="button" onClick={() => setSelectedRole(key)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all border ${active ? "bg-emerald-100 border-emerald-400 shadow-md ring-2 ring-emerald-500/20" : "bg-white border-transparent hover:border-emerald-200 hover:shadow-sm"}`}>
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

        {/* RIGHT — Auth form */}
        <main className="p-10 md:p-12 bg-white flex flex-col justify-center">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {isRegister ? ui.registerTitle : ui.login}
                </h2>
                <button type="button" onClick={handleAutofill}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-200 transition-colors">
                  {ui.autofillBtn}
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {ui.continueAs} <span className="font-bold text-emerald-700">{dict.roles[selectedRole].title}</span>
              </p>
            </div>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}
              className="appearance-none border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white outline-none cursor-pointer">
              <option value="EN">English</option>
              <option value="HI">हिंदी</option>
              <option value="MR">मराठी</option>
              <option value="TE">తెలుగు</option>
            </select>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {isRegister && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{ui.nameLabel}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={ui.namePlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{ui.emailOnly}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={ui.emailPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{ui.passwordLabel}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all" />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{error}</div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white py-4 font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-70">
                {loading
                  ? <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Authenticating...</>
                  : ui.loginBtn(dict.roles[selectedRole].title)
                }
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 font-medium pt-4 border-t border-slate-100">
              <div>
                {isRegister ? 'Already have an account? ' : 'New to Krishi-Shetra? '}
                <button type="button" onClick={() => { setIsRegister(!isRegister); setError(null); }}
                  className="text-emerald-600 font-bold hover:underline">
                  {isRegister ? ui.login : ui.register}
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
