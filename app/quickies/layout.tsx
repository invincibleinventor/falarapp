import Search from "@/components/SearchComponent";
import { AppConfig } from "@/config/config";
import Tabbed from "./tabbed";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (

    
    <div className="flex-1 h-screen p-0 py-0 overflow-hidden">
          
    
     <Tabbed/>
      
      
      {children}
    </div>
  );
}
