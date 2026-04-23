// 'use client';

// import Link from "next/link";
// import React, { useEffect, useMemo, useState } from "react";

// /* --- Types --- */
// type Lang = "EN" | "HI" | "MR" | "TE";
// type RoleKey = "FPO" | "SHG" | "Startup" | "Processor" | "Consumer";

// /* --- i18n dictionary --- */
// const DICT: Record<
//   Lang,
//   {
//     ui: {
//       welcome: string;
//       chooseRole: string;
//       login: string;
//       continueAs: string;
//       emailOrMobile: string;
//       loginWithOtp: string;
//       password: string;
//       requestOtp: string;
//       forgot: string;
//       loginBtn: (role: string) => string;
//       register: string;
//       terms: string;
//       proTipTitle: string;
//       needHelpCall: (phone: string) => string;
//       validation: {
//         enterIdentifier: string;
//         enterOtp: string;
//         passwordShort: string;
//       };
//       otpSentMsg: (target: string) => string;
//     };
//     roles: Record<
//       RoleKey,
//       {
//         title: string;
//         subtitle: string;
//         note: string;
//       }
//     >;
//   }
// > = {
//   EN: {
//     ui: {
//       welcome: "Welcome Back",
//       chooseRole: "Choose your role to continue on Shree Anna",
//       login: "Login",
//       continueAs: "Continue as",
//       emailOrMobile: "Email or mobile",
//       loginWithOtp: "Login with OTP",
//       password: "Password",
//       requestOtp: "Request OTP",
//       forgot: "Forgot?",
//       loginBtn: (role) => `Login as ${role}`,
//       register: "Register / Create FPO",
//       terms: "Terms & Privacy",
//       proTipTitle: "Pro tip:",
//       needHelpCall: (phone) => `Need help? Call ${phone}`,
//       validation: {
//         enterIdentifier: "Please enter your email or mobile number.",
//         enterOtp: "Enter the 4–6 digit OTP.",
//         passwordShort: "Password must be at least 6 characters.",
//       },
//       otpSentMsg: (target) => `OTP sent to ${target} (mock)`,
//     },
//     roles: {
//       FPO: {
//         title: "Farmer Producer Organization (FPO)",
//         subtitle: "Collective to improve farmer incomes and market access",
//         note: "FPOs: Register to access bulk procurement dashboards & certification support.",
//       },
//       SHG: {
//         title: "Self-Help Group (SHG)",
//         subtitle: "Community groups for aggregation & micro-business",
//         note: "SHGs: Simple registration with Aadhaar verification for group-level onboarding.",
//       },
//       Startup: {
//         title: "Startup",
//         subtitle: "Value-add product creators & distributors",
//         note: "Startups: create product listings, source verified millets, and apply for grants.",
//       },
//       Processor: {
//         title: "Processor",
//         subtitle: "Mills and processors sourcing millets",
//         note: "Processors: access quality certificates & logistics integrations on onboarding.",
//       },
//       Consumer: {
//         title: "Consumer",
//         subtitle: "Buyers looking for nutritious millet products",
//         note: "Consumers: explore millet products, trace origin & view nutrition info.",
//       },
//     },
//   },

