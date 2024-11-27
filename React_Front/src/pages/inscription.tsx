import  AppSidebar  from "../components/sidebar/appSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function pageInscription() {
    const { username, email } = useSelector((state: RootState) => state.auth);
    
    const menuItems = [
        {
            title: "Events",
            items: ["All Events", "Add Event"],
            links: ["Events", "AddEvent"]
        },
        {
            title: "Inscriptions",
            items: ["All inscriptions", "Inscriptions by event", "Add inscription"],
            link: ["get_all", "InscriptionsByEvent", "AddInscription"]
        }
    ];

    return (
        <div className="h-screen overflow-hidden">
            <SidebarProvider>
                <AppSidebar 
                    menuItems={menuItems}
                    userName={username}
                    userEmail={email}
                />
            </SidebarProvider>
        </div>
    )
}
