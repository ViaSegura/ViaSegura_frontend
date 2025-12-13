"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Header } from "@viasegura/components/header";
import { Button } from "@viasegura/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@viasegura/components/ui/card";

import {
  MapPin,
  Activity,
  Zap,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
  Map,
} from "lucide-react";
import { HeatmapMap } from "@viasegura/constants/heatmap";
import { BackgroundRecife } from "@viasegura/constants/img";

const Home = () => {
  const incidentData = [
    { neighborhood: "Center", incidentCount: 45, intensity: "high" },
    { neighborhood: "South Zone", incidentCount: 32, intensity: "medium" },
    { neighborhood: "North Zone", incidentCount: 28, intensity: "medium" },
    { neighborhood: "East Zone", incidentCount: 18, intensity: "low" },
    { neighborhood: "West Zone", incidentCount: 22, intensity: "low" },
  ];

  const neighborhoodCoordinates: {
    [key: string]: { lat: number; lng: number };
  } = {
    Center: { lat: -8.06315, lng: -34.8812 },
    "South Zone": { lat: -8.132, lng: -34.903 },
    "North Zone": { lat: -8.033, lng: -34.909 },
    "East Zone": { lat: -8.025, lng: -34.885 },
    "West Zone": { lat: -8.055, lng: -34.935 },
  };

  const heatmapData = useMemo(() => {
    return incidentData.map((item): [number, number, number] => {
      const coords = neighborhoodCoordinates[item.neighborhood];
      return [coords?.lat || 0, coords?.lng || 0, item.incidentCount];
    });
  }, [incidentData]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Visualize sinistros com
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              mapas de calor
            </span>
          </h1>
          <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
            Transforme dados de sinistros em insights visuais poderosos.
            Identifique padrões, previna riscos e tome decisões baseadas em
            dados geoespaciais.
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 shadow-elegant">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <HeatmapMap data={heatmapData} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Tudo que você precisa para analisar e visualizar dados de
              sinistros de forma eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mapas de Calor</CardTitle>
                <CardDescription>
                  Visualize concentrações de sinistros com mapas interativos e
                  intuitivos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Performance Rápida</CardTitle>
                <CardDescription>
                  Processe milhões de registros com velocidade e precisão
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Colaboração</CardTitle>
                <CardDescription>
                  Compartilhe insights com sua equipe através de relatórios
                  customizados
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Explore o mapa de ocorrências de trânsito do Recife
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                Transformamos <strong>dados oficiais da CTTU</strong> em um
                painel interativo e inteligente, revelando padrões e pontos
                críticos no trânsito da cidade.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>
                    Identifique pontos críticos e padrões de sinistros.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>
                    Baseie suas decisões em dados oficiais e atualizados.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Acesse mapa de calor com filtros inteligentes.</span>
                </div>
              </div>

              <Link href="/register">
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-card border border-border rounded-lg p-8 shadow-elegant">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
                  <img
                    src={BackgroundRecife.img}
                    alt={BackgroundRecife.title}
                    className="w-full h-full object-cover object-[35%_center]"
                  />
                  <div className="absolute inset-0 bg-black/25"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de organizações que já transformaram seus
            processos de análise de sinistros
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-3"
              >
                Registre-se
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 border-border/50"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary" />
                <Activity className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ViaSegura
              </span>
            </div>

            <div className="text-sm text-foreground/60">
              © 2025 ViaSegura. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
