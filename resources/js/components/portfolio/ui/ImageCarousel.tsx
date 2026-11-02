import React from 'react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface ImageCarouselProps {
    images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="my-8 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <Swiper
                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                effect="fade"
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="cert-swiper aspect-video w-full"
            >
                {images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={
                                image.startsWith('http')
                                    ? image
                                    : `/storage/${image}`
                            }
                            alt={`Gallery image ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
