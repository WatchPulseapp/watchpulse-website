'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Card from './Card';
import { fadeInUp } from '@/lib/animations';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0
}: FeatureCardProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="group relative overflow-hidden">
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Icon */}
        <div className="mb-4 p-3 bg-brand-primary/10 rounded-lg w-fit group-hover:bg-brand-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-brand-primary" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-2 text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