//   HI: {
//     ui: {
//       welcome: "वापसी पर स्वागत है",
//       chooseRole: "आगे बढ़ने के लिए अपनी भूमिका चुनें",
//       login: "लॉगिन",
//       continueAs: "के रूप में जारी रखें",
//       emailOrMobile: "ईमेल या मोबाइल",
//       loginWithOtp: "OTP से लॉगिन",
//       password: "पासवर्ड",
//       requestOtp: "OTP अनुरोध करें",
//       forgot: "भूल गए?",
//       loginBtn: (role) => `${role} के रूप में लॉगिन`,
//       register: "रजिस्टर / FPO बनाएं",
//       terms: "नियम और गोपनीयता",
//       proTipTitle: "प्रो टिप:",
//       needHelpCall: (phone) => `मदद चाहिए? कॉल करें ${phone}`,
//       validation: {
//         enterIdentifier: "कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।",
//         enterOtp: "4–6 अंकों का OTP दर्ज करें।",
//         passwordShort: "पासवर्ड कम से कम 6 अंकों का होना चाहिए।",
//       },
//       otpSentMsg: (target) => `OTP ${target} पर भेजा गया (नमूना)`,
//     },
//     roles: {
//       FPO: { title: "किसान उत्पादक संगठन (FPO)", subtitle: "किसानों की आय और बाजार पहुंच बढ़ाने के लिए समूह", note: "FPOs: थोक खरीद डैशबोर्ड और सर्टिफिकेशन समर्थन के लिए रजिस्टर करें।" },
//       SHG: { title: "स्व-सहायता समूह (SHG)", subtitle: "समूह जो समेकन और सूक्ष्म-व्यवसाय करते हैं", note: "SHGs: समूह-स्तर ऑनबोर्डिंग के लिए आसान Aadhaar सत्यापन।" },
//       Startup: { title: "स्टार्टअप", subtitle: "वैल्यू-ऐड उत्पाद निर्माता और वितरक", note: "Startups: उत्पाद सूची बनाएँ, सत्यापित बाजु मिलेट्स स्रोत करें और अनुदान के लिए आवेदन करें।" },
//       Processor: { title: "प्रोसेसर", subtitle: "मिल्स और मिलेट्स संसाधित करने वाले", note: "Processors: गुणवत्ता प्रमाण पत्र और लॉजिस्टिक्स इंटीग्रेशन का उपयोग करें।" },
//       Consumer: { title: "उपभोक्ता", subtitle: "पोषक मिलेट उत्पादों के खरीदार", note: "Consumers: मिलेट उत्पाद देखें, उत्पत्ति ट्रेस करें और पोषण जानकारी देखें।" },
//     },
//   },

//   MR: {
//     ui: {
//       welcome: "परत येताना स्वागत",
//       chooseRole: "पुढे जाण्यासाठी आपली भूमिका निवडा",
//       login: "लॉगिन",
//       continueAs: "या म्हणून सुरू ठेवा",
//       emailOrMobile: "ईमेल किंवा मोबाईल",
//       loginWithOtp: "OTP ने लॉगिन",
//       password: "पासवर्ड",
//       requestOtp: "OTP विनंती करा",
//       forgot: "विसरलात?",
//       loginBtn: (role) => `${role} म्हणून लॉगिन`,
//       register: "नोंदणी / FPO तयार करा",
//       terms: "नियम व गोपनीयता",
//       proTipTitle: "टिप:",
//       needHelpCall: (phone) => `मदतीसाठी कॉल करा ${phone}`,
//       validation: {
//         enterIdentifier: "कृपया आपला ईमेल किंवा मोबाईल नंबर प्रविष्ट करा.",
//         enterOtp: "4–6 अंकांची OTP प्रविष्ट करा.",
//         passwordShort: "पासवर्ड किमान 6 अक्षरांचा असावा.",
//       },
//       otpSentMsg: (target) => `OTP ${target} वर पाठवले (नमुना)`,
//     },
//     roles: {
//       FPO: {
//         title: "Farmer Producer Organization (FPO)",
//         subtitle: "शेती उत्पादन व सुधारणा गट",
//         note: "FPOs: थोक खरेदी डॅशबोर्ड व सर्टिफिकेशन साठी नोंदणी करा.",
//       },
//       SHG: {
//         title: "Self-Help Group (SHG)",
//         subtitle: "समूह – एग्रीगेशन व मायक्रो-बिझनेस",
//         note: "SHGs: गट-स्तरीय ऑनबोर्डिंगसाठी Aadhaar सत्यापन.",
//       },
//       Startup: {
//         title: "स्टार्टअप",
//         subtitle: "वैल्यू-ऐड उत्पादक व वितरक",
//         note: "Startups: उत्पादन सूची करा, प्रमाणित मिलेट्स स्रोत करा व अनुदानासाठी अर्ज करा.",
//       },
//       Processor: {
//         title: "प्रोसेसर",
//         subtitle: "मिल व संसाधक",
//         note: "Processors: गुणवत्ता प्रमाणपत्र व लॉजिस्टिक्स इंटीग्रेशन वापरा.",
//       },
//       Consumer: {
//         title: "ग्राहक",
//         subtitle: "न्यूट्रिशियस मिलेट उत्पादने शोधणारे",
//         note: "Consumers: मिलेट उत्पादने शोधा, उत्पत्ती ट्रेस करा व पोषण माहिती पहा.",
//       },
//     },
//   },

