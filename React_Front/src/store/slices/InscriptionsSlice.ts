import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Inscription {
  id: string;
  eventId: string;
  participantId:{
    name:string;
    email:string;
    phone:string;
    NID:string;
  }
  createdAt: string;
}

interface InscriptionsState {
  inscriptions: Inscription[];
}

const initialState: InscriptionsState = {
  inscriptions: [],
};

const inscriptionsSlice = createSlice({
  name: 'inscriptions',
  initialState,
  reducers: {
    setInscriptions: (state, action: PayloadAction<Inscription[]>) => {
      state.inscriptions = action.payload;
    },
    addInscription: (state, action: PayloadAction<Inscription>) => {
      state.inscriptions.push(action.payload);
    },
    updateInscription: (state, action: PayloadAction<Inscription>) => {
      const index = state.inscriptions.findIndex(inscription => inscription.id === action.payload.id);
      if (index !== -1) {
        state.inscriptions[index] = action.payload;
      }
    },
    deleteInscription: (state, action: PayloadAction<string>) => {
      state.inscriptions = state.inscriptions.filter(inscription => inscription.id !== action.payload);
    },
  }
});

export const {
  setInscriptions,
  addInscription,
  updateInscription,
  deleteInscription,
} = inscriptionsSlice.actions;

export default inscriptionsSlice.reducer;
