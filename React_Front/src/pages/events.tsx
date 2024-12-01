import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/appSidebar";
import { axiosInstance } from "@/services/axiosInstence";
import { setEvents } from "@/store/slices/eventSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { setUser } from "@/store/slices/authslice";


export default function Events() {
    const dispatch = useDispatch();
    const events = useSelector((state: RootState) => state.event.events);
    const [searchTerm, setSearchTerm] = useState("");
    const { id, username, email } = useSelector((state: RootState) => state.auth);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [updateFormData, setUpdateFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        creator: ""
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get(`/event/${id}`);
                if (response.data && response.data.length > 0) {
                    dispatch(setEvents(response.data));
                } else {
                    console.log("No events found");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [dispatch]);

    const navigate = useNavigate();

    const handleDownloadPDF = async (eventId: string) => {
        try {
            const response = await axiosInstance.get(`/event/download/${eventId}`, {
                responseType: 'blob'
            });

            if(response.status === 401){
                toast.error("Unauthorized");
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            }

            // Create blob link to download
            const url =  window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event-${eventId}.pdf`);

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Failed to download PDF');
        }
    };

    const handleUpdateClick = (event: any) => {
        setSelectedEvent(event);
        setUpdateFormData({
            title: event.title,
            description: event.description,
            date: new Date(event.date).toISOString().split('T')[0],
            location: event.location,
            creator: event.creator
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/event/${selectedEvent._id}`, updateFormData);
            dispatch(setEvents(events.map(event =>
                event._id === selectedEvent._id ? { ...event, ...updateFormData } : event
            )));
            setIsUpdateModalOpen(false);
            toast.success("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event");
        }
    };

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

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-screen overflow-hidden">
            <SidebarProvider>
                <AppSidebar
                    menuItems={menuItems}
                    userName={username}
                    userEmail={email}
                />
                <div className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
                    </div>
                    <div className="rounded-md border">
                        {events.length > 0 && (
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Filter events..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="relative w-full overflow-auto">
                            {filteredEvents.length === 0 ? (
                                <div className="p-3 text-center text-muted-foreground">
                                    No events found
                                </div>
                            ) : (
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {filteredEvents.map((event) => (
                                            <tr key={event._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">{event.title}</td>
                                                <td className="p-4 align-middle">{event.description}</td>
                                                <td className="p-4 align-middle">{new Date(event.date).toLocaleDateString()}</td>
                                                <td className="p-4 align-middle">{event.location}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex justify-around space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateClick(event)}
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                                        >
                                                            Update
                                                        </button>
                                                        <form onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            const res = await axiosInstance.delete(`/event/${event._id}`);
                                                            if (res.status === 200) {
                                                                dispatch(setEvents(events.filter(e => e._id !== event._id)));
                                                                toast.success("Event deleted successfully!");
                                                            } else {
                                                                toast.error("Failed to delete event");
                                                            }
                                                        }}>
                                                            <button
                                                                type="submit"
                                                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 h-9 px-4 py-2"
                                                            >
                                                                Delete
                                                            </button>
                                                        </form>
                                                        <button
                                                            onClick={() => handleDownloadPDF(event._id)}
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 h-9 px-4 py-2"
                                                        >
                                                            Download PDF
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarProvider>

            {/* Update Event Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                    <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Update Event</h3>
                            <p className="text-sm text-muted-foreground">Make changes to your event here.</p>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <input type="hidden" value={id || ""} />
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</label>
                                <input
                                    type="text"
                                    value={updateFormData.title}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, title: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
                                <textarea
                                    value={updateFormData.description}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Date</label>
                                <input
                                    type="date"
                                    value={updateFormData.date}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, date: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location</label>
                                <input
                                    type="text"
                                    value={updateFormData.location}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, location: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    Update
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}