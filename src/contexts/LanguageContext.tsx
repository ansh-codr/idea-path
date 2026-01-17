import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "ta" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.tagline": "AI-Powered Business Guidance",
    
    // Hero Section
    "hero.badge": "AI-Powered Business Guidance",
    "hero.headline": "Turn your skills into a",
    "hero.headline.highlight": "real business path",
    "hero.subheadline": "Guided by AI. Built for first-time founders. Transform your unique background into actionable startup ideas with confidence.",
    "hero.cta": "Start Building",
    "hero.trust": "No credit card required • Free to explore • Private & secure",
    
    // Generator Section
    "generator.title": "Tell us about yourself",
    "generator.subtitle": "Share your background and goals. Our AI will analyze your unique context to generate personalized business directions.",
    "generator.skills.label": "What are your core skills or expertise?",
    "generator.skills.placeholder": "e.g., I'm good at teaching, have experience in accounting, know how to cook traditional recipes...",
    "generator.skills.hint": "Include professional skills, hobbies, or anything you do well",
    "generator.interests.label": "What topics or industries interest you?",
    "generator.interests.placeholder": "e.g., sustainability, education, local food, technology...",
    "generator.budget.label": "Starting budget",
    "generator.budget.placeholder": "Select range",
    "generator.budget.under1k": "Under ₹80,000",
    "generator.budget.1k5k": "₹80,000 - ₹4,00,000",
    "generator.budget.5k20k": "₹4,00,000 - ₹16,00,000",
    "generator.budget.20k50k": "₹16,00,000 - ₹40,00,000",
    "generator.budget.over50k": "Over ₹40,00,000",
    "generator.location.label": "Location type",
    "generator.location.placeholder": "Select type",
    "generator.location.urban": "Urban / City",
    "generator.location.suburban": "Suburban",
    "generator.location.semiurban": "Semi-Urban",
    "generator.location.rural": "Rural / Village",
    "generator.location.remote": "Fully Remote",
    "generator.audience.label": "Who do you want to help or serve?",
    "generator.audience.placeholder": "e.g., busy parents, small business owners, students, elderly...",
    "generator.audience.hint": "Think about the people whose problems you'd like to solve",
    "generator.submit": "Generate Business Ideas",
    "generator.loading": "Analyzing your context...",
    
    // Results Section
    "results.title": "Your Personalized",
    "results.title.highlight": "Business Direction",
    "results.subtitle": "Based on your unique context, here's what our AI recommends",
    "results.idea.label": "Recommended Direction",
    "results.idea.whyFits": "Why this fits you",
    "results.feasibility.title": "Feasibility Analysis",
    "results.feasibility.disclaimer": "These are AI estimates based on your inputs. Actual results may vary.",
    "results.roadmap.title": "Execution Roadmap",
    "results.roadmap.subtitle": "Step-by-step path to launch",
    "results.pitch.title": "Your Quick Pitch",
    
    // Final CTA
    "cta.complete": "Analysis Complete",
    "cta.title": "Ready to take the next step?",
    "cta.subtitle": "Your personalized business direction is just the beginning. Save your results, refine your idea, or explore different paths.",
    "cta.save": "Download PDF",
    "cta.share": "Share Results",
    "cta.restart": "Try Different Inputs",
    "cta.features.title": "What you get with UDHBHAV AI",
    "cta.features.ai": "AI-powered analysis",
    "cta.features.roadmaps": "Personalized roadmaps",
    "cta.features.scoring": "Feasibility scoring",
    "cta.features.insights": "Market insights",
    
    // Footer
    "footer.tagline": "Connecting Skills & Opportunities.",
    "footer.disclaimer": "UDHBHAV AI © 2026 • AI outputs are suggestions, not guarantees",
    
    // Chatbot
    "chat.title": "UDHBHAV AI Assistant",
    "chat.subtitle": "Ask me anything about starting a business",
    "chat.placeholder": "Type your question...",
    "chat.send": "Send",
    "chat.welcome": "Hello! I'm here to help you on your entrepreneurial journey. Ask me anything about starting a business, validating ideas, or understanding market needs.",
  },
  hi: {
    // Navigation
    "nav.tagline": "AI-संचालित व्यवसाय मार्गदर्शन",
    
    // Hero Section
    "hero.badge": "AI-संचालित व्यवसाय मार्गदर्शन",
    "hero.headline": "अपने कौशल को बनाएं",
    "hero.headline.highlight": "असली व्यवसाय का रास्ता",
    "hero.subheadline": "AI द्वारा मार्गदर्शित। पहली बार के संस्थापकों के लिए बनाया गया। आत्मविश्वास के साथ अपनी अनूठी पृष्ठभूमि को कार्रवाई योग्य स्टार्टअप विचारों में बदलें।",
    "hero.cta": "शुरू करें",
    "hero.trust": "कोई क्रेडिट कार्ड नहीं • मुफ्त में देखें • निजी और सुरक्षित",
    
    // Generator Section
    "generator.title": "हमें अपने बारे में बताएं",
    "generator.subtitle": "अपनी पृष्ठभूमि और लक्ष्य साझा करें। हमारी AI आपके अनूठे संदर्भ का विश्लेषण करके व्यक्तिगत व्यवसाय दिशाएं तैयार करेगी।",
    "generator.skills.label": "आपकी मुख्य कुशलता या विशेषज्ञता क्या है?",
    "generator.skills.placeholder": "जैसे, मैं पढ़ाने में अच्छा हूं, लेखांकन का अनुभव है, पारंपरिक व्यंजन बनाना जानता हूं...",
    "generator.skills.hint": "पेशेवर कौशल, शौक, या कोई भी चीज जो आप अच्छी तरह करते हैं",
    "generator.interests.label": "कौन से विषय या उद्योग आपको रुचिकर लगते हैं?",
    "generator.interests.placeholder": "जैसे, पर्यावरण, शिक्षा, स्थानीय भोजन, तकनीक...",
    "generator.budget.label": "शुरुआती बजट",
    "generator.budget.placeholder": "राशि चुनें",
    "generator.budget.under1k": "₹80,000 से कम",
    "generator.budget.1k5k": "₹80,000 - ₹4,00,000",
    "generator.budget.5k20k": "₹4,00,000 - ₹16,00,000",
    "generator.budget.20k50k": "₹16,00,000 - ₹40,00,000",
    "generator.budget.over50k": "₹40,00,000 से अधिक",
    "generator.location.label": "स्थान का प्रकार",
    "generator.location.placeholder": "प्रकार चुनें",
    "generator.location.urban": "शहरी / शहर",
    "generator.location.suburban": "उपनगरीय",
    "generator.location.semiurban": "अर्ध-शहरी",
    "generator.location.rural": "ग्रामीण / गांव",
    "generator.location.remote": "पूरी तरह दूरस्थ",
    "generator.audience.label": "आप किसकी मदद करना चाहते हैं?",
    "generator.audience.placeholder": "जैसे, व्यस्त माता-पिता, छोटे व्यवसाय मालिक, छात्र, बुजुर्ग...",
    "generator.audience.hint": "उन लोगों के बारे में सोचें जिनकी समस्याओं को आप हल करना चाहते हैं",
    "generator.submit": "व्यवसाय विचार बनाएं",
    "generator.loading": "आपके संदर्भ का विश्लेषण हो रहा है...",
    
    // Results Section
    "results.title": "आपकी व्यक्तिगत",
    "results.title.highlight": "व्यवसाय दिशा",
    "results.subtitle": "आपके अनूठे संदर्भ के आधार पर, हमारी AI यह सुझाव देती है",
    "results.idea.label": "अनुशंसित दिशा",
    "results.idea.whyFits": "यह आपके लिए क्यों उपयुक्त है",
    "results.feasibility.title": "व्यवहार्यता विश्लेषण",
    "results.feasibility.disclaimer": "ये आपके इनपुट पर आधारित AI अनुमान हैं। वास्तविक परिणाम भिन्न हो सकते हैं।",
    "results.roadmap.title": "कार्यान्वयन रोडमैप",
    "results.roadmap.subtitle": "लॉन्च का चरण-दर-चरण रास्ता",
    "results.pitch.title": "आपकी त्वरित पिच",
    
    // Final CTA
    "cta.complete": "विश्लेषण पूर्ण",
    "cta.title": "अगला कदम उठाने के लिए तैयार?",
    "cta.subtitle": "आपकी व्यक्तिगत व्यवसाय दिशा बस शुरुआत है। अपने परिणाम सहेजें, अपने विचार को परिष्कृत करें, या अलग रास्ते खोजें।",
    "cta.save": "PDF डाउनलोड करें",
    "cta.share": "परिणाम साझा करें",
    "cta.restart": "अलग इनपुट आज़माएं",
    "cta.features.title": "UDHBHAV AI के साथ आपको क्या मिलता है",
    "cta.features.ai": "AI-संचालित विश्लेषण",
    "cta.features.roadmaps": "व्यक्तिगत रोडमैप",
    "cta.features.scoring": "व्यवहार्यता स्कोरिंग",
    "cta.features.insights": "बाजार अंतर्दृष्टि",
    
    // Footer
    "footer.tagline": "कौशल और अवसरों को जोड़ना।",
    "footer.disclaimer": "UDHBHAV AI © 2026 • AI आउटपुट सुझाव हैं, गारंटी नहीं",
    
    // Chatbot
    "chat.title": "UDHBHAV AI सहायक",
    "chat.subtitle": "व्यवसाय शुरू करने के बारे में कुछ भी पूछें",
    "chat.placeholder": "अपना सवाल लिखें...",
    "chat.send": "भेजें",
    "chat.welcome": "नमस्ते! मैं आपकी उद्यमशीलता यात्रा में मदद करने के लिए यहां हूं। व्यवसाय शुरू करने, विचारों को मान्य करने, या बाजार की जरूरतों को समझने के बारे में कुछ भी पूछें।",
  },
  ta: {
    // Navigation
    "nav.tagline": "AI-இயக்கப்படும் வணிக வழிகாட்டுதல்",
    
    // Hero Section
    "hero.badge": "AI-இயக்கப்படும் வணிக வழிகாட்டுதல்",
    "hero.headline": "உங்கள் திறன்களை மாற்றுங்கள்",
    "hero.headline.highlight": "உண்மையான வணிக பாதையாக",
    "hero.subheadline": "AI வழிகாட்டுதலுடன். முதல்முறை நிறுவனர்களுக்காக உருவாக்கப்பட்டது. உங்கள் தனித்துவமான பின்னணியை நடவடிக்கை எடுக்கக்கூடிய தொடக்க யோசனைகளாக மாற்றுங்கள்.",
    "hero.cta": "தொடங்கு",
    "hero.trust": "கிரெடிட் கார்டு தேவையில்லை • இலவசமாக ஆராயுங்கள் • தனிப்பட்ட மற்றும் பாதுகாப்பான",
    
    // Generator Section
    "generator.title": "உங்களைப் பற்றி சொல்லுங்கள்",
    "generator.subtitle": "உங்கள் பின்னணியையும் இலக்குகளையும் பகிருங்கள். தனிப்பயனாக்கப்பட்ட வணிக திசைகளை உருவாக்க எங்கள் AI உங்கள் தனித்துவமான சூழலை பகுப்பாய்வு செய்யும்.",
    "generator.skills.label": "உங்கள் முக்கிய திறன்கள் அல்லது நிபுணத்துவம் என்ன?",
    "generator.skills.placeholder": "எ.கா., நான் கற்பிப்பதில் நல்லவன், கணக்கியலில் அனுபவம் உள்ளது, பாரம்பரிய சமையல் தெரியும்...",
    "generator.skills.hint": "தொழில்முறை திறன்கள், பொழுதுபோக்குகள், அல்லது நீங்கள் நன்றாக செய்யும் எதையும் சேர்க்கவும்",
    "generator.interests.label": "எந்த தலைப்புகள் அல்லது தொழில்கள் உங்களுக்கு ஆர்வமாக உள்ளன?",
    "generator.interests.placeholder": "எ.கா., நிலைத்தன்மை, கல்வி, உள்ளூர் உணவு, தொழில்நுட்பம்...",
    "generator.budget.label": "தொடக்க பட்ஜெட்",
    "generator.budget.placeholder": "வரம்பைத் தேர்ந்தெடுக்கவும்",
    "generator.budget.under1k": "₹80,000க்கு கீழ்",
    "generator.budget.1k5k": "₹80,000 - ₹4,00,000",
    "generator.budget.5k20k": "₹4,00,000 - ₹16,00,000",
    "generator.budget.20k50k": "₹16,00,000 - ₹40,00,000",
    "generator.budget.over50k": "₹40,00,000க்கு மேல்",
    "generator.location.label": "இருப்பிட வகை",
    "generator.location.placeholder": "வகையைத் தேர்ந்தெடுக்கவும்",
    "generator.location.urban": "நகர்ப்புற / நகரம்",
    "generator.location.suburban": "புறநகர்",
    "generator.location.semiurban": "அரை-நகர்ப்புற",
    "generator.location.rural": "கிராமப்புற / கிராமம்",
    "generator.location.remote": "முழுமையாக தொலைநிலை",
    "generator.audience.label": "யாருக்கு உதவ விரும்புகிறீர்கள்?",
    "generator.audience.placeholder": "எ.கா., பிஸியான பெற்றோர், சிறு வணிக உரிமையாளர்கள், மாணவர்கள், முதியோர்...",
    "generator.audience.hint": "யாருடைய பிரச்சனைகளை தீர்க்க விரும்புகிறீர்கள் என்று நினைக்கவும்",
    "generator.submit": "வணிக யோசனைகளை உருவாக்கு",
    "generator.loading": "உங்கள் சூழலை பகுப்பாய்வு செய்கிறது...",
    
    // Results Section
    "results.title": "உங்கள் தனிப்பயனாக்கப்பட்ட",
    "results.title.highlight": "வணிக திசை",
    "results.subtitle": "உங்கள் தனித்துவமான சூழலின் அடிப்படையில், எங்கள் AI இதை பரிந்துரைக்கிறது",
    "results.idea.label": "பரிந்துரைக்கப்பட்ட திசை",
    "results.idea.whyFits": "இது உங்களுக்கு ஏன் பொருத்தமானது",
    "results.feasibility.title": "சாத்தியக்கூறு பகுப்பாய்வு",
    "results.feasibility.disclaimer": "இவை உங்கள் உள்ளீடுகளின் அடிப்படையிலான AI மதிப்பீடுகள். உண்மையான முடிவுகள் மாறுபடலாம்.",
    "results.roadmap.title": "செயல்படுத்தும் வழிகாட்டி",
    "results.roadmap.subtitle": "தொடங்குவதற்கான படிப்படியான பாதை",
    "results.pitch.title": "உங்கள் விரைவான பிட்ச்",
    
    // Final CTA
    "cta.complete": "பகுப்பாய்வு முடிந்தது",
    "cta.title": "அடுத்த படி எடுக்க தயாரா?",
    "cta.subtitle": "உங்கள் தனிப்பயனாக்கப்பட்ட வணிக திசை வெறும் தொடக்கம். உங்கள் முடிவுகளைச் சேமியுங்கள், உங்கள் யோசனையை செம்மைப்படுத்துங்கள், அல்லது வெவ்வேறு பாதைகளை ஆராயுங்கள்.",
    "cta.save": "PDF பதிவிறக்கம்",
    "cta.share": "முடிவுகளை பகிரவும்",
    "cta.restart": "வேறு உள்ளீடுகளை முயற்சிக்கவும்",
    "cta.features.title": "UDHBHAV AI-ல் உங்களுக்கு என்ன கிடைக்கும்",
    "cta.features.ai": "AI-இயக்கப்படும் பகுப்பாய்வு",
    "cta.features.roadmaps": "தனிப்பயனாக்கப்பட்ட வழிகாட்டிகள்",
    "cta.features.scoring": "சாத்தியக்கூறு மதிப்பீடு",
    "cta.features.insights": "சந்தை நுண்ணறிவுகள்",
    
    // Footer
    "footer.tagline": "திறன்களையும் வாய்ப்புகளையும் இணைக்கிறது.",
    "footer.disclaimer": "UDHBHAV AI © 2026 • AI வெளியீடுகள் பரிந்துரைகள், உத்தரவாதங்கள் அல்ல",
    
    // Chatbot
    "chat.title": "UDHBHAV AI உதவியாளர்",
    "chat.subtitle": "வணிகத்தைப் பற்றி எதையும் கேளுங்கள்",
    "chat.placeholder": "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...",
    "chat.send": "அனுப்பு",
    "chat.welcome": "வணக்கம்! உங்கள் தொழில்முனைவோர் பயணத்தில் உதவ நான் இங்கே இருக்கிறேன். வணிகத்தை தொடங்குவது, யோசனைகளை சரிபார்ப்பது அல்லது சந்தை தேவைகளை புரிந்துகொள்வது பற்றி எதையும் கேளுங்கள்.",
  },
  te: {
    // Navigation
    "nav.tagline": "AI-ఆధారిత వ్యాపార మార్గదర్శకత్వం",
    
    // Hero Section
    "hero.badge": "AI-ఆధారిత వ్యాపార మార్గదర్శకత్వం",
    "hero.headline": "మీ నైపుణ్యాలను మార్చండి",
    "hero.headline.highlight": "నిజమైన వ్యాపార మార్గంగా",
    "hero.subheadline": "AI మార్గదర్శకత్వంతో. మొదటిసారి వ్యవస్థాపకుల కోసం నిర్మించబడింది. మీ ప్రత్యేక నేపథ్యాన్ని చర్య తీసుకోగల స్టార్టప్ ఆలోచనలుగా మార్చండి.",
    "hero.cta": "ప్రారంభించు",
    "hero.trust": "క్రెడిట్ కార్డ్ అవసరం లేదు • ఉచితంగా అన్వేషించండి • ప్రైవేట్ & సురక్షితం",
    
    // Generator Section
    "generator.title": "మీ గురించి చెప్పండి",
    "generator.subtitle": "మీ నేపథ్యం మరియు లక్ష్యాలను షేర్ చేయండి. వ్యక్తిగతీకరించిన వ్యాపార దిశలను రూపొందించడానికి మా AI మీ ప్రత్యేక సందర్భాన్ని విశ్లేషిస్తుంది.",
    "generator.skills.label": "మీ ప్రధాన నైపుణ్యాలు లేదా నిపుణత ఏమిటి?",
    "generator.skills.placeholder": "ఉదా., నేను బోధించడంలో మంచివాడిని, అకౌంటింగ్‌లో అనుభవం ఉంది, సంప్రదాయ వంటకాలు వండటం తెలుసు...",
    "generator.skills.hint": "వృత్తిపరమైన నైపుణ్యాలు, అభిరుచులు లేదా మీరు బాగా చేసే ఏదైనా చేర్చండి",
    "generator.interests.label": "ఏ అంశాలు లేదా పరిశ్రమలు మీకు ఆసక్తి కలిగిస్తాయి?",
    "generator.interests.placeholder": "ఉదా., సుస్థిరత, విద్య, స్థానిక ఆహారం, సాంకేతికత...",
    "generator.budget.label": "ప్రారంభ బడ్జెట్",
    "generator.budget.placeholder": "పరిధిని ఎంచుకోండి",
    "generator.budget.under1k": "₹80,000 కంటే తక్కువ",
    "generator.budget.1k5k": "₹80,000 - ₹4,00,000",
    "generator.budget.5k20k": "₹4,00,000 - ₹16,00,000",
    "generator.budget.20k50k": "₹16,00,000 - ₹40,00,000",
    "generator.budget.over50k": "₹40,00,000 కంటే ఎక్కువ",
    "generator.location.label": "స్థాన రకం",
    "generator.location.placeholder": "రకాన్ని ఎంచుకోండి",
    "generator.location.urban": "పట్టణ / నగరం",
    "generator.location.suburban": "శివార్లు",
    "generator.location.semiurban": "సెమీ-అర్బన్",
    "generator.location.rural": "గ్రామీణ / గ్రామం",
    "generator.location.remote": "పూర్తిగా రిమోట్",
    "generator.audience.label": "మీరు ఎవరికి సహాయం చేయాలనుకుంటున్నారు?",
    "generator.audience.placeholder": "ఉదా., బిజీగా ఉండే తల్లిదండ్రులు, చిన్న వ్యాపార యజమానులు, విద్యార్థులు, వృద్ధులు...",
    "generator.audience.hint": "ఎవరి సమస్యలను మీరు పరిష్కరించాలనుకుంటున్నారో ఆలోచించండి",
    "generator.submit": "వ్యాపార ఆలోచనలు రూపొందించు",
    "generator.loading": "మీ సందర్భాన్ని విశ్లేషిస్తోంది...",
    
    // Results Section
    "results.title": "మీ వ్యక్తిగతీకరించిన",
    "results.title.highlight": "వ్యాపార దిశ",
    "results.subtitle": "మీ ప్రత్యేక సందర్భం ఆధారంగా, మా AI ఇది సిఫార్సు చేస్తుంది",
    "results.idea.label": "సిఫార్సు చేసిన దిశ",
    "results.idea.whyFits": "ఇది మీకు ఎందుకు సరిపోతుంది",
    "results.feasibility.title": "సాధ్యత విశ్లేషణ",
    "results.feasibility.disclaimer": "ఇవి మీ ఇన్‌పుట్‌ల ఆధారంగా AI అంచనాలు. వాస్తవ ఫలితాలు మారవచ్చు.",
    "results.roadmap.title": "అమలు రోడ్‌మ్యాప్",
    "results.roadmap.subtitle": "లాంచ్ చేయడానికి దశల వారీ మార్గం",
    "results.pitch.title": "మీ క్విక్ పిచ్",
    
    // Final CTA
    "cta.complete": "విశ్లేషణ పూర్తయింది",
    "cta.title": "తదుపరి అడుగు వేయడానికి సిద్ధంగా ఉన్నారా?",
    "cta.subtitle": "మీ వ్యక్తిగతీకరించిన వ్యాపార దిశ కేవలం ప్రారంభం. మీ ఫలితాలను సేవ్ చేయండి, మీ ఆలోచనను మెరుగుపరచండి లేదా వేర్వేరు మార్గాలను అన్వేషించండి.",
    "cta.save": "PDF డౌన్‌లోడ్",
    "cta.share": "ఫలితాలను షేర్ చేయండి",
    "cta.restart": "వేరే ఇన్‌పుట్‌లు ప్రయత్నించండి",
    "cta.features.title": "UDHBHAV AI తో మీకు ఏమి లభిస్తుంది",
    "cta.features.ai": "AI-ఆధారిత విశ్లేషణ",
    "cta.features.roadmaps": "వ్యక్తిగతీకరించిన రోడ్‌మ్యాప్‌లు",
    "cta.features.scoring": "సాధ్యత స్కోరింగ్",
    "cta.features.insights": "మార్కెట్ అంతర్దృష్టులు",
    
    // Footer
    "footer.tagline": "నైపుణ్యాలు & అవకాశాలను కలుపుతోంది.",
    "footer.disclaimer": "UDHBHAV AI © 2026 • AI అవుట్‌పుట్‌లు సూచనలు, హామీలు కాదు",
    
    // Chatbot
    "chat.title": "UDHBHAV AI సహాయకుడు",
    "chat.subtitle": "వ్యాపారం గురించి ఏదైనా అడగండి",
    "chat.placeholder": "మీ ప్రశ్నను టైప్ చేయండి...",
    "chat.send": "పంపు",
    "chat.welcome": "నమస్కారం! మీ వ్యవస్థాపక ప్రయాణంలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. వ్యాపారాన్ని ప్రారంభించడం, ఆలోచనలను ధృవీకరించడం లేదా మార్కెట్ అవసరాలను అర్థం చేసుకోవడం గురించి ఏదైనా అడగండి.",
  },
};

const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
  te: "తెలుగు",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { languageNames };
