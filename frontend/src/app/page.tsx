'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/notes');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 sm:pt-48 sm:pb-32">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-violet-400 text-sm font-semibold tracking-wide uppercase">AI-Powered Productivity</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight animate-fade-up">
                        Your Digital Second Brain,
                        <br />
                        <span className="gradient-text pb-2">
                            Simplified.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        The ultimate hub for your thoughts and discoveries. NoteMark helps you capture,
                        organize, and retrieve your notes and bookmarks with zero friction.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                        >
                            Start Journaling Now
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold text-white bg-slate-900/40 border border-white/10 hover:bg-slate-800/60 transition-all backdrop-blur-md"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Everything you need to manage your digital life in one cohesive, beautiful workspace.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card-hover p-8 rounded-3xl">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/10">
                                <span className="text-3xl">📝</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Intelligent Notes</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Draft your ideas with clarity. Our tagging system and instant search ensure you never lose a thought again.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card-hover p-8 rounded-3xl">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/10">
                                <span className="text-3xl">🔖</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Smart Curation</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Save URLs and let NoteMark automatically fetch the context. Organize your web discoveries with ease.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card-hover p-8 rounded-3xl">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10">
                                <span className="text-3xl">⭐</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Instant Access</h3>
                            <p className="text-slate-400 leading-relaxed">
                                mark high-priority items as favorites. One-click access to your most vital information when you need it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
                    <p>Built with ❤️ using Next.js, Express, and MongoDB</p>
                </div>
            </footer>
        </div>
    );
}
