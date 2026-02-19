
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
  Heart,
  ShieldCheck,
  Award,
  ArrowRight,
  Settings,
  Save,
  LogOut,
  Upload
} from 'lucide-react';

const WHATSAPP_LINK = "https://wa.me/5542999748582";

// --- CONFIGURAÇÃO INICIAL PADRÃO ---
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
    text1: "Sou psicóloga clínica com 12 anos de experiência e uma trajetória de 19 anos dedicada ao Serviço Social.",
    text2: "Minha postura é acolhedora, clara e objetiva. Trabalho com o compromisso ético profundo em caminhar ao seu lado.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=1000"
  },
  atendimento: {
    title: "Como podemos conversar?",
    subtitle: "Ofereço modalidades flexíveis para que você possa iniciar seu processo com conforto e segurança."
  }
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('janaina_clok_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge para garantir que campos novos (como abordagem.image) existam
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          abordagem: { ...DEFAULT_CONTENT.abordagem, ...parsed.abordagem }
        };
      } catch (e) {
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const saveContent = useCallback(() => {
    try {
      localStorage.setItem('janaina_clok_content', JSON.stringify(content));
      alert('Alterações salvas com sucesso!');
    } catch (e) {
      alert('Erro ao salvar: Imagens muito grandes podem travar o salvamento no navegador.');
    }
  }, [content]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'Janaina Clok' && loginForm.password === '0846252') {
      setIsAdminMode(true);
      setIsLoginOpen(false);
    } else {
      alert('Credenciais inválidas.');
    }
  };

  const handleContentChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleImageUpload = (section: string, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Imagem muito pesada! Escolha uma menor que 1.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => handleContentChange(section, field, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Componente de edição de texto
  const EditableText = ({ section, field, className, multiline = false }: any) => {
    if (!isAdminMode) return <span className={className}>{content[section][field]}</span>;
    return multiline ? (
      <textarea
        className={`w-full bg-yellow-50 border border-yellow-200 p-2 rounded ${className}`}
        value={content[section][field]}
        onChange={(e) => handleContentChange(section, field, e.target.value)}
        rows={4}
      />
    ) : (
      <input
        className={`w-full bg-yellow-50 border border-yellow-200 p-1 rounded ${className}`}
        value={content[section][field]}
        onChange={(e) => handleContentChange(section, field, e.target.value)}
      />
    );
  };

  // Componente de Upload de Imagem
  const ImageUploader = ({ section, field }: { section: string, field: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    if (!isAdminMode) return null;
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-[3rem]">
        <button onClick={() => inputRef.current?.click()} className="bg-white px-4 py-2 rounded-full font-bold flex gap-2 items-center">
          <Upload size={16} /> Trocar Foto
        </button>
        <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleImageUpload(section, field)} />
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: content.colors.warmBeige, color: content.colors.earthText }}>
      
      {/* Botão administrativo escondido */}
      {!isAdminMode && (
        <button onClick={() => setIsLoginOpen(true)} className="fixed bottom-4 left-4 z-[110] opacity-10 hover:opacity-100 p-2 bg-gray-800 text-white rounded-full">
          <Settings size={18} />
        </button>
      )}

      {/* Login Painel */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-6 text-center">Login Administrativo</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Usuário" className="w-full p-3 border rounded-xl" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required />
              <input type="password" placeholder="Senha" className="w-full p-3 border rounded-xl" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
              <button type="submit" className="w-full p-3 bg-[#BC6C5A] text-white rounded-xl font-bold">Entrar</button>
              <button type="button" onClick={() => setIsLoginOpen(false)} className="w-full text-xs text-gray-400">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Cabeçalho do Painel */}
      {isAdminMode && (
        <div className="fixed top-0 left-0 w-full bg-gray-900 text-white p-3 z-[200] flex justify-between items-center px-6">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Modo Edição</span>
          <div className="flex gap-4">
            <button onClick={saveContent} className="bg-green-600 px-4 py-1 rounded text-xs font-bold flex items-center gap-2"><Save size={14}/> SALVAR</button>
            <button onClick={() => setIsAdminMode(false)} className="bg-red-600 px-4 py-1 rounded text-xs font-bold flex items-center gap-2"><LogOut size={14}/> SAIR</button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/95 shadow-sm py-3' : 'bg-transparent py-6'} ${isAdminMode ? 'mt-12' : ''}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-widest uppercase" style={{ color: content.colors.terracotta }}>Janaina Clok</span>
            <span className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">Psicóloga Clínica</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-widest">
            {['inicio', 'para-quem', 'abordagem', 'sobre', 'atendimento'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:opacity-60">{id.replace('-', ' ')}</button>
            ))}
            <a href={WHATSAPP_LINK} target="_blank" className="text-white px-6 py-2 rounded-full" style={{ backgroundColor: content.colors.terracotta }}>Agendar</a>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="pt-40 pb-20 px-6 min-h-screen flex items-center" style={{ backgroundColor: content.colors.softSand }}>
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              <EditableText section="hero" field="titlePrefix" />
              <span style={{ color: content.colors.terracotta }} className="italic"> <EditableText section="hero" field="titleItalic" /></span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-md">
              <EditableText section="hero" field="subtitle" multiline />
            </p>
            <a href={WHATSAPP_LINK} target="_blank" className="inline-block text-white px-10 py-5 rounded-full font-bold shadow-xl" style={{ backgroundColor: content.colors.terracotta }}>
              <EditableText section="hero" field="cta" />
            </a>
          </div>
          <div className="relative group">
            <ImageUploader section="hero" field="image" />
            <img src={content.hero.image} alt="Janaina" className="rounded-[3rem] shadow-2xl w-full h-[500px] object-cover" />
          </div>
        </div>
      </section>

      {/* Para Quem */}
      <section id="para-quem" className="py-24 px-6 bg-white">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">Para quem é o atendimento?</h2>
          <div className="h-0.5 w-20 mx-auto" style={{ backgroundColor: content.colors.terracotta }}></div>
        </div>
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {['Ansiedade', 'Autoestima', 'Carreira'].map((item, i) => (
            <div key={i} className="p-10 rounded-3xl" style={{ backgroundColor: content.colors.softSand }}>
              <Heart className="mb-4" style={{ color: content.colors.terracotta }} />
              <h3 className="text-xl font-bold mb-2">{item}</h3>
              <p className="text-sm text-gray-500 font-light">Suporte especializado para lidar com os desafios emocionais do dia a dia.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Abordagem (FOTO CORRIGIDA AQUI) */}
      <section id="abordagem" className="py-24 px-6" style={{ backgroundColor: content.colors.softSand }}>
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: content.colors.terracotta }}>Abordagem Clínica</span>
            <h2 className="text-4xl font-serif">Ciência e Humanidade em <span style={{ color: content.colors.terracotta }}>sintonia.</span></h2>
            <p className="text-gray-600 leading-relaxed">Foco na Terapia Cognitivo-Comportamental aliada à visão Humanista.</p>
          </div>
          <div className="relative group min-h-[400px]">
            <ImageUploader section="abordagem" field="image" />
            <img 
              src={content.abordagem?.image || DEFAULT_CONTENT.abordagem.image} 
              alt="Consultório" 
              className="rounded-[3rem] shadow-2xl w-full h-[450px] object-cover border-8 border-white" 
            />
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-24 px-6 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <ImageUploader section="sobre" field="image" />
            <img src={content.sobre.image} alt="Sobre mim" className="rounded-[3rem] shadow-2xl h-[600px] w-full object-cover" />
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-serif"><EditableText section="sobre" field="title" /></h2>
            <div className="h-0.5 w-16" style={{ backgroundColor: content.colors.terracotta }}></div>
            <p className="text-xl italic font-light"><EditableText section="sobre" field="quote" multiline /></p>
            <p className="text-gray-500 font-light"><EditableText section="sobre" field="text1" multiline /></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-center text-[10px] uppercase tracking-widest text-gray-400">
        <p>© Janaina Clok - CRP 08/46252</p>
      </footer>

      {/* WhatsApp Flutuante */}
      <a href={WHATSAPP_LINK} target="_blank" className="fixed bottom-6 right-6 p-4 bg-[#25D366] text-white rounded-full shadow-2xl z-[100] hover:scale-110 transition-transform">
        <MessageCircle size={24} />
      </a>
    </div>
  );
};

export default App;
