const getAerodromeLabel = aerodrome => {
  let label = aerodrome.name
  if (aerodrome.identification) {
    label += ' (' + aerodrome.identification + ')'
  }
  return label
}

export const getAerodromeOption = aerodrome => ({
  value: aerodrome.id,
  label: getAerodromeLabel(aerodrome)
})

export const getMemberOption = member => ({
  value: member.id,
  label: `${member.lastname} ${member.firstname}`
})

export const getAerodromeOptions = aerodromes =>
  aerodromes.map(aerodrome => getAerodromeOption(aerodrome))

export const getMemberOptions = members =>
  members.map(member => getMemberOption(member))
