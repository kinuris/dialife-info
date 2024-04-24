/// <reference types="vite/client" />
type User = {
  doctor_id: string
  name: string
  email: string
  profile_picture_link: string
}

type Patient = {
  patient_id: string
  name: string
  birthdate: string
  province: string
  sex: string
  municipality: string
  barangay: string
  zip_code: string
  address_description: string
  contact_number: string
}

type PatientRecordType = 'glucose' | 'bmi' | 'nutrition' | 'activity' | 'medication'

type GlucoseType = {
  blood_glucose_level: string
  glucose_created_at: string
}

type BMIType = {
  bmi_level: string
  bmi_created_at: string
}

type MedicationType = {
  medicine_name: string
  medicine_dosage: string
  medicine_route: string
  medicine_form: string
  medicine_taken_at: string
  medicine_taken_time?: string
}

type ActivityType = {
  activity_type: string
  activity_duration: string
  activity_frequency: string
  activity_created_at: string
}

type NutritionType = {
  nutrition_foods: string
  nutrition_meal_time: string
  nutrition_created_at: string
}

type DoctorContact = {
  doctor_number_id: string
  fk_doctor_id: string
  number: string
}

type ProfilePicChange = {
  message: string
  link: string
}
