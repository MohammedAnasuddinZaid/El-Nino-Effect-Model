import type { Language } from './i18n'
import { FAQ as FAQ_EN, PROJECT as PROJECT_EN, SOURCES, type FAQItem, type Source } from './siteContent'

export type ProjectCopy = typeof PROJECT_EN
export type { FAQItem, Source }

/**
 * Hindi dossier copy. Kept separate from the English source of truth so the
 * English text stays exactly as the student wrote it.
 */
const PROJECT_HI: ProjectCopy = {
  title: 'एल नीनो और जल संरक्षण',
  subtitle: 'टिकाऊ खेती के लिए वर्षा जल संचयन और ड्रिप सिंचाई',
  student: 'अहमदी बेगम',
  className: 'कक्षा 7 · वर्ग बी',
  aim:
    'एल नीनो की मूल बात समझाना और यह दिखाना कि बारिश कम या अनियमित होने पर वर्षा जल संचयन और ड्रिप सिंचाई कैसे पानी बचाने और खेती में मदद कर सकते हैं।',
  objectives: [
    'एल नीनो और मौसम पर उसके असर को समझना।',
    'बारिश, खेती और उपलब्ध पानी को जोड़कर देखना।',
    'वर्षा जल संचयन क्यों ज़रूरी है, यह समझाना।',
    'छत से पानी जमा करना, छानना और भंडारण दिखाना।',
    'ड्रिप सिंचाई के काम करने का तरीका दिखाना।',
    'सूखे समय में सही जल प्रबंधन कैसे मदद करता है, यह दिखाना।',
    'जल संरक्षण और टिकाऊ खेती के बारे में जागरूकता बढ़ाना।',
  ],
  methodology: [
    'मज़बूत प्रदर्शनी आधार बनाकर उसे प्रशांत महासागर, घर, भंडारण और खेती के हिस्सों में बाँटना।',
    'गर्म सतह के पानी, व्यापारिक हवाओं के तीरों और वायुमंडलीय गति के साथ प्रशांत महासागर का नामांकित चित्र बनाना।',
    'सपाट छत, नाली और पाइप वाला घर बनाना।',
    'पाइप को फ़िल्टर से होते हुए भंडारण टंकी तक ले जाना।',
    'टंकी को कम वोल्टेज DC पंप से मुख्य सिंचाई लाइन और पतली ड्रिप नलियों से जोड़ना।',
    'नमूना फ़सलों की जड़ों के पास ड्रिप एमिटर रखना।',
    'बारिश, संचयन, छानना, भंडारण और बूँद-बूँद सिंचाई दिखाना।',
  ],
  outcomes: [
    'एल नीनो को एक प्राकृतिक जलवायु प्रक्रिया के रूप में साफ़ और दिखने वाली तरह समझाना।',
    'छत से संचयन, छानने और भंडारण का चलता हुआ प्रदर्शन।',
    'पौधों की जड़ों तक पानी पहुँचने का जुड़ा हुआ प्रदर्शन।',
    'भंडारण और किफ़ायती सिंचाई क्यों ज़रूरी है, इसकी व्यावहारिक समझ।',
  ],
  applications: [
    'घरों, स्कूलों और दूसरी इमारतों की छतों पर संचयन।',
    'जमा बारिश के पानी से बगीचों और खेतों की सिंचाई।',
    'सब्ज़ियों, फलों के पौधों और दूसरी फ़सलों को किफ़ायती सिंचाई।',
    'अनियमित बारिश वाले इलाकों में जल की योजना।',
    'जलवायु और जल संरक्षण जागरूकता कार्यक्रम।',
  ],
  conclusion:
    'एल नीनो को रोका नहीं जा सकता, पर पानी की उपलब्धता पर उसके असर को योजना और सोच-समझकर पानी के इस्तेमाल से संभाला जा सकता है। वर्षा जल संचयन उपलब्ध बारिश को पकड़ता है, और ड्रिप सिंचाई जमा पानी को किफ़ायती ढंग से पहुँचाती है। दोनों मिलकर जलवायु की समझ से स्थानीय काम तक का व्यावहारिक रास्ता दिखाते हैं।',
  socialMessage:
    'हर बूँद मायने रखती है: बारिश जमा करें, पानी बचाएँ, और टिकाऊ खेती को आगे बढ़ाएँ।',
  limitations: [
    'डिजिटल प्रशांत महासागर चित्र एक सरल शैक्षिक दृश्य है, कोई पूर्वानुमान या जलवायु सिमुलेशन नहीं।',
    'डिजिटल फ़िल्टर की परतें सिर्फ समझाने के लिए हैं; उन्हें असली फ़िल्टर से मिलाकर देखना चाहिए।',
    'गीला हिस्सा और जड़ का कटा दृश्य शिक्षा के लिए हैं, मापे गए मिट्टी-नमी के आँकड़े नहीं।',
    'डिजिटल मॉडल टंकी और खेत के बीच कम वोल्टेज DC पंप दिखाता है, जो दी गई सामग्री सूची पर आधारित एक व्याख्या है; असली मॉडल गुरुत्व से भी चल सकता है।',
    'संचयन कैलकुलेटर एक अनुमान देता है, कोई सीधा माप नहीं।',
  ],
  openQuestions: [
    'आधार, घर, फ़िल्टर, टंकी और पाइपों की अंतिम नाप और जगह क्या होगी?',
    'असली मॉडल में DC पंप लगेगा या गुरुत्व से पानी चलेगा?',
    'असली फ़िल्टर में कौन-सी सामग्री और किस क्रम में परतें होंगी?',
    'असली मॉडल में फ़र्स्ट-फ्लश, जाली या ओवरफ़्लो पाइप है या नहीं?',
    'आख़िरी पौधे असली, कृत्रिम या मिले-जुले होंगे?',
  ],
}

