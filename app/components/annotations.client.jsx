import { useEffect } from 'react';

export default function Annotations({ children }) {
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('[data-annotation-id]').forEach((annotation) => {
        const container = annotation.querySelector('.photo-container');
        const rect = annotation.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        if (inView) {
          const opacity = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + annotation.offsetHeight)));
          container.classList.add('position-fixed');
          container.style.opacity = opacity;
        } else {
          container.classList.remove('position-fixed');
          container.style.opacity = '0';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <>{children}</>;
}