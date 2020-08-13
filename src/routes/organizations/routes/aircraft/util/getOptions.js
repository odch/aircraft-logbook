export const getAerodromeOption = aerodrome => ({
  value: aerodrome.id,
  label: `${aerodrome.identification} (${aerodrome.name})`,
  timezone: aerodrome.timezone
})

export const getMemberOption = member => ({
  value: member.id,
  label: `${member.lastname} ${member.firstname}`
})

export const getFuelTypeOption = fuelType => ({
  value: fuelType.name,
  label: fuelType.description || fuelType.name
})