const FAQ_HI: FAQItem[] = [
  {
    group: 'एल नीनो',
    q: 'एल नीनो क्या है?',
    a: 'एल नीनो एक प्राकृतिक जलवायु प्रक्रिया है, जिसमें मध्य और पूर्वी प्रशांत महासागर का सतही पानी सामान्य से ज़्यादा गर्म हो जाता है। यह दुनिया भर के मौसम और बारिश पर असर डाल सकता है।',
  },
  {
    group: 'एल नीनो',
    q: 'एल नीनो भारत को कैसे प्रभावित करता है?',
    a: 'एल नीनो भारतीय ग्रीष्म मानसून को कमज़ोर कर सकता है और बारिश सामान्य से कम रहने का ख़तरा बढ़ा सकता है। हर बार सूखा नहीं पड़ता, और दूसरे कारण भी मायने रखते हैं।',
  },
  {
    group: 'एल नीनो',
    q: 'एल नीनो क्यों होता है?',
    a: 'जब प्रशांत महासागर का तापमान और हवा की सामान्य गति बदलती है, तब एल नीनो बनता है। व्यापारिक हवाएँ कमज़ोर पड़ जाती हैं और गर्म सतही पानी पूर्व की ओर खिसक जाता है।',
  },
  {
    group: 'एल नीनो',
    q: 'क्या एल नीनो और ग्लोबल वार्मिंग एक ही हैं?',
    a: 'नहीं। एल नीनो कुछ महीनों में बदलने वाली प्राकृतिक प्रक्रिया है। ग्लोबल वार्मिंग पृथ्वी के औसत तापमान का लंबे समय तक बढ़ना है, जिसका मुख्य कारण इंसानी गतिविधियाँ हैं।',
  },
  {
    group: 'वर्षा जल',
    q: 'वर्षा जल संचयन क्या है?',
    a: 'यह बारिश के पानी को जमा करके बाद में इस्तेमाल करने की प्रक्रिया है। छत वाले सिस्टम में आमतौर पर छत, नाली, पाइप, फ़िल्टर और भंडारण होता है।',
  },
  {
    group: 'वर्षा जल',
    q: 'फ़िल्टर क्या करता है?',
    a: 'यह पत्ते, कंकड़ और घुले कचरे को रोकता है। इससे पानी साफ़ दिखने लगता है, पर वह अपने आप पीने लायक नहीं बन जाता। पीने के लिए सही उपचार और जाँच ज़रूरी है।',
  },
  {
    group: 'वर्षा जल',
    q: 'भंडारण क्यों ज़रूरी है?',
    a: 'भंडारण जमा पानी को सँभालकर रखता है ताकि बारिश रुकने के बाद भी उसका इस्तेमाल हो सके। उपलब्ध पानी टंकी की क्षमता, पहले की बारिश और पहले इस्तेमाल हुए पानी पर निर्भर करता है।',
  },
  {
    group: 'सिंचाई',
    q: 'ड्रिप सिंचाई पानी कैसे बचाती है?',
    a: 'यह पानी को धीरे-धीरे और तय मात्रा में पौधों की जड़ों के पास पहुँचाती है। इससे कुछ दूसरे तरीकों की तुलना में बहाव और भाप बनने से होने वाला नुकसान कम हो सकता है।',
  },
  {
    group: 'सिंचाई',
    q: 'ड्रिप सिंचाई के नुकसान क्या हैं?',
    a: 'लगाने में खर्च ज़्यादा हो सकता है, और अगर पानी छना न हो या सिस्टम की देखभाल न हो, तो छोटे एमिटर बंद हो सकते हैं।',
  },
  {
    group: 'हमारा मॉडल',
    q: 'आपका मॉडल कैसे काम करता है?',
    a: 'पहले मैं एल नीनो और बारिश पर उसके संभावित असर को समझाती हूँ। फिर छत पर डाला पानी नाली और पाइप से बहकर फ़िल्टर से गुज़रता है और भंडारण टंकी में जाता है। आख़िर में जमा पानी ड्रिप नलियों से बूँद-बूँद कर पौधों तक पहुँचता है।',
  },
  {
    group: 'हमारा मॉडल',
    q: 'मुख्य संदेश क्या है?',
    a: 'हम प्राकृतिक जलवायु घटनाओं को नियंत्रित नहीं कर सकते, पर वर्षा जल जमा करके, बर्बादी कम करके और किफ़ायती सिंचाई अपनाकर पानी की कमी के लिए तैयार रह सकते हैं।',
  },
  {
    group: 'छोटी जाँच',
    q: 'क्या हम एल नीनो को रोक सकते हैं?',
    a: 'नहीं। एल नीनो एक प्राकृतिक जलवायु घटना है। हम अच्छे जल प्रबंधन और संरक्षण से पानी की संभावित कमी के लिए तैयार रह सकते हैं।',
  },
]

