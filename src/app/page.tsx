"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Brain,
  Users,
  FileText,
  MessageSquare,
  ArrowRight,
  Play,
  Star,
  Zap,
  ListChecks,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {  const features = [
    {
      icon: Brain,
      title: "Smart Learning",
      description:
        "AI-powered explanations tailored to your learning style and pace.",
    },
    {
      icon: FileText,
      title: "Document Analysis",
      description:
        "Upload PDFs, images, and documents for instant analysis and insights.",
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description:
        "Natural conversations that adapt to your questions and learning needs.",
    },
    {
      icon: ListChecks,
      title: "QCM Generator",
      description:
        "Create custom multiple choice exams and quizzes from any topic or document.",
    },
    {
      icon: Users,
      title: "Study Groups",
      description:
        "Collaborate with classmates and share learning resources seamlessly.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Helped" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Available" },
    { number: "100+", label: "Subjects" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduLLM</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-slate-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="cursor-pointer border-slate-600 text-slate-300 bg-slate-500 hover:bg-slate-800 hover:text-slate-400"
              >
                Sign In
              </Button>
              <Link href="/chat">
                <Button className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Advanced AI
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your AI Learning
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Companion
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your learning experience with AI-powered assistance.
              Upload documents, ask questions, and get personalized explanations
              that adapt to your learning style.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Learning Chat
                </Button>
              </Link>
              <Link href="/qcm">
                <Button
                  size="lg"
                  className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
                >
                  <ListChecks className="mr-2 h-5 w-5" />
                  Create QCM Exam
                </Button>
              </Link>
            </div>
              <div className="flex justify-center mb-16">
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer border-slate-600 text-slate-300 bg-slate-500 hover:bg-slate-800 hover:text-slate-400 px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for
              <span className="block text-emerald-400">Better Learning</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey with
              AI-powered assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of students who are already learning smarter with
                EduLLM.
              </p>
              <Link href="/chat">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduLLM</span>
            </div>
            <div className="text-slate-400">
              © 2024 EduLLM. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
