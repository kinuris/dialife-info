export async function getConsolidated<T extends PatientRecordType>(
  patientId: string,
  type: T,
  days: number = 7
): Promise<
  T extends 'medication'
    ? MedicationType[]
    : T extends 'glucose'
      ? GlucoseType[]
      : T extends 'activity'
        ? ActivityType[]
        : T extends 'bmi'
          ? BMIType[]
          : T extends 'nutrition'
            ? NutritionType[]
            : never
> {
  const response = await fetch('/dialife-api/patient/record/consolidated', {
    method: 'POST',
    body: JSON.stringify({
      patient_id: patientId,
      type,
      days
    })
  })

  return await response.json()
}

export async function getLatest<T extends PatientRecordType>(
  patientId: string,
  type: T
): Promise<T extends 'glucose' ? GlucoseType : T extends 'bmi' ? BMIType : any> {
  const response = await fetch('/dialife-api/patient/record/latest', {
    method: 'POST',
    body: JSON.stringify({
      patient_id: patientId,
      type
    })
  })

  return await response.json()
}
