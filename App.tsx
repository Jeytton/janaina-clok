
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Instagram, 
  Mail, 
  Menu, 
  X,
  ChevronDown,
  Heart,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  Settings,
  Save,
  LogOut,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const WHATSAPP_LINK = "https://wa.me/5542999748582";

// --- DEFAULT CONTENT CONFIGURATION ---
const DEFAULT_CONTENT = {
  colors: {
    terracotta: "#BC6C5A",
    deepTerracotta: "#8B5E52",
    warmBeige: "#FDFBF9",
    softSand: "#FAF3ED",
    earthText: "#433430"
  },
  hero: {
    titlePrefix: "Ressignifique",
    titleMain: " sua ",
    titleItalic: "história.",
    subtitle: "Apoio especializado para adultos que buscam superar a ansiedade, fortalecer a autoestima e encontrar equilíbrio em suas relações.",
    cta: "Agendar Atendimento",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000"
  },
  abordagem: {
    image: "https://images.unsplash.com/photo-1516533075015-a3838414c3cb?auto=format&fit=crop&q=80&w=1000"
  },
  sobre: {
    title: "Janaina Clok",
    quote: "Minha trajetória é dedicada a entender a complexidade do outro e oferecer ferramentas para uma vida com mais significado.",
    text1: "Sou psicóloga clínica com 12 anos de experiência e uma trajetória de 19 anos dedicada ao Serviço Social, o que me conferiu uma visão profunda sobre a resiliência humana.",
    text2: "Minha postura é acolhedora, clara e objetiva. Não trabalho com fórmulas mágicas, mas sim com um compromisso ético profundo em caminhar ao seu lado na busca por clareza emocional e saúde mental duradoura.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=1000"
  },
  atendimento: {
    title: "Como podemos conversar?",
    subtitle: "Ofereço modalidades flexíveis para que você possa iniciar seu processo com conforto e segurança."
  }
};