const SOURCE_USE_HI: Record<string, string> = {
  'noaa-elnino': 'समुद्र का गर्म होना, व्यापारिक हवाओं का कमज़ोर होना और वैश्विक मौसम पर असर।',
  'climate-gov-enso': 'सामान्य–एल नीनो–ला नीना की तुलना और निगरानी का संदर्भ।',
  'nasa-elnino': 'समुद्र और वायुमंडल की परस्पर क्रिया तथा प्रशांत महासागर के बदलाव के दृश्य।',
  'imd-faq': 'एल नीनो और मानसून के संभावित संबंध तथा दूसरे कारक।',
  cgwb: 'छत का जलग्रहण, नालियाँ, पाइप, जाली, फ़र्स्ट-फ्लश और भंडारण।',
  telangana: 'छत पर संचयन, सफ़ाई और ओवरफ़्लो की व्यावहारिक जानकारी।',
  jalshakti: 'देश में जल और स्वच्छता का संदर्भ तथा सार्वजनिक संसाधन।',
  'fao-drip': 'एमिटर का व्यवहार, फ़िल्टर, रुकावट और सिंचाई डिज़ाइन।',
  'who-water': 'साफ़ दिखने वाला पानी और सुरक्षित पीने का पानी एक क्यों नहीं हैं।',
}

export type DossierUi = {
  projectPanel: string
  sourcesPanel: string
  eyebrow: string
  year: string
  student: string
  klass: string
  format: string
  formatValue: string
  tabsAria: string
  tabs: { id: 'overview' | 'method' | 'notes' | 'faq'; label: string }[]
  secAim: string
  secIdea: string
  ideaHeading: string
  ideaP1: string
  ideaP2: string
  secConclusion: string
  secObjectives: string
  secBuildMethod: string
  methodHeading: string
  secOutcomes: string
  secApplications: string
  secClaims: string
  claimsHeading: string
  secVerify: string
  verifyHeading: string
  secDesignNote: string
  designHeading: string
  designP1: string
  designP2: string
  secVisitorQ: string
  faqHeading: string
  openSources: string
  sourcesEyebrow: string
  sourcesCount: string
  sourcesHeading: string
  sourcesLede: string
  principles: { index: string; title: string; text: string }[]
  sourceNoteHeading: string
  sourceNoteText: string
  openProject: string
  sourcesFoot: string
  categories: { climate: string; water: string; irrigation: string; safety: string }
  calculator: {
    label: string
    eyebrow: string
    heading: string
    lede: string
    inputs: string
    metric: string
    roofArea: string
    rainfall: string
    runoff: string
    tankCapacity: string
    formulaLabel: string
    formulaLine: string
    formulaResult: string
    formulaNote: string
    eventLabel: string
    estimate: string
    tank: string
    harvestLabel: string
    harvestNote: string
    gross: string
    storable: string
    overflow: string
    caution: string
    sourcesLink: string
  }
}

