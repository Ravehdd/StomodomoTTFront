import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Patient = {
    id: number,
    add_time: string,
    start_time: string,
    end_time: string,
    cancel_time: string | null,
    clinic: string,
    doctor_name: string,
    patient: string,
    patient_id: number,
    phone: string,
    personal_account: number,
    family_account: number,
    days_count: number

}

type PatientID = number;

export type PatientState = {
    entities: Record<PatientID, Patient>
    ids: PatientID[]
}

const initialState: PatientState = {
    entities: {},
    ids: []
}

export const patientSlice = createSlice({
    name: "patient",
    initialState: initialState,
    selectors: {
        selectAllPatient: state => state.entities
    },
    reducers: {
        storePatient: (state, action: PayloadAction<{patient: Patient[]}>) => {
            const {patient} = action.payload
            return {
                ...state,
                entities: patient.reduce((acc, pat) => {
                    acc[pat.id] = pat
                    return acc
                }, {} as Record<PatientID, Patient>),
                ids: patient.map(pat => pat.id)
            }
        }
    }
})