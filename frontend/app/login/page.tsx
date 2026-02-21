"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const carouselSlides = [
  {
    image: "/carousel-1.jpg",
    title: "إدارة اللوفت",
    description: "نظام متكامل لإدارة لوفت الحمام الخاص بك بسهولة واحترافية",
  },
  {
    image: "/carousel-2.jpg",
    title: "تتبع السباقات",
    description: "سجّل نتائج السباقات وتابع أداء حماماتك في كل مسافة",
  },
  {
    image: "/carousel-3.jpg",
    title: "متابعة التربية",
    description: "تتبع التزاوج والبيض والفقس وسلالات الحمام",
  },
  {
    image: "/carousel-4.jpg",
    title: "الرعاية الصحية",
    description: "سجّل التطعيمات والعلاجات وتابع صحة كل حمامة",
  },
];

import { Eye, EyeOff } from "lucide-react";
import apiClient from "@/lib/api-client";

export default function LoginPage() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();

  // ...

  // Check for registration success params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiClient
        .post("/auth/login", { email, password })
        .catch((err) => {
          if (err.response?.status === 401) {
            throw new Error("Invalid credentials. Please try again.");
          }
          throw err;
        });

      const data = res.data;
      // localStorage.setItem("access_token", data.access_token); // REMOVED

      // Clear persistence state to ensure we start at Dashboard
      const keysToRemove = [
        "goldenloft_activeTab",
        "goldenloft_currentLoftPage",
        "goldenloft_currentPigeonPage",
        "goldenloft_currentTasksPage",
        "goldenloft_currentInventoryPage",
        "goldenloft_currentNutritionPage",
        "goldenloft_currentBreedingPage",
        "goldenloft_currentTrainingPage",
        "goldenloft_currentRacingPage",
        "goldenloft_currentFinancialPage",
        "goldenloft_currentReportsPage",
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // document.cookie = ... // REMOVED (Handled by server)
      toast.success("Login successful! Welcome back.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* الجانب الأيسر مع النموذج */}
      <div className="flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Golden Loft
            </h1>
            <p className="text-muted-foreground text-lg">اللوفت الذهبي</p>
            <h2 className="text-xl text-foreground mt-6">
              مرحباً بك في نظام إدارة اللوفت
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {success && (
              <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg text-center font-medium">
                {success}
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="email">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل اسم المستخدم"
                className="w-full p-3 border rounded-lg text-right bg-card"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm text-muted-foreground"
                htmlFor="password"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  className="w-full p-3 border rounded-lg text-right bg-card pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <div className="text-left">
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-primary-foreground font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  أو
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-border bg-transparent hover:bg-secondary"
            >
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              تسجيل الدخول بحساب Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              مستخدم جديد؟{" "}
              <Link
                href="/register"
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                إنشاء حساب
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* الجانب الأيمن مع الكاروسيل */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 text-white overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            direction: "rtl",
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }) as any,
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full m-0">
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index} className="h-full p-0">
                <div className="relative h-screen flex flex-col items-center justify-center p-8">
                  {/* خلفية الصورة */}
                  <div className="absolute inset-0">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-800/50 to-amber-700/30" />
                  </div>

                  {/* المحتوى */}
                  <div className="relative z-10 max-w-md mx-auto text-center space-y-6 mt-auto pb-24">
                    <h2 className="text-4xl font-bold text-balance drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-white/95 leading-relaxed drop-shadow-md">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* نقاط التنقل */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`الانتقال للشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