const UI_EN: DossierUi = {
  projectPanel: 'Project dossier',
  sourcesPanel: 'Source library',
  eyebrow: 'Project dossier · Science exhibition',
  year: '2026 / Class 7B',
  student: 'Student',
  klass: 'Class',
  format: 'Format',
  formatValue: 'Interactive 3D model',
  tabsAria: 'Project dossier sections',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'method', label: 'Method' },
    { id: 'notes', label: 'Model notes' },
    { id: 'faq', label: 'Questions & answers' },
  ],
  secAim: '01 / Aim',
  secIdea: '02 / The idea',
  ideaHeading: 'Climate is uncertain. Water planning need not be.',
  ideaP1:
    'El Niño is a natural pattern, not a controllable event. It can tilt the odds of rainfall one way or another, but it cannot decide a single village’s weather. The practical response is to prepare: catch rain when it arrives, store it safely, and deliver it where it grows food.',
  ideaP2:
    'This exhibit connects a simplified Pacific cross-section to a rooftop catchment, a filter and tank, and a drip-irrigated crop bed. Each stage is built to be explored — not simply watched.',
  secConclusion: '03 / Conclusion',
  secObjectives: '04 / Objectives',
  secBuildMethod: 'Build method',
  methodHeading: 'From model base to working water route.',
  secOutcomes: 'Outcomes',
  secApplications: 'Applications',
  secClaims: 'What the digital model does — and does not — claim',
  claimsHeading: 'Clarity with limits.',
  secVerify: 'To verify against the physical build',
  verifyHeading: 'Open model notes',
  secDesignNote: 'Design note',
  designHeading: 'The pump is an interpretation.',
  designP1:
    'The digital scene shows a low DC pump between the storage tank and the raised field, based on the supplied materials list. The final physical arrangement could be gravity-fed or pumped. This is a modelling choice, clearly labelled in the component inspector.',
  designP2:
    'Filter media, the wetting bulb and the Pacific cross-section are educational visualizations. They are built to explain processes — not to simulate measurements.',
  secVisitorQ: 'Visitor questions',
  faqHeading: 'Ask the exhibit.',
  openSources: 'Open the source library',
  sourcesEyebrow: 'Evidence & method',
  sourcesCount: '09 sources',
  sourcesHeading: 'The science behind the story.',
  sourcesLede:
    'The exhibit simplifies complex Earth systems. These sources anchor the explanations; the limitations below mark where the digital model stops and the physical model begins.',
  principles: [
    { index: '01', title: 'Odds, not guarantees', text: 'El Niño is described as a shift in the probability of rainfall patterns — never as a guaranteed drought.' },
    { index: '02', title: 'Clarity, not purity', text: 'A visual filter is not a drinking-water treatment system. Safety needs testing and appropriate treatment.' },
    { index: '03', title: 'Models explain', text: 'Digital cutaways and the wetting bulb are illustrative teaching tools, not measured data.' },
  ],
  sourceNoteHeading: 'On interpretation',
  sourceNoteText:
    'This is a student science exhibit, not a research paper or a forecast. The digital ocean is a schematic; the filter media and soil cutaway are educational visualizations; the harvest calculator is an estimate based on user inputs. The physical model’s final filter layers, pump arrangement and catchment details should be recorded once the build is complete.',
  openProject: 'Open the project dossier',
  sourcesFoot: 'Compiled for the Class 7B exhibition · 2026',
  categories: { climate: 'Climate science', water: 'Rainwater & water', irrigation: 'Irrigation', safety: 'Water safety' },
  calculator: {
    label: 'Rooftop harvest estimator',
    eyebrow: 'Interactive planning tool',
    heading: 'A harvest estimate.',
    lede: 'Use one rainfall event to see how roof area, runoff and tank size shape what you can keep. This is a simplified estimate — not a measurement or a guarantee.',
    inputs: 'Your inputs',
    metric: 'Metric',
    roofArea: 'Catchment area',
    rainfall: 'Rainfall depth',
    runoff: 'Runoff coefficient',
    tankCapacity: 'Storage capacity',
    formulaLabel: 'Estimate formula',
    formulaLine: 'Area × rainfall × runoff coefficient',
    formulaResult: '= harvest potential (litres)',
    formulaNote: '1 mm of rain on 1 m² ≈ 1 litre before losses',
    eventLabel: 'For this rain event',
    estimate: 'Estimate',
    tank: 'Tank',
    harvestLabel: 'Estimated harvest',
    harvestNote: 'Before first-flush diversion, evaporation, leakage and filtration losses.',
    gross: 'Gross rainfall on roof',
    storable: 'Can be stored',
    overflow: 'Potential overflow',
    caution:
      'A full tank stops storing. Real systems need first-flush diversion, screening, a safe overflow and maintenance. Rainwater intended for drinking needs suitable treatment and testing.',
    sourcesLink: 'Read the harvesting sources',
  },
}

