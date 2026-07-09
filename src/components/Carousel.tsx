import { useState } from 'react'

export interface CarouselSlide {
  src: string
  alt: string
}

interface CarouselProps {
  slides: CarouselSlide[]
}

// 좌우 화살표 + 점 인디케이터로 넘기는 이미지 캐러셀 (끝에서 순환).
export function Carousel({ slides }: Readonly<CarouselProps>) {
  const [index, setIndex] = useState(0)

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length)
  }

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <img key={slide.src} src={slide.src} alt={slide.alt} />
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow prev"
        aria-label="이전 슬라이드"
        onClick={() => go(index - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-arrow next"
        aria-label="다음 슬라이드"
        onClick={() => go(index + 1)}
      >
        ›
      </button>

      <div className="carousel-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={i === index ? 'active' : ''}
            aria-label={`${i + 1}번 슬라이드`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  )
}
