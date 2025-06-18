"use client";

import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Play,
  Star,
  Zap,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();

  const quickActions = [
    {
      icon: MessageSquare,
      title: t('home.chat.title'),
      description: t('home.chat.description'),
      href: `/${locale}/chat`,
      color: "from-emerald-400 to-teal-400",
    },
    {
      icon: ListChecks,
      title: t('home.qcm.title'),
      description: t('home.qcm.description'),
      href: `/${locale}/qcm`,
      color: "from-blue-400 to-cyan-400",
    },
  ];  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-card/50 border border-emerald-400/20 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{t('home.poweredByAI')}</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('home.title')}
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {t('home.titleHighlight')}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>
        </div>
      </section>      {/* Features Grid */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {quickActions.map((action, index) => (
              <Link key={`${action.title}-${index}`} href={action.href}>
                <div className="group p-8 bg-card/30 border border-border hover:bg-card/50 hover:border-border/80 transition-all duration-300 cursor-pointer rounded-2xl">
                  <div className="flex items-start gap-4 rtl:flex-row-reverse">
                    <div className={`bg-gradient-to-r ${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 rtl:text-right">{action.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed rtl:text-right">{action.description}</p>
                      <div className="mt-4">
                        <div className="inline-flex items-center text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors rtl:flex-row-reverse">
                          {t('home.chat.action')}
                          <ArrowRight className="ltr:ml-1 rtl:mr-1 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-800/50 rounded-3xl p-12">
            <div className="space-y-6">
              {/* Stars */}
              <div className="flex justify-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t('home.cta.title')}
              </h2>
              
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                {t('home.cta.subtitle')}
              </p>              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 rtl:flex-row-reverse">
                <Link href={`/${locale}/chat`}>
                  <Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-full font-medium">
                    {t('home.cta.startLearning')}
                    <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-3 rounded-full font-medium"
                >
                  <Play className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                  {t('home.cta.watchDemo')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6">          <div className="flex flex-col md:flex-row justify-between items-center rtl:flex-row-reverse">
            <div className="flex items-center gap-3 mb-4 md:mb-0 rtl:flex-row-reverse">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-2.5 rounded-xl">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">EduLLM</span>
            </div>
            <div className="text-slate-500 text-sm">
              {t('home.footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
