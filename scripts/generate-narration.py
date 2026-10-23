"""Generate the exhibit narration with Edge neural voices.

Usage:
    py -3.10 -m pip install edge-tts
    py -3.10 scripts/generate-narration.py
"""

from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts

EN_VOICE = "en-IN-NeerjaExpressiveNeural"
HI_VOICE = "hi-IN-SwaraNeural"

EN = [
    "This is Ahmadi Begum's Class 7 science project. It follows one drop of water. The drop starts in the Pacific Ocean. It falls as rain on a roof. Then it is filtered, stored, and used to water plants. Let us follow the drop.",
    "The Pacific is the biggest ocean on Earth. Normally, winds push warm water to the west. During El Niño, the winds become weaker. Warm water moves east. The ocean and the air are connected, so weather can change far away.",
    "El Niño can make India's summer monsoon weaker. But it does not always cause a drought. Other things also affect the rain. We cannot be sure what will happen. So we prepare. Catch rain when it comes, and use less water when it is scarce.",
    "When rain is late or scarce, the soil gets dry. The tank gets low. Plants get stressed. We cannot switch the rain on. But we can catch the rain that does come. And we can use every litre carefully.",
    "Rain falls on the roof. The gutter catches the water. The downpipe carries it down to the filter. Every part has a job. A bigger roof can catch more rain, but only if the water is guided and stored safely.",
    "Rainwater enters the filter at the top. First, a mesh stops leaves and twigs. Then gravel and sand trap mud and small pieces. Charcoal can reduce smell and colour. The water looks clearer as it leaves. But clear water is not always safe to drink. It still needs proper treatment and testing.",
    "The filtered water rises inside the storage tank. The tank cannot hold an endless supply. But even a small reserve can help a garden or a few plants through a short dry time. Save water today, so you have some tomorrow.",
    "From the tank, water goes into the main pipe. Then it enters thin drip tubes. Small emitters release water slowly, drop by drop, near the roots. This gives water where the plant needs it. Less water is wasted. But the small holes can clog, so cleaning and filtering matter.",
    "The complete model brings the story together. The ocean shows why rain can change. The roof and tank show how to catch and store water. The drip pipes show how to use it carefully. We cannot control the weather. But we can take care of the water we have.",
]

HI = [
    "यह अहमदी बेगम की कक्षा सात की विज्ञान परियोजना है। इसमें हम पानी की एक बूँद के साथ चलते हैं। बूँद प्रशांत महासागर से शुरू होती है। फिर वह छत पर बारिश बनकर गिरती है। उसके बाद उसे साफ करके टंकी में रखा जाता है और पौधों को दिया जाता है।",
    "प्रशांत महासागर दुनिया का सबसे बड़ा महासागर है। आम तौर पर हवाएँ गर्म पानी को पश्चिम की ओर धकेलती हैं। एल नीनो में हवाएँ कमज़ोर हो जाती हैं। गर्म पानी पूर्व की ओर चला जाता है। इससे दूर के इलाकों में मौसम बदल सकता है।",
    "एल नीनो से भारत का गर्मियों का मानसून कमज़ोर हो सकता है। लेकिन हर बार सूखा नहीं पड़ता। बारिश को दूसरी चीज़ें भी प्रभावित करती हैं। हमें पक्का नहीं पता क्या होगा। इसलिए हम तैयार रहते हैं। बारिश आए तो पानी बचाते हैं, और कम पानी में समझदारी से काम लेते हैं।",
    "जब बारिश देर से आती है या कम होती है, तो मिट्टी सूख जाती है। टंकी खाली हो जाती है। पौधे मुरझाने लगते हैं। हम बारिश को चालू नहीं कर सकते। लेकिन जो बारिश आती है, उसे इकट्ठा कर सकते हैं। और हर लीटर पानी सोच-समझकर इस्तेमाल कर सकते हैं।",
    "बारिश छत पर गिरती है। नाली पानी इकट्ठा करती है। पाइप पानी को नीचे फ़िल्टर तक ले जाता है। हर हिस्से का अपना काम है। बड़ी छत ज़्यादा बारिश पकड़ सकती है, लेकिन तभी जब पानी सही रास्ते से जाए और सुरक्षित रखा जाए।",
    "बारिश का पानी फ़िल्टर में ऊपर से आता है। सबसे पहले जाली पत्ते और टहनियाँ रोकती है। फिर कंकड़ और रेत कीचड़ और छोटे टुकड़े रोकते हैं। कोयला गंध और रंग कम कर सकता है। बाहर आते समय पानी साफ़ दिखता है। लेकिन साफ़ दिखने वाला पानी हमेशा पीने लायक नहीं होता। उसे अच्छी तरह साफ और जाँचना ज़रूरी है।",
    "साफ किया हुआ पानी टंकी में ऊपर आता है। टंकी में असीमित पानी नहीं रखा जा सकता। लेकिन थोड़ा भंडार भी बगीचे या कुछ पौधों को छोटे सूखे दौर में मदद कर सकता है। आज पानी बचाओ, ताकि कल काम आए।",
    "टंकी से पानी मुख्य पाइप में आता है। फिर वह पतली ड्रिप पाइप में जाता है। छोटे छेद पानी को धीरे-धीरे, बूँद-बूँद करके जड़ के पास छोड़ते हैं। इससे पानी वहीं पहुँचता है जहाँ पौधे को ज़रूरत है। कम पानी बर्बाद होता है। लेकिन छोटे छेद बंद हो सकते हैं, इसलिए सफ़ाई और फ़िल्टर ज़रूरी है।",
    "पूरा मॉडल सारी कहानी जोड़ता है। महासागर दिखाता है कि बारिश क्यों बदल सकती है। छत और टंकी दिखाते हैं कि पानी कैसे इकट्ठा और सुरक्षित रखा जाए। ड्रिप पाइप दिखाते हैं कि पानी समझदारी से कैसे इस्तेमाल करें। मौसम हमारे हाथ में नहीं है। लेकिन अपने पानी की देखभाल हम कर सकते हैं।",
]


async def render(lines: list[str], voice: str, language: str, rate: str) -> None:
    out_dir = Path(__file__).resolve().parent.parent / "public" / "audio" / language
    out_dir.mkdir(parents=True, exist_ok=True)
    for index, text in enumerate(lines):
        path = out_dir / f"{index:02d}.mp3"
        communicate = edge_tts.Communicate(text, voice, rate=rate, volume="+0%", pitch="+0Hz")
        await communicate.save(str(path))
        print(f"{language} {index:02d} -> {path.name} ({path.stat().st_size:,} bytes)")


async def main() -> None:
    await render(EN, EN_VOICE, "en", "-5%")
    await render(HI, HI_VOICE, "hi", "-6%")


if __name__ == "__main__":
    asyncio.run(main())
