export const getAerodromeOption = aerodrome => ({
  value: aerodrome.id,
  label: `${aerodrome.identification} (${aerodrome.name})`
})

export const getMemberOption = member => ({
  value: member.id,
  label: `${member.lastname} ${member.firstname}`
})
