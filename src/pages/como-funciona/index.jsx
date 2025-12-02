import React from 'react';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import Icon from 'components/AppIcon';
import { useNavigate } from 'react-router-dom';

const ComoFunciona = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '1',
      title: 'Descubre',
      icon: 'Search',
      description: 'Filtra por tipo de animal, edad, tamaño y ubicación. Encuentra animales que encajan con tu hogar y tu ritmo de vida.',
      color: 'primary'
    },
    {
      number: '2',
      title: 'Conecta',
      icon: 'MessageCircle',
      description: 'Habla directamente con la protectora y resuelve tus dudas. Recibe información clara sobre carácter, salud y necesidades.',
      color: 'secondary'
    },
    {
      number: '3',
      title: 'Acompaña',
      icon: 'Heart',
      description: 'No te dejamos solo después de la adopción. Accede a consejos de veterinarios, educadores y otros adoptantes.',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        icon: 'bg-primary text-white'
      },
      secondary: {
        bg: 'bg-secondary/10',
        text: 'text-secondary',
        border: 'border-secondary/20',
        icon: 'bg-secondary text-white'
      },
      accent: {
        bg: 'bg-accent/10',
        text: 'text-accent-700',
        border: 'border-accent/20',
        icon: 'bg-accent text-white'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
            ¿Cómo funciona AdoptaEspaña?
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Hacemos fácil lo que antes era un lío: ver, elegir y acompañar.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              return (
                <div key={step.number} className="relative">
                  {/* Connector Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-border-light z-0" />
                  )}

                  {/* Card */}
                  <div className={`relative bg-surface rounded-2xl p-8 border-2 ${colors.border} shadow-sm hover:shadow-md transition-all duration-300 z-10`}>
                    {/* Number Badge */}
                    <div className={`absolute -top-4 -left-4 w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                      <Icon name={step.icon} size={32} className={colors.text} />
                    </div>

                    {/* Content */}
                    <h3 className={`text-2xl font-heading font-bold ${colors.text} mb-4 text-center`}>
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-6">
            ¿Listo para empezar tu historia?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Miles de peludos están esperando conocerte. Da el primer paso hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <Icon name="Heart" size={20} />
              <span>Ver animales en adopción</span>
            </button>
            <button
              onClick={() => navigate('/authentication-login-register')}
              className="btn-outline text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              <Icon name="Building2" size={20} />
              <span>Soy protectora</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Cuánto cuesta adoptar?',
                a: 'La adopción es gratuita, aunque algunas protectoras solicitan un aporte voluntario para cubrir gastos veterinarios (vacunas, chip, esterilización).'
              },
              {
                q: '¿Qué requisitos necesito?',
                a: 'Cada protectora tiene sus propios requisitos, pero generalmente incluyen: ser mayor de edad, tener estabilidad económica y emocional, y comprometerte al cuidado a largo plazo.'
              },
              {
                q: '¿Puedo devolver al animal si no funciona?',
                a: 'Las adopciones son compromisos serios, pero entendemos que hay situaciones excepcionales. La protectora siempre recuperará al animal si es necesario.'
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-surface border border-border rounded-xl p-6 group"
              >
                <summary className="font-semibold text-text-primary cursor-pointer flex items-center justify-between">
                  <span>{faq.q}</span>
                  <Icon name="ChevronDown" size={20} className="text-text-secondary group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComoFunciona;
