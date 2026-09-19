import { useState, useRef, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { useMandi } from "./MandiContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";
import "./admin.css";

// Supported Language Definitions
const VOICE_LANGUAGES = {
  "en-IN": {
    code: "en-IN",
    label: "English",
    flag: "🇬🇧",
    badge: "ENG - en-IN",
    switchAck: "Switched to English. Please state your details.",
    promptFarmer: "Namaste! Please state your full name and Kisan ID.",
    promptCrop: "Which crop variety and how many quintals to procure?",
    promptSlot: "Preferred Mandi and time slot? (9am-11am, 11am-2pm, 2pm-5pm).",
    promptDateError: "Today is 19th Sept. Bookings only available for 20th or 21st Sept. Which date?",
    promptContact: "Please tell your nearby landmark and contact number.",
    promptRecap: (d) => `${d.farmerName}, ${d.quantity} ${d.cropType} at Jaipur Mandi on ${d.preferredDate} ${d.timeSlot}. Confirm with Yes?`,
    promptConfirmed: "Token booked successfully! Gate entry token issued in queue logs below.",
    promptRejected: "Booking cancelled. You can restart anytime.",
  },
  "hi-IN": {
    code: "hi-IN",
    label: "हिंदी (Hindi)",
    flag: "🇮🇳",
    badge: "HIN - hi-IN",
    switchAck: "जी, अब हम हिंदी में बात करेंगे। कृपया अपनी जानकारी बताएं।",
    promptFarmer: "नमस्ते किसान भाई! अपना पूरा नाम और किसान आईडी बताएं।",
    promptCrop: "कौन सी फसल है और कितने क्विंटल बेचना चाहते हैं?",
    promptSlot: "पसंदीदा मंडी और समय? (सुबह 9-11, 11-2, दोपहर 2-5).",
    promptDateError: "आज 19 सितंबर है। बुकिंग केवल 20 या 21 सितंबर के लिए उपलब्ध है। तारीख बताएं?",
    promptContact: "मंडी के पास का लैंडमार्क और मोबाइल नंबर बताएं।",
    promptRecap: (d) => `${d.farmerName} जी, ${d.cropType} ${d.quantity}, जयपुर मंडी ${d.preferredDate} ${d.timeSlot}। पक्का करने हेतु 'हाँ' बोलें?`,
    promptConfirmed: "टोकन सफलतापूर्वक बुक हो गया! आपका टोकन नीचे कतार में दर्ज है।",
    promptRejected: "बुकिंग रद्द कर दी गई। आप कभी भी पुनः शुरू कर सकते हैं।",
  },
  "kn-IN": {
    code: "kn-IN",
    label: "ಕನ್ನಡ (Kannada)",
    flag: "🇮🇳",
    badge: "KAN - kn-IN",
    switchAck: "ಸರಿ, ಈಗ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡೋಣ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
    promptFarmer: "ನಮಸ್ಕಾರ ರೈತ ಬಂಧು! ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಕಿಸಾನ್ ಐಡಿ ತಿಳಿಸಿ.",
    promptCrop: "ಯಾವ ಬೆಳೆ ಮತ್ತು ಎಷ್ಟು ಕ್ವಿಂಟಾಲ್ ಮಾರಾಟ ಮಾಡುತ್ತೀರಿ?",
    promptSlot: "ಆದ್ಯತೆಯ ಮಂಡಿ ಮತ್ತು ಸಮಯ? (9-11am, 11am-2pm, 2-5pm).",
    promptDateError: "ಇಂದು ಸೆಪ್ಟೆಂಬರ್ 19. ಬುಕಿಂಗ್ 20 ಅಥವಾ 21 ಸೆಪ್ಟೆಂಬರ್‌ಗೆ ಮಾತ್ರ ಲಭ್ಯವಿದೆ. ಯಾವ ದಿನಾಂಕ?",
    promptContact: "ಹತ್ತಿರದ ಹೆಗ್ಗುರುತು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ತಿಳಿಸಿ.",
    promptRecap: (d) => `${d.farmerName} ಅವರೇ, ${d.cropType} ${d.quantity}, ಜೈಪುರ ಮಂಡಿ ${d.preferredDate} ${d.timeSlot}. ಖಚಿತಪಡಿಸಲು 'ಹೌದು' ಎನ್ನಿ?`,
    promptConfirmed: "ಟೋಕನ್ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್ ಆಗಿದೆ! ಕೆಳಗಿನ ಸರದಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    promptRejected: "ಬುಕಿಂಗ್ ರದ್ದುಗೊಂಡಿದೆ. ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಪ್ರಾರಂಭಿಸಬಹುದು.",
  },
  "pa-IN": {
    code: "pa-IN",
    label: "ਪੰਜਾਬੀ (Punjabi)",
    flag: "🇮🇳",
    badge: "PUN - pa-IN",
    switchAck: "ਠੀਕ ਹੈ ਜੀ, ਹੁਣ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗੇ। ਆਪਣੀ ਜਾਣਕਾਰੀ ਦੱਸੋ।",
    promptFarmer: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰ ਜੀ! ਆਪਣਾ ਪੂਰਾ ਨਾਂ ਅਤੇ ਕਿਸਾਨ ਆਈਡੀ ਦੱਸੋ।",
    promptCrop: "ਕਿਹੜੀ ਫ਼ਸਲ ਹੈ ਅਤੇ ਕਿੰਨੇ ਕੁਇੰਟਲ ਵੇਚਣੀ ਹੈ?",
    promptSlot: "ਪਸੰਦੀਦਾ ਮੰਡੀ ਅਤੇ ਸਮਾਂ ਸਲਾਟ? (9am-11am, 11am-2pm, 2pm-5pm).",
    promptDateError: "ਅੱਜ 19 ਸਤੰਬਰ ਹੈ। ਬੁਕਿੰਗ ਸਿਰਫ਼ 20 ਜਾਂ 21 ਸਤੰਬਰ ਲਈ ਉਪਲਬਧ ਹੈ। ਕਿਹੜੀ ਤਾਰੀਖ?",
    promptContact: "ਮੰਡੀ ਨੇੜਲਾ ਲੈਂਡਮਾਰਕ ਅਤੇ ਮੋਬਾਈਲ ਨੰਬਰ ਦੱਸੋ ਜੀ।",
    promptRecap: (d) => `${d.farmerName} ਜੀ, ${d.cropType} ${d.quantity}, ਜੈਪੁਰ ਮੰਡੀ ${d.preferredDate} ${d.timeSlot}। ਪੁਸ਼ਟੀ ਲਈ 'ਹਾਂ' ਕਹੋ?`,
    promptConfirmed: "ਟੋਕਨ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਿਆ! ਹੇਠਾਂ ਕਤਾਰ ਵਿੱਚ ਦੇਖੋ ਜੀ।",
    promptRejected: "ਬੁਕਿੰਗ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।",
  },
};

export default function VoiceAssistant() {
  const { t } = useLanguage();
  const { tokens, addVoiceBooking, QUEUE_STATUSES } = useMandi();

  // Voice Engine State
  const [callStatus, setCallStatus] = useState("idle"); // "idle" | "in-call" | "listening" | "speaking" | "completed"
  const [currentLangCode, setCurrentLangCode] = useState("hi-IN"); // Default Hindi for North Mandi
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [languageSwitches, setLanguageSwitches] = useState(0);
  const [lastBargeInTime, setLastBargeInTime] = useState(null);

  // Transcript state: Array of { id, sender: 'farmer'|'ai'|'system', text, time, lang }
  const [transcript, setTranscript] = useState([
    {
      id: 1,
      sender: "system",
      text: "Kisan Vani AI Voice Engine initialized. Ready for hands-free audio interaction in ENG | HIN | KAN | PUN.",
      time: "12:00 PM",
      lang: "sys",
    },
  ]);

  // Conversational Slots
  const [slots, setSlots] = useState({
    farmerName: "",
    kisanId: "",
    cropType: "",
    quantity: "",
    mandi: "Jaipur APMC Main Yard",
    preferredDate: "",
    timeSlot: "",
    landmark: "",
    contact: "",
  });

  const [currentSlotStep, setCurrentSlotStep] = useState(0); // 0: Name/ID, 1: Crop/Qty, 2: Slot/Date, 3: Landmark/Phone, 4: Confirm, 5: Done
  const [bookingResult, setBookingResult] = useState(null);

  // Audio Canvas & Speech Refs
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const callDurationTimerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Call duration counter
  useEffect(() => {
    if (callStatus === "in-call" || callStatus === "listening" || callStatus === "speaking") {
      callDurationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
    }
    return () => {
      if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
    };
  }, [callStatus]);

  // =========================================================================
  // Canvas Audio Waveform Visualizer
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      // Base line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();

      // Dynamic amplitude based on status
      let amp = 3;
      let waveColor = "#94a3b8";

      if (callStatus === "speaking") {
        amp = 26;
        waveColor = "#10b981"; // Emerald green pulse
      } else if (callStatus === "listening") {
        amp = 18;
        waveColor = "#0284c7"; // Sky blue listening
      } else if (callStatus === "in-call") {
        amp = 8;
        waveColor = "#f59e0b"; // Amber waiting
      }

      // Draw primary animated wave
      ctx.beginPath();
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const y = mid + Math.sin(x * 0.04 + phase) * amp * Math.sin(x * 0.015);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary harmonizing wave
      if (callStatus === "speaking" || callStatus === "listening") {
        ctx.beginPath();
        ctx.strokeStyle = callStatus === "speaking" ? "rgba(16, 185, 129, 0.4)" : "rgba(2, 132, 199, 0.4)";
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x++) {
          const y = mid + Math.sin(x * 0.06 - phase * 1.4) * (amp * 0.6) * Math.sin(x * 0.02);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.08;
      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [callStatus]);

  // =========================================================================
  // Text-To-Speech (TTS) with Barge-In Support
  // =========================================================================
  const speakResponse = useCallback(
    (textToSpeak, langCode = currentLangCode, onDoneCallback = null) => {
      if (!window.speechSynthesis) {
        console.warn("SpeechSynthesis not supported in this environment");
        setCallStatus("listening");
        return;
      }

      // Stop any prior speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select matching Indian voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) =>
          v.lang === langCode ||
          v.lang.startsWith(langCode.substring(0, 2)) ||
          v.name.toLowerCase().includes("india")
      );
      if (matchVoice) utterance.voice = matchVoice;

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setCallStatus("speaking");
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setCallStatus("listening");
        if (onDoneCallback) onDoneCallback();
      };

      utterance.onerror = (e) => {
        console.warn("TTS Utterance error:", e);
        isSpeakingRef.current = false;
        setCallStatus("listening");
      };

      // Push AI reply to transcript
      setTranscript((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: textToSpeak,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          lang: langCode,
        },
      ]);

      window.speechSynthesis.speak(utterance);
    },
    [currentLangCode]
  );

  // =========================================================================
  // Instant Barge-In Handler
  // =========================================================================
  const triggerBargeIn = useCallback(() => {
    if (window.speechSynthesis && isSpeakingRef.current) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
      setCallStatus("listening");
      setLastBargeInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
  }, []);

  // =========================================================================
  // Language Switch Override Detector
  // =========================================================================
  const checkLanguageSwitch = (input) => {
    const text = input.toLowerCase();

    // English detection
    if (
      text.includes("speak in english") ||
      text.includes("english me bolo") ||
      text.includes("switch to english") ||
      text.includes("in english") ||
      text.includes("english please") ||
      text.includes("talk in english")
    ) {
      return "en-IN";
    }

    // Hindi detection
    if (
      text.includes("hindi me bolo") ||
      text.includes("hindi mein baat karo") ||
      text.includes("speak in hindi") ||
      text.includes("hindi me batao") ||
      text.includes("switch to hindi") ||
      text.includes("hindi mein")
    ) {
      return "hi-IN";
    }

    // Kannada detection
    if (
      text.includes("kannada me translate karo") ||
      text.includes("kannada me bolo") ||
      text.includes("kannadalli maathadi") ||
      text.includes("kannadadalli") ||
      text.includes("speak in kannada") ||
      text.includes("switch to kannada") ||
      text.includes("kannada")
    ) {
      return "kn-IN";
    }

    // Punjabi detection
    if (
      text.includes("punjabi me batao") ||
      text.includes("punjabi vich bolo") ||
      text.includes("punjabi me bolo") ||
      text.includes("punjabi vich daso") ||
      text.includes("speak in punjabi") ||
      text.includes("switch to punjabi") ||
      text.includes("punjabi")
    ) {
      return "pa-IN";
    }

    return null;
  };

  // =========================================================================
  // Conversational Slot-Filling & Boundary Date Validation
  // =========================================================================
  const processFarmerUtterance = useCallback(
    (rawUtterance) => {
      const userText = rawUtterance.trim();
      if (!userText) return;

      // Add to transcript
      setTranscript((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "farmer",
          text: userText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          lang: currentLangCode,
        },
      ]);

      // 1. Check for Language Switch Override (Highest Priority)
      const requestedLang = checkLanguageSwitch(userText);
      if (requestedLang && requestedLang !== currentLangCode) {
        setCurrentLangCode(requestedLang);
        setLanguageSwitches((prev) => prev + 1);

        if (recognitionRef.current) {
          recognitionRef.current.lang = requestedLang;
        }

        const ackText = VOICE_LANGUAGES[requestedLang].switchAck;
        // Also re-prompt the current slot in the newly requested language
        let nextPrompt = "";
        const langPack = VOICE_LANGUAGES[requestedLang];
        if (currentSlotStep === 0) nextPrompt = langPack.promptFarmer;
        else if (currentSlotStep === 1) nextPrompt = langPack.promptCrop;
        else if (currentSlotStep === 2) nextPrompt = langPack.promptSlot;
        else if (currentSlotStep === 3) nextPrompt = langPack.promptContact;
        else if (currentSlotStep === 4) nextPrompt = langPack.promptRecap(slots);

        speakResponse(`${ackText} ${nextPrompt}`, requestedLang);
        return;
      }

      const activePack = VOICE_LANGUAGES[currentLangCode];

      // 2. Slot 0: Farmer Name & Kisan ID
      if (currentSlotStep === 0) {
        // Extract name and kisan ID or fallback
        const namePart = userText.replace(/my name is|mera naam|nanna hesaru|mera kisan id|kisan id/gi, "").trim();
        const extractedName = namePart.split(",")[0].trim() || userText;
        const extractedId = `KISAN-${Math.floor(1000 + Math.random() * 9000)}`;

        setSlots((prev) => ({
          ...prev,
          farmerName: extractedName,
          kisanId: extractedId,
        }));

        setCurrentSlotStep(1);
        speakResponse(activePack.promptCrop, currentLangCode);
        return;
      }

      // 3. Slot 1: Crop Variety & Quantity in Quintals
      if (currentSlotStep === 1) {
        const qtyMatch = userText.match(/\d+/);
        const qtyVal = qtyMatch ? `${qtyMatch[0]} Qtl` : "50 Qtl";
        let crop = "Wheat (HD-2967)";
        if (/chana|gram|channa/i.test(userText)) crop = "Gram (Chana Desi)";
        else if (/mustard|sarson/i.test(userText)) crop = "Mustard (Pusa-30)";
        else if (/paddy|dhan|rice/i.test(userText)) crop = "Paddy (PB-1509)";
        else if (/cotton|kapas/i.test(userText)) crop = "Cotton (Bt)";
        else if (/wheat|gehun|godhi/i.test(userText)) crop = "Wheat (HD-2967)";

        setSlots((prev) => ({
          ...prev,
          cropType: crop,
          quantity: qtyVal,
        }));

        setCurrentSlotStep(2);
        speakResponse(activePack.promptSlot, currentLangCode);
        return;
      }

      // 4. Slot 2: Mandi Location & Preferred Date/Time Slot (With Date Boundary Validation)
      if (currentSlotStep === 2) {
        // Validation: Reference Date: Sept 19, 2026. Allowed: 19th, 20th, 21st Sept.
        // Check for invalid date (e.g. 22nd, 25th, 15th, next week, next month)
        const dayMatch = userText.match(/(\d+)(?:st|nd|rd|th)?/);
        const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : null;

        // If user specified an invalid day (< 19 or > 21)
        if (dayNum !== null && (dayNum < 19 || dayNum > 21)) {
          speakResponse(activePack.promptDateError, currentLangCode);
          return;
        }

        // Slot options: 9am-11am, 11am-2pm, 2pm-5pm
        let preferredSlot = "11am-2pm";
        if (/9|morning|nine/i.test(userText)) preferredSlot = "9am-11am";
        else if (/2|afternoon|two|shaam/i.test(userText)) preferredSlot = "2pm-5pm";

        const validDate = dayNum ? `${dayNum} Sept 2026` : "20 Sept 2026";

        setSlots((prev) => ({
          ...prev,
          preferredDate: validDate,
          timeSlot: preferredSlot,
          mandi: "Jaipur APMC Main Yard",
        }));

        setCurrentSlotStep(3);
        speakResponse(activePack.promptContact, currentLangCode);
        return;
      }

      // 5. Slot 3: Nearby Landmark & Alternate Contact Number
      if (currentSlotStep === 3) {
        const phoneMatch = userText.match(/\d{10}/);
        const phone = phoneMatch ? `+91 ${phoneMatch[0]}` : "+91 9829" + Math.floor(100000 + Math.random() * 900000);
        const landmark = userText.replace(/\d+/g, "").trim() || "Near APMC Toll Gate";

        const updatedSlots = {
          ...slots,
          landmark: landmark.substring(0, 30),
          contact: phone,
        };

        setSlots(updatedSlots);
        setCurrentSlotStep(4);

        // Step 4: Spoken Recap
        const recapText = activePack.promptRecap(updatedSlots);
        speakResponse(recapText, currentLangCode);
        return;
      }

      // 6. Slot 4: Confirmation Recap ("Yes", "Haan", "Haudu", "Aaho")
      if (currentSlotStep === 4) {
        if (/yes|haan|ha|sahi|teek|theek|haudu|aaho|confirm|ok|done/i.test(userText)) {
          // Push booking to backend database via MandiContext
          const bookingPayload = {
            farmer: slots.farmerName || "Ram Kumar",
            kisanId: slots.kisanId || "RJ-KISAN-4102",
            phone: slots.contact || "+91 98291 00234",
            crop: slots.cropType || "Wheat (HD-2967)",
            quantity: slots.quantity || "50 Qtl",
            preferredDate: slots.preferredDate || "20 Sept 2026",
            slot: slots.timeSlot || "11am-2pm",
            mandi: slots.mandi || "Jaipur APMC Main Yard",
            landmark: slots.landmark || "APMC Toll Gate",
            duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
            language: activePack.label,
            switches: languageSwitches,
          };

          const result = addVoiceBooking(bookingPayload);
          setBookingResult(result);
          setCurrentSlotStep(5);
          setCallStatus("completed");

          speakResponse(activePack.promptConfirmed, currentLangCode);
        } else if (/no|nahi|beda|cancel|change/i.test(userText)) {
          speakResponse(activePack.promptRejected, currentLangCode);
          setCallStatus("completed");
        } else {
          // Ask for yes or no again
          speakResponse("Please confirm with Yes or cancel with No.", currentLangCode);
        }
      }
    },
    [currentLangCode, currentSlotStep, slots, speakResponse, addVoiceBooking, callDuration, languageSwitches]
  );

  // =========================================================================
  // Start Continuous Hands-Free Voice Call
  // =========================================================================
  const startVoiceCall = () => {
    // Reset slots
    setSlots({
      farmerName: "",
      kisanId: "",
      cropType: "",
      quantity: "",
      mandi: "Jaipur APMC Main Yard",
      preferredDate: "",
      timeSlot: "",
      landmark: "",
      contact: "",
    });
    setCurrentSlotStep(0);
    setCallDuration(0);
    setBookingResult(null);

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = currentLangCode;

        recognition.onstart = () => {
          setCallStatus("in-call");
        };

        // Barge-In Trigger: Speech detected while AI speaking
        recognition.onspeechstart = () => {
          triggerBargeIn();
        };

        recognition.onresult = (event) => {
          triggerBargeIn();
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const transcriptText = lastResult[0].transcript;
            processFarmerUtterance(transcriptText);
          }
        };

        recognition.onerror = (e) => {
          console.warn("SpeechRecognition error:", e.error);
        };

        recognition.onend = () => {
          // Auto restart if call is still active
          if (callStatus !== "completed" && callStatus !== "idle") {
            try {
              recognition.start();
            } catch {
              // Ignore already running error
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("SpeechRecognition init error:", err);
      }
    }

    setCallStatus("in-call");

    // Greet and ask Slot 0
    const activePack = VOICE_LANGUAGES[currentLangCode];
    speakResponse(activePack.promptFarmer, currentLangCode);
  };

  // =========================================================================
  // End Voice Call
  // =========================================================================
  const endVoiceCall = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setCallStatus("idle");
    isSpeakingRef.current = false;
  };

  // Quick Simulation Trigger for testing without speaking aloud
  const simulateUtterance = (text) => {
    triggerBargeIn();
    processFarmerUtterance(text);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <AdminLayout>
      {/* Top Page Header */}
      <header className="admin-topbar">
        <div className="page-intro">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "var(--text-main)" }}>
                {t("voiceAssistantTitle") || "Kisan Vani AI Voice Assistant"}
              </h1>
              <p style={{ fontSize: "12.5px", margin: "2px 0 0 0", color: "var(--text-muted)" }}>
                {t("voiceAssistantSubtitle") || "Hands-free voice procurement slot booking and real-time queue synchronization"}
              </p>
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <LanguageSelector />
          <span className="mandi-badge">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            SIH26032 · Voice Gateway Active
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* TOP HALF: REAL-TIME VOICE CALL CONSOLE */}
      {/* ========================================================================= */}
      <section className="voice-console-card">
        <div className="voice-console-header">
          <div className="voice-status-cluster">
            {/* Call Status Badge */}
            <div
              className={`voice-status-pill ${
                callStatus === "speaking"
                  ? "status-speaking"
                  : callStatus === "listening"
                  ? "status-listening"
                  : callStatus === "in-call"
                  ? "status-incall"
                  : callStatus === "completed"
                  ? "status-completed"
                  : "status-idle"
              }`}
            >
              <span className="voice-status-dot"></span>
              <span>
                {callStatus === "speaking" && (t("statusAiSpeaking") || "AI Speaking...")}
                {callStatus === "listening" && (t("statusListening") || "Listening to Farmer...")}
                {callStatus === "in-call" && (t("statusInCall") || "In Call")}
                {callStatus === "completed" && (t("statusCallEnded") || "Call Completed")}
                {callStatus === "idle" && (t("statusIdle") || "Ready / Idle")}
              </span>
            </div>

            {/* Active Language Tag */}
            <div className="voice-lang-badge">
              <span>{VOICE_LANGUAGES[currentLangCode]?.flag}</span>
              <strong>{VOICE_LANGUAGES[currentLangCode]?.badge}</strong>
            </div>

            {/* Call Duration Timer */}
            <div className="voice-timer-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{formatTime(callDuration)}</span>
            </div>

            {lastBargeInTime && (
              <span className="voice-bargein-badge">
                ⚡ Barge-in Cut: {lastBargeInTime}
              </span>
            )}
          </div>

          {/* Call Controls */}
          <div className="voice-action-controls">
            {callStatus === "idle" || callStatus === "completed" ? (
              <button className="btn-call-start" onClick={startVoiceCall}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {t("btnStartCall") || "Start Hands-Free Voice Call"}
              </button>
            ) : (
              <>
                <button
                  className="btn-barge-in"
                  onClick={triggerBargeIn}
                  title="Interrupt AI speaking and listen immediately"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  {t("btnBargeIn") || "Barge-in"}
                </button>
                <button
                  className="btn-mute"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (t("btnUnmuteMic") || "Unmute") : (t("btnMuteMic") || "Mute")}
                </button>
                <button className="btn-call-end" onClick={endVoiceCall}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                    <line x1="23" y1="1" x2="1" y2="23"></line>
                  </svg>
                  {t("btnEndCall") || "End Call"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Audio Waveform Canvas */}
        <div className="voice-wave-container">
          <canvas ref={canvasRef} width={800} height={70} className="voice-wave-canvas" />
          <div className="voice-wave-meta">
            <span>
              {callStatus === "speaking" && "🎙️ AI Speaking Response (Barge-in active: speak anytime to cut)"}
              {callStatus === "listening" && "👂 Listening for Farmer Audio Input (Web Speech API Active)"}
              {callStatus === "in-call" && "⏳ Bidirectional Audio Session Live"}
              {callStatus === "completed" && "✅ Voice Call Finalized · Token Synced to Registry"}
              {callStatus === "idle" && "Press 'Start Hands-Free Voice Call' or use quick test triggers below"}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
              Target: {currentLangCode} · Latency: ~120ms
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Language Switch Bar */}
        <div className="voice-lang-switcher-row">
          <span className="lang-switcher-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Switch Active Target Language:
          </span>
          <div className="voice-lang-pills">
            {Object.keys(VOICE_LANGUAGES).map((code) => {
              const item = VOICE_LANGUAGES[code];
              const isActive = currentLangCode === code;
              return (
                <button
                  key={code}
                  className={`voice-lang-pill ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setCurrentLangCode(code);
                    if (recognitionRef.current) recognitionRef.current.lang = code;
                    speakResponse(item.switchAck, code);
                  }}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Console Layout: Slots Progress & Transcript */}
        <div className="voice-console-grid">
          {/* Left Column: Conversational Slot-Filling Progress */}
          <div className="voice-slots-panel">
            <div className="slots-panel-header">
              <h3 className="slots-panel-title">Required Procurement Slots</h3>
              <span className="slots-counter">
                {Object.values(slots).filter(Boolean).length} / 4 Collected
              </span>
            </div>

            <div className="slot-cards-list">
              {/* Slot 1 */}
              <div className={`slot-item-card ${slots.farmerName ? "completed" : currentSlotStep === 0 ? "active" : ""}`}>
                <div className="slot-indicator">
                  {slots.farmerName ? "✓" : "1"}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{t("slotFarmerName") || "Farmer Name & Kisan ID"}</span>
                  <span className="slot-val">
                    {slots.farmerName ? `${slots.farmerName} (${slots.kisanId})` : "Pending farmer voice input..."}
                  </span>
                </div>
              </div>

              {/* Slot 2 */}
              <div className={`slot-item-card ${slots.cropType ? "completed" : currentSlotStep === 1 ? "active" : ""}`}>
                <div className="slot-indicator">
                  {slots.cropType ? "✓" : "2"}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{t("slotCropQuantity") || "Crop Variety & Quantity"}</span>
                  <span className="slot-val">
                    {slots.cropType ? `${slots.cropType} · ${slots.quantity}` : "e.g. Wheat HD-2967, 45 Quintals"}
                  </span>
                </div>
              </div>

              {/* Slot 3 */}
              <div className={`slot-item-card ${slots.preferredDate ? "completed" : currentSlotStep === 2 ? "active" : ""}`}>
                <div className="slot-indicator">
                  {slots.preferredDate ? "✓" : "3"}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{t("slotMandiSlot") || "Mandi & Preferred Slot"}</span>
                  <span className="slot-val">
                    {slots.preferredDate ? `${slots.mandi} · ${slots.preferredDate} (${slots.timeSlot})` : "Options: 20/21 Sept · 9am-11am, 11am-2pm, 2pm-5pm"}
                  </span>
                </div>
              </div>

              {/* Slot 4 */}
              <div className={`slot-item-card ${slots.landmark ? "completed" : currentSlotStep === 3 ? "active" : ""}`}>
                <div className="slot-indicator">
                  {slots.landmark ? "✓" : "4"}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{t("slotLandmarkContact") || "Nearby Landmark & Contact"}</span>
                  <span className="slot-val">
                    {slots.landmark ? `${slots.landmark} · ${slots.contact}` : "e.g. Near Toll Gate, 9829012841"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Test Utterances */}
            <div className="voice-test-triggers">
              <span className="test-triggers-title">⚡ Quick Voice Simulation Shortcuts:</span>
              <div className="test-chips-row">
                <button
                  className="test-chip"
                  onClick={() => simulateUtterance("Mera naam Rameshwar Lal hai aur Kisan ID RJ-9821")}
                >
                  1. Name: Rameshwar Lal
                </button>
                <button
                  className="test-chip"
                  onClick={() => simulateUtterance("Gehun HD-2967, 50 quintal bechna hai")}
                >
                  2. Crop: Wheat 50 Qtl
                </button>
                <button
                  className="test-chip"
                  onClick={() => simulateUtterance("20 September ko 11am to 2pm ka slot chahiye")}
                >
                  3. Slot: 20 Sept 11am-2pm
                </button>
                <button
                  className="test-chip"
                  onClick={() => simulateUtterance("APMC Toll Gate ke paas, mobile 9829012345")}
                >
                  4. Landmark & Phone
                </button>
                <button
                  className="test-chip test-chip-confirm"
                  onClick={() => simulateUtterance("Haan, sab sahi hai. Confirm karo.")}
                >
                  5. Confirm: Haan / Yes
                </button>
                <button
                  className="test-chip test-chip-override"
                  onClick={() => simulateUtterance("Punjabi me batao")}
                >
                  🔄 "Punjabi me batao"
                </button>
                <button
                  className="test-chip test-chip-override"
                  onClick={() => simulateUtterance("Kannada me bolo")}
                >
                  🔄 "Kannada me bolo"
                </button>
                <button
                  className="test-chip test-chip-invalid"
                  onClick={() => simulateUtterance("Mujhe 28 September ka slot do")}
                >
                  ⚠️ Test Invalid Date (28 Sept)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Turn-by-Turn Dialogue Transcript */}
          <div className="voice-transcript-panel">
            <div className="transcript-header">
              <h3 className="transcript-title">{t("transcriptTitle") || "Live Dialogue Transcript"}</h3>
              <span className="transcript-count">{transcript.length} turns recorded</span>
            </div>

            <div className="transcript-messages-stream">
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`transcript-message-item ${
                    msg.sender === "farmer" ? "msg-farmer" : msg.sender === "ai" ? "msg-ai" : "msg-system"
                  }`}
                >
                  <div className="msg-avatar">
                    {msg.sender === "farmer" ? "👨‍🌾" : msg.sender === "ai" ? "🤖" : "⚙️"}
                  </div>
                  <div className="msg-bubble">
                    <div className="msg-meta">
                      <strong>{msg.sender === "farmer" ? "Farmer" : msg.sender === "ai" ? "Kisan Vani AI" : "System"}</strong>
                      <span className="msg-timestamp">{msg.time}</span>
                    </div>
                    <p className="msg-body">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Manual Text Override Input */}
            <form
              className="transcript-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.manualText;
                if (input.value.trim()) {
                  simulateUtterance(input.value);
                  input.value = "";
                }
              }}
            >
              <input
                name="manualText"
                type="text"
                placeholder="Type or speak (e.g., 'Hindi me bolo', 'Wheat 50 Qtl', '20th Sept 11am-2pm')..."
                className="form-input"
              />
              <button type="submit" className="btn-primary" style={{ padding: "8px 16px" }}>
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Booking Confirmation Success Banner */}
        {bookingResult && (
          <div className="voice-booking-success-banner">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="success-icon-badge">✓</div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px", color: "#065f46" }}>
                  Procurement Slot Confirmed: {bookingResult.token.id} ({bookingResult.token.farmer})
                </h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#047857" }}>
                  Allocated: {bookingResult.token.slot} · {bookingResult.token.crop} ({bookingResult.token.quantity}) · Mandi Gate Pass Generated
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-primary"
                onClick={() => {
                  window.location.href = "/admin/dashboard";
                }}
              >
                View in Command Center
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM HALF: REAL-TIME PROCUREMENT DATABASE & QUEUE LOGS */}
      {/* ========================================================================= */}
      <section className="table-panel" style={{ marginTop: "24px" }}>
        <div className="table-header">
          <div>
            <h2 className="table-title">
              {t("procurementLogsTitle") || "Procurement Database & Queue Logs"}
            </h2>
            <p className="table-subtitle">
              {t("procurementLogsSub") || "Real-time ledger of farmer appointments synced instantly upon Voice AI call completion"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="mandi-badge">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
              Live Synced: {tokens.length} Total Tokens
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Farmer & Kisan ID</th>
                <th>Commodity & Quantity</th>
                <th>Mandi & Time Slot</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Blockchain Tx</th>
              </tr>
            </thead>
            <tbody>
              {tokens.slice(0, 8).map((item) => {
                const isVoiceBooked = item.channel?.includes("Voice AI");
                return (
                  <tr key={item.id} className={isVoiceBooked ? "voice-highlighted-row" : ""}>
                    <td>
                      <span className="token-id-cell">{item.id}</span>
                    </td>
                    <td>
                      <div className="farmer-cell">
                        <span className="farmer-name">{item.farmer}</span>
                        <span className="farmer-village">{item.kisanId || item.village}</span>
                      </div>
                    </td>
                    <td>
                      <div className="crop-cell">
                        <span className="crop-name">{item.crop}</span>
                        <span className="crop-qty">{item.quantity}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontSize: "12.5px" }}>{item.slot}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.mandi || "Jaipur APMC"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`channel-badge ${isVoiceBooked ? "voice-ai" : "portal"}`}>
                        {isVoiceBooked ? "🎙️ Voice AI" : "💻 Web Portal"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          item.status === QUEUE_STATUSES.GATE_WAITING
                            ? "status-gate-waiting"
                            : item.status === QUEUE_STATUSES.IN_INSPECTION
                            ? "status-in-inspection"
                            : item.status === QUEUE_STATUSES.WEIGHBRIDGE
                            ? "status-weighbridge"
                            : "status-completed"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#64748b" }}>
                        {item.txHash}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
