const NATURES = [
  'vp', // charter vfr
  'ip', // charter ifr
  'vs', // instruction vfr
  'vss', // instruction vfr solo
  'is', // instruction ifr
  'iss', // instruction ifr solo
  'tr', // trial flight
  'tec', // technical flight
  'vc' // "commercial" sight seeing flight
]

export const getFlightNatures = () => NATURES.slice(0)
