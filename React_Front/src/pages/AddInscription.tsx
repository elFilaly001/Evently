import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/appSidebar";
import { axiosInstance } from "@/services/axiosInstence";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function AddInscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector((state: RootState) => state.event.events);
  const { email, username } = useSelector((state: RootState) => state.auth);

  const defaultFormData = {
    eventId: "",
    name: "",
    email: "",
    phone: "",
    NID: ""
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [emailError, setEmailError] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.eventId) newErrors.eventId = "Event is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.NID) newErrors.NID = "NID is required";
    // Validate phone number format (assuming 8 digits)
    if (formData.phone) {
      const phoneRegex = /^\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone number must be 9 digits";
      }
    }

    // Additional email validation
    if (formData.email) {
      // Check for common email providers
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const emailDomain = formData.email.split('@')[1];
      
      if (!commonDomains.includes(emailDomain.toLowerCase())) {
        newErrors.email = "Please use a common email provider (Gmail, Yahoo, Hotmail, Outlook)";
      }

      // Check minimum length
      if (formData.email.length < 5) {
        newErrors.email = "Email is too short";
      }

      // Check maximum length
      if (formData.email.length > 50) {
        newErrors.email = "Email is too long";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { eventId, ...participantData } = formData;
      const response = await axiosInstance.post("/inscription/addInscription", {
        event: eventId,
        participant: participantData
      });

      if(response.status === 401){
                toast.error("Unauthorized");
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            }
      toast.success("Inscription added successfully");
      setFormData(defaultFormData); // Reset form after successful submission
    } catch (error) {
      // console.error("Error adding inscription:", error);
      toast.error(error.response?.data?.message);   
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setErrors({
      ...errors,
      [name]: ""
    });

    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="h-screen overflow-hidden">
        <Toaster position="top-right" />
      <SidebarProvider>
        <AppSidebar 
          menuItems={menuItems}
          userName={username}
          userEmail={email}
        />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Add Inscription</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-left ml-2">
                Event <span className="text-red-500">*</span>
              </label>
              <select 
                name="eventId"
                value={formData.eventId}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.eventId ? 'border-red-500' : ''}`}
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {errors.eventId && <p className="text-red-500 text-sm mt-1">{errors.eventId}</p>}
            </div>

            <div>
              <label  className="block text-sm font-medium mb-1 text-left ml-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left ml-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left ml-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-left ml-2">
                NID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="NID"
                value={formData.NID}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.NID ? 'border-red-500' : ''}`}
              />
              {errors.NID && <p className="text-red-500 text-sm mt-1">{errors.NID}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Add Inscription
              </button>
            </div>
          </form>
        </div>
      </SidebarProvider>
    </div>
  );
}