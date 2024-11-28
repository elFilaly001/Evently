import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/appSidebar";
import { axiosInstance } from "@/services/axiosInstence";
import { toast, Toaster } from "react-hot-toast";

export default function AddEvent() {
    const { id, username, email } = useSelector((state: RootState) => state.auth);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        creator: id || ""
    });

    const menuItems = [
        {
          title: "Inscriptions",
          items: ["Inscriptions", "Add inscription"],
          link: ["Inscription", "AddInscription"]
        },
        {
          title: "Events", 
          items: ["All Events", "Add Event"],
          link: ["Events", "AddEvent"]
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/event/addEvent", formData);
            if (response.status === 201) {
                toast.success("Event created successfully!");
                setFormData({
                    title: "",
                    description: "",
                    date: "",
                    location: "",
                    creator: id || ""
                });
            }
        } catch (error: any) {
            // console.error("Error creating event:", error.response?.data?.message);
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster />
            <SidebarProvider>
                <div className="flex flex-1">
                    <AppSidebar 
                        menuItems={menuItems}
                        userName={username}
                        userEmail={email}
                    />
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="w-full max-w-xl">
                            <h1 className="text-2xl font-bold mb-8">Add New Event</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[120px]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Create Event
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
}