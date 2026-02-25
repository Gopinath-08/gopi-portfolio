import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Home', href: '/#home', isHash: true },
  { label: 'About', href: '/#about', isHash: true },
  { label: 'Skills', href: '/#skills', isHash: true },
  { label: 'Projects', href: '/#projects', isHash: true },
  { label: 'Contact', href: '/#contact', isHash: true },
  { label: 'Play', href: '/play', isHash: false },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/"
              className="text-lg font-serif text-primary hover:text-accent transition-colors"
            >
              G.M
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item.isHash ? (
                  <a
                    href={item.href}
                    className="text-foreground/70 hover:text-primary transition-colors font-sans text-sm uppercase tracking-wider relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-foreground/70 hover:text-primary transition-colors font-sans text-sm uppercase tracking-wider relative group ${
                      location.pathname === item.href ? 'text-primary' : ''
                    }`}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>

          {/* Right side: Theme Toggle and Contact Button */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <motion.a
              href="#contact"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact →
            </motion.a>
          </div>

          {/* Mobile: Theme Toggle and Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.isHash ? (
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium py-2"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium py-2"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium"
                >
                  Let's Talk
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
