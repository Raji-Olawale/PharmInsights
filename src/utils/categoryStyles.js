const accents = {
  blue: { accent: '#2874ba', soft: '#edf5fd', profile: '#66b2f6' },
  green: { accent: '#0c9b64', soft: '#eaf7f0', profile: '#63dca4' },
  orange: { accent: '#db832d', soft: '#fff5eb', profile: '#ffc078' },
}

export function getAccentStyle(accent) {
  const colors = accents[accent]
  return colors
    ? {
        '--accent': colors.accent,
        '--accent-soft': colors.soft,
        '--profile': colors.profile,
      }
    : undefined
}
