'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LucideIcon } from 'lucide-react';

interface FeatureShowcaseProps {
    id: string;
    screenshotSrc: string;
    badge: string;
    badgeIcon: LucideIcon;
    reversed?: boolean;
}

export default function FeatureShowcase({ id, screenshotSrc, badge, badgeIcon: BadgeIcon, reversed = false }: FeatureShowcaseProps) {
    const { t } = useLanguage();

    const contentBlock = (
        <motion.div
            className="flex-1 max-w-xl"
            initial={{ opacity: 0, x: reversed ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-5">
                <BadgeIcon className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">{badge}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                {t(`showcase.${id}.title`)}
            </h3>

            {/* Description */}
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                {t(`showcase.${id}.description`)}
            </p>

            {/* Feature Points */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => {
                    const point = t(`showcase.${id}.point${i}`);
                    if (!point || point === `showcase.${id}.point${i}`) return null;
                    return (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            </div>
                            <span className="text-text-secondary text-sm leading-relaxed">{point}</span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );

    const phoneBlock = (
        <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: reversed ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-12 bg-brand-primary/10 rounded-full blur-3xl animate-glow-pulse" />

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="phone-mockup w-[220px] sm:w-[260px] md:w-[280px]">
                        <div className="phone-screen relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />
                            <Image
                                src={screenshotSrc}
                                alt={t(`showcase.${id}.title`)}
                                fill
                                className="object-cover"
                                sizes="280px"
                                quality={78}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <section className="relative py-20 md:py-28 overflow-hidden">
            <Container>
                <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                    {contentBlock}
                    {phoneBlock}
                </div>
            </Container>
        </section>
    );
}
