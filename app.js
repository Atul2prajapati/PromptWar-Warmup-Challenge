/* ═══════════════════════════════════════════════════ */
/*  SAHAYAK — सहायक  |  Application Logic              */
/* ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── STATE ──────────────────────────────────── */
    const state = {
        language: localStorage.getItem('sahayak-lang') || null,
        userName: 'Ajay',
        currentScreen: 'language-screen',
        cameraStream: null,
        isListening: false,
        isSpeaking: false,
        recognition: null,
        selectedContact: null,
        conversationStep: 0,
        conversationData: {},
    };

    /* ─── i18n TRANSLATIONS ─────────────────────── */
    const i18n = {
        en: {
            camera_title: 'EXPLAIN THIS',
            camera_desc: 'Take a photo',
            talk_title: 'TALK TO ME',
            talk_desc: 'Tell me what you need',
            today_title: 'MY DAY',
            today_desc: 'What do I need to do?',
            help_title: 'Something looks wrong?',
            help_desc: 'ASK FAMILY',
            change_lang: 'Change Language',
            camera_hint: 'Point at what you want to understand',
            capture_label: 'Tap to take photo',
            talk_tap: 'Tap to start talking',
            talk_listening: 'Listening...',
            send: 'Send',
            try_again: 'Try Again',
            type_hint: 'Or type here:',
            type_placeholder: 'Type your message...',
            today_heading: 'TODAY',
            tomorrow_heading: 'TOMORROW',
            family_heading: 'Ask Family for Help',
            family_subtitle: 'Who would you like to contact?',
            family_context_label: 'What do you need help with?',
            ctx_understand: "I can't understand something",
            ctx_safe: "Something doesn't look safe",
            ctx_help: 'I just need help',
            listen: 'Listen',
            not_sure: 'Not sure about this?',
            ask_family_btn: 'Ask Family',
            confirm_title: 'Did I understand correctly?',
            yes: 'YES',
            change: 'CHANGE',
            scam_stop: 'STOP — Please check this',
            call_family: 'Call Family',
            check_message: 'Check Message',
            remind_me: 'Remind Me',
            show_how_pay: 'Show me how to pay',
            greeting_morning: 'Good Morning',
            greeting_afternoon: 'Good Afternoon',
            greeting_evening: 'Good Evening',
            greeting_subtitle: 'How can I help you today?',
            safe: '🟢 SAFE',
            check: '🟡 CHECK',
            stop: '🔴 STOP',
            analyzing: 'Looking at your photo...',
            msg_sent: 'Message sent to',
            reminder_set: 'Reminder set!',
        },
        hi: {
            camera_title: 'यह समझाएं',
            camera_desc: 'फोटो लें',
            talk_title: 'मुझसे बात करें',
            talk_desc: 'बताएं आपको क्या चाहिए',
            today_title: 'मेरा दिन',
            today_desc: 'आज मुझे क्या करना है?',
            help_title: 'कुछ गड़बड़ लग रही है?',
            help_desc: 'परिवार से पूछें',
            change_lang: 'भाषा बदलें',
            camera_hint: 'जो समझना है उस पर कैमरा रखें',
            capture_label: 'फोटो लेने के लिए टैप करें',
            talk_tap: 'बोलने के लिए टैप करें',
            talk_listening: 'सुन रहे हैं...',
            send: 'भेजें',
            try_again: 'फिर से कोशिश करें',
            type_hint: 'या यहाँ लिखें:',
            type_placeholder: 'अपना संदेश लिखें...',
            today_heading: 'आज',
            tomorrow_heading: 'कल',
            family_heading: 'परिवार से मदद लें',
            family_subtitle: 'किससे बात करना चाहेंगे?',
            family_context_label: 'किस बारे में मदद चाहिए?',
            ctx_understand: 'मुझे कुछ समझ नहीं आ रहा',
            ctx_safe: 'कुछ सही नहीं लग रहा',
            ctx_help: 'मुझे बस मदद चाहिए',
            listen: 'सुनें',
            not_sure: 'इसके बारे में पक्का नहीं हैं?',
            ask_family_btn: 'परिवार से पूछें',
            confirm_title: 'क्या मैंने सही समझा?',
            yes: 'हाँ',
            change: 'बदलें',
            scam_stop: 'रुकें — कृपया जांचें',
            call_family: 'परिवार को कॉल करें',
            check_message: 'संदेश जांचें',
            remind_me: 'याद दिलाएं',
            show_how_pay: 'भुगतान कैसे करें बताएं',
            greeting_morning: 'सुप्रभात',
            greeting_afternoon: 'नमस्कार',
            greeting_evening: 'शुभ संध्या',
            greeting_subtitle: 'आज मैं आपकी कैसे मदद कर सकता हूँ?',
            safe: '🟢 सुरक्षित',
            check: '🟡 जाँचें',
            stop: '🔴 रुकें',
            analyzing: 'आपकी फोटो देख रहे हैं...',
            msg_sent: 'संदेश भेज दिया गया',
            reminder_set: 'रिमाइंडर सेट हो गया!',
        },
        hinglish: {
            camera_title: 'YEH SAMJHAO',
            camera_desc: 'Photo lo',
            talk_title: 'MUJHSE BAAT KARO',
            talk_desc: 'Batao kya chahiye',
            today_title: 'MERA DIN',
            today_desc: 'Aaj kya karna hai?',
            help_title: 'Kuch galat lag raha hai?',
            help_desc: 'FAMILY SE PUCHO',
            change_lang: 'Language change karo',
            camera_hint: 'Jo samajhna hai uspe camera rakho',
            capture_label: 'Photo lene ke liye tap karo',
            talk_tap: 'Bolne ke liye tap karo',
            talk_listening: 'Sun rahe hain...',
            send: 'Bhejo',
            try_again: 'Phir se try karo',
            type_hint: 'Ya yahan likho:',
            type_placeholder: 'Apna message likho...',
            today_heading: 'AAJ',
            tomorrow_heading: 'KAL',
            family_heading: 'Family se help lo',
            family_subtitle: 'Kisse baat karna chahoge?',
            family_context_label: 'Kis baare mein help chahiye?',
            ctx_understand: 'Mujhe kuch samajh nahi aa raha',
            ctx_safe: 'Kuch sahi nahi lag raha',
            ctx_help: 'Mujhe bas help chahiye',
            listen: 'Suno',
            not_sure: 'Sure nahi ho?',
            ask_family_btn: 'Family se pucho',
            confirm_title: 'Kya maine sahi samjha?',
            yes: 'HAAN',
            change: 'BADLO',
            scam_stop: 'RUKO — Please check karo',
            call_family: 'Family ko call karo',
            check_message: 'Message check karo',
            remind_me: 'Yaad dilao',
            show_how_pay: 'Payment kaise karna hai batao',
            greeting_morning: 'Good Morning',
            greeting_afternoon: 'Good Afternoon',
            greeting_evening: 'Good Evening',
            greeting_subtitle: 'Aaj mein aapki kaise help kar sakta hoon?',
            safe: '🟢 SAFE',
            check: '🟡 CHECK',
            stop: '🔴 RUKO',
            analyzing: 'Aapki photo dekh rahe hain...',
            msg_sent: 'Message bhej diya',
            reminder_set: 'Reminder set ho gaya!',
        },
    };

    /* ─── DEMO DATA ──────────────────────────────── */
    const familyContacts = [
        { name: 'Priya', relation: 'Daughter · बेटी', initials: 'P', phone: '+919876543210' },
        { name: 'Rahul', relation: 'Son · बेटा', initials: 'R', phone: '+919876543211' },
        { name: 'Sunita', relation: 'Wife · पत्नी', initials: 'S', phone: '+919876543212' },
    ];

    const todayEvents = [
        { time: '9:00 AM', emoji: '💊', label: 'Morning medicine', detail: 'Blood pressure tablet', done: true },
        { time: '11:30 AM', emoji: '🩺', label: 'Doctor appointment', detail: 'Dr. Sharma — City Hospital', done: false, current: true },
        { time: '6:00 PM', emoji: '📞', label: 'Call Priya', detail: 'Weekly call with daughter', done: false },
    ];

    const tomorrowEvents = [
        { time: '', emoji: '💳', label: 'Electricity bill due', detail: '₹1,240 — BSES Rajdhani', done: false },
    ];

    const todayEventsHi = [
        { time: '9:00 AM', emoji: '💊', label: 'सुबह की दवाई', detail: 'ब्लड प्रेशर की गोली', done: true },
        { time: '11:30 AM', emoji: '🩺', label: 'डॉक्टर अपॉइंटमेंट', detail: 'डॉ. शर्मा — सिटी हॉस्पिटल', done: false, current: true },
        { time: '6:00 PM', emoji: '📞', label: 'प्रिया को कॉल करें', detail: 'बेटी से हफ्ते की बात', done: false },
    ];

    const tomorrowEventsHi = [
        { time: '', emoji: '💳', label: 'बिजली बिल जमा करना है', detail: '₹1,240 — BSES राजधानी', done: false },
    ];


    /* ─── HELPERS ────────────────────────────────── */
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    function t(key) {
        const lang = state.language || 'en';
        return (i18n[lang] && i18n[lang][key]) || (i18n.en[key]) || key;
    }

    function getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return t('greeting_morning');
        if (h < 17) return t('greeting_afternoon');
        return t('greeting_evening');
    }

    function showToast(icon, text) {
        const toast = $('#toast');
        $('#toast-icon').textContent = icon;
        $('#toast-text').textContent = text;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3000);
    }


    /* ─── SCREEN NAVIGATION ──────────────────────── */
    function navigateTo(screenId) {
        const current = $(`.screen.active`);
        const target = $(`#${screenId}`);
        if (!target || target === current) return;

        if (current) {
            current.classList.add('exiting');
            current.classList.remove('active');
            setTimeout(() => current.classList.remove('exiting'), 500);
        }

        // Small delay so exit animation starts first
        setTimeout(() => {
            target.classList.add('active');
            state.currentScreen = screenId;

            // Screen-specific setup
            if (screenId === 'home-screen') setupHomeScreen();
            if (screenId === 'camera-screen') startCamera();
            if (screenId === 'today-screen') renderTodayScreen();
            if (screenId === 'family-screen') renderFamilyScreen();
            if (screenId === 'talk-screen') resetTalkScreen();
        }, 80);

        // Cleanup camera when leaving
        if (state.currentScreen === 'camera-screen' && screenId !== 'camera-screen') {
            stopCamera();
        }
    }


    /* ─── LANGUAGE SELECTION ─────────────────────── */
    function initLanguageScreen() {
        $$('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.language = btn.dataset.lang;
                localStorage.setItem('sahayak-lang', state.language);
                applyTranslations();
                navigateTo('home-screen');
            });
        });

        // If language already set, skip to home
        if (state.language) {
            applyTranslations();
            navigateTo('home-screen');
        }
    }

    function applyTranslations() {
        $$('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });
        $$('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });
    }


    /* ─── HOME SCREEN ────────────────────────────── */
    function setupHomeScreen() {
        $('#greeting-text').textContent = getGreeting();
        $('#greeting-name').textContent = state.userName;
        $('#greeting-subtitle').textContent = t('greeting_subtitle');
    }


    /* ─── CAMERA ─────────────────────────────────── */
    async function startCamera() {
        const video = $('#camera-video');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            state.cameraStream = stream;
            video.srcObject = stream;
        } catch (err) {
            console.warn('Camera not available:', err);
            // Show a demo result anyway
            showToast('📷', 'Camera not available — showing demo');
            setTimeout(() => showDemoResult('bill'), 1000);
        }
    }

    function stopCamera() {
        if (state.cameraStream) {
            state.cameraStream.getTracks().forEach(track => track.stop());
            state.cameraStream = null;
        }
    }

    function capturePhoto() {
        const video = $('#camera-video');
        const canvas = $('#camera-canvas');

        if (video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
        }

        stopCamera();

        // Show loading, then demo result
        showToast('🔍', t('analyzing'));
        setTimeout(() => {
            // Randomly show bill or scam demo
            const demos = ['bill', 'appointment', 'scam'];
            const pick = demos[Math.floor(Math.random() * demos.length)];
            showDemoResult(pick);
        }, 1500);
    }


    /* ─── SPEECH: Text-to-Speech ─────────────────── */
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85;
            utterance.pitch = 1;

            // Try to use Hindi voice for Hindi
            if (state.language === 'hi') {
                utterance.lang = 'hi-IN';
            } else {
                utterance.lang = 'en-IN';
            }

            utterance.onstart = () => {
                state.isSpeaking = true;
                $('#btn-listen').classList.add('playing');
            };
            utterance.onend = () => {
                state.isSpeaking = false;
                $('#btn-listen').classList.remove('playing');
            };

            window.speechSynthesis.speak(utterance);
        }
    }

    function stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            state.isSpeaking = false;
            const btn = $('#btn-listen');
            if (btn) btn.classList.remove('playing');
        }
    }


    /* ─── SPEECH: Speech-to-Text ─────────────────── */
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        state.recognition = new SpeechRecognition();
        state.recognition.continuous = false;
        state.recognition.interimResults = true;

        if (state.language === 'hi') {
            state.recognition.lang = 'hi-IN';
        } else {
            state.recognition.lang = 'en-IN';
        }

        state.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            const el = $('#talk-transcript');
            el.textContent = transcript;
            el.classList.add('has-text');
            $('#talk-actions').style.display = 'flex';
        };

        state.recognition.onend = () => {
            state.isListening = false;
            $('#mic-animation').classList.remove('listening');
            $('#talk-status').textContent = t('talk_tap');
        };

        state.recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            state.isListening = false;
            $('#mic-animation').classList.remove('listening');
            $('#talk-status').textContent = t('talk_tap');
        };
    }

    function toggleListening() {
        if (!state.recognition) {
            initSpeechRecognition();
        }

        if (state.isListening) {
            state.recognition.stop();
            state.isListening = false;
            $('#mic-animation').classList.remove('listening');
            $('#talk-status').textContent = t('talk_tap');
        } else {
            // Re-init with current language
            if (state.recognition) {
                if (state.language === 'hi') {
                    state.recognition.lang = 'hi-IN';
                } else {
                    state.recognition.lang = 'en-IN';
                }
            }

            try {
                state.recognition.start();
                state.isListening = true;
                $('#mic-animation').classList.add('listening');
                $('#talk-status').textContent = t('talk_listening');
            } catch (err) {
                console.warn('Speech recognition start failed:', err);
                showToast('🎙️', 'Voice not available — please type');
            }
        }
    }

    function resetTalkScreen() {
        const el = $('#talk-transcript');
        el.textContent = '';
        el.classList.remove('has-text');
        $('#talk-actions').style.display = 'none';
        $('#talk-status').textContent = t('talk_tap');
        $('#mic-animation').classList.remove('listening');
        $('#text-input').value = '';
        state.isListening = false;
    }


    /* ─── TODAY SCREEN ───────────────────────────── */
    function renderTodayScreen() {
        const isHi = state.language === 'hi';
        const events = isHi ? todayEventsHi : todayEvents;
        const tmrwEvents = isHi ? tomorrowEventsHi : tomorrowEvents;

        const container = $('#timeline-today');
        container.innerHTML = events.map((ev, i) => `
            <div class="timeline-item" style="animation-delay:${i * 0.1}s">
                <div class="timeline-dot ${ev.done ? 'done' : ''} ${ev.current ? 'upcoming' : ''}"></div>
                <div class="timeline-card ${ev.current ? 'current' : ''}">
                    <span class="timeline-emoji">${ev.emoji}</span>
                    <div class="timeline-info">
                        <span class="timeline-time">${ev.time}</span>
                        <span class="timeline-label">${ev.label}</span>
                        <span class="timeline-detail">${ev.detail}</span>
                    </div>
                </div>
            </div>
        `).join('');

        const tmrw = $('#timeline-tomorrow');
        tmrw.innerHTML = tmrwEvents.map((ev, i) => `
            <div class="timeline-item" style="animation-delay:${(events.length + i) * 0.1}s">
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <span class="timeline-emoji">${ev.emoji}</span>
                    <div class="timeline-info">
                        <span class="timeline-time">${ev.time}</span>
                        <span class="timeline-label">${ev.label}</span>
                        <span class="timeline-detail">${ev.detail}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }


    /* ─── FAMILY SCREEN ──────────────────────────── */
    function renderFamilyScreen() {
        const container = $('#family-contacts');
        container.innerHTML = familyContacts.map((c, i) => `
            <div class="contact-card" style="animation-delay:${i * 0.1}s">
                <div class="contact-avatar">${c.initials}</div>
                <div class="contact-info">
                    <span class="contact-name">${c.name}</span>
                    <span class="contact-relation">${c.relation}</span>
                </div>
                <div class="contact-actions">
                    <button class="contact-action-btn contact-call" data-phone="${c.phone}" data-name="${c.name}" aria-label="Call ${c.name}">
                        📞
                    </button>
                    <button class="contact-action-btn contact-msg" data-name="${c.name}" aria-label="Message ${c.name}">
                        💬
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.contact-call').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                showToast('📞', `Calling ${name}...`);
            });
        });

        container.querySelectorAll('.contact-msg').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                state.selectedContact = name;
                $('#family-context').style.display = 'block';
            });
        });

        $('#family-context').style.display = 'none';
    }


    /* ─── DEMO AI RESULTS ────────────────────────── */
    function showDemoResult(type) {
        const header = $('#result-header');
        const body = $('#result-body');
        const badge = $('#safety-badge');
        const actions = $('#result-actions');
        let speakText = '';

        switch (type) {
            case 'bill':
                badge.className = 'safety-badge safe';
                $('#safety-dot').className = 'safety-dot';
                $('#safety-text').textContent = t('safe');

                header.innerHTML = `
                    <span class="result-header-icon">📄</span>
                    <span class="result-header-title">${state.language === 'hi' ? 'आपका बिजली का बिल' : 'Your Electricity Bill'}</span>
                `;

                body.innerHTML = `
                    <div class="result-row">
                        <span class="result-label">${state.language === 'hi' ? 'राशि' : 'Amount'}</span>
                        <span class="result-value amount">₹1,240</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">${state.language === 'hi' ? 'देय तिथि' : 'Due Date'}</span>
                        <span class="result-value">20 September</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">${state.language === 'hi' ? 'प्रदाता' : 'Provider'}</span>
                        <span class="result-value">BSES Rajdhani</span>
                    </div>
                    <div class="result-warning">
                        <span class="result-warning-icon">⚠️</span>
                        <span>${state.language === 'hi' ? 'लेट फीस से बचने के लिए देय तिथि से पहले भुगतान करें।' : 'Pay before the due date to avoid late fees.'}</span>
                    </div>
                `;

                actions.innerHTML = `
                    <button class="btn-pill btn-primary" id="btn-remind-bill">${t('remind_me')}</button>
                    <button class="btn-pill btn-ghost" id="btn-pay-bill">${t('show_how_pay')}</button>
                `;

                speakText = state.language === 'hi'
                    ? 'आपका बिजली का बिल 1240 रुपये है। 20 सितंबर तक भुगतान करें।'
                    : 'Your electricity bill is 1,240 rupees. Due on 20 September. Pay before the due date to avoid late fees.';

                // Wire up action buttons
                setTimeout(() => {
                    const remindBtn = $('#btn-remind-bill');
                    if (remindBtn) {
                        remindBtn.addEventListener('click', () => {
                            showConfirmation({
                                icon: '⏰',
                                details: [
                                    { label: state.language === 'hi' ? 'रिमाइंडर' : 'Reminder', value: state.language === 'hi' ? 'बिजली बिल भुगतान' : 'Electricity Bill Payment' },
                                    { label: state.language === 'hi' ? 'तारीख' : 'Date', value: '19 September' },
                                    { label: state.language === 'hi' ? 'राशि' : 'Amount', value: '₹1,240' },
                                ],
                                onConfirm: () => showToast('✅', t('reminder_set')),
                            });
                        });
                    }
                    const payBtn = $('#btn-pay-bill');
                    if (payBtn) {
                        payBtn.addEventListener('click', () => startConversation('payment'));
                    }
                }, 100);
                break;

            case 'appointment':
                badge.className = 'safety-badge safe';
                $('#safety-dot').className = 'safety-dot';
                $('#safety-text').textContent = t('safe');

                header.innerHTML = `
                    <span class="result-header-icon">🩺</span>
                    <span class="result-header-title">${state.language === 'hi' ? 'आपकी अपॉइंटमेंट' : 'Your Appointment'}</span>
                `;

                body.innerHTML = `
                    <p class="result-info-text">${state.language === 'hi'
                        ? 'आपकी अपॉइंटमेंट कल सुबह 11 बजे है।'
                        : 'Your appointment is tomorrow at 11 AM.'}</p>
                    <div class="result-row" style="margin-top: 16px;">
                        <span class="result-label">${state.language === 'hi' ? 'डॉक्टर' : 'Doctor'}</span>
                        <span class="result-value">Dr. Sharma</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">${state.language === 'hi' ? 'समय' : 'Time'}</span>
                        <span class="result-value">11:00 AM</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">${state.language === 'hi' ? 'जगह' : 'Place'}</span>
                        <span class="result-value">City Hospital</span>
                    </div>
                `;

                actions.innerHTML = `
                    <button class="btn-pill btn-primary" id="btn-remind-appt">${t('remind_me')}</button>
                `;

                speakText = state.language === 'hi'
                    ? 'आपकी अपॉइंटमेंट कल सुबह 11 बजे है। डॉक्टर शर्मा, सिटी हॉस्पिटल।'
                    : 'Your appointment is tomorrow at 11 AM. Doctor Sharma at City Hospital.';

                setTimeout(() => {
                    const btn = $('#btn-remind-appt');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            showConfirmation({
                                icon: '🩺',
                                details: [
                                    { label: state.language === 'hi' ? 'रिमाइंडर' : 'Reminder', value: state.language === 'hi' ? 'डॉक्टर अपॉइंटमेंट' : 'Doctor Appointment' },
                                    { label: state.language === 'hi' ? 'कल' : 'Tomorrow', value: '11:00 AM' },
                                    { label: state.language === 'hi' ? 'डॉक्टर' : 'Doctor', value: 'Dr. Sharma' },
                                ],
                                onConfirm: () => showToast('✅', t('reminder_set')),
                            });
                        });
                    }
                }, 100);
                break;

            case 'scam':
                badge.className = 'safety-badge stop';
                $('#safety-dot').className = 'safety-dot';
                $('#safety-text').textContent = t('stop');

                header.innerHTML = `
                    <span class="result-header-icon">🔴</span>
                    <span class="result-header-title">${t('scam_stop')}</span>
                `;

                body.innerHTML = `
                    <p class="result-info-text" style="color: var(--red); font-weight: 700;">${
                        state.language === 'hi'
                            ? 'यह संदेश आपसे एक पेमेंट लिंक पर क्लिक करने को कह रहा है।'
                            : 'This message is asking you to click a payment link.'
                    }</p>
                    <p class="result-scam-text">${
                        state.language === 'hi'
                            ? 'मेरी सलाह है कि जब तक आप भेजने वाले की पुष्टि नहीं कर लेते, तब तक लिंक पर क्लिक न करें।'
                            : 'I recommend not clicking the link until you verify who sent it.'
                    }</p>
                `;

                actions.innerHTML = `
                    <button class="btn-pill btn-family-escalate" id="btn-scam-call-family">${t('call_family')}</button>
                    <button class="btn-pill btn-ghost" id="btn-scam-check-msg">${t('check_message')}</button>
                `;

                speakText = state.language === 'hi'
                    ? 'रुकें। यह संदेश आपसे एक पेमेंट लिंक पर क्लिक करने को कह रहा है। लिंक पर क्लिक न करें।'
                    : 'Stop. This message is asking you to click a payment link. I recommend not clicking the link until you verify who sent it.';

                setTimeout(() => {
                    const btn = $('#btn-scam-call-family');
                    if (btn) {
                        btn.addEventListener('click', () => navigateTo('family-screen'));
                    }
                    const btn2 = $('#btn-scam-check-msg');
                    if (btn2) {
                        btn2.addEventListener('click', () => showToast('🔍', state.language === 'hi' ? 'संदेश की जांच करें' : 'Checking the message...'));
                    }
                }, 100);
                break;

            default:
                body.innerHTML = `<p class="result-info-text">I'm here to help!</p>`;
                break;
        }

        // Store speak text for listen button
        $('#btn-listen').dataset.speakText = speakText;

        navigateTo('result-screen');
    }


    /* ─── CONFIRMATION MODAL ─────────────────────── */
    let confirmCallback = null;

    function showConfirmation({ icon, details, onConfirm }) {
        const modal = $('#confirmation-modal');
        $('#modal-icon').textContent = icon;
        const body = $('#modal-body');
        body.innerHTML = details.map(d => `
            <div class="modal-detail">
                <span class="modal-detail-label">${d.label}</span>
                <span class="modal-detail-value">${d.value}</span>
            </div>
        `).join('');

        confirmCallback = onConfirm;
        modal.classList.add('active');
    }

    function hideConfirmation() {
        $('#confirmation-modal').classList.remove('active');
        confirmCallback = null;
    }


    /* ─── CONVERSATIONAL UI ──────────────────────── */
    const conversationFlows = {
        payment: {
            steps: [
                {
                    question: () => state.language === 'hi' ? 'आप कैसे भुगतान करना चाहेंगे?' : 'How would you like to pay?',
                    type: 'options',
                    options: () => state.language === 'hi'
                        ? ['UPI / PhonePe', 'बैंक ट्रांसफर', 'ऑफलाइन / ऑफिस']
                        : ['UPI / PhonePe', 'Bank Transfer', 'Offline / Office'],
                },
                {
                    question: () => state.language === 'hi' ? 'क्या आप चाहते हैं कि मैं भुगतान की तारीख याद दिलाऊं?' : 'Would you like me to remind you on the payment date?',
                    type: 'options',
                    options: () => state.language === 'hi' ? ['हाँ, याद दिलाएं', 'नहीं, धन्यवाद'] : ['Yes, remind me', 'No, thank you'],
                },
            ],
            onComplete: (data) => {
                showToast('✅', t('reminder_set'));
                navigateTo('home-screen');
            },
        },
        help: {
            steps: [
                {
                    question: () => state.language === 'hi' ? 'आपको किस तरह की मदद चाहिए?' : 'What kind of help do you need?',
                    type: 'options',
                    options: () => state.language === 'hi'
                        ? ['दवाई के बारे में', 'अपॉइंटमेंट', 'बिल / भुगतान', 'कुछ और']
                        : ['About medicine', 'Appointment', 'Bill / Payment', 'Something else'],
                },
            ],
            onComplete: (data) => {
                showDemoResult('appointment');
            },
        },
    };

    function startConversation(flowName) {
        const flow = conversationFlows[flowName];
        if (!flow) return;

        state.conversationStep = 0;
        state.conversationData = {};
        state.conversationFlow = flow;

        renderConversationStep();
        navigateTo('conversation-screen');
    }

    function renderConversationStep() {
        const flow = state.conversationFlow;
        if (!flow || state.conversationStep >= flow.steps.length) {
            if (flow && flow.onComplete) flow.onComplete(state.conversationData);
            return;
        }

        const step = flow.steps[state.conversationStep];
        const question = typeof step.question === 'function' ? step.question() : step.question;

        // Animate question
        const bubble = $('#conv-question');
        bubble.textContent = question;

        // Input area
        const inputArea = $('#conv-input-area');
        inputArea.innerHTML = '';

        if (step.type === 'options') {
            const options = typeof step.options === 'function' ? step.options() : step.options;
            options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'conv-option-btn';
                btn.textContent = opt;
                btn.style.animationDelay = `${(i + 1) * 0.1}s`;
                btn.addEventListener('click', () => {
                    state.conversationData[`step_${state.conversationStep}`] = opt;
                    state.conversationStep++;
                    renderConversationStep();
                });
                inputArea.appendChild(btn);
            });
        } else if (step.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'conv-text-input';
            input.placeholder = step.placeholder || '';
            inputArea.appendChild(input);

            const btn = document.createElement('button');
            btn.className = 'btn-pill btn-primary';
            btn.textContent = state.language === 'hi' ? 'आगे बढ़ें' : 'Continue';
            btn.style.marginTop = '12px';
            btn.addEventListener('click', () => {
                state.conversationData[`step_${state.conversationStep}`] = input.value;
                state.conversationStep++;
                renderConversationStep();
            });
            inputArea.appendChild(btn);
        }

        // Progress dots
        const progress = $('#conv-progress');
        progress.innerHTML = flow.steps.map((_, i) => {
            let cls = 'conv-progress-dot';
            if (i < state.conversationStep) cls += ' done';
            if (i === state.conversationStep) cls += ' active';
            return `<span class="${cls}"></span>`;
        }).join('');
    }


    /* ─── HANDLE VOICE / TEXT INPUT ──────────────── */
    function handleUserMessage(text) {
        if (!text || !text.trim()) return;

        const lower = text.toLowerCase();

        // Simple keyword matching for demo
        if (lower.includes('bill') || lower.includes('बिल') || lower.includes('electricity') || lower.includes('बिजली')) {
            showDemoResult('bill');
        } else if (lower.includes('doctor') || lower.includes('appointment') || lower.includes('डॉक्टर') || lower.includes('अपॉइंटमेंट')) {
            showDemoResult('appointment');
        } else if (lower.includes('scam') || lower.includes('fraud') || lower.includes('suspicious') || lower.includes('धोखा') || lower.includes('link')) {
            showDemoResult('scam');
        } else if (lower.includes('today') || lower.includes('schedule') || lower.includes('आज') || lower.includes('day') || lower.includes('दिन')) {
            navigateTo('today-screen');
        } else if (lower.includes('family') || lower.includes('call') || lower.includes('priya') || lower.includes('परिवार') || lower.includes('कॉल') || lower.includes('प्रिया')) {
            navigateTo('family-screen');
        } else if (lower.includes('help') || lower.includes('मदद')) {
            startConversation('help');
        } else {
            // Default: show appointment result as demo
            showDemoResult('appointment');
        }
    }


    /* ─── EVENT LISTENERS ────────────────────────── */
    function bindEvents() {
        // Back buttons
        $$('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                stopSpeaking();
                const target = btn.dataset.back;
                navigateTo(target);
            });
        });

        // Home screen actions
        $('#btn-camera').addEventListener('click', () => navigateTo('camera-screen'));
        $('#btn-talk').addEventListener('click', () => navigateTo('talk-screen'));
        $('#btn-today').addEventListener('click', () => navigateTo('today-screen'));
        $('#btn-family-home').addEventListener('click', () => navigateTo('family-screen'));
        $('#btn-settings').addEventListener('click', () => {
            state.language = null;
            localStorage.removeItem('sahayak-lang');
            navigateTo('language-screen');
        });

        // Camera
        $('#btn-capture').addEventListener('click', capturePhoto);

        // Voice
        $('#btn-mic').addEventListener('click', toggleListening);

        // Send voice message
        $('#btn-send-voice').addEventListener('click', () => {
            const text = $('#talk-transcript').textContent;
            handleUserMessage(text);
        });

        // Retry voice
        $('#btn-retry-voice').addEventListener('click', () => {
            resetTalkScreen();
            toggleListening();
        });

        // Send text message
        $('#btn-send-text').addEventListener('click', () => {
            const text = $('#text-input').value;
            handleUserMessage(text);
        });

        $('#text-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage($('#text-input').value);
            }
        });

        // Listen button
        $('#btn-listen').addEventListener('click', () => {
            if (state.isSpeaking) {
                stopSpeaking();
            } else {
                const text = $('#btn-listen').dataset.speakText;
                if (text) speak(text);
            }
        });

        // Confirmation modal
        $('#btn-confirm-yes').addEventListener('click', () => {
            hideConfirmation();
            if (confirmCallback) confirmCallback();
        });

        $('#btn-confirm-change').addEventListener('click', () => {
            hideConfirmation();
        });

        // Family context buttons
        $$('.context-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = state.selectedContact || 'Priya';
                showToast('💬', `${t('msg_sent')} ${name}`);
                setTimeout(() => navigateTo('home-screen'), 1500);
            });
        });

        // Ask family from result screen
        $('#btn-ask-family').addEventListener('click', () => {
            stopSpeaking();
            navigateTo('family-screen');
        });

        // Scam modal buttons
        $('#btn-scam-family').addEventListener('click', () => {
            $('#scam-modal').classList.remove('active');
            navigateTo('family-screen');
        });

        $('#btn-scam-check').addEventListener('click', () => {
            $('#scam-modal').classList.remove('active');
        });
    }


    /* ─── INIT ───────────────────────────────────── */
    function init() {
        bindEvents();
        initLanguageScreen();
        initSpeechRecognition();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
