import { useEffect } from 'react';

export default function EISAnnotations() {
  useEffect(() => {
    const handleScroll = () => {
      const annotations = document.querySelectorAll('.sticky-annotation');
      const viewportCenter = window.innerHeight / 2;

      let closestAnnotation: Element | null = null;
      let closestDistance = Infinity;

      annotations.forEach((annotation) => {
        const rect = annotation.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInView) return;

        const annotationCenter = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(annotationCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestAnnotation = annotation;
        }
      });

      annotations.forEach((annotation) => {
        const container = annotation.querySelector('.photo-container') as HTMLElement;
        if (!container) return;

        if (annotation === closestAnnotation) {
          container.classList.add('position-fixed');
          container.style.opacity = '1';
        } else {
          container.classList.remove('position-fixed');
          container.style.opacity = '0';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}