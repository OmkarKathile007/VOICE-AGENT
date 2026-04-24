'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Lang = "EN" | "HI" | "MR" | "TE";
type RoleKey = "FPO" | "SHG" | "Startup" | "Processor" | "Consumer";

type DictShape = {
  ui: {
    welcome: string;
    chooseRole: string;
    login: string;
    continueAs: string;
    emailOrPhone: string;
    identifierPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    loginBtn: (role: string) => string;
    register: string;
    terms: string;
    proTipTitle: string;
    validation: {
      enterIdentifier: string;
      invalidIdentifier: string;
      passwordShort: string;
    };
  };
  roles: Record<RoleKey, { title: string; subtitle: string; note: string }>;
};

const baseRoles: DictShape["roles"] = {
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
};

const DICT: Record<Lang, DictShape> = {
  EN: {
    ui: {
      welcome: "Welcome Back",
      chooseRole: "Choose your role to continue on Shree Anna",
      login: "Login",
      continueAs: "Continue as",
      emailOrPhone: "Email or phone number",
      identifierPlaceholder: "name@domain.com or +91 9876543210",
      password: "Password",
      passwordPlaceholder: "Enter password",
      loginBtn: (role) => `Login as ${role}`,
      register: "Register / Create FPO",
      terms: "Terms & Privacy",
      proTipTitle: "Pro tip:",
      validation: {
        enterIdentifier: "Please enter your email or phone number.",
        invalidIdentifier: "Enter a valid email or phone number.",
        passwordShort: "Password must be at least 6 characters.",
      },
    },
    roles: baseRoles,
  },
  HI: {
    ui: {
      welcome: "वापसी पर स्वागत है",
      chooseRole: "आगे बढ़ने के लिए अपनी भूमिका चुनें",
      login: "लॉगिन",
      continueAs: "के रूप में जारी रखें",
      emailOrPhone: "ईमेल या मोबाइल नंबर",
      identifierPlaceholder: "name@domain.com या +91 9876543210",
      password: "पासवर्ड",
      passwordPlaceholder: "पासवर्ड दर्ज करें",
      loginBtn: (role) => `${role} के रूप में लॉगिन`,
      register: "रजिस्टर / FPO बनाएं",
      terms: "नियम और गोपनीयता",
      proTipTitle: "प्रो टिप:",
      validation: {
        enterIdentifier: "कृपया ईमेल या मोबाइल नंबर दर्ज करें।",
        invalidIdentifier: "मान्य ईमेल या मोबाइल नंबर दर्ज करें।",
        passwordShort: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      },
    },
    roles: baseRoles,
  },
  MR: {
    ui: {
      welcome: "परत येताना स्वागत",
      chooseRole: "पुढे जाण्यासाठी आपली भूमिका निवडा",
      login: "लॉगिन",
      continueAs: "या म्हणून सुरू ठेवा",
      emailOrPhone: "ईमेल किंवा मोबाईल नंबर",
      identifierPlaceholder: "name@domain.com किंवा +91 9876543210",
      password: "पासवर्ड",
      passwordPlaceholder: "पासवर्ड प्रविष्ट करा",
      loginBtn: (role) => `${role} म्हणून लॉगिन`,
      register: "नोंदणी / FPO तयार करा",
      terms: "नियम व गोपनीयता",
      proTipTitle: "टिप:",
      validation: {
        enterIdentifier: "कृपया ईमेल किंवा मोबाईल नंबर प्रविष्ट करा.",
        invalidIdentifier: "वैध ईमेल किंवा मोबाईल नंबर प्रविष्ट करा.",
        passwordShort: "पासवर्ड किमान 6 अक्षरांचा असावा.",
      },
    },
    roles: baseRoles,
  },
  TE: {
    ui: {
      welcome: "మళ్లీ స్వాగతం",
      chooseRole: "కొనసాగడానికి మీ పాత్రను ఎంచుకోండి",
      login: "లాగిన్",
      continueAs: "ఈ పాత్రగా కొనసాగండి",
      emailOrPhone: "ఈమెయిల్ లేదా మొబైల్ నంబర్",
      identifierPlaceholder: "name@domain.com లేదా +91 9876543210",
      password: "పాస్వర్డ్",
      passwordPlaceholder: "పాస్వర్డ్ నమోదు చేయండి",
      loginBtn: (role) => `${role}గా లాగిన్`,
      register: "రాజిస్టర్ / FPO సృష్టించండి",
      terms: "నియమాలు & గోప్యత",
      proTipTitle: "ప్రో చిట్కా:",
      validation: {
        enterIdentifier: "దయచేసి ఈమెయిల్ లేదా మొబైల్ నంబర్ ఇవ్వండి.",
        invalidIdentifier: "చెల్లుబాటు అయ్యే ఈమెయిల్ లేదా మొబైల్ నంబర్ ఇవ్వండి.",
        passwordShort: "పాస్వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
      },
    },
    roles: baseRoles,
  },
};

export default function RoleLoginI18n() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("EN");
  const [selectedRole, setSelectedRole] = useState<RoleKey>("FPO");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dict = DICT[lang] ?? DICT.EN;
  const ui = useMemo(() => dict.ui, [dict]);
  const ROLE_KEYS: RoleKey[] = ["FPO", "SHG", "Startup", "Processor", "Consumer"];

  useEffect(() => {
    const stored = localStorage.getItem("shreeLang") as Lang | null;
    if (stored && DICT[stored]) setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("shreeLang", lang);
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const isValidIdentifier = (value: string) => {
    const trimmed = value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const phoneOk = /^\+?[0-9]{10,15}$/.test(trimmed.replace(/[\s-]/g, ""));
    return emailOk || phoneOk;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!identifier.trim()) return setError(ui.validation.enterIdentifier);
    if (!isValidIdentifier(identifier)) return setError(ui.validation.invalidIdentifier);
    if (password.length < 6) return setError(ui.validation.passwordShort);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    setLoading(false);

    if (selectedRole === "Consumer") {
      router.push("/product");
    } else if (selectedRole === "Processor") {
      window.location.href = "http://localhost:8081";
    } else if (selectedRole === "SHG") {
      window.location.href = "https://shree-anna-certify.lovable.app";
    } else if (selectedRole === "Startup") {
      window.location.href = "https://krishi-sphere-nexus.lovable.app";
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6ea] to-[#f7fff5] flex items-center justify-center p-6 font-inter">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border-2 border-[#b7dfb7]">
        <aside className="relative bg-[#ecfbee] p-10 md:pl-14 md:pr-10 border-r-2 border-[#b7dfb7]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#dff3df]/70 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-[#204c20] tracking-tight">{ui.welcome}</h1>
            <p className="mt-2 text-sm text-[#436343]">{ui.chooseRole}</p>
            <div className="mt-8 space-y-4">
              {ROLE_KEYS.map((key) => {
                const active = key === selectedRole;
                const meta = dict.roles[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all ${
                      active
                        ? "bg-[#dff3df] shadow-lg ring-2 ring-[#4CAF50]/50"
                        : "bg-white hover:shadow-md hover:ring-1 hover:ring-[#b7dfb7]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${active ? "text-[#204c20]" : "text-[#374d37]"}`}>{meta.title}</div>
                      <div className="text-xs text-[#5b7c5b] mt-1">{meta.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 text-xs text-[#5b7c5b] italic">🌾 <strong>{ui.proTipTitle}</strong> Select the role that best represents you.</div>
          </div>
        </aside>

        <main className="p-10 md:p-12 bg-gradient-to-b from-white to-[#f9fff8]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-[#204c20]">{ui.login}</h2>
              <p className="text-sm text-[#3e5e3e]">{ui.continueAs} <span className="font-semibold">{dict.roles[selectedRole].title}</span></p>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="border border-[#c8e0c8] rounded-md px-3 py-2 text-sm bg-[#f9fff8] focus:ring-2 focus:ring-[#4CAF50]/50 focus:outline-none"
            >
              <option value="EN">EN</option>
              <option value="HI">हिंदी</option>
              <option value="MR">मराठी</option>
              <option value="TE">తెలుగు</option>
            </select>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-[#204c20]">{ui.emailOrPhone}</label>
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={ui.identifierPlaceholder}
                className="mt-2 block w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#204c20]">{ui.password}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={ui.passwordPlaceholder}
                className="mt-2 block w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60 focus:outline-none"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#2E7D32] text-white py-3 font-medium shadow-sm hover:scale-[1.02] transition-transform">
                {loading ? "Logging in..." : ui.loginBtn(dict.roles[selectedRole].title)}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#4b644b]">
              <div>
                New? <button type="button" onClick={() => alert("Registration (mock)")} className="underline text-[#2E7D32] font-medium">{ui.register}</button>
              </div>
              <div>{ui.terms}</div>
            </div>
          </form>

          <div className="mt-6 text-sm text-[#436343] italic border-t border-[#dcefdc] pt-4">{dict.roles[selectedRole].note}</div>
        </main>
      </div>
    </div>
  );
}
