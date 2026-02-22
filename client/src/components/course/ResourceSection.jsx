import React from 'react';
import { Download, FileText, Link as LinkIcon, Video, ExternalLink, Sparkles } from 'lucide-react';

const ResourceSection = ({ resources = [] }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return <FileText size={24} className="text-red-400 group-hover:scale-110 transition-transform" />;
            case 'Video': return <Video size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />;
            case 'Link': return <LinkIcon size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />;
            default: return <FileText size={24} className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Knowledge Base</span>
                    <h3 className="text-2xl font-black text-white">Supplemental Assets</h3>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {resources.length} Available
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {resources.length === 0 ? (
                    <div className="col-span-2 text-center py-32 glass rounded-[4rem] border-2 border-dashed border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <FileText size={48} className="opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-500 italic">No supplemental assets found</h3>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.25em] mt-4">The academic repository is currently empty</p>
                    </div>
                ) : (
                    resources.map((resource, index) => (
                        <div key={index} className="glass p-8 rounded-[3rem] border border-white/5 flex items-center justify-between group hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-500 shadow-xl">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-xl shadow-inner group-hover:bg-primary/10 transition-colors">
                                    {getIcon(resource.type)}
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="font-black text-white text-lg tracking-tight group-hover:text-primary transition-colors">{resource.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${resource.type === 'PDF' ? 'bg-red-500' : resource.type === 'Video' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{resource.type} ARCHIVE</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => window.open(resource.url, '_blank')}
                                className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-2xl hover:scale-110 active:scale-90"
                            >
                                {resource.type === 'Link' ? <ExternalLink size={24} /> : <Download size={24} />}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="mx-4 p-12 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/5 rounded-[4rem] border border-white/5 relative overflow-hidden group/tip">
                <div className="absolute right-0 top-0 p-10 opacity-[0.03] rotate-12 group-hover/tip:scale-150 transition-transform duration-1000">
                    <Sparkles size={160} />
                </div>
                <div className="relative z-10 flex gap-8 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
                        <ExternalLink size={28} />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Mastery Strategy</h4>
                        <p className="text-gray-400 leading-relaxed font-bold italic text-base">
                            "Leverage these assets to deepen your understanding beyond the standard curriculum. Top percentile students spend average 40% more time in the supplemental repository."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceSection;
