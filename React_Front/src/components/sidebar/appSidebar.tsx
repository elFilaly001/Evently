import { ChevronUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../ui/dropdown-menu"
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  items?: string[];
  link?: string[];
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  userName?: string | null;
  userEmail?: string | null;
}

export default function AppSidebar({ menuItems, userName, userEmail }: AppSidebarProps) {
  const firstLetter = userName?.charAt(0)?.toUpperCase() || ''
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index} className="ml-2">
              <SidebarMenuButton className="mt-4" >
                {item.title}</SidebarMenuButton>
              {item.items && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuSubButton key={subIndex}>
                        <Link to={`/${item.link?.[subIndex]}`}>
                          {subItem}
                        </Link>
                      </SidebarMenuSubButton>
                    ))}
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full h-12 justify-between">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  {firstLetter}
                </div>
                <div className="ml-3 flex flex-col text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              <ChevronUp className="h-4 w-4 transition-transform duration-200" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-5" side="right" align="start">
            <DropdownMenuItem className="">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
