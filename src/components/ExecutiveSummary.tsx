import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ExecutiveSummary = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const valueProps = [
    'Architect scalable systems handling millions of users',
    'Lead high-performing engineering teams',
    'Drive technical strategy and innovation',
    'Deliver projects on time and under budget',
    'Build products that generate measurable ROI',
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Value Proposition</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Technical Leadership That <span className="text-gradient-accent">Drives Results</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                As a technology leader, I combine deep technical expertise with strategic vision to build 
                world-class products and high-performing teams. My approach focuses on scalable architecture, 
                engineering excellence, and measurable business impact.
              </p>

              <div className="space-y-4 mb-8">
                {valueProps.map((prop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-foreground">{prop}</span>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule a Consultation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </motion.a>
            </motion.div>

            {/* Right: Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: 'Years Experience', value: '2+', subtext: 'Technical Leadership' },
                { label: 'Projects Delivered', value: '50+', subtext: 'Production Ready' },
                { label: 'Teams Led', value: '10+', subtext: 'Cross-functional' },
                { label: 'Success Rate', value: '98%', subtext: 'On-time Delivery' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.subtext}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;

