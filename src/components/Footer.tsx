import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Github, href: "https://github.com/Gopinath-08", label: 'GitHub' },
    {
      Icon: Linkedin,
      href: "https://www.linkedin.com/in/gopinath-majhi-76b0b81b8",
      label: 'LinkedIn'
    },
    { Icon: Twitter, href: "https://x.com/GopinathMajhi13", label: 'Twitter' },
  ];

  return (
    <footer className='py-20 bg-background border-t border-border'>
      <div className='container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Main Footer Content */}
          <div className='grid md:grid-cols-3 gap-12 mb-12'>
            {/* Brand */}
            <div>
              <motion.a
                href='#home'
                className='text-2xl font-serif text-primary hover:text-accent transition-colors inline-block mb-4'
                whileHover={{ x: 2 }}
              >
                G.M
              </motion.a>
              <p className='text-sm text-foreground/60 font-sans leading-relaxed'>
                Full-Stack Developer building modern web and mobile applications.
              </p>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-foreground/50 mb-6'>
                Connect
              </h3>
              <div className='flex items-center gap-4'>
                {socialLinks.map(({ Icon, href, label }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all'
                    aria-label={label}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <div className='flex flex-col items-end md:items-start'>
              <h3 className='text-xs font-mono uppercase tracking-wider text-foreground/50 mb-6'>
                Navigation
              </h3>
              <motion.a
                href='#home'
                className='flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors group'
                whileHover={{ y: -2 }}
              >
                <span className='font-sans'>Back to top</span>
                <ArrowUp size={14} className='group-hover:-translate-y-1 transition-transform' />
              </motion.a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-xs font-mono text-foreground/50'>
              © {currentYear} Gopinath Majhi. All rights reserved.
            </p>
            <p className='text-xs font-mono text-foreground/50'>
              Built with React & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