const UI_HI: DossierUi = {
  projectPanel: 'परियोजना फ़ाइल',
  sourcesPanel: 'स्रोत संग्रह',
  eyebrow: 'परियोजना फ़ाइल · विज्ञान प्रदर्शनी',
  year: '2026 / कक्षा 7बी',
  student: 'छात्रा',
  klass: 'कक्षा',
  format: 'प्रारूप',
  formatValue: 'इंटरैक्टिव 3D मॉडल',
  tabsAria: 'परियोजना फ़ाइल के भाग',
  tabs: [
    { id: 'overview', label: 'परिचय' },
    { id: 'method', label: 'तरीका' },
    { id: 'notes', label: 'मॉडल नोट्स' },
    { id: 'faq', label: 'प्रश्न और उत्तर' },
  ],
  secAim: '01 / उद्देश्य',
  secIdea: '02 / विचार',
  ideaHeading: 'जलवायु अनिश्चित है, पर जल की योजना अनिश्चित न हो।',
  ideaP1:
    'एल नीनो एक प्राकृतिक प्रक्रिया है, कोई ऐसी घटना नहीं जिसे हम चला सकें। यह बारिश की संभावना को इधर-उधर झुका सकता है, पर किसी एक गाँव का मौसम तय नहीं कर सकता। इसलिए तैयारी ज़रूरी है: बारिश आए तो जमा करो, सुरक्षित रखो, और वहाँ पहुँचाओ जहाँ अनाज उगता है।',
  ideaP2:
    'यह प्रदर्शनी प्रशांत महासागर के सरल चित्र को छत के जलग्रहण, फ़िल्टर और टंकी, और ड्रिप सिंचाई वाली फ़सल क्यारी से जोड़ती है। हर हिस्सा देखने के लिए बना है — सिर्फ़ देखने के लिए नहीं।',
  secConclusion: '03 / निष्कर्ष',
  secObjectives: '04 / लक्ष्य',
  secBuildMethod: 'बनाने का तरीका',
  methodHeading: 'मॉडल के आधार से पानी के रास्ते तक।',
  secOutcomes: 'परिणाम',
  secApplications: 'उपयोग',
  secClaims: 'डिजिटल मॉडल क्या बताता है — और क्या नहीं',
  claimsHeading: 'सीमाओं के साथ स्पष्टता।',
  secVerify: 'असली मॉडल से जाँचने के लिए',
  verifyHeading: 'खुले मॉडल नोट्स',
  secDesignNote: 'डिज़ाइन नोट',
  designHeading: 'पंप एक व्याख्या है।',
  designP1:
    'डिजिटल दृश्य में भंडारण टंकी और ऊँचे खेत के बीच कम वोल्टेज वाला DC पंप दिखाया गया है, जो दी गई सामग्री सूची पर आधारित है। असली मॉडल गुरुत्व से या पंप से चल सकता है। यह एक चुनाव है, जिसे हिस्सा-निरीक्षक में साफ़ लिखा गया है।',
  designP2:
    'फ़िल्टर की सामग्री, गीला हिस्सा और प्रशांत महासागर का चित्र शिक्षा के लिए हैं। ये प्रक्रियाएँ समझाने के लिए बनाए गए हैं — माप नापने के लिए नहीं।',
  secVisitorQ: 'दर्शकों के प्रश्न',
  faqHeading: 'प्रदर्शनी से पूछें।',
  openSources: 'स्रोत संग्रह खोलें',
  sourcesEyebrow: 'प्रमाण और तरीका',
  sourcesCount: '09 स्रोत',
  sourcesHeading: 'कहानी के पीछे का विज्ञान।',
  sourcesLede:
    'यह प्रदर्शनी जटिल पृथ्वी प्रणालियों को सरल बनाती है। ये स्रोत समझ को आधार देते हैं; नीचे दी सीमाएँ बताती हैं कि डिजिटल मॉडल कहाँ रुकता है और असली मॉडल कहाँ शुरू होता है।',
  principles: [
    { index: '01', title: 'संभावना, गारंटी नहीं', text: 'एल नीनो को बारिश के बदलने की संभावना बताया गया है — कभी पक्के सूखे के रूप में नहीं।' },
    { index: '02', title: 'साफ़, पर शुद्ध नहीं', text: 'दिखने वाला फ़िल्टर पीने के पानी की सफ़ाई की व्यवस्था नहीं है। सुरक्षा के लिए जाँच और सही उपचार ज़रूरी है।' },
    { index: '03', title: 'मॉडल समझाते हैं', text: 'डिजिटल कटे दृश्य और गीला हिस्सा सिखाने के साधन हैं, मापे गए आँकड़े नहीं।' },
  ],
  sourceNoteHeading: 'व्याख्या के बारे में',
  sourceNoteText:
    'यह एक छात्र विज्ञान प्रदर्शनी है, कोई शोध पत्र या पूर्वानुमान नहीं। डिजिटल महासागर एक सरल चित्र है; फ़िल्टर सामग्री और मिट्टी का कटा दृश्य शिक्षा के लिए हैं; संचयन कैलकुलेटर आपके दिए मानों पर आधारित अनुमान है। मॉडल बन जाने पर उसकी असली फ़िल्टर परतें, पंप और जलग्रहण की जानकारी दर्ज कर लेनी चाहिए।',
  openProject: 'परियोजना फ़ाइल खोलें',
  sourcesFoot: 'कक्षा 7बी प्रदर्शनी के लिए तैयार · 2026',
  categories: { climate: 'जलवायु विज्ञान', water: 'वर्षा जल और पानी', irrigation: 'सिंचाई', safety: 'पानी की सुरक्षा' },
  calculator: {
    label: 'छत संचयन अनुमान',
    eyebrow: 'इंटरैक्टिव योजना साधन',
    heading: 'संचयन का अनुमान।',
    lede: 'एक बारिश के उदाहरण से देखें कि छत का क्षेत्र, बहाव और टंकी की नाप कितना पानी बचा पाती है। यह एक सरल अनुमान है — कोई माप या गारंटी नहीं।',
    inputs: 'आपके मान',
    metric: 'माप',
    roofArea: 'जलग्रहण क्षेत्र',
    rainfall: 'बारिश की गहराई',
    runoff: 'बहाव गुणांक',
    tankCapacity: 'भंडारण क्षमता',
    formulaLabel: 'अनुमान का सूत्र',
    formulaLine: 'क्षेत्र × बारिश × बहाव गुणांक',
    formulaResult: '= संचयन की संभावना (लीटर)',
    formulaNote: '1 मिमी बारिश, 1 मी² पर ≈ 1 लीटर (नुकसान से पहले)',
    eventLabel: 'इस बारिश के लिए',
    estimate: 'अनुमान',
    tank: 'टंकी',
    harvestLabel: 'अनुमानित संचयन',
    harvestNote: 'फ़र्स्ट-फ्लश, भाप, रिसाव और छानने के नुकसान से पहले।',
    gross: 'छत पर कुल बारिश',
    storable: 'जमा हो सकता है',
    overflow: 'छलक सकता है',
    caution:
      'टंकी भर जाने पर संचयन रुक जाता है। असली सिस्टम में फ़र्स्ट-फ्लश, जाली, सुरक्षित ओवरफ़्लो और देखभाल ज़रूरी है। पीने के लिए रखे बारिश के पानी को सही उपचार और जाँच चाहिए।',
    sourcesLink: 'संचयन के स्रोत पढ़ें',
  },
}

const PROJECT: Record<Language, ProjectCopy> = { en: PROJECT_EN, hi: PROJECT_HI }
const FAQ: Record<Language, FAQItem[]> = { en: FAQ_EN, hi: FAQ_HI }
const UI: Record<Language, DossierUi> = { en: UI_EN, hi: UI_HI }

export function getProjectCopy(language: Language) {
  return PROJECT[language]
}

export function getFaqCopy(language: Language) {
  return FAQ[language]
}

export function getDossierUi(language: Language) {
  return UI[language]
}

export function getSourceLibrary(language: Language) {
  if (language === 'en') return SOURCES
  return SOURCES.map((source) => ({ ...source, use: SOURCE_USE_HI[source.id] ?? source.use }))
}
