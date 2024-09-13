"use client";

import React, { useState, useEffect, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Users,
  BarChart,
  MessageSquare,
  Zap,
  RefreshCw,
  Shield,
  Check,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkbox } from "./ui/checkbox";
import { v4 as uuidv4 } from 'uuid';

// Types
interface Step {
  icon: React.ElementType;
  text: string;
}

interface PersonalizationData {
  businessSize: string;
  mainChallenge: string;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
  color: string;
}

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
}

// Form schema
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  businessSize: z.enum(["solo", "small", "medium", "large"]),
  address: z.string().min(2, "Industry must be at least 2 characters"),
  mainChallenge: z.enum(["scheduling", "customer", "analytics", "growth"]),
  plan: z.enum(["starter", "pro", "enterprise"]),
  agreeTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must agree to the terms and conditions"
    ),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const saveToConvex = async (
  data: SignUpFormData
): Promise<{ success: boolean }> => {
  console.log("Saving to Convex:", data);
  const response = await fetch("/api/convex", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("Convex response:", response);
  if (!response.ok) {
    console.error("Convex error:", response.status, response.statusText);
    return { success: false };
  }
  return { success: true };
};

const InteractiveDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps: Step[] = [
    { icon: Calendar, text: "AI schedules optimal appointment" },
    { icon: MessageSquare, text: "Smart notifications sent to client" },
    { icon: Users, text: "Client confirms appointment" },
    { icon: BarChart, text: "Analytics updated in real-time" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Incrementing step:", step);
      setStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000);
    return () => {
      console.log("Clearing timer");
      clearInterval(timer);
    };
  }, [step, steps.length]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.text}
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{
              scale: i === step ? 1 : 0.8,
              opacity: i === step ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            <s.icon
              className={`w-8 h-8 ${i === step ? "text-[#00AE98]" : "text-gray-200"}`}
            />
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-white">{steps[step].text}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const PersonalizationQuiz: React.FC<{
  onComplete: (data: PersonalizationData) => void;
}> = ({ onComplete }) => {
  const [businessSize, setBusinessSize] = useState("");
  const [mainChallenge, setMainChallenge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submitting form:");
    console.log(`Business size: ${businessSize}`);
    console.log(`Main challenge: ${mainChallenge}`);
    console.log("Calling onComplete with:", { businessSize, mainChallenge });
    e.preventDefault();
    onComplete({ businessSize, mainChallenge });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="businessSize" className="text-white">
          Business Size
        </Label>
        <Select value={businessSize} onValueChange={setBusinessSize}>
          <SelectTrigger className="w-full bg-gray-800 text-white">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo Detailer</SelectItem>
            <SelectItem value="small">Small Team (2-5)</SelectItem>
            <SelectItem value="medium">Medium (6-20)</SelectItem>
            <SelectItem value="large">Large (21+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="mainChallenge" className="text-white">
          Main Challenge
        </Label>
        <Select value={mainChallenge} onValueChange={setMainChallenge}>
          <SelectTrigger className="w-full bg-gray-800 text-white">
            <SelectValue placeholder="Select challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduling">Efficient Scheduling</SelectItem>
            <SelectItem value="customer">Customer Management</SelectItem>
            <SelectItem value="analytics">Business Analytics</SelectItem>
            <SelectItem value="growth">Scaling Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-[#00AE98] hover:bg-[#009B86]">
        See How DetailSync Can Help
      </Button>
    </form>
  );
};

const SocialProof: React.FC = () => {
  const [users, setUsers] = useState(1000);
  const [savings, setSavings] = useState(20);

  useEffect(() => {
    console.log("Creating interval");
    const timer = setInterval(() => {
      console.log("Incrementing users and savings");
      setUsers((prevUsers) => {
        const newUsers = prevUsers + Math.floor(Math.random() * 5);
        console.log(`New users: ${newUsers}`);
        return newUsers;
      });
      setSavings((prevSavings) => {
        const newSavings = prevSavings + 0.1;
        console.log(`New savings: ${newSavings}`);
        return newSavings;
      });
    }, 5000);
    return () => {
      console.log("Clearing interval");
      clearInterval(timer);
    };
  }, []);

  console.log(`Users: ${users}, Savings: ${savings}`);

  return (
    <div className="flex justify-around w-full max-w-md">
      <div className="text-center">
        <div className="text-3xl font-bold text-[#39e9d1]">
          {users.toLocaleString()}+
        </div>
        <br></br>
        <div className="text-sm text-gray-300">Happy Users</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#39e9d1]">
          {savings.toFixed(1)}hrs
        </div>
        <br></br>
          <div className="text-sm text-gray-300">Avg. Weekly Time Saved</div>
      </div>
    </div>
  );
};

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      text: "Hi there! I'm DetailSync's AI assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  console.log(`Current state of messages: ${JSON.stringify(messages)}`);

  const handleSend = () => {
    console.log(`User input: ${input}`);
    if (input.trim()) {
      console.log("Updating messages state");
      setMessages((prev) => [...prev, { id: uuidv4(), text: input, isBot: false }]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        console.log("Updating messages state with AI response");
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: "That's a great question! DetailSync can definitely help with that. Our AI-powered scheduling system can optimize your appointments and save you time. Would you like to know more?",
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-[#00AE98] hover:bg-[#009B86]"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Chat with DetailSync AI</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${msg.isBot ? "text-left" : "text-right"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${msg.isBot ? "bg-[#00AE98] text-white" : "bg-gray-700 text-white"}`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2 bg-gray-700 text-white"
            />
            <Button
              onClick={handleSend}
              className="bg-[#00AE98] hover:bg-[#009B86]"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Icon3D: React.FC<{ icon: React.ElementType; color: string }> = ({
  icon: IconComponent,
  color,
}) => {
  return (
    <div className="relative w-16 h-16 mb-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full transform -rotate-6 scale-105"></div>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} rounded-full shadow-lg transform rotate-6 scale-105`}
      ></div>
      <div className="absolute inset-0 bg-gray-900 rounded-full transform scale-90 flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

const SignUpForm: React.FC<{ onClose: () => void; selectedPlan?: string }> = ({
  onClose,
  selectedPlan,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      plan: selectedPlan as "starter" | "pro" | "enterprise" | undefined,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const result = await saveToConvex(data);
      if (result.success) {
        toast.success("Sign up successful! Welcome to DetailSync.");
        onClose();
      } else {
        toast.error("An error occurred during sign up. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" {...register("companyName")} />
        {errors.companyName && (
          <p className="text-red-500 text-sm">{errors.companyName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="businessSize">Business Size</Label>
        <Select
          onValueChange={(value) =>
            register("businessSize").onChange({ target: { value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select business size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo Detailer</SelectItem>
            <SelectItem value="small">Small Team (2-5)</SelectItem>
            <SelectItem value="medium">Medium (6-20)</SelectItem>
            <SelectItem value="large">Large (21+)</SelectItem>
          </SelectContent>
        </Select>
        {errors.businessSize && (
          <p className="text-red-500 text-sm">{errors.businessSize.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
        {errors.industry && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mainChallenge">Main Challenge</Label>
        <Select
          onValueChange={(value) =>
            register("mainChallenge").onChange({ target: { value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select main challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduling">Efficient Scheduling</SelectItem>
            <SelectItem value="customer">Customer Management</SelectItem>
            <SelectItem value="analytics">Business Analytics</SelectItem>
            <SelectItem value="growth">Scaling Operations</SelectItem>
          </SelectContent>
        </Select>
        {errors.mainChallenge && (
          <p className="text-red-500 text-sm">{errors.mainChallenge.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="plan">Selected Plan</Label>
        <Select
          onValueChange={(value) =>
            register("plan").onChange({ target: { value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        {errors.plan && (
          <p className="text-red-500 text-sm">{errors.plan.message}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="agreeTerms" {...register("agreeTerms")} />
        <Label htmlFor="agreeTerms">I agree to the terms and conditions</Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
      )}
      <Button type="submit" className="w-full bg-[#0400ff] hover:bg-[#009B86]">
        Sign Up
      </Button>
    </form>
  );
};

export function LandingPageComponent() {
  const [personalization, setPersonalization] =
    useState<PersonalizationData | null>(null);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(
    undefined
  );

  const features: Feature[] = [
    {
      id: "scheduling",
      icon: Calendar,
      title: "AI-Powered Scheduling",
      description: "Optimize appointments with machine learning",
      details: [
        "Intelligent time slot allocation",
        "Predictive booking patterns",
        "Automated conflict resolution",
        "Real-time availability updates",
      ],
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "customer",
      icon: Users,
      title: "Customer Management",
      description: "Securely store and manage customer data",
      details: [
        "Comprehensive customer profiles",
        "Service history tracking",
        "Preference-based recommendations",
        "GDPR and CCPA compliant",
      ],
      color: "from-green-400 to-green-600",
    },
    {
      id: "notifications",
      icon: MessageSquare,
      title: "Smart Notifications",
      description: "Automated, multi-channel reminders",
      details: [
        "SMS, email, and push notifications",
        "AI-driven optimal reminder timing",
        "Customizable message templates",
        "Two-way communication support",
      ],
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "integration",
      icon: RefreshCw,
      title: "Calendar Syncing",
      description: "Seamless integration with popular calendars",
      details: [
        "Google, Apple, and Outlook calendar sync",
        "Real-time two-way updates",
        "Conflict detection and resolution",
        "Multi-calendar support for teams",
      ],
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "analytics",
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Actionable insights for your business",
      details: [
        "Real-time performance metrics",
        "Customer behavior analysis",
        "Revenue and growth forecasting",
        "Customizable report generation",
      ],
      color: "from-red-400 to-red-600",
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Protect your data with advanced encryption",
      details: [
        "End-to-end data encryption",
        "Regular security audits",
        "Role-based access control",
        "Compliance with industry standards",
      ],
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: "Perfect for independent detailers",
      features: [
        "Up to 100 appointments/month",
        "Basic AI scheduling",
        "Email support",
        "Customer management",
      ],
    },
    {
      name: "Pro",
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: "Ideal for growing detailing businesses",
      features: [
        "Unlimited appointments",
        "Advanced AI scheduling",
        "Priority support",
        "Team management",
        "Custom branding",
      ],
    },
    {
      name: "Enterprise",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: "For large-scale detailing operations",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "API access",
        "Advanced analytics",
        "Custom integrations",
      ],
    },
  ];

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
    setIsSignUpOpen(true);
  };

  return (
    <>
      <Head>
        <title>DetailSync - AI-Powered Scheduling for Modern Detailers</title>
        <meta
          name="description"
          content="Revolutionize your detailing business with DetailSync's AI-powered scheduling, customer management, and analytics tools."
        />
        <meta
          name="keywords"
          content="detailing, automotive services, auto detailing, scheduling, AI, business management, customer management, analytics"
        />
        <meta
          property="og:title"
          content="DetailSync - AI-Powered Scheduling for Modern Detailers"
        />
        <meta
          property="og:description"
          content="Revolutionize your detailing business with DetailSync's AI-powered scheduling, customer management, and analytics tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://detailsync.com" />
        <meta
          property="og:image"
          content="https://detailsync.com/og-image.jpg"
        />
        <link rel="canonical" href="https://detailsync.com" />
      </Head>
      <div className="flex flex-col min-h-screen bg-yellow-900 text-teal-300">
        <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-900 bg-opacity-40 backdrop-blur-sm">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-[#00AE98] mr-2" />
                <span className="text-xl font-bold">DetailSync</span>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="#features"
                  className="hover:text-[#00AE98] transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="hover:text-[#00AE98] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#contact"
                  className="hover:text-[#00AE98] transition-colors"
                >
                  Contact
                </Link>
              </div>
              <Button onClick={() => setIsSignUpOpen(true)}>Sign Up</Button>
            </div>
          </nav>
        </header>

        <main className="flex-1 pt-16">
          <section className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AE98] via-blue-600 to-purple-600 opacity-30"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

            <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              >
                Revolutionize Your Detailing Business
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl sm:text-2xl text-center mb-8 max-w-2xl"
              >
                AI-Powered Scheduling for the Modern Detailer
              </motion.p>

              {!personalization ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <PersonalizationQuiz onComplete={setPersonalization} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <h2 className="text-2xl font-bold">
                    Perfect for {personalization.businessSize} detailers facing{" "}
                    {personalization.mainChallenge} challenges!
                  </h2>
                  <p className="text-xl">
                    DetailSync is your new AI-powered platform that will help you overcome your{" "}
                    {personalization.mainChallenge} challenges and grow your business.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setIsSignUpOpen(true)}
                    className="bg-[#00AE98] hover:bg-[#009B86] text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Sign Up Now
                  </Button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12"
              >
                <InteractiveDemo />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <SocialProof />
              </motion.div>
            </div>
          </section>

          <section
            id="features"
            className="w-full py-24 bg-gray-900 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AE98] via-blue-600 to-purple-600 opacity-30 blur-3xl"></div>
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-12 text-white">
                Cutting-Edge Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 h-full transition-all hover:shadow-lg hover:shadow-[#00AE98]/20 hover:border-[#00AE98]/50 group rounded-xl overflow-hidden">
                      <CardHeader className="relative flex flex-col items-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AE98]/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Icon3D icon={feature.icon} color={feature.color} />
                        <CardTitle className="text-xl font-bold text-white group-hover:text-[#00AE98] transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-center">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {feature.details.map((detail, i) => (
                            <p
                              key={detail}
                              className="text-sm text-gray-800 flex items-center"
                            >
                              <Check className="w-4 h-4 mr-2 text-[#2fd6c0]" />
                              {detail}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="pricing"
            className="w-full py-24 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AE98] via-blue-600 to-purple-600 opacity-30"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Flexible Pricing
              </h2>
              <div className="flex justify-center items-center mb-8">
                <span
                  className={`mr-2 ${!isAnnualBilling ? "text-[#00AE98]" : "text-gray-400"}`}
                >
                  Monthly
                </span>
                <Switch
                  checked={isAnnualBilling}
                  onCheckedChange={setIsAnnualBilling}
                />
                <span
                  className={`ml-2 ${isAnnualBilling ? "text-gray-200" : "text-gray-100"}`}
                >
                  Annual (Save 20%)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingTiers.map((tier) => (
                  <Card
                    key={tier.name}
                    className="bg-[rgba(136,245,203,0.3)] backdrop-blur-[10px] border-[rgba(255,255,255,0.88)] rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        {tier.name}
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-4">
                        $
                        {isAnnualBilling
                          ? (tier.yearlyPrice / 12).toFixed(2)
                          : tier.monthlyPrice}
                        <span className="text-lg font-normal">/mo</span>
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="w-5 h-5 mr-2 text-[#00AE98]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-6 bg-[#00AE98] hover:bg-[#009B86]"
                        onClick={() =>
                          handlePlanSelection(tier.name.toLowerCase())
                        }
                      >
                        Choose Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="w-full py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                Get in Touch
              </h2>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="max-w-md mx-auto space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#00AE98] hover:bg-[#009B86]"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </section>
        </main>

        <footer className="bg-gray-600 py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Zap className="h-8 w-8 text-[#00AE98] mr-2" />
                <span className="text-xl font-bold">DetailSync</span>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="hover:text-[#00AE98] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#00AE98] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-800">
              © {new Date().getFullYear()} DetailSync. All rights reserved.
            </div>
          </div>
        </footer>

        <AIChat />

        <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Sign Up for DetailSync</DialogTitle>
              <DialogDescription>
                Create your account to start optimizing your detailing business.
              </DialogDescription>
            </DialogHeader>
            <SignUpForm
              onClose={() => setIsSignUpOpen(false)}
              selectedPlan={selectedPlan}
            />
          </DialogContent>
        </Dialog>

        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
}
