export type Vec3 = [number, number, number]

export type CameraPose = {
  position: Vec3
  target: Vec3
}

export type CameraPath = {
  start: CameraPose
  end: CameraPose
}

export type Metric = { label: string; value: string; tone?: 'warm' | 'cool' | 'neutral' }

export type ChapterText = {
  kicker: string
  title: string
  body: string
  note?: string
  narration: string
  caption: string
  metrics: Metric[]
}

export type Chapter = ChapterText & {
  id: string
  number: string
  align: 'left' | 'right' | 'center'
  camera: CameraPath
  interaction?: 'ocean' | 'cutaway' | 'calculator' | 'replay'
  hi: ChapterText
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'every-drop',
    number: '00',
    kicker: 'Ahmadi Begum · Class 7B · Science project',
    title: 'Every drop has a story.',
    body:
      'This is Ahmadi Begum’s Class 7 science project. It follows one drop of water — from the Pacific Ocean, to rain on a roof, into a tank, and down to a plant’s root. Simple idea: rain can change, so we save every drop we can.',
    note: 'Made by Ahmadi Begum, Class 7B. We cannot control the rain, but we can use every drop carefully.',
    narration:
      'This is Ahmadi Begum’s Class 7 science project. It follows one drop of water. The drop starts in the Pacific Ocean. It falls as rain on a roof. Then it is filtered, stored, and used to water plants. Let us follow the drop.',
    caption: 'One drop. One journey. Rain, roof, tank, root.',
    align: 'left',
    camera: {
      start: { position: [15, 10.5, 26], target: [-1, 2.0, 0] },
      end: { position: [10, 8.2, 20], target: [-2.4, 2.0, 0] },
    },
    metrics: [
      { label: 'Systems', value: '03', tone: 'cool' },
      { label: 'Journey', value: '1 drop', tone: 'neutral' },
      { label: 'Idea', value: 'Conserve', tone: 'warm' },
    ],
    hi: {
      kicker: 'अहमदी बेगम · कक्षा 7बी · विज्ञान परियोजना',
      title: 'हर बूँद की एक कहानी है।',
      body:
        'यह अहमदी बेगम की कक्षा 7 की विज्ञान परियोजना है। इसमें हम पानी की एक बूँद के साथ चलते हैं — प्रशांत महासागर से छत पर बारिश तक, फिर टंकी और पौधे की जड़ तक। सीधी बात: बारिश बदल सकती है, इसलिए हम हर बूँद बचाते हैं।',
      note: 'अहमदी बेगम, कक्षा 7बी द्वारा बनाया गया। बारिश हमारे हाथ में नहीं है, पर हर बूँद का सही इस्तेमाल हम कर सकते हैं।',
      narration:
        'यह अहमदी बेगम की कक्षा सात की विज्ञान परियोजना है। इसमें हम पानी की एक बूँद के साथ चलते हैं। बूँद प्रशांत महासागर से शुरू होती है। फिर वह छत पर बारिश बनकर गिरती है। उसके बाद उसे साफ करके टंकी में रखा जाता है और पौधों को दिया जाता है।',
      caption: 'एक बूँद। एक यात्रा। बारिश, छत, टंकी और जड़।',
      metrics: [
        { label: 'तंत्र', value: '03', tone: 'cool' },
        { label: 'यात्रा', value: '1 बूँद', tone: 'neutral' },
        { label: 'विचार', value: 'बचाओ', tone: 'warm' },
      ],
    },
  },
  {
    id: 'pacific',
    number: '01',
    kicker: 'The Pacific Ocean',
    title: 'When the Pacific changes.',
    body:
      'The Pacific is the biggest ocean on Earth. Normally, winds push warm surface water to the west. During El Niño, those winds become weaker and warm water moves east. This can change weather far away from the ocean.',
    note: 'This is a simple model, not a weather forecast. The real Pacific is much bigger and more complex.',
    narration:
      'The Pacific is the biggest ocean on Earth. Normally, winds push warm water to the west. During El Niño, the winds become weaker. Warm water moves east. The ocean and the air are connected, so weather can change far away.',
    caption: 'Normal: warm water stays in the west. El Niño: warm water moves east.',
    align: 'right',
    camera: {
      start: { position: [-6.8, 5.5, 12.5], target: [-11.2, 1.65, 0] },
      end: { position: [-10.2, 4.0, 8.6], target: [-11.4, 1.45, 0] },
    },
    metrics: [
      { label: 'Trade winds', value: 'Weaker', tone: 'warm' },
      { label: 'Warm water', value: 'Moves east', tone: 'warm' },
      { label: 'Pattern', value: 'Natural', tone: 'neutral' },
    ],
    interaction: 'ocean',
    hi: {
      kicker: 'प्रशांत महासागर',
      title: 'जब प्रशांत महासागर बदलता है।',
      body:
        'प्रशांत महासागर दुनिया का सबसे बड़ा महासागर है। आम तौर पर हवाएँ गर्म पानी को पश्चिम की ओर धकेलती हैं। एल नीनो में ये हवाएँ कमज़ोर हो जाती हैं और गर्म पानी पूर्व की ओर जाता है। इससे दूर के इलाकों का मौसम भी बदल सकता है।',
      note: 'यह एक सरल मॉडल है, मौसम का पूर्वानुमान नहीं। असली प्रशांत महासागर बहुत बड़ा और जटिल है।',
      narration:
        'प्रशांत महासागर दुनिया का सबसे बड़ा महासागर है। आम तौर पर हवाएँ गर्म पानी को पश्चिम की ओर धकेलती हैं। एल नीनो में हवाएँ कमज़ोर हो जाती हैं। गर्म पानी पूर्व की ओर चला जाता है। इससे दूर के इलाकों में मौसम बदल सकता है।',
      caption: 'आम दिन: गर्म पानी पश्चिम में। एल नीनो: गर्म पानी पूर्व की ओर।',
      metrics: [
        { label: 'हवाएँ', value: 'कमज़ोर', tone: 'warm' },
        { label: 'गर्म पानी', value: 'पूर्व की ओर', tone: 'warm' },
        { label: 'पैटर्न', value: 'प्राकृतिक', tone: 'neutral' },
      ],
    },
  },
  {
    id: 'monsoon',
    number: '02',
    kicker: 'The Indian monsoon',
    title: 'A tilt in the odds — not a promise of drought.',
    body:
      'El Niño can make India’s summer monsoon weaker. But it does not always cause a drought. Other things also affect the monsoon. That is why we plan ahead: catch rain when it comes and use less water when it is scarce.',
    note: 'El Niño changes the chance of a weaker monsoon. It does not decide the weather on its own.',
    narration:
      'El Niño can make India’s summer monsoon weaker. But it does not always cause a drought. Other things also affect the rain. We cannot be sure what will happen. So we prepare: catch rain when it comes, and use less water when it is scarce.',
    caption: 'El Niño changes the odds. Being prepared is in our hands.',
    align: 'left',
    camera: {
      start: { position: [0.8, 8.2, 19.5], target: [-2.4, 2.0, 0.2] },
      end: { position: [-0.8, 6.7, 16.2], target: [-3.4, 2.0, 0.4] },
    },
    metrics: [
      { label: 'Monsoon', value: 'Can weaken', tone: 'warm' },
      { label: 'Other causes', value: 'Also matter', tone: 'cool' },
      { label: 'Certainty', value: 'Never 100%', tone: 'neutral' },
    ],
    hi: {
      kicker: 'भारतीय मानसून',
      title: 'संभावना बदलती है — पक्का सूखा नहीं।',
      body:
        'एल नीनो से भारत का गर्मियों का मानसून कमज़ोर हो सकता है। लेकिन इसका मतलब यह नहीं कि हर बार सूखा पड़ेगा। मानसून को दूसरी चीज़ें भी प्रभावित करती हैं। इसलिए हम पहले से तैयार रहते हैं: बारिश आए तो पानी बचाओ, और कम पानी में समझदारी से काम लो।',
      note: 'एल नीनो से कमज़ोर मानसून की संभावना बढ़ती है। वह अकेला मौसम तय नहीं करता।',
      narration:
        'एल नीनो से भारत का गर्मियों का मानसून कमज़ोर हो सकता है। लेकिन हर बार सूखा नहीं पड़ता। बारिश को दूसरी चीज़ें भी प्रभावित करती हैं। हमें पक्का नहीं पता क्या होगा। इसलिए हम तैयार रहते हैं। बारिश आए तो पानी बचाते हैं, और कम पानी में समझदारी से काम लेते हैं।',
      caption: 'एल नीनो संभावना बदलता है। तैयारी हमारे हाथ में है।',
      metrics: [
        { label: 'मानसून', value: 'कमज़ोर हो सकता है', tone: 'warm' },
        { label: 'दूसरे कारण', value: 'भी ज़रूरी', tone: 'cool' },
        { label: 'निश्चितता', value: 'कभी 100% नहीं', tone: 'neutral' },
      ],
    },
  },
  {
    id: 'scarcity',
    number: '03',
    kicker: 'The water gap',
    title: 'When rain doesn’t arrive on time.',
    body:
      'If rain is late or scarce, the soil gets dry, the tank gets low, and plants get stressed. We cannot switch the ocean or the monsoon on. But we can catch the rain that does come, and use it carefully.',
    note: 'The dry field is only an example of water stress. It does not prove that El Niño caused one particular drought.',
    narration:
      'When rain is late or scarce, the soil gets dry. The tank gets low. Plants get stressed. We cannot switch the rain on. But we can catch the rain that does come. And we can use every litre carefully.',
    caption: 'Water stress is felt at home, in the soil, and in the field.',
    align: 'right',
    camera: {
      start: { position: [9.6, 6.4, 14.5], target: [8.4, 1.2, 1.2] },
      end: { position: [8.3, 5.0, 12.2], target: [9.4, 1.0, 1.5] },
    },
    metrics: [
      { label: 'Soil', value: 'Dry', tone: 'warm' },
      { label: 'Tank', value: 'Low', tone: 'warm' },
      { label: 'Our move', value: 'Adapt', tone: 'cool' },
    ],
    hi: {
      kicker: 'पानी की कमी',
      title: 'जब बारिश समय पर नहीं आती।',
      body:
        'बारिश देर से आए या कम हो, तो मिट्टी सूख जाती है, टंकी खाली हो जाती है और पौधे परेशान होते हैं। हम महासागर या मानसून को चालू-बंद नहीं कर सकते। पर जो बारिश आती है, उसे इकट्ठा कर सकते हैं और सोच-समझकर इस्तेमाल कर सकते हैं।',
      note: 'सूखा खेत सिर्फ पानी की कमी का उदाहरण है। यह साबित नहीं करता कि किसी खास सूखे की वजह सिर्फ एल नीनो था।',
      narration:
        'जब बारिश देर से आती है या कम होती है, तो मिट्टी सूख जाती है। टंकी खाली हो जाती है। पौधे मुरझाने लगते हैं। हम बारिश को चालू नहीं कर सकते। लेकिन जो बारिश आती है, उसे इकट्ठा कर सकते हैं। और हर लीटर पानी सोच-समझकर इस्तेमाल कर सकते हैं।',
      caption: 'पानी की कमी घर, मिट्टी और खेत में महसूस होती है।',
      metrics: [
        { label: 'मिट्टी', value: 'सूखी', tone: 'warm' },
        { label: 'टंकी', value: 'कम', tone: 'warm' },
        { label: 'हमारा कदम', value: 'अनुकूल बनो', tone: 'cool' },
      ],
    },
  },
  {
    id: 'catch-rain',
    number: '04',
    kicker: 'Rooftop rainwater harvesting',
    title: 'The roof becomes a rain catcher.',
    body:
      'Rain falls on the roof. The gutter catches the water. The downpipe carries it to the filter. A bigger roof can catch more rain, but only if the water is guided, cleaned, and stored safely.',
    note: 'This model shows the main path. Real systems often also use a first-flush pipe to throw away the dirtiest first rain, and a screen to stop leaves.',
    narration:
      'Rain falls on the roof. The gutter catches the water. The downpipe carries it down to the filter. Every part has a job. A bigger roof can catch more rain, but only if the water is guided and stored safely.',
    caption: 'Rain, roof, gutter, downpipe, filter.',
    align: 'left',
    camera: {
      start: { position: [0.8, 6.0, 12.2], target: [-1.9, 2.35, 0.7] },
      end: { position: [0.2, 4.6, 9.4], target: [-0.6, 2.2, 1.1] },
    },
    metrics: [
      { label: 'Catcher', value: 'Roof', tone: 'cool' },
      { label: 'Gutter', value: 'Collects', tone: 'cool' },
      { label: 'Downpipe', value: 'Gravity', tone: 'neutral' },
    ],
    hi: {
      kicker: 'छत पर वर्षा जल संचयन',
      title: 'छत बारिश पकड़ने का काम करती है।',
      body:
        'बारिश छत पर गिरती है। नाली पानी इकट्ठा करती है। पाइप उसे फ़िल्टर तक ले जाता है। बड़ी छत से ज़्यादा बारिश पकड़ी जा सकती है, लेकिन तभी जब पानी सही रास्ते से जाए, साफ हो और सुरक्षित रखा जाए।',
      note: 'यह मॉडल मुख्य रास्ता दिखाता है। असली व्यवस्था में पहली गंदी बारिश को अलग करने वाला पाइप और पत्ते रोकने वाली जाली भी होती है।',
      narration:
        'बारिश छत पर गिरती है। नाली पानी इकट्ठा करती है। पाइप पानी को नीचे फ़िल्टर तक ले जाता है। हर हिस्से का अपना काम है। बड़ी छत ज़्यादा बारिश पकड़ सकती है, लेकिन तभी जब पानी सही रास्ते से जाए और सुरक्षित रखा जाए।',
      caption: 'बारिश, छत, नाली, पाइप, फ़िल्टर।',
      metrics: [
        { label: 'पकड़ने की जगह', value: 'छत', tone: 'cool' },
        { label: 'नाली', value: 'इकट्ठा', tone: 'cool' },
        { label: 'पाइप', value: 'गुरुत्वाकर्षण', tone: 'neutral' },
      ],
    },
  },
  {
    id: 'filtration',
    number: '05',
    kicker: 'Filtration',
    title: 'Clear water is not always safe water.',
    body:
      'The filter stops leaves, grit, mud, and small pieces. The water looks clearer. But a simple filter does not remove every germ or every harmful chemical. Rainwater still needs proper treatment and testing before people drink it.',
    note: 'The filter layers in this digital model are illustrative. Match them to the real filter in Ahmadi’s physical model. Clear water still needs proper treatment and testing before drinking.',
    narration:
      'Rainwater enters the filter at the top. First, a mesh stops leaves and twigs. Then gravel and sand trap mud and small pieces. Charcoal can reduce smell and colour. The water looks clearer as it leaves. But clear water is not always safe to drink. It still needs proper treatment and testing.',
    caption: 'A filter makes water clearer. It does not make it automatically safe to drink.',
    align: 'right',
    camera: {
      start: { position: [3.8, 4.8, 12.4], target: [1.15, 1.55, 1.7] },
      end: { position: [3.1, 3.9, 10.6], target: [1.2, 1.4, 1.85] },
    },
    metrics: [
      { label: 'Leaves & grit', value: 'Stopped', tone: 'warm' },
      { label: 'Mud', value: 'Less', tone: 'cool' },
      { label: 'Safe to drink', value: 'Not sure', tone: 'warm' },
    ],
    interaction: 'cutaway',
    hi: {
      kicker: 'फ़िल्टर',
      title: 'साफ़ दिखने वाला पानी हमेशा पीने लायक नहीं होता।',
      body:
        'फ़िल्टर पत्ते, कंकड़, कीचड़ और छोटे टुकड़े रोकता है। पानी ज़्यादा साफ़ दिखने लगता है। लेकिन साधारण फ़िल्टर हर कीटाणु या हर हानिकारक चीज़ नहीं हटाता। बारिश का पानी पीने से पहले अच्छी तरह साफ और जाँचा जाना चाहिए।',
      note: 'इस डिजिटल मॉडल में फ़िल्टर की परतें सिर्फ समझाने के लिए हैं। इन्हें अहमदी के असली मॉडल के फ़िल्टर से मिलाइए। साफ़ पानी पीने से पहले जाँच और सही उपचार ज़रूरी है।',
      narration:
        'बारिश का पानी फ़िल्टर में ऊपर से आता है। सबसे पहले जाली पत्ते और टहनियाँ रोकती है। फिर कंकड़ और रेत कीचड़ और छोटे टुकड़े रोकते हैं। कोयला गंध और रंग कम कर सकता है। बाहर आते समय पानी साफ़ दिखता है। लेकिन साफ़ दिखने वाला पानी हमेशा पीने लायक नहीं होता। उसे अच्छी तरह साफ और जाँचना ज़रूरी है।',
      caption: 'फ़िल्टर पानी साफ़ करता है। पीने के लिए सुरक्षित होने की गारंटी नहीं देता।',
      metrics: [
        { label: 'पत्ते और कंकड़', value: 'रुकते हैं', tone: 'warm' },
        { label: 'कीचड़', value: 'कम', tone: 'cool' },
        { label: 'पीने लायक', value: 'पक्का नहीं', tone: 'warm' },
      ],
    },
  },
  {
    id: 'storage',
    number: '06',
    kicker: 'Storage',
    title: 'Save the rain for a dry day.',
    body:
      'The tank keeps filtered rainwater for later. It can fill up, so extra water needs a safe way out. A tank has a limited size, but even a small reserve can help a garden or a few plants through a short dry spell.',
    note: 'The harvest calculator gives an estimate, not a measurement. It depends on roof size, rainfall, water lost at the start, and tank size.',
    narration:
      'The filtered water rises inside the storage tank. The tank cannot hold an endless supply. But even a small reserve can help a garden or a few plants through a short dry time. Save water today, so you have some tomorrow.',
    caption: 'Store what falls today. Use it on a dry day.',
    align: 'left',
    camera: {
      start: { position: [8.8, 5.0, 11.6], target: [4.1, 1.1, 1.6] },
      end: { position: [7.9, 4.2, 10.0], target: [4.2, 0.95, 1.65] },
    },
    metrics: [
      { label: 'Tank level', value: 'Rising', tone: 'cool' },
      { label: 'Capacity', value: 'Limited', tone: 'neutral' },
      { label: 'Extra water', value: 'Plan a way out', tone: 'warm' },
    ],
    interaction: 'calculator',
    hi: {
      kicker: 'पानी का भंडारण',
      title: 'बारिश को सूखे दिन के लिए बचाओ।',
      body:
        'टंकी साफ किए हुए बारिश के पानी को बाद के लिए रखती है। टंकी भर सकती है, इसलिए ज़्यादा पानी को सुरक्षित रास्ते से बाहर जाना चाहिए। टंकी की जगह सीमित होती है, फिर भी थोड़ा भंडार छोटे सूखे दौर में बगीचे या कुछ पौधों की मदद कर सकता है।',
      note: 'बारिश संचय कैलकुलेटर सिर्फ अनुमान देता है, माप नहीं। यह छत के आकार, बारिश, शुरुआती नुकसान और टंकी के आकार पर निर्भर करता है।',
      narration:
        'साफ किया हुआ पानी टंकी में ऊपर आता है। टंकी में असीमित पानी नहीं रखा जा सकता। लेकिन थोड़ा भंडार भी बगीचे या कुछ पौधों को छोटे सूखे दौर में मदद कर सकता है। आज पानी बचाओ, ताकि कल काम आए।',
      caption: 'आज गिरने वाला पानी बचाओ। सूखे दिन में काम लो।',
      metrics: [
        { label: 'टंकी का स्तर', value: 'बढ़ता है', tone: 'cool' },
        { label: 'क्षमता', value: 'सीमित', tone: 'neutral' },
        { label: 'ज़्यादा पानी', value: 'निकास की योजना', tone: 'warm' },
      ],
    },
  },
  {
    id: 'drip',
    number: '07',
    kicker: 'Drip irrigation',
    title: 'Give water to the root, not the whole field.',
    body:
      'Drip pipes send water slowly, drop by drop, near the plant roots. The soil takes it in where roots can use it. Less water is lost to runoff or evaporation. Real savings depend on soil, crop, weather, and care.',
    note: 'The root cutaway is illustrative. Real water spread depends on soil. Drip emitters can clog, so filtration and cleaning matter.',
    narration:
      'From the tank, water goes into the main pipe. Then it enters thin drip tubes. Small emitters release water slowly, drop by drop, near the roots. This gives water where the plant needs it. Less water is wasted. But the small holes can clog, so cleaning and filtering matter.',
    caption: 'Slow, local, careful. Drip irrigation makes stored water go further.',
    align: 'right',
    camera: {
      start: { position: [15.4, 5.8, 13.4], target: [10.6, 0.95, 1.2] },
      end: { position: [14.0, 4.6, 11.4], target: [10.7, 0.72, 1.5] },
    },
    metrics: [
      { label: 'Delivery', value: 'Drop by drop', tone: 'cool' },
      { label: 'Target', value: 'Root zone', tone: 'cool' },
      { label: 'Cleaning', value: 'Must do', tone: 'warm' },
    ],
    hi: {
      kicker: 'ड्रिप सिंचाई',
      title: 'पानी पूरे खेत में नहीं, जड़ के पास दो।',
      body:
        'ड्रिप पाइप पानी को धीरे-धीरे, बूँद-बूँद करके पौधों की जड़ के पास भेजते हैं। मिट्टी पानी उसी जगह लेती है जहाँ जड़ उसे इस्तेमाल कर सके। बहकर और भाप बनकर कम पानी बर्बाद होता है। असली बचत मिट्टी, फसल, मौसम और देखभाल पर निर्भर करती है।',
      note: 'जड़ का कटा हुआ दृश्य सिर्फ समझाने के लिए है। असली में पानी मिट्टी के हिसाब से फैलता है। ड्रिप के छोटे छेद बंद हो सकते हैं, इसलिए फ़िल्टर और सफ़ाई ज़रूरी है।',
      narration:
        'टंकी से पानी मुख्य पाइप में आता है। फिर वह पतली ड्रिप पाइप में जाता है। छोटे छेद पानी को धीरे-धीरे, बूँद-बूँद करके जड़ के पास छोड़ते हैं। इससे पानी वहीं पहुँचता है जहाँ पौधे को ज़रूरत है। कम पानी बर्बाद होता है। लेकिन छोटे छेद बंद हो सकते हैं, इसलिए सफ़ाई और फ़िल्टर ज़रूरी है।',
      caption: 'धीरे, पास में, सोच-समझकर। ड्रिप सिंचाई पानी को दूर तक चलाती है।',
      metrics: [
        { label: 'पहुँचाना', value: 'बूँद-बूँद', tone: 'cool' },
        { label: 'लक्ष्य', value: 'जड़ का क्षेत्र', tone: 'cool' },
        { label: 'सफ़ाई', value: 'ज़रूरी', tone: 'warm' },
      ],
    },
  },
  {
    id: 'whole-system',
    number: '08',
    kicker: 'The complete model',
    title: 'One connected system. One shared resource.',
    body:
      'El Niño shows us that rain can change. Rainwater harvesting catches the rain that comes. Drip irrigation uses that saved water drop by drop. Together, they turn uncertainty into a plan for homes, schools, and farms.',
    note: 'Ahmadi Begum · Class 7B — Every Drop Counts: Harvest Rainwater, Save Water, and Support Sustainable Agriculture.',
    narration:
      'The complete model brings the story together. The ocean shows why rain can change. The roof and tank show how to catch and store water. The drip pipes show how to use it carefully. We cannot control the weather. But we can take care of the water we have.',
    caption: 'Catch what falls. Store what is needed. Give it with care.',
    align: 'left',
    camera: {
      start: { position: [0, 10.5, 34], target: [0, 1.5, 0] },
      end: { position: [0.8, 12.5, 38], target: [0, 1.15, 0] },
    },
    metrics: [
      { label: 'El Niño', value: 'Understand', tone: 'warm' },
      { label: 'Rain', value: 'Capture', tone: 'cool' },
      { label: 'Water', value: 'Conserve', tone: 'cool' },
    ],
    interaction: 'replay',
    hi: {
      kicker: 'पूरा मॉडल',
      title: 'एक जुड़ा हुआ तंत्र। एक साझा पानी।',
      body:
        'एल नीनो दिखाता है कि बारिश बदल सकती है। वर्षा जल संचयन जो बारिश आती है उसे पकड़ता है। ड्रिप सिंचाई उस बचाए पानी को बूँद-बूँद करके इस्तेमाल करती है। दोनों मिलकर अनिश्चितता को घर, स्कूल और खेत के लिए एक योजना बनाते हैं।',
      note: 'अहमदी बेगम · कक्षा 7बी — हर बूँद मायने रखती है: बारिश बचाओ, पानी बचाओ, टिकाऊ खेती में मदद करो।',
      narration:
        'पूरा मॉडल सारी कहानी जोड़ता है। महासागर दिखाता है कि बारिश क्यों बदल सकती है। छत और टंकी दिखाते हैं कि पानी कैसे इकट्ठा और सुरक्षित रखा जाए। ड्रिप पाइप दिखाते हैं कि पानी समझदारी से कैसे इस्तेमाल करें। मौसम हमारे हाथ में नहीं है। लेकिन अपने पानी की देखभाल हम कर सकते हैं।',
      caption: 'जो गिरे उसे पकड़ो। ज़रूरत तक बचाओ। सोच-समझकर दो।',
      metrics: [
        { label: 'एल नीनो', value: 'समझो', tone: 'warm' },
        { label: 'बारिश', value: 'पकड़ो', tone: 'cool' },
        { label: 'पानी', value: 'बचाओ', tone: 'cool' },
      ],
    },
  },
]

export const TOTAL_CHAPTERS = CHAPTERS.length

export function getChapterCopy(chapter: Chapter, language: 'en' | 'hi'): Chapter {
  if (language === 'hi') return { ...chapter, ...chapter.hi }
  return chapter
}
