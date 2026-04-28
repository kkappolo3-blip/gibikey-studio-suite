import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  Waves,
  Image as ImageIcon,
  GraduationCap,
  Download,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const tools = [
  { n: 1, title: "PaperForge", url: "/pdf-tools", icon: FileText },
  { n: 2, title: "AuraSound", url: "/soft-murmur", icon: Waves },
  { n: 3, title: "PixelCast", url: "/file-convert", icon: ImageIcon },
  { n: 4, title: "MindWell", url: "/cerdika", icon: GraduationCap },
  { n: 5, title: "GrabMate", url: "/downloader", icon: Download },
  { n: 6, title: "MediScript", url: "/medical-certificate", icon: Stethoscope },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => currentPath === p;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[image:var(--gradient-gold)] shadow-[var(--shadow-gold)]">
            <Sparkles className="h-5 w-5 text-[oklch(0.2_0.03_40)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-wide text-sidebar-primary">
              Gibikey
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-sidebar-foreground/70">
              Studio App
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-widest text-[10px]">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((t) => (
                <SidebarMenuItem key={t.url}>
                  <SidebarMenuButton asChild isActive={isActive(t.url)} tooltip={t.title}>
                    <Link to={t.url} className="flex items-center gap-3">
                      <t.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">
                        <span className="mr-2 text-xs font-mono text-sidebar-foreground/50">
                          {String(t.n).padStart(2, "0")}
                        </span>
                        {t.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
