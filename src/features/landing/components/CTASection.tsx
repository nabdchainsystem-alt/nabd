import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Rocket, CheckCircle } from 'phosphor-react';

export const CTASection: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const benefits = [
        "Free 14-day trial",
        "No credit card required",
        "Cancel anytime",
        "Full feature access"
    ];

    return (
        <section ref={sectionRef} className="py-32 bg-white dark:bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zinc-200/10 dark:bg-zinc-800/10 rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.7 }}
                    className="relative"
                >
                    {/* Main Card */}
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-black" />

                        {/* Subtle gradient accent */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-700/10 rounded-full opacity-50" />

                        {/* Content */}
                        <div className="relative p-12 md:p-20 text-center">
                            {/* Rocket Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : { scale: 0 }}
                                transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white mb-8"
                            >
                                <Rocket size={40} weight="duotone" className="text-black" />
                            </motion.div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
                            >
                                Ready to transform
                                <br />
                                your business?
                            </motion.h2>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
                            >
                                Join thousands of companies already using NABD to streamline
                                their operations and drive growth.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                            >
                                <button
                                    onClick={onGetStarted}
                                    className="group h-14 px-8 rounded-xl bg-white text-black font-semibold text-lg
                                    hover:bg-zinc-100 transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2">
                                        Start Free Trial
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>

                                <button className="h-14 px-8 rounded-xl border border-zinc-700 text-white font-semibold text-lg
                                    hover:bg-white/5 hover:border-zinc-600 transition-all duration-200"
                                >
                                    Schedule Demo
                                </button>
                            </motion.div>

                            {/* Benefits */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-wrap justify-center gap-6"
                            >
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2 text-zinc-400">
                                        <CheckCircle size={18} weight="fill" className="text-zinc-500" />
                                        <span className="text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
