import React from 'react';

const TestimonialsSection = () => {
    return (
        <div className="py-24 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-12">What Our Students Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Sarah L.', role: 'Computer Science Student', text: 'MAAN-verse completely changed how I learn. The interactive labs are a game changer!', bg: 'bg-emerald-500' },
                        { name: 'James K.', role: 'Aspiring Designer', text: 'The faculty feedback is incredibly detailed. I feel so much more confident in my skills now.', bg: 'bg-blue-500' },
                        { name: 'Anita R.', role: 'Data Analyst', text: 'Production quality is top-notch. It feels like a premium experience from start to finish.', bg: 'bg-purple-500' },
                    ].map((t, i) => (
                        <div key={i} className="bg-gray-800 p-8 rounded-2xl relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-full ${t.bg} flex items-center justify-center text-white font-bold text-xl`}>
                                    {t.name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <p className="text-xs text-gray-400">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 text-left italic">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