const App: React.FC = () => {
  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Content state loaded from localStorage or default
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('janaina_clok_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge to ensure new sections like 'abordagem' exist even if the user has an old save
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          colors: { ...DEFAULT_CONTENT.colors, ...parsed.colors },
          hero: { ...DEFAULT_CONTENT.hero, ...parsed.hero },
          abordagem: { ...DEFAULT_CONTENT.abordagem, ...parsed.abordagem },
          sobre: { ...DEFAULT_CONTENT.sobre, ...parsed.sobre },
          atendimento: { ...DEFAULT_CONTENT.atendimento, ...parsed.atendimento }
        };
      } catch (e) {
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  // Login credentials state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // --- HANDLERS ---
  const saveContent = useCallback(() => {
    try {
      localStorage.setItem('janaina_clok_content', JSON.stringify(content));
      alert('Alterações salvas com sucesso no seu navegador!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar: O tamanho das imagens pode ter excedido o limite do navegador. Tente usar imagens menores.');
    }
  }, [content]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'Janaina Clok' && loginForm.password === '0846252') {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsAdminMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Credenciais inválidas.');
    }
  };

  const handleContentChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleColorChange = (key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleImageUpload = (section: string, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB para garantir o salvamento.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleContentChange(section, field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollTo = useCallback((id: string) => (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', id: 'inicio' },
    { name: 'Para quem é', id: 'para-quem' },
    { name: 'Abordagem', id: 'abordagem' },
    { name: 'Sobre mim', id: 'sobre' },
    { name: 'Atendimento', id: 'atendimento' },
  ];

  // --- RENDER HELPERS ---
  const EditableText = ({ section, field, className, multiline = false }: any) => {
    if (!isAdminMode) return <span className={className}>{content[section][field]}</span>;
    
    return multiline ? (
      <textarea
        className={`w-full bg-yellow-50 border border-yellow-200 p-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 ${className}`}
        value={content[section][field]}
        onChange={(e) => handleContentChange(section, field, e.target.value)}
        rows={4}
      />
    ) : (
      <input
        className={`w-full bg-yellow-50 border border-yellow-200 p-1 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 ${className}`}
        value={content[section][field]}
        onChange={(e) => handleContentChange(section, field, e.target.value)}
      />
    );
  };

  const ImageUploader = ({ section, field, roundedClass = "rounded-[3rem]" }: { section: string, field: string, roundedClass?: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    if (!isAdminMode) return null;

    return (
      <div className={`absolute inset-0 z-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 ${roundedClass}`}>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-gray-800 px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-xl hover:scale-105 transition-transform"
        >
          <Upload size={20} />
          Trocar Foto
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload(section, field)} 
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: content.colors.warmBeige, color: content.colors.earthText }}>
      
      {/* Admin Toggle Button */}
      {!isAdminMode && (
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="fixed bottom-4 left-4 z-[110] p-3 bg-gray-800 text-white rounded-full opacity-20 hover:opacity-100 transition-opacity"
          title="Acesso Administrativo"
        >
          <Settings size={20} />
        </button>
      )}

      {/* Admin Panel Header */}
      {isAdminMode && (
        <div className="fixed top-0 left-0 w-full bg-gray-900 text-white z-[200] px-6 py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} /> Painel Administrativo
            </span>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center space-x-3">
              <label className="text-[10px] uppercase font-bold text-gray-400">Cor Principal:</label>
              <input 
                type="color" 
                value={content.colors.terracotta} 
                onChange={(e) => handleColorChange('terracotta', e.target.value)} 
                className="h-6 w-10 border-none bg-transparent cursor-pointer rounded" 
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={saveContent} 
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Save size={16} /> SALVAR ALTERAÇÕES
            </button>
            <button 
              onClick={() => { setIsAdminMode(false); setIsLoggedIn(false); }} 
              className="bg-gray-700 hover:bg-red-600 px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all"
            >
              <LogOut size={16} /> SAIR
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#BC6C5A]/10 text-[#BC6C5A] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#433430]">Painel de Controle</h3>
              <p className="text-gray-500 text-sm">Autentique-se para editar sua página</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Usuário</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BC6C5A]/20"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Senha</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BC6C5A]/20"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#BC6C5A] text-white p-4 rounded-xl font-bold shadow-lg shadow-terracotta/20 hover:bg-[#A3594A] transition-all">
                Acessar Painel
              </button>
              <button type="button" onClick={() => setIsLoginOpen(false)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest pt-4">
                Voltar ao site
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-5'} ${isAdminMode ? 'mt-[52px]' : ''}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => scrollTo('inicio')()} className="flex flex-col group text-left">
            <span className="text-xl md:text-2xl font-serif tracking-widest font-bold uppercase transition-colors" style={{ color: content.colors.terracotta }}>Janaina Clok</span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500">Psicóloga Clínica | CRP 08/46252</span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)()}
                className="text-[11px] font-bold hover:opacity-70 transition-colors uppercase tracking-[0.15em]"
                style={{ color: content.colors.earthText }}
              >
                {link.name}
              </button>
            ))}
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-7 py-3 rounded-full text-[11px] font-bold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg uppercase tracking-[0.15em]"
              style={{ backgroundColor: content.colors.terracotta, boxShadow: `0 10px 20px -5px ${content.colors.terracotta}40` }}
            >
              <MessageCircle size={14} />
              <span>Agendar</span>
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ color: content.colors.earthText }}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white fixed inset-0 top-[60px] z-[99] p-8 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)()}
                className="text-2xl font-serif py-4 border-b border-gray-100 text-left"
                style={{ color: content.colors.earthText }}
              >
                {link.name}
              </button>
            ))}
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white p-5 rounded-2xl text-center font-bold flex items-center justify-center space-x-3 shadow-xl mt-4"
              style={{ backgroundColor: content.colors.terracotta }}
            >
              <MessageCircle size={24} />
              <span className="text-lg uppercase tracking-widest">Agendar Consulta</span>
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 md:pt-48 md:pb-36 relative overflow-hidden flex items-center min-h-[90vh]" style={{ backgroundColor: content.colors.softSand }}>
        <div className="absolute top-0 right-0 w-[50%] h-full rounded-l-full blur-3xl -z-10" style={{ backgroundColor: `${content.colors.terracotta}08` }}></div>
        
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-3 px-5 py-2 bg-white border border-[#E8D8D0] rounded-full shadow-sm">
                <Heart size={14} style={{ color: content.colors.terracotta }} />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#8B5E52] uppercase">Espaço Ético e Acolhedor</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif leading-[1.05]" style={{ color: content.colors.earthText }}>
                <EditableText section="hero" field="titlePrefix" />
                <EditableText section="hero" field="titleMain" />
                <span className="italic" style={{ color: content.colors.terracotta }}>
                  <EditableText section="hero" field="titleItalic" />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg font-light">
                <EditableText section="hero" field="subtitle" multiline />
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white px-10 py-5 rounded-full font-bold transition-all flex items-center justify-center space-x-3 text-xs uppercase tracking-widest shadow-2xl"
                  style={{ backgroundColor: content.colors.terracotta, boxShadow: `0 20px 40px -10px ${content.colors.terracotta}40` }}
                >
                  <MessageCircle size={20} />
                  <span><EditableText section="hero" field="cta" /></span>
                </a>
                <button 
                  onClick={() => scrollTo('para-quem')()}
                  className="bg-white border border-[#E8D8D0] px-10 py-5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 text-xs uppercase tracking-widest group"
                  style={{ color: content.colors.earthText }}
                >
                  <span>Saiba Mais</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <ImageUploader section="hero" field="image" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] z-10 border-[16px] border-white">
                <img src={content.hero.image} alt="Janaina Clok" className="w-full h-[500px] md:h-[650px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quem Section */}
      <section id="para-quem" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: content.colors.earthText }}>Para quem é o atendimento?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg font-light">Identifique o momento de buscar um suporte profissional para cuidar da sua saúde mental.</p>
            <div className="h-0.5 w-24 mt-8 mx-auto rounded-full" style={{ backgroundColor: content.colors.terracotta }}></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Controle da Ansiedade", desc: "Tratamento para inquietação, preocupação excessiva e estresse.", icon: "🌿" },
              { title: "Dificuldades de Relação", desc: "Comunicação, limites saudáveis e superação de conflitos.", icon: "🤝" },
              { title: "Fortalecimento da Autoestima", desc: "Autoconhecimento para lidar with insecurities and regain confidence.", icon: "✨" },
              { title: "Regulação Emocional", desc: "Lidar com oscilações de humor e sentimentos de tristeza profunda.", icon: "🪴" },
              { title: "Vida no Exterior", desc: "Suporte especializado para desafios da adaptação cultural e isolamento.", icon: "🌎" },
              { title: "Transições e Decisões", desc: "Apoio em mudanças de carreira, luto e grandes escolhas.", icon: "⏳" }
            ].map((item, idx) => (
              <div key={idx} className="p-12 rounded-[2.5rem] border border-transparent hover:shadow-2xl transition-all duration-500 group" style={{ backgroundColor: content.colors.softSand }}>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: content.colors.earthText }}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abordagem Section */}
      <section id="abordagem" className="py-28 relative" style={{ backgroundColor: content.colors.softSand }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-2" style={{ color: content.colors.terracotta }}>
                <Award size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Abordagem Integrada</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight" style={{ color: content.colors.earthText }}>Ciência e Humanidade <br /> em <span style={{ color: content.colors.terracotta }}>sintonia.</span></h2>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Minha prática clínica integra a objetividade da TCC com a sensibilidade da Abordagem Humanista, garantindo um tratamento personalizado para cada paciente.
              </p>
              <div className="space-y-8 pt-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E8D8D0] flex gap-6">
                  <div className="p-4 rounded-2xl h-fit" style={{ backgroundColor: `${content.colors.terracotta}15`, color: content.colors.terracotta }}><ShieldCheck size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Terapia Cognitivo-Comportamental</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Focada em evidências, a TCC auxilia na identificação de padrões de pensamento e na mudança de comportamentos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <ImageUploader section="abordagem" field="image" />
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img src={content.abordagem.image} alt="Consultório" className="w-full h-[600px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mim Section */}
      <section id="sobre" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 relative group">
               <ImageUploader section="sobre" field="image" />
               <img src={content.sobre.image} alt="Janaina Clok" className="rounded-[3.5rem] shadow-2xl h-[750px] w-full object-cover grayscale-[10%]" />
               <div className="absolute top-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden lg:block">
                  <div className="flex items-center space-x-4">
                     <div className="p-3 rounded-full text-white" style={{ backgroundColor: content.colors.terracotta }}><Heart size={24} /></div>
                     <div>
                        <p className="text-2xl font-serif font-bold" style={{ color: content.colors.earthText }}>12 Anos</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Atuação Clínica</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <div className="space-y-4">
                <span className="font-bold tracking-widest text-xs uppercase" style={{ color: content.colors.terracotta }}>Conheça sua Terapeuta</span>
                <h2 className="text-4xl md:text-6xl font-serif" style={{ color: content.colors.earthText }}><EditableText section="sobre" field="title" /></h2>
                <div className="h-0.5 w-20" style={{ backgroundColor: content.colors.terracotta }}></div>
              </div>
              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p className="italic text-xl border-l-4 pl-6 py-2" style={{ color: content.colors.terracotta, borderColor: content.colors.terracotta }}>
                  "<EditableText section="sobre" field="quote" multiline />"
                </p>
                <p><EditableText section="sobre" field="text1" multiline /></p>
                <p><EditableText section="sobre" field="text2" multiline /></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atendimento Section */}
      <section id="atendimento" className="py-28" style={{ backgroundColor: content.colors.softSand }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif mb-6" style={{ color: content.colors.earthText }}><EditableText section="atendimento" field="title" /></h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-lg font-light"><EditableText section="atendimento" field="subtitle" multiline /></p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="p-12 rounded-[3.5rem] bg-white border border-[#E8D8D0] text-center space-y-8 hover:shadow-2xl transition-all duration-500">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${content.colors.terracotta}10`, color: content.colors.terracotta }}><MapPin size={40} /></div>
              <h3 className="text-3xl font-serif font-bold">Presencial</h3>
              <p className="text-gray-500">Consultório privado em Ponta Grossa (PR), em ambiente sigiloso.</p>
            </div>
            <div className="p-12 rounded-[3.5rem] bg-white border border-[#E8D8D0] text-center space-y-8 hover:shadow-2xl transition-all duration-500">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${content.colors.terracotta}10`, color: content.colors.terracotta }}><Globe size={40} /></div>
              <h3 className="text-3xl font-serif font-bold">Online</h3>
              <p className="text-gray-500">Videochamada para brasileiros em qualquer lugar do mundo.</p>
            </div>
          </div>

          <div className="mt-24 text-center">
            <div className="p-16 md:p-24 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden" style={{ backgroundColor: content.colors.terracotta }}>
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                  <h2 className="text-4xl md:text-6xl font-serif leading-tight">Agende seu horário e inicie seu processo.</h2>
                  <a 
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-white px-14 py-6 rounded-full font-bold hover:scale-105 transition-all shadow-xl items-center space-x-4 text-xs uppercase tracking-[0.2em]"
                    style={{ color: content.colors.terracotta }}
                  >
                    <MessageCircle size={24} />
                    <span>Falar no WhatsApp</span>
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-28 pb-12 border-t border-[#E8D8D0]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-20 mb-20">
            <div className="space-y-6">
               <span className="text-3xl font-serif font-bold" style={{ color: content.colors.terracotta }}>Janaina Clok</span>
               <p className="text-gray-500 leading-relaxed font-light">Acolhimento humanizado e compromisso ético na saúde mental do adulto.</p>
            </div>
            <div className="space-y-8">
              <h5 className="font-bold uppercase tracking-[0.2em] text-[10px]">Mapa do Site</h5>
              <ul className="space-y-4 text-gray-500 uppercase tracking-widest text-[11px] font-semibold">
                <li><button onClick={() => scrollTo('inicio')()} className="hover:opacity-70 transition-opacity">Início</button></li>
                <li><button onClick={() => scrollTo('para-quem')()} className="hover:opacity-70 transition-opacity">Para quem é</button></li>
                <li><button onClick={() => scrollTo('sobre')()} className="hover:opacity-70 transition-opacity">Sobre Mim</button></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h5 className="font-bold uppercase tracking-[0.2em] text-[10px]">Contato</h5>
              <div className="space-y-5 text-gray-600 text-sm">
                <p className="flex items-center gap-3"><MapPin size={18} style={{ color: content.colors.terracotta }} /> Ponta Grossa - PR</p>
                <p className="flex items-center gap-3"><MessageCircle size={18} style={{ color: content.colors.terracotta }} /> (42) 99974-8582</p>
                <p className="font-bold pt-4" style={{ color: content.colors.terracotta }}>CRP 08/46252</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-12 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Janaina Clok - Psicologia Clínica. <br />
            Este site não oferece atendimento de urgência e emergência.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 bg-[#25D366] text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100]"
      >
        <MessageCircle size={36} />
      </a>
    </div>
  );
};

export default App;
