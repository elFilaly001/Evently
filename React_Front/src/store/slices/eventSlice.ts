import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
  _id: string;
  title: string; 
  description: string;
  date: string;
  location: string;
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<Event>) => {
      state.selectedEvent = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event._id === action.payload._id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event._id !== action.payload);
    },
  }
});

export const {
  setEvents,
  setSelectedEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