//   TE: {
//     ui: {
//       welcome: "మళ్లీ స్వాగతం",
//       chooseRole: "కొనసాగడానికి మీ పాత్రను ఎంచుకోండి",
//       login: "లాగిన్",
//       continueAs: "ఈ పాత్రగా కొనసాగండి",
//       emailOrMobile: "ఈమెయిల్ లేదా మొబైల్",
//       loginWithOtp: "OTP తో లాగిన్",
//       password: "పాస్వర్డ్",
//       requestOtp: "OTP అభ్యర్థించండి",
//       forgot: "మర్చిపోయారా?",
//       loginBtn: (role) => `${role}గా లాగిన్`,
//       register: "రాజిస్టర్ / FPO సృష్టించండి",
//       terms: "నియమాలు & గోప్యత",
//       proTipTitle: "ప్రో చిట్కా:",
//       needHelpCall: (phone) => `సహాయం కావాలా? కాల్ చేయండి ${phone}`,
//       validation: {
//         enterIdentifier: "దయచేసి మీ ఇమెయిల్ లేదా మొబైల్ నంబర్ ఇవ్వండి.",
//         enterOtp: "4–6 అంకెల OTP ను నమోదు చేయండి.",
//         passwordShort: "పాస్వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
//       },
//       otpSentMsg: (target) => `OTPను ${target} కు పంపించబడింది (మాక్)`,
//     },
//     roles: {
//       FPO: {
//         title: "Farmer Producer Organization (FPO)",
//         subtitle: "వ్యవసాయదారుల ఆదాయం మరియు మార్కెట్ యాక్సెస్ పెంచడానికి సమూహం",
//         note: "FPOs: బల్క్ ప్రొక్యూర్‌మెంట్ డాష్‌బోర్డ్ & సర్టిఫికేషన్ మద్దతు కోసం రిజిస్టర్ అవ్వండి.",
//       },
//       SHG: {
//         title: "Self-Help Group (SHG)",
//         subtitle: "సమూహాలు సమీకరణ & సూక్ష్మ-వ్యవసాయ వ్యాపారాలకు",
//         note: "SHGs: సమూహ-స్థాయి ఆన్‌బోర్డింగ్ కోసం Aadhaar ధృవీకరణ.",
//       },
//       Startup: {
//         title: "స్టార్టప్",
//         subtitle: "విలువ-జోడించిన ఉత్పత్తి సృష్టికర్తలు & పంపిణీదారులు",
//         note: "Startups: ఉత్పత్తి జాబితాలు సృష్టించండి, ప్రమాణీకృత మిల్లెట్స్ మూలాలను పొందండి మరియు గ్రాంట్స్‌కి దరఖాస్తు చేయండి.",
//       },
//       Processor: {
//         title: "ప్రాసెసర్",
//         subtitle: "మిల్స్ మరియు మిల్లెట్స్ ప్రాసెసింగ్ సంస్థలు",
//         note: "Processors: ఆన్‌బోర్డింగ్‌ సమయంలో నాణ్యత సర్టిఫికేట్లు & లాజిస్టిక్స్ అంతర్లీనతలను పొందండి.",
//       },
//       Consumer: {
//         title: "కస్టమర్",
//         subtitle: "పోషకమైన మిల్లెట్ ఉత్పత్తులను కంటే కొనే వారు",
//         note: "Consumers: మిల్లెట్ ఉత్పత్తులను తెరవండి, మూలాన్ని ట్రేస్ చేయండి & పోషక సమాచారం చూడండి.",
//       },
//     },
//   },
// };

// /* --- Helpers --- */
// const PHONE = "+91-XXXXXXXXXX";

// export default function RoleLoginI18n() {
//   const getInitialLang = (): Lang => {
//     if (typeof window === "undefined") return "EN";
//     const stored = localStorage.getItem("shreeLang");
//     if (stored && DICT[stored as Lang]) return stored as Lang;
//     return "EN";
//   };
//   const [lang, setLang] = useState<Lang>(getInitialLang);
//   const dict = DICT[lang] ?? DICT.EN;

//   useEffect(() => {
//     try {
//       localStorage.setItem("shreeLang", lang);
//     } catch {}
//     document.documentElement.lang = lang.toLowerCase();
//   }, [lang]);

//   const ROLE_KEYS: RoleKey[] = ["FPO", "SHG", "Startup", "Processor", "Consumer"];
//   const [selectedRole, setSelectedRole] = useState<RoleKey>("FPO");
//   const [useOtp, setUseOtp] = useState(true);
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const ui = useMemo(() => dict.ui, [dict]);

//   const onSubmit = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     setError(null);
//     if (!identifier.trim()) return setError(ui.validation.enterIdentifier);
//     if (useOtp && !/^\d{4,6}$/.test(otp)) return setError(ui.validation.enterOtp);
//     if (!useOtp && password.length < 6) return setError(ui.validation.passwordShort);

//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 900));
//     setLoading(false);
//     alert(`${ui.loginBtn(dict.roles[selectedRole].title)} — ${identifier}`);
//   };

//   const sendOtp = async () => {
//     if (!identifier.trim()) return setError(ui.validation.enterIdentifier);
//     setError(null);
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 700));
//     setLoading(false);
//     alert(ui.otpSentMsg(identifier));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#eaf6ea] to-[#f7fff5] flex items-center justify-center p-6 font-inter">
//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border-2 border-[#b7dfb7]">

//         {/* LEFT SECTION - Stakeholder Roles */}
//         <aside className="relative bg-[#ecfbee] p-10 md:pl-14 md:pr-10 border-r-2 border-[#b7dfb7]">
//           <div className="absolute inset-0 bg-gradient-to-b from-[#dff3df]/70 to-transparent pointer-events-none"></div>

//           <div className="relative z-10">
//             <h1 className="text-3xl font-bold text-[#204c20] tracking-tight">{ui.welcome}</h1>
//             <p className="mt-2 text-sm text-[#436343]">{ui.chooseRole}</p>

//             <div className="mt-8 space-y-4">
//               {ROLE_KEYS.map((key) => {
//                 const active = key === selectedRole;
//                 const meta = dict.roles[key];
//                 return (
//                   <button
//                     key={key}
//                     onClick={() => setSelectedRole(key)}
//                     className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all
//                       ${active
//                         ? "bg-[#dff3df] shadow-lg ring-2 ring-[#4CAF50]/50"
//                         : "bg-white hover:shadow-md hover:ring-1 hover:ring-[#b7dfb7]"
//                       }`}
//                   >
//                     <div className={`flex items-center justify-center w-12 h-12 rounded-full ${active ? "bg-[#4CAF50] text-white" : "bg-[#ecfbee] text-[#204c20]"}`}>
//                       {key === "FPO" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 2L19 7v7c0 4-3 7-7 7s-7-3-7-7V7l7-5z" stroke="currentColor" strokeWidth="1.4"/></svg>}
//                       {key === "SHG" && <svg className="w-6 h-6" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.4"/></svg>}
//                       {key === "Startup" && <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.4"/></svg>}
//                       {key === "Processor" && <svg className="w-6 h-6" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/></svg>}
//                       {key === "Consumer" && <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M7 7h10l1 9H6L7 7z" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="19" r="1" fill="currentColor"/><circle cx="16" cy="19" r="1" fill="currentColor"/></svg>}
//                     </div>

//                     <div className="flex-1">
//                       <div className={`text-sm font-semibold ${active ? "text-[#204c20]" : "text-[#374d37]"}`}>{meta.title}</div>
//                       <div className="text-xs text-[#5b7c5b] mt-1">{meta.subtitle}</div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="mt-8 text-xs text-[#5b7c5b] italic">
//               🌾 <strong>{ui.proTipTitle}</strong> Select the role that best represents you.
//             </div>
//           </div>
//         </aside>

//         {/* RIGHT SECTION - Login */}
//         <main className="p-10 md:p-12 bg-gradient-to-b from-white to-[#f9fff8]">
//           <div className="flex items-center justify-between mb-2">
//             <div>
//               <h2 className="text-2xl font-bold text-[#204c20]">{ui.login}</h2>
//               <p className="text-sm text-[#3e5e3e]">
//                 {ui.continueAs} <span className="font-semibold">{dict.roles[selectedRole].title}</span>
//               </p>
//             </div>
//             <select
//               value={lang}
//               onChange={(e) => setLang(e.target.value as Lang)}
//               className="border border-[#c8e0c8] rounded-md px-3 py-2 text-sm bg-[#f9fff8] focus:ring-2 focus:ring-[#4CAF50]/50 focus:outline-none"
//             >
//               <option value="EN">EN</option>
//               <option value="HI">हिंदी</option>
//               <option value="MR">मराठी</option>
//               <option value="TE">తెలుగు</option>
//             </select>
//           </div>

//           <form className="mt-6 space-y-4" onSubmit={onSubmit}>
//             <div>
//               <label htmlFor="identifier" className="block text-sm font-medium text-[#204c20]">
//                 {ui.emailOnly}
//               </label>
//               <input
//                 id="identifier"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder={ui.emailPlaceholder}
//                 className="mt-2 block w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60 focus:outline-none"
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setUseOtp(true)}
//                 className={`px-3 py-1.5 rounded-md text-sm font-medium ${useOtp ? "bg-[#4CAF50] text-white" : "bg-[#e9f5e9] text-[#204c20]"}`}
//               >
//                 {ui.loginWithOtp}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUseOtp(false)}
//                 className={`px-3 py-1.5 rounded-md text-sm font-medium ${!useOtp ? "bg-[#4CAF50] text-white" : "bg-[#e9f5e9] text-[#204c20]"}`}
//               >
//                 {ui.password}
//               </button>
//               <div className="ml-auto text-xs text-[#5b7c5b]">{ui.needHelpCall(PHONE)}</div>
//             </div>

//             {useOtp ? (
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
//                 <input
//                   id="otp"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   className="sm:col-span-2 w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60"
//                 />
//                 <button
//                   type="button"
//                   onClick={sendOtp}
//                   disabled={loading}
//                   className="sm:col-span-1 w-full rounded-md bg-[#4CAF50] text-white px-4 py-3 text-sm font-medium hover:brightness-95 transition"
//                 >
//                   {loading ? "Sending..." : ui.requestOtp}
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-[#204c20]">{ui.password}</label>
//                 <div className="relative mt-2">
//                   <input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="********"
//                     className="w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60"
//                   />
//                   <button type="button" onClick={() => alert("Password reset (mock)")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4CAF50] underline">{ui.forgot}</button>
//                 </div>
//               </div>
//             )}

//             {error && <div className="text-sm text-red-600">{error}</div>}

//             <div className="pt-2">
//               <Link href={'/products'}>
//               <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#2E7D32] text-white py-3 font-medium shadow-sm hover:scale-[1.02] transition-transform">
//                 {loading ? "Logging in..." : ui.loginBtn(dict.roles[selectedRole].title)}
//               </button>
//               </Link>
//             </div>

//             <div className="flex items-center justify-between text-xs text-[#4b644b]">
//               <div>
//                 New?{" "}
//                 <button type="button" onClick={() => alert("Registration (mock)")} className="underline text-[#2E7D32] font-medium">
//                   {ui.register}
//                 </button>
//               </div>
//               <div>{ui.terms}</div>
//             </div>
//           </form>

//           <div className="mt-6 text-sm text-[#436343] italic border-t border-[#dcefdc] pt-4">
//             {dict.roles[selectedRole].note}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, requestEmailOtp, verifyEmailOtp } from "@/lib/emailOtpAuth";

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
      requestOtp: string;
      loginBtn: (role: string) => string;
      register: string;
      terms: string;
      proTipTitle: string;
      needHelpCall: (phone: string) => string;
      validation: {
        enterEmail: string;
        invalidEmail: string;
        enterOtp: string;
      };
      otpSentMsg: (target: string) => string;
      otpVerifiedMsg: string;
      otpErrorMsg: string;
      missingConfigMsg: string;
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
      chooseRole: "Choose your role to continue on Shree Anna",
      login: "Login",
      continueAs: "Continue as",
      emailOnly: "Email",
      emailPlaceholder: "name@domain.com",
      requestOtp: "Request OTP",
      loginBtn: (role) => `Login as ${role}`,
      register: "Register / Create FPO",
      terms: "Terms & Privacy",
      proTipTitle: "Pro tip:",
      needHelpCall: (phone) => `Need help? Call ${phone}`,
      validation: {
        enterEmail: "Please enter your email address.",
        invalidEmail: "Enter a valid email address.",
        enterOtp: "Enter the 6 digit OTP.",
      },
      otpSentMsg: (target) => `OTP sent to ${target}.`,
      otpVerifiedMsg: "Email verified successfully.",
      otpErrorMsg: "OTP verification failed. Please try again.",
      missingConfigMsg: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
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
      requestOtp: "OTP अनुरोध करें",
      loginBtn: (role) => `${role} के रूप में लॉगिन`,
      register: "रजिस्टर / FPO बनाएं",
      terms: "नियम और गोपनीयता",
      proTipTitle: "प्रो टिप:",
      needHelpCall: (phone) => `मदद चाहिए? कॉल करें ${phone}`,
      validation: {
        enterEmail: "कृपया अपना ईमेल दर्ज करें।",
        invalidEmail: "मान्य ईमेल दर्ज करें।",
        enterOtp: "6 अंकों का OTP दर्ज करें।",
      },
      otpSentMsg: (target) => `OTP ${target} पर भेजा गया।`,
      otpVerifiedMsg: "ईमेल सफलतापूर्वक सत्यापित हुआ।",
      otpErrorMsg: "OTP सत्यापन असफल।",
      missingConfigMsg: "Supabase कॉन्फ़िगर नहीं है।",
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
      requestOtp: "OTP विनंती करा",
      loginBtn: (role) => `${role} म्हणून लॉगिन`,
      register: "नोंदणी / FPO तयार करा",
      terms: "नियम व गोपनीयता",
      proTipTitle: "टिप:",
      needHelpCall: (phone) => `मदतीसाठी कॉल करा ${phone}`,
      validation: {
        enterEmail: "कृपया आपला ईमेल प्रविष्ट करा.",
        invalidEmail: "वैध ईमेल प्रविष्ट करा.",
        enterOtp: "6 अंकी OTP प्रविष्ट करा.",
      },
      otpSentMsg: (target) => `OTP ${target} वर पाठवले.`,
      otpVerifiedMsg: "ईमेल यशस्वीरित्या सत्यापित झाले.",
      otpErrorMsg: "OTP सत्यापन अयशस्वी.",
      missingConfigMsg: "Supabase कॉन्फिगर केलेले नाही.",
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
      requestOtp: "OTP అభ్యర్థించండి",
      loginBtn: (role) => `${role}గా లాగిన్`,
      register: "రాజిస్టర్ / FPO సృష్టించండి",
      terms: "నియమాలు & గోప్యత",
      proTipTitle: "ప్రో చిట్కా:",
      needHelpCall: (phone) => `సహాయం కావాలా? కాల్ చేయండి ${phone}`,
      validation: {
        enterEmail: "దయచేసి మీ ఈమెయిల్ ఇవ్వండి.",
        invalidEmail: "చెల్లుబాటు అయ్యే ఈమెయిల్ ఇవ్వండి.",
        enterOtp: "6 అంకెల OTP నమోదు చేయండి.",
      },
      otpSentMsg: (target) => `OTPను ${target} కు పంపించబడింది.`,
      otpVerifiedMsg: "ఈమెయిల్ విజయవంతంగా ధృవీకరించబడింది.",
      otpErrorMsg: "OTP ధృవీకరణ విఫలమైంది.",
      missingConfigMsg: "Supabase కాన్ఫిగర్ చేయలేదు.",
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
const PHONE = "+91-XXXXXXXXXX";

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
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const ui = useMemo(() => dict.ui, [dict]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!email.trim()) return setError(ui.validation.enterEmail);
    if (!isValidEmail(email)) return setError(ui.validation.invalidEmail);
    if (!/^\d{6}$/.test(otp)) return setError(ui.validation.enterOtp);
    if (!isSupabaseConfigured) return setError(ui.missingConfigMsg);

    setLoading(true);
    const { error: verifyError } = await verifyEmailOtp(email.trim(), otp.trim());
    setLoading(false);

    if (verifyError) {
      setError(ui.otpErrorMsg);
      return;
    }

    alert(ui.otpVerifiedMsg);

    // Role-based redirect logic:
    // Consumer -> internal /product
    // SHG -> external https://shree-anna-certify.lovable.app
    // Startup or Processor -> external https://krishi-sphere-nexus.lovable.app
    // FPO (or default) -> keep original /products
    if (selectedRole === "Consumer") {
      // internal route
      router.push("/product");
    } else if (selectedRole === "Processor" ) {
      window.location.href = "http://localhost:8081";
    }
    
   
    
     else if (selectedRole === "SHG") {
      window.location.href = "https://shree-anna-certify.lovable.app";
    } else if (selectedRole === "Startup" ) {
      window.location.href = "https://krishi-sphere-nexus.lovable.app";
    } else {
      // FPO or any other fallback
      router.push("/products");
    }
  };

  const sendOtp = async () => {
    if (!email.trim()) return setError(ui.validation.enterEmail);
    if (!isValidEmail(email)) return setError(ui.validation.invalidEmail);
    if (!isSupabaseConfigured) return setError(ui.missingConfigMsg);

    setError(null);
    setLoading(true);
    const { error: otpError } = await requestEmailOtp(email.trim());
    setLoading(false);

    if (otpError) {
      setError(otpError);
      return;
    }

    setOtpRequested(true);
    alert(ui.otpSentMsg(email));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6ea] to-[#f7fff5] flex items-center justify-center p-6 font-inter">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border-2 border-[#b7dfb7]">

        {/* LEFT SECTION - Stakeholder Roles */}
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
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all
                      ${active
                        ? "bg-[#dff3df] shadow-lg ring-2 ring-[#4CAF50]/50"
                        : "bg-white hover:shadow-md hover:ring-1 hover:ring-[#b7dfb7]"
                      }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${active ? "bg-[#4CAF50] text-white" : "bg-[#ecfbee] text-[#204c20]"}`}>
                      {key === "FPO" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 2L19 7v7c0 4-3 7-7 7s-7-3-7-7V7l7-5z" stroke="currentColor" strokeWidth="1.4"/></svg>}
                      {key === "SHG" && <svg className="w-6 h-6" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.4"/></svg>}
                      {key === "Startup" && <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.4"/></svg>}
                      {key === "Processor" && <svg className="w-6 h-6" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/></svg>}
                      {key === "Consumer" && <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M7 7h10l1 9H6L7 7z" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="19" r="1" fill="currentColor"/><circle cx="16" cy="19" r="1" fill="currentColor"/></svg>}
                    </div>

                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${active ? "text-[#204c20]" : "text-[#374d37]"}`}>{meta.title}</div>
                      <div className="text-xs text-[#5b7c5b] mt-1">{meta.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-xs text-[#5b7c5b] italic">
              🌾 <strong>{ui.proTipTitle}</strong> Select the role that best represents you.
            </div>
          </div>
        </aside>

        {/* RIGHT SECTION - Login */}
        <main className="p-10 md:p-12 bg-gradient-to-b from-white to-[#f9fff8]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-[#204c20]">{ui.login}</h2>
              <p className="text-sm text-[#3e5e3e]">
                {ui.continueAs} <span className="font-semibold">{dict.roles[selectedRole].title}</span>
              </p>
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
              <label htmlFor="identifier" className="block text-sm font-medium text-[#204c20]">
                {ui.emailOnly}
              </label>
              <input
                id="identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ui.emailPlaceholder}
                className="mt-2 block w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60 focus:outline-none"
              />
            </div>

            <div className="ml-auto text-xs text-[#5b7c5b]">{ui.needHelpCall(PHONE)}</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="sm:col-span-2 w-full rounded-md border border-[#cde8cd] px-4 py-3 text-sm focus:ring-2 focus:ring-[#4CAF50]/60"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="sm:col-span-1 w-full rounded-md bg-[#4CAF50] text-white px-4 py-3 text-sm font-medium hover:brightness-95 transition"
              >
                {loading ? "Sending..." : ui.requestOtp}
              </button>
            </div>

            {otpRequested && <div className="text-xs text-[#2E7D32]">{ui.otpSentMsg(email)}</div>}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#2E7D32] text-white py-3 font-medium shadow-sm hover:scale-[1.02] transition-transform">
                {loading ? "Logging in..." : ui.loginBtn(dict.roles[selectedRole].title)}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#4b644b]">
              <div>
                New?{" "}
                <button type="button" onClick={() => alert("Registration (mock)")} className="underline text-[#2E7D32] font-medium">
                  {ui.register}
                </button>
              </div>
              <div>{ui.terms}</div>
            </div>
          </form>

          <div className="mt-6 text-sm text-[#436343] italic border-t border-[#dcefdc] pt-4">
            {dict.roles[selectedRole].note}
          </div>
        </main>
      </div>
    </div>
  );
}
