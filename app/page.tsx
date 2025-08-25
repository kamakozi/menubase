"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Clock,
  Smartphone,
  HeadphonesIcon,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen gradient-bg">
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 glass-card p-2 rounded-full">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={language === "de" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("de")}
            className="h-8 px-3 text-sm"
          >
            DE
          </Button>
          <Button
            variant={language === "en" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="h-8 px-3 text-sm"
          >
            EN
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
            {t("heroTitle")}
            <span className="text-primary">{t("heroTitleAccent")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
            <span className="text-primary font-medium">{t("heroSubtitleAccent")}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium hover-lift group"
              asChild
            >
              <Link href="/auth/sign-up">
                {t("getStartedFree")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="px-8 py-4 text-lg font-medium hover-lift" asChild>
              <Link href="/auth/login">{t("login")}</Link>
            </Button>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-scale-in mb-24">
          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif text-primary">{t("mobileFirstTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">{t("mobileFirstDesc")}</CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif text-primary">{t("instantUpdatesTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">{t("instantUpdatesDesc")}</CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-serif text-primary">{t("businessExcellenceTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">{t("businessExcellenceDesc")}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it works Section */}
      <section className="py-24 bg-background/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("howItWorksTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("howItWorksSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <div className="text-2xl font-bold text-primary">1</div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("step1Title")}</h3>
              <p className="text-muted-foreground">{t("step1Desc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <div className="text-2xl font-bold text-primary">2</div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("step2Title")}</h3>
              <p className="text-muted-foreground">{t("step2Desc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <div className="text-2xl font-bold text-primary">3</div>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("step3Title")}</h3>
              <p className="text-muted-foreground">{t("step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("whyChooseTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("whyChooseSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("saveTimeTitle")}</h3>
              <p className="text-muted-foreground">{t("saveTimeDesc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("increaseSalesTitle")}</h3>
              <p className="text-muted-foreground">{t("increaseSalesDesc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("mobileReadyTitle")}</h3>
              <p className="text-muted-foreground">{t("mobileReadyDesc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors hover-lift">
                <HeadphonesIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">{t("expertSupportTitle")}</h3>
              <p className="text-muted-foreground">{t("expertSupportDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("featuresTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("dragDropTitle")}</h3>
                  <p className="text-muted-foreground">{t("dragDropDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("analyticsTitle")}</h3>
                  <p className="text-muted-foreground">{t("analyticsDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("multiLocationTitle")}</h3>
                  <p className="text-muted-foreground">{t("multiLocationDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("customBrandingTitle")}</h3>
                  <p className="text-muted-foreground">{t("customBrandingDesc")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("dailySpecialsTitle")}</h3>
                  <p className="text-muted-foreground">{t("dailySpecialsDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("dietaryInfoTitle")}</h3>
                  <p className="text-muted-foreground">{t("dietaryInfoDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("qrCodeTitle")}</h3>
                  <p className="text-muted-foreground">{t("qrCodeDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("secureReliableTitle")}</h3>
                  <p className="text-muted-foreground">{t("secureReliableDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("trustedTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">✓</div>
              <div className="text-muted-foreground">{t("activeRestaurants")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">✓</div>
              <div className="text-muted-foreground">{t("menuViewsMonthly")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">✓</div>
              <div className="text-muted-foreground">{t("uptimeGuarantee")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">✓</div>
              <div className="text-muted-foreground">{t("customerSupport")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("testimonialsTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed">"{t("testimonial1")}"</blockquote>
                <cite className="text-muted-foreground font-medium">{t("testimonial1Author")}</cite>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed">"{t("testimonial2")}"</blockquote>
                <cite className="text-muted-foreground font-medium">{t("testimonial2Author")}</cite>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed">"{t("testimonial3")}"</blockquote>
                <cite className="text-muted-foreground font-medium">{t("testimonial3Author")}</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{t("ctaTitle")}</h2>
            <p className="text-xl text-muted-foreground mb-12">{t("ctaSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-medium hover-lift group"
                asChild
              >
                <Link href="/auth/sign-up">
                  {t("startFreeTrial")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">{t("ctaFooter")}</p>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif font-bold text-xl mb-4">MenuBase</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("footerDescription")}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("legal")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/impressum" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("legalNotice")}
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/agb" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/widerruf" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("rightOfWithdrawal")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("support")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/preise" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("support")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("company")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("login")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("getStartedFree")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 MenuBase. {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
            </p>
            <p className="text-sm text-muted-foreground">{t("footerTagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
