/** @format */

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-12 bg-secondary text-secondary-foreground'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <motion.a
            href='#home'
            className='text-2xl font-display font-bold'
            whileHover={{ scale: 1.05 }}>
            GM<span className='text-primary'>.</span>
          </motion.a>

          <div className='flex items-center gap-6'>
            {[
              { Icon: Github, href: "https://github.com/Gopinath-08" },
              {
                Icon: Linkedin,
                href: "https://www.linkedin.com/in/gopinath-majhi-76b0b81b8",
              },
              { Icon: Twitter, href: "https://x.com/GopinathMajhi13" },
            ].map(({ Icon, href }) => (
              <motion.a
                key={href}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className='p-2 text-secondary-foreground/70 hover:text-primary transition-colors duration-300'>
                <Icon size={20} />
              </motion.a>
            ))}
          </div>

          <p className='text-sm text-secondary-foreground/70 flex items-center gap-1'>
            © {currentYear} Gopinath. Made with{" "}
            <Heart size={14} className='text-primary' /> and code.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
