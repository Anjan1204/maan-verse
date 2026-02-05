import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <div className="py-24 bg-[#020617] relative overflow-hidden chalkboard-doodles">
            <div className="absolute inset-0 bg-primary/5 opacity-40"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Future?</h2>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed">Join thousands of scholars already mastering their craft on MAAN-verse in a distraction-free environment.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/10 hover:-translate-y-1">
                        Start Your Journey
                    </Link>
                    <Link to="/courses" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                        Explore Academics
                    </Link>
                </div>
                <p className="mt-8 text-sm text-slate-500 uppercase tracking-widest font-semibold italic">Where curiosity meets expertise</p>
            </div>
        </div>
    );
};

export default CTASection;
