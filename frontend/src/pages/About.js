import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Palette, Gamepad2, Server, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../i18n/LanguageContext';

export default function About() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the about file based on the current language
    fetch(`/about.${language}.txt`)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('File not found');
      })
      .then(text => {
        setAboutContent(text);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default language file
        fetch('/about.fr.txt')
          .then(response => response.text())
          .then(text => {
            setAboutContent(text);
            setLoading(false);
          })
          .catch(() => {
            setAboutContent(getDefaultContent());
            setLoading(false);
          });
      });
  }, [language]);

  const getDefaultContent = () => {
    return language === 'en' 
      ? `# About PawStation Overdrive

An arcade game collection with a Space Groove theme.

## Technologies Used

This application uses modern technologies to deliver a smooth and performant gaming experience.`
      : `# À Propos de PawStation Overdrive

Une collection de jeux arcade sur le thème Space Groove.

## Technologies Utilisées

Cette application utilise des technologies modernes pour offrir une expérience de jeu fluide et performante.`;
  };

  const techStack = [
    {
      category: t('about.frontend'),
      icon: Code,
      color: 'from-neon-pink to-cyan-pop',
      techs: [
        { name: 'React 19', description: t('about.techReact') },
        { name: 'Phaser 3.90', description: t('about.techPhaser') },
        { name: 'Tailwind CSS', description: 'Design system' },
        { name: 'React Router 7', description: 'Navigation' }
      ]
    },
    {
      category: t('about.backend'),
      icon: Server,
      color: 'from-cyan-pop to-retro-gold',
      techs: [
        { name: 'FastAPI', description: t('about.techFastAPI') },
        { name: 'MongoDB', description: t('about.techMongoDB') },
        { name: 'Pydantic', description: t('about.techPydantic') },
        { name: 'Motor', description: t('about.techMotor') }
      ]
    },
    {
      category: t('about.devops'),
      icon: Shield,
      color: 'from-retro-gold to-acid-green',
      techs: [
        { name: 'Docker', description: t('about.techDocker') },
        { name: 'Nginx', description: 'Reverse proxy' },
        { name: 'Let\'s Encrypt', description: t('about.techSSL') },
        { name: 'Docker Compose', description: 'Orchestration' }
      ]
    },
    {
      category: t('about.design'),
      icon: Palette,
      color: 'from-acid-green to-neon-pink',
      techs: [
        { name: 'Orbitron', description: t('about.techOrbitron') },
        { name: 'Rajdhani', description: t('about.techRajdhani') },
        { name: 'Press Start 2P', description: t('about.techPressStart') },
        { name: 'Disco Cosmic', description: t('about.techTheme') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      <div className="starfield"></div>
      
      <div className="relative z-10 min-h-screen max-w-4xl mx-auto p-6 flex flex-col">
        {/* Header */}
        <header className="py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-cyan-pop hover:text-white transition-colors mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-rajdhani font-bold">{t('about.back')}</span>
          </button>
          
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4" data-testid="about-title">
            {t('about.title')}
          </h1>
        </header>

        {/* Content from file */}
        <div className="flex-1 mb-8">
          <div className="bg-deep-purple/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 mb-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-cyan-pop font-rajdhani text-lg animate-pulse">
                  {t('about.loading')}
                </div>
              </div>
            ) : (
              <div 
                className="prose prose-invert max-w-none"
                style={{
                  color: '#ffffff',
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-orbitron font-black text-white mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-orbitron font-bold text-cyan-pop mb-3 mt-6" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-orbitron font-bold text-neon-pink mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-300 font-rajdhani text-base leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 font-rajdhani mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 font-rajdhani mb-4 space-y-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="text-retro-gold" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-pop pl-4 italic text-gray-400 my-4" {...props} />,
                    hr: ({node, ...props}) => <hr className="border-white/20 my-6" {...props} />,
                    a: ({node, href, children, ...props}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neon-pink hover:text-cyan-pop underline transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {aboutContent}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <h2 className="text-3xl font-orbitron font-black text-white mb-6">
            {t('about.techStack')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.category}
                  className="bg-deep-purple/30 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-pop/50 transition-all"
                  data-testid={`tech-category-${category.category.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
                      <Icon className="w-6 h-6 text-space-black" />
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-white">
                      {category.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {category.techs.map((tech) => (
                      <div key={tech.name} className="flex flex-col">
                        <span className="text-cyan-pop font-rajdhani font-bold text-sm">
                          {tech.name}
                        </span>
                        <span className="text-gray-400 font-rajdhani text-xs">
                          {tech.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center py-6 border-t border-white/10">
          <p className="text-gray-500 font-rajdhani text-sm">
            {t('about.version')}
          </p>
          <p className="text-gray-600 font-rajdhani text-xs mt-2">
            {t('about.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
