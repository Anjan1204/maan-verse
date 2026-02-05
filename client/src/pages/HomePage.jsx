import React from 'react';
import Footer from '../components/Footer';

// Import Home Sections
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TimelineSection from '../components/home/TimelineSection';
import CoursePreviewSection from '../components/home/CoursePreviewSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

import CategoriesSection from '../components/home/CategoriesSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <HeroSection />
            <CategoriesSection />
            <FeaturesSection />
            <TimelineSection />
            <CoursePreviewSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default HomePage;
