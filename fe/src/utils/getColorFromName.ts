const colorPalette = [
  '#A9DFD8', // light green
  '#FCB859', //orange
  '#C9A8C7', //lilac
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function getColorFromName(name: string): string {
  // Simple hash for index selection
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}