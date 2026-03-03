import { useState, useRef, useCallback, useEffect, FormEvent } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Phone, PhoneOff, Settings, Database, MessageSquare, Activity, Loader2, Send } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [activeTab, setActiveTab] = useState<'live' | 'chat' | 'knowledge'>('live');
  const [systemInstruction, setSystemInstruction] = useState(
    `Pertanyaan: Apa nama perusahaan ini?
Jawaban: Nama perusahaan ini adalah Maxy Academy.

Pertanyaan: Apa tagline Maxy Academy?
Jawaban: Empowering Gen Z with AI-Driven Learning, Digital Skills, and Purpose-Driven Leadership for Global Impact.

Pertanyaan: Apa moto Maxy Academy?
Jawaban: Moto Maxy Academy adalah "Komunikasi yang baik bisa mendorongmu untuk menjaga hubungan atau relasi dengan orang lain."

Pertanyaan: Apa itu Maxy Academy?
Jawaban: Tentang Kami: Maxy Academy adalah institusi pendidikan yang menggabungkan teknologi AI dan Blockchain untuk membekali mahasiswa dan pencari kerja dengan keterampilan, pengetahuan, dan kemampuan yang relevan. Kami berkomitmen mendukung Agenda Pembangunan Berkelanjutan (SDG) PBB melalui inisiatif pendidikan berkualitas. Kami menjembatani kesenjangan antara dunia akademik dan industri profesional.

Pertanyaan: Apa visi Maxy Academy?
Jawaban: Visi Maxy Academy tahun 2030 adalah mencetak 1.000.000 talenta digital dan 1.000 wirausaha digital & sosial di Indonesia. Misi utama kami adalah mengubah kehidupan melalui pendidikan digital untuk memberdayakan generasi muda Indonesia.

Pertanyaan: Apa misi Maxy Academy?
Jawaban: Misi Maxy Academy mencakup: 1. Menjembatani adaptasi mahasiswa dari dunia akademik menuju dunia kerja. 2. Menciptakan wadah mikro untuk generasi masa depan secara meta. 3. Menggunakan AI untuk membantu komunitas kecil mendapatkan akses edukasi yang berkualitas.

Pertanyaan: Apa nilai inti (core values) Maxy Academy?
Jawaban: Core Values (Nilai Inti) Maxy Academy adalah: Excellence (Keunggulan), Glory (Kejayaan), Relevance (Relevansi), Agile (Tangkas), dan Creative (Kreatif).

Pertanyaan: Apa statistik dan pencapaian Maxy Academy?
Jawaban: Statistik dan Pencapaian Maxy Academy meliputi: 3+ Tahun Pengalaman, 5.000+ Peserta (Maxians), 2.000+ Alumni telah mendapatkan pekerjaan, 250+ Universitas Mitra, 100+ Perusahaan Mitra (Nasional & Global), 98% Tingkat Penempatan Magang, dan >80% Tingkat Penempatan Kerja Penuh Waktu.

Pertanyaan: Apa saja layanan dan program di Maxy Academy?
Jawaban: Layanan dan Program Maxy Academy meliputi: 1. Career-Ready Bootcamps (Program intensif 45 hari di bidang AI, Cyber Security, Digital Marketing). 2. Sertifikasi Diakui Industri (CompTIA, BNSP). 3. Program Ruang Talenta (Job Connector) menghubungkan talenta dengan 100+ mitra industri.

Pertanyaan: Apa saja jalur karir (tracks) yang tersedia di Maxy Academy?
Jawaban: Jalur Karir (Tracks) di Maxy Academy meliputi: Jalur Magang (penempatan di Triputra Group, BRI, Google), Jalur Karier Penuh Waktu, dan Jalur Solopreneur & Entrepreneur (Technopreneurship & Sociopreneurship berbasis AI).

Pertanyaan: Siapa saja manajemen eksekutif di Maxy Academy?
Jawaban: Tim Manajemen Eksekutif Maxy Academy terdiri dari: Isaac Munandar (CEO), Andy F. Bintoro (CTO), Stefen Laksana (Product Development), Ika Noviani (Head of Operations), Regina Sydney (Head of Marketing and Sales), dan Jessica Charisma (University Relationship).

Pertanyaan: Dimana alamat kantor pusat Maxy Academy?
Jawaban: Alamat Kantor Pusat Maxy Academy di Jakarta berlokasi di Pakuwon Tower 26-J Jl. Casablanca Raya No.88, Jakarta Selatan, DKI Jakarta 12960.

Pertanyaan: Dimana alamat kantor cabang Maxy Academy?
Jawaban: Alamat Kantor Cabang Maxy Academy di Surabaya berlokasi di VieLoft SOHO Ciputra World 1220 Jl. Mayjen Sungkono Kav. 89, Surabaya, 60224.

Pertanyaan: Apa itu bootcamp di maxy academy?
Jawaban: Bootcamp di Maxy Academy adalah program pelatihan technology dan digital yang dilakukan secara intensif selama 1 bulan untuk mempersiapkan mahasiswa yang mampu menjawab kebutuhan industri.

Pertanyaan: Siapa yang bisa ikut maxy academy?
Jawaban: Yang bisa mengikuti program Maxy Academy adalah Mahasiswa semester 5 hingga fresh graduate.

Pertanyaan: Apa sajah yang dipelajari di bootcamp maxy academy ini?
Jawaban: Di Bootcamp Maxy Academy, mahasiswa bisa belajar Backend, Frontend, UI/UX, Digital Marketing, Product Management, dan Data Science.

Pertanyaan: Bagaimana tahapan bootcamp di maxy academy?
Jawaban: Tahapan bootcamp di Maxy Academy: Durasi 1 bulan (2 jam/hari Senin-Jumat). Ada assessment di setiap akhir materi. Minggu 1-2: Matchmaking perusahaan. Minggu 3: List perusahaan intern. Minggu 4: Selesai bootcamp dan mulai magang.

Pertanyaan: Apakah saya harus punya latar belakang IT?
Jawaban: Untuk kelas Backend dan Frontend di Maxy Academy disarankan memiliki latar belakang IT, namun untuk kelas lain terbuka umum.

Pertanyaan: Berapa lama bootcamp di maxy academy?
Jawaban: Program Bootcamp di Maxy Academy berlangsung secara intensif selama 1 bulan.

Pertanyaan: Setelah menyelesaikan bootcamp, apakah saya akan dibantu mendapatkan magang?
Jawaban: Ya, setelah bootcamp Maxy Academy, kamu akan dibantu mendapatkan magang di perusahaan partner kami apabila mengambil paket bootcamp Coaching atau Mentoring.

Pertanyaan: Apakah saya bisa memilih magang secara onsite atau online?
Jawaban: Pelaksanaan magang Maxy Academy secara onsite atau online tergantung pada kebijakan masing-masing perusahaan partner.

Pertanyaan: Apakah saya bisa memilih perusahaan partner MAXY Academy untuk magang?
Jawaban: Mahasiswa harus mengikuti proses matchmaking terlebih dahulu yang akan dilakukan dalam proses bootcamp Maxy Academy untuk menentukan perusahaan tempat magang.

Pertanyaan: Setelah menyelesaikan magang, apakah saya akan dibantu mendapatkan full time job?
Jawaban: Iya, Maxy Academy dapat membantu mendapatkan full time job setelah magang, namun terdapat biaya tambahan. Hubungi kami untuk detailnya.

Pertanyaan: Bagaimana cara mendaftar bootcamp di MAXY Academy?
Jawaban: Cara daftar bootcamp Maxy Academy: Registrasi melalui website https://maxy.academy atau Whatsapp kami (https://wa.me/628113955599) dan isi form pendaftaran. Tim kami akan menghubungi Anda selanjutnya.

Pertanyaan: Bagaimana caranya saya bisa mendapatkan scholarship up to 100%?
Jawaban: Untuk mendapatkan scholarship hingga 100% di Maxy Academy, kamu bisa mengikuti placement test online (60 menit). Hubungi Whatsapp kami (https://wa.me/628113955599) untuk akses tes.

Pertanyaan: Apakah ada program cicilan?
Jawaban: Ya, Maxy Academy menyediakan program cicilan menggunakan Edufund hingga 12x dengan bunga yang terjangkau.

Pertanyaan: Dimana alamat lengkap kantor Maxy Academy?
Jawaban: Maxy Academy memiliki dua lokasi kantor. 1. Kantor Pusat (Jakarta): Pakuwon Tower 26-J Jl. Casablanca Raya No.88, Jakarta Selatan, DKI Jakarta 12960. 2. Kantor Cabang (Surabaya): VieLoft SOHO Ciputra World 1220 Jl. Mayjen Sungkono Kav. 89, Surabaya, 60224.

Pertanyaan: Apa detail dan harga paket Bootcamp Only?
Jawaban: Paket 'Bootcamp Only' seharga Rp 9.000.000. Keuntungan mencakup: Group Mentoring (1 Mentor untuk 1 Kelas), Lifetime Maxy Community, E-Book Maxy Academy, Private Access Upskilling LMS Selama 1 Tahun, Onboarding Kit, Konversi 20 SKS di Universitas, dan Internship Guarantee *(S&K berlaku).

Pertanyaan: Apa detail dan harga paket Bootcamp + Internship?
Jawaban: Paket 'Bootcamp + Internship' seharga Rp 25.000.000. Keuntungan mencakup: Konversi 20 SKS di Universitas, Internship Guarantee *(S&K berlaku), Group Mentoring (1 Mentor untuk 1 Kelas), Lifetime Maxy Community, E-Book Maxy Academy, Private Access Upskilling LMS Selama 1 Tahun, dan Onboarding Kit.

Pertanyaan: Apa Facebook resmi Maxy Academy?
Jawaban: Halaman Facebook resmi Maxy Academy adalah: https://www.facebook.com/maxy.academy

Pertanyaan: Apa Instagram resmi Maxy Academy?
Jawaban: Akun Instagram resmi Maxy Academy adalah: https://www.instagram.com/maxy.academy

Pertanyaan: Apa LinkedIn resmi Maxy Academy?
Jawaban: LinkedIn resmi Maxy Academy adalah: https://www.linkedin.com/company/maxyacademy/

Pertanyaan: Apa TikTok resmi Maxy Academy?
Jawaban: Akun TikTok resmi Maxy Academy adalah: https://www.tiktok.com/@maxy.academy?_t=8XjFgVmDMOY&_r=1

Pertanyaan: Apa WhatsApp resmi Maxy Academy?
Jawaban: Nomor WhatsApp resmi Maxy Academy untuk konsultasi adalah: https://api.whatsapp.com/send/?phone=628113955599

Pertanyaan: Apa saja daftar lengkap akun media sosial Maxy Academy?
Jawaban: Berikut adalah daftar lengkap media sosial resmi Maxy Academy:
- Instagram: https://www.instagram.com/maxy.academy
- LinkedIn: https://www.linkedin.com/company/maxyacademy/
- TikTok: https://www.tiktok.com/@maxy.academy?_t=8XjFgVmDMOY&_r=1
- Facebook: https://www.facebook.com/maxy.academy
- WhatsApp: https://api.whatsapp.com/send/?phone=628113955599

=== TIM MANAJEMEN ===
Isaac Munandar (CEO), Andy F. Bintoro (CTO), Stefen Laksana (Product Development), Ika Noviani (Head of Operations), Regina Sydney (Head of Marketing and Sales), Jessica Charisma (University Relationship).

=== ALAMAT KANTOR ===
Kantor Pusat (Jakarta): Pakuwon Tower 26-J Jl. Casablanca Raya No.88, Jakarta Selatan, DKI Jakarta 12960.
Kantor Cabang (Surabaya): VieLoft SOHO Ciputra World 1220 Jl. Mayjen Sungkono Kav. 89, Surabaya, 60224.

=== MEDIA SOSIAL ===
Instagram: https://www.instagram.com/maxy.academy
LinkedIn: https://www.linkedin.com/company/maxyacademy/
TikTok: https://www.tiktok.com/@maxy.academy
Facebook: https://www.facebook.com/maxy.academy
WhatsApp: https://api.whatsapp.com/send/?phone=628113955599

ATURAN PENTING:
- Jika pertanyaan di luar konteks Maxy Academy, sampaikan dengan sopan bahwa Anda hanya bisa membantu terkait Maxy Academy.
- Selalu rekomendasikan untuk menghubungi WhatsApp resmi untuk informasi lebih lanjut.
- Bersikaplah ramah dan antusias saat menjelaskan program.
- JANGAN mengarang informasi yang tidak ada di Knowledge Base.${"`"}`
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Halo! 👋 Saya asisten Customer Service Maxy Academy. Ada yang bisa saya bantu hari ini? Kamu bisa tanya tentang program bootcamp, magang, harga paket, atau apapun seputar Maxy Academy!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);

  const audioQueueRef = useRef<Float32Array[]>([]);
  const nextPlayTimeRef = useRef(0);

  const connect = async () => {
    setIsConnecting(true);
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

      processorNodeRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);

            processorNodeRef.current!.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                let s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }

              const buffer = new ArrayBuffer(pcm16.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(i * 2, pcm16[i], true);
              }

              let binary = '';
              const bytes = new Uint8Array(buffer);
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            sourceNodeRef.current!.connect(processorNodeRef.current!);
            processorNodeRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData && part.inlineData.data) {
                  const binary = atob(part.inlineData.data);
                  const bytes = new Uint8Array(binary.length);
                  for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                  }
                  const view = new DataView(bytes.buffer);
                  const pcm16 = new Int16Array(bytes.length / 2);
                  for (let i = 0; i < pcm16.length; i++) {
                    pcm16[i] = view.getInt16(i * 2, true);
                  }

                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                    float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
                  }

                  audioQueueRef.current.push(float32);
                  playNextAudio();
                }
              }
            }

            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              nextPlayTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            disconnect();
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to connect:", err);
      setIsConnecting(false);
      disconnect();
    }
  };

  const playNextAudio = () => {
    if (!audioContextRef.current || audioQueueRef.current.length === 0) return;

    setIsSpeaking(true);
    const audioData = audioQueueRef.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length, 24000);
    audioBuffer.copyToChannel(audioData, 0);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    const currentTime = audioContextRef.current.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime;
    }

    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;

    source.onended = () => {
      if (audioQueueRef.current.length > 0) {
        playNextAudio();
      } else {
        setIsSpeaking(false);
      }
    };
  };

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
      sessionRef.current = null;
    }
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    audioQueueRef.current = [];
    nextPlayTimeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    try {
      // Build history for context
      const history = chatMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemInstruction,
        },
        history: history
      });

      const response = await chat.sendMessage({ message: userMessage });

      setChatMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: 'Maaf, terjadi kesalahan saat memproses pesan Anda.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-200">
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
            <Activity className="w-6 h-6" />
            CS AI Platform
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Prototype Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('live')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'live'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-zinc-600 hover:bg-zinc-100'
              }`}
          >
            <Phone className="w-4 h-4" />
            Live Call Test
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'chat'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-zinc-600 hover:bg-zinc-100'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            Text Chatbot
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'knowledge'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-zinc-600 hover:bg-zinc-100'
              }`}
          >
            <Database className="w-4 h-4" />
            Knowledge Base
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-500">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {activeTab === 'live' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100">
              <div className="p-8 flex flex-col items-center text-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isConnected
                  ? isSpeaking
                    ? 'bg-indigo-100 shadow-[0_0_40px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-indigo-50 shadow-lg'
                  : 'bg-zinc-100'
                  }`}>
                  {isConnected ? (
                    <div className="relative">
                      <Activity className={`w-12 h-12 text-indigo-600 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      {isSpeaking && (
                        <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-ping opacity-20"></div>
                      )}
                    </div>
                  ) : (
                    <PhoneOff className="w-12 h-12 text-zinc-400" />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-zinc-800 mb-2">
                  {isConnected ? 'Connected to AI' : 'AI Customer Service'}
                </h2>
                <p className="text-zinc-500 text-sm mb-8">
                  {isConnected
                    ? isSpeaking ? 'AI is speaking...' : 'Listening to you...'
                    : 'Click the button below to start a voice call with the AI agent.'}
                </p>

                <button
                  onClick={isConnected ? disconnect : connect}
                  disabled={isConnecting}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isConnecting
                    ? 'bg-zinc-400'
                    : isConnected
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                >
                  {isConnecting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isConnected ? (
                    <PhoneOff className="w-6 h-6" />
                  ) : (
                    <Phone className="w-6 h-6" />
                  )}
                </button>
              </div>

              {isConnected && (
                <div className="bg-zinc-50 p-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Session Active
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-6 border-b border-zinc-200 bg-white">
              <h2 className="text-xl font-bold text-zinc-800">Text Chatbot</h2>
              <p className="text-sm text-zinc-500">Chat with the AI Customer Service agent</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-5 py-3 text-sm bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>AI is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-zinc-200">
              <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 bg-zinc-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl text-sm outline-none transition-all"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Knowledge Base (RAG Simulation)</h2>
                <p className="text-zinc-600">
                  Configure the system instructions and knowledge that the AI will use to answer customer queries.
                  In a production environment, this would be connected to a vector database (like Pinecone) for Retrieval-Augmented Generation.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  System Instructions & Context
                </label>
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  className="w-full h-64 p-4 text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  placeholder="Enter the instructions and knowledge for the AI..."
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-6 py-2 bg-white border border-zinc-300 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    Test in Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('live')}
                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Test in Voice Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
