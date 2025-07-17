import { useState, useEffect } from "react";
import { List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListBody from "./ListBody";
import MapBody from "./Map";
import { useGeneral } from "@/context/GeneralContext";
import { ViewModeType } from "@/types/ViewModeType";

export default function BodyWrapper() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { viewMode, setViewMode } = useGeneral();
  const [mounted, setMounted] = useState({
    list: false,
    map: false
  });
  const [isDesktop, setIsDesktop] = useState(false);

  const toggleView = () => {
    setViewMode(viewMode === ViewModeType.List ? ViewModeType.Map : ViewModeType.List);
  };

  useEffect(() => {
    setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      const scrollThreshold = (window.innerWidth < 768 && viewMode === ViewModeType.List) ? 400 : 0;
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      setHasScrolled(window.innerWidth >= 768 || currentScroll >= scrollThreshold);

      const bottomThreshold = window.innerWidth < 768 ? 450 : 200;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      setIsAtBottom(currentScroll + clientHeight >= scrollHeight - bottomThreshold);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      handleScroll();

      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [viewMode]);

  useEffect(() => {
    setMounted(prev => ({
      list: viewMode === ViewModeType.List || prev.list,
      map: viewMode === ViewModeType.Map || prev.map
    }));
    window.scrollTo({
      top: 0,
    });
  }, [viewMode]);

  return (
    <div className="relative">
      {mounted.list && (
        <div className={viewMode !== ViewModeType.List ? 'hidden' : ''}>
          <ListBody />
        </div>
      )}

      {mounted.map && (
        <div className={viewMode !== ViewModeType.Map ? 'hidden' : ''}>
          <MapBody />
        </div>
      )}

      {(hasScrolled || isDesktop) && !isAtBottom && (
        <div className="fixed bottom-9 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={toggleView}
            className="rounded-full px-6 py-7 shadow-lg bg-[#222222] hover:bg-[#222222] text-primary-foreground transition-all transform hover:scale-[1.04] active:scale-100 duration-0"
          >
            {viewMode === ViewModeType.List ? (
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">Karte anzeigen</span>
                <Map style={{ width: "20px", height: "20px" }} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">Liste anzeigen</span>
                <List style={{ width: "20px", height: "20px" }} />
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
