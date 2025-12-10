'use client'
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the type for card data
interface CardData {
  imgUrl: string;
  alt: string;
}

interface GalleryCarouselProps {
  data?: CardData[];
}

const GalleryCarousel = ({ data = [] }: GalleryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 to allow infinite scroll
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefetch all images on mount
  useEffect(() => {
    if (data.length === 0) return;

    const imagePromises = data.map((card) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = card.imgUrl;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch((err) => {
        console.error('Error loading images:', err);
        setImagesLoaded(true); // Still show even if some images fail
      });
  }, [data]);

  // Always show 1 card per view for maximum image size
  const cardsPerView = 1;

  // Show navigation only if more than 2 images
  const showNavigation = data.length > 2;

  // Create extended array for infinite scroll
  // [last, ...data, first] for seamless looping
  const getExtendedData = () => {
    if (data.length <= 1) return data;
    return [data[data.length - 1], ...data, data[0]];
  };

  const extendedData = getExtendedData();

  // Calculate the percentage to move per slide
  const slidePercentage = 100 / extendedData.length;

  // Set initial position to show first real image (index 1 in extended array)
  useEffect(() => {
    if (containerRef.current && data.length > 1) {
      containerRef.current.style.transform = `translateX(-${currentIndex * slidePercentage}%)`;
    }
  }, []);

  const nextSlide = () => {
    if (isAnimating || data.length <= 1) return;

    setIsAnimating(true);
    const nextIndex = currentIndex + 1;

    if (containerRef.current) {
      // Smooth transition to next slide
      containerRef.current.style.transition = "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)";
      containerRef.current.style.transform = `translateX(-${nextIndex * slidePercentage}%)`;

      setTimeout(() => {
        // If we're at the cloned last slide, jump to the real first slide
        if (nextIndex === extendedData.length - 1) {
          containerRef.current!.style.transition = "none";
          containerRef.current!.style.transform = `translateX(-${1 * slidePercentage}%)`;
          setCurrentIndex(1);
        } else {
          setCurrentIndex(nextIndex);
        }
        setIsAnimating(false);
      }, 600);
    }
  };

  const prevSlide = () => {
    if (isAnimating || data.length <= 1) return;

    setIsAnimating(true);
    const prevIndex = currentIndex - 1;

    if (containerRef.current) {
      // Smooth transition to previous slide
      containerRef.current.style.transition = "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)";
      containerRef.current.style.transform = `translateX(-${prevIndex * slidePercentage}%)`;

      setTimeout(() => {
        // If we're at the cloned first slide, jump to the real last slide
        if (prevIndex === 0) {
          containerRef.current!.style.transition = "none";
          containerRef.current!.style.transform = `translateX(-${(extendedData.length - 2) * slidePercentage}%)`;
          setCurrentIndex(extendedData.length - 2);
        } else {
          setCurrentIndex(prevIndex);
        }
        setIsAnimating(false);
      }, 600);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '100vw',
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        No hay imágenes disponibles
      </div>
    );
  }

  // Show loading state while images are prefetching
  if (!imagesLoaded) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '100vw',
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '100%',
          height: '80vh',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.75rem',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          Cargando imágenes...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100vw',
      padding: '0 1rem',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: data.length === 1 ? '1200px' : '100%',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Navigation Buttons - Only show if more than 2 images */}
        {showNavigation && data.length > cardsPerView && (
          <>
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              aria-label="Imagen anterior"
              style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '3.5rem',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Siguiente imagen"
              style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '3.5rem',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Cards Container Wrapper */}
        <div style={{
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Sliding Cards Container */}
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              width: `${extendedData.length * 100}%`,
              transform: `translateX(-${currentIndex * slidePercentage}%)`,
              transition: 'none',
              willChange: 'transform'
            }}
          >
            {extendedData.map((card, idx) => (
              <div
                key={`slide-${idx}`}
                style={{
                  width: `${100 / extendedData.length}%`,
                  padding: '0 0.5rem',
                  boxSizing: 'border-box',
                  flexShrink: 0
                }}
              >
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  height: '100%'
                }}>
                  <div style={{
                    width: '100%',
                    height: '80vh',
                    minHeight: '500px',
                    maxHeight: '900px'
                  }}>
                    <img
                      src={card.imgUrl}
                      alt={card.alt || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          button[aria-label*="Imagen"] {
            width: 3rem !important;
            height: 3rem !important;
            left: 0.5rem !important;
          }
          button[aria-label*="Siguiente"] {
            right: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryCarousel;
