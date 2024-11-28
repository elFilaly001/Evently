import AppSidebar from "../components/sidebar/appSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/services/axiosInstence";
import { Dialog } from "@headlessui/react";
import { setEvents } from "@/store/slices/eventSlice";
import { deleteInscription, setInscriptions } from "@/store/slices/InscriptionsSlice";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    creator: string;
}

interface Participant {
    name: string;
    email: string;
    phone: string;
    NID: string;
}

interface Inscription {
    _id: string;
    event: string;
    participant: Participant;
    createdAt: string;
    updatedAt: string;
    eventDetails: Event;
}

export default function PageInscription() { // Fixed function name to start with capital letter
    const dispatch = useDispatch();
    const { id, username, email } = useSelector((state: RootState) => state.auth);
    const inscriptions = useSelector((state: RootState) => state.inscription.inscriptions);
    const events = useSelector((state: RootState) => state.event.events); // Fixed selector paths
    const [filteredInscriptions, setFilteredInscriptions] = useState<Inscription[]>([]);
    const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateForm, setUpdateForm] = useState<Participant & {eventId?: string}>({
        name: '',
        email: '',
        phone: '',
        NID: ''
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch inscriptions
                const inscriptionsResponse = await axiosInstance.get(`/inscription/${id}`);
                const inscriptionsData = inscriptionsResponse.data;
                
                // Fetch all events
                const eventsResponse = await axiosInstance.get(`/event/${id}`);
                const eventsData = eventsResponse.data;
                
                if (!eventsData || eventsData.length === 0) {
                    setError("No events found");
                    return;
                }
                
                dispatch(setEvents(eventsData));
                
                if (!inscriptionsData || inscriptionsData.length === 0) {
                    setError("No inscriptions found");
                    return;
                }
                
                dispatch(setInscriptions(inscriptionsData));
                setFilteredInscriptions(inscriptionsData);
                setError(null);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setError("No inscriptions found");
                } else {
                    console.error('Error fetching data:', error);
                    setError("An error occurred while fetching data");
                }
            }
        };
        
        if (id) { // Only fetch if id exists
            fetchData();
        }
    }, [id, dispatch]);

    const handleUpdateClick = (inscription: Inscription) => {
        setSelectedInscription(inscription);
        setUpdateForm({
            ...inscription.participant,
            eventId: inscription.event
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInscription) return; // Add check for selectedInscription

        try {
            const { eventId, ...participantData } = updateForm;
            await axiosInstance.put(`/inscription/${selectedInscription._id}`, {
                participant: participantData,
                event: eventId
            });
            // Refresh data after update
            const inscriptionsResponse = await axiosInstance.get(`/inscription/${id}`);
            dispatch(setInscriptions(inscriptionsResponse.data));
            setFilteredInscriptions(inscriptionsResponse.data);
            setIsUpdateModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error updating inscription:', error);
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

    if (!id) return null;

    console.log("inscriptions",inscriptions);
    console.log("events",events);
    
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
                        <h2 className="text-3xl font-bold tracking-tight">Inscriptions</h2>
                    </div>
                    {error ? (
                        <div className="rounded-md border p-4 text-center text-gray-500">
                            {error}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <div className="p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Filter events..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onChange={(e) => {
                                            const searchTerm = e.target.value.toLowerCase();
                                            const filtered = inscriptions.filter((inscription) => {
                                                const event = inscription.event;
                                                if (!event) return false;
                                                
                                                return (
                                                    event.title.toLowerCase().includes(searchTerm) ||
                                                    event.description.toLowerCase().includes(searchTerm) ||
                                                    event.location.toLowerCase().includes(searchTerm)
                                                );
                                            });
                                            setFilteredInscriptions(filtered);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Event</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">NID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {filteredInscriptions.map((inscription) => (
                                            <tr key={inscription._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">{inscription.eventDetails[0].title}</td>
                                                <td className="p-4 align-middle">{inscription.participant.name}</td>
                                                <td className="p-4 align-middle">{inscription.participant.email}</td>
                                                <td className="p-4 align-middle">{inscription.participant.phone}</td>
                                                <td className="p-4 align-middle">{inscription.participant.NID}</td>
                                                <td className="p-4 align-middle">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedInscription(inscription);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                                    >
                                                        View Event
                                                    </button>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleUpdateClick(inscription)}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                                                        >
                                                            Update
                                                        </button>
                                                        <form onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            await axiosInstance.delete(`/inscription/${inscription._id}`);
                                                            dispatch(deleteInscription(inscription._id));
                                                            setFilteredInscriptions(prev => prev.filter(item => item._id !== inscription._id));
                                                        }}>
                                                            <button 
                                                                type="submit"
                                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
                                                            >
                                                                Delete
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Details Modal */}
                <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30 " aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6">
                            <Dialog.Title className="text-2xl font-bold mb-4">
                                Event Details
                            </Dialog.Title>
                            <div className="space-y-4">
                                <div>
                                    <p>Title: {selectedInscription?.eventDetails[0].title}</p>
                                    <p>Description: {selectedInscription?.eventDetails[0].description}</p>
                                    <p>Date: {selectedInscription?.eventDetails[0].date ? new Date(selectedInscription.eventDetails[0].date).toLocaleDateString() : ''}</p>
                                    <p>Location: {selectedInscription?.eventDetails[0].location}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Registration Details</h3>
                                    <p>Registration Date: {selectedInscription?.createdAt ? new Date(selectedInscription.createdAt).toLocaleDateString() : ''}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                {/* Update Modal */}
                <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
                            <Dialog.Title className="text-2xl font-bold mb-4">
                                Update Inscription
                            </Dialog.Title>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Event</label>
                                    <select
                                        value={updateForm.eventId}
                                        onChange={(e) => setUpdateForm({...updateForm, eventId: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    >
                                        <option value="">Select an event</option>
                                        {events?.map((event) => (
                                            <option key={event._id} value={event._id}>
                                                {event.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={updateForm.name}
                                        onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={updateForm.email}
                                        onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        value={updateForm.phone}
                                        onChange={(e) => setUpdateForm({...updateForm, phone: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">NID</label>
                                    <input
                                        type="text"
                                        value={updateForm.NID}
                                        onChange={(e) => setUpdateForm({...updateForm, NID: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUpdateModalOpen(false)}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </SidebarProvider>
        </div>
    )
}
