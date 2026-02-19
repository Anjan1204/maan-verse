import React from 'react';
import { Download, FileText, Link as LinkIcon, Video, ExternalLink } from 'lucide-react';

const ResourceSection = ({ resources = [] }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return <FileText className="text-red-400" />;
            case 'Video': return <Video className="text-indigo-400" />;
            case 'Link': return <LinkIcon className="text-emerald-400" />;
            default: return <FileText className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.length === 0 ? (
                    <div className="col-span-2 text-center py-20 glass rounded-[3rem] border-2 border-dashed border-white/5">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-black text-gray-500">No Extra Resources Yet</h3>
                        <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mt-2">Check back later for supplemental material</p>
                    </div>
                ) : (
                    resources.map((resource, index) => (
                        <div key={index} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">
                                    {getIcon(resource.type)}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white tracking-tight">{resource.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{resource.type}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.open(resource.url, '_blank')}
                                className="p-3 bg-white/5 rounded-xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-xl"
                            >
                                {resource.type === 'Link' ? <ExternalLink size={20} /> : <Download size={20} />}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-10 rounded-[3rem] border border-indigo-500/20">
                <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Pro Tip</h4>
                <p className="text-gray-400 leading-relaxed font-bold italic text-sm">
                    Supplemental materials are curated to help you master the course objectives. We recommend reviewing these before attempting the final assessment.
                </p>
            </div>
        </div>
    );
};

export default ResourceSection;
