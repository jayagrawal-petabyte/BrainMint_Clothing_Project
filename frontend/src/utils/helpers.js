export const getColorName = (hex) => {
  if (!hex) return '';
  const colors = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#00ffff': 'Cyan',
    '#ff00ff': 'Magenta',
    '#808080': 'Gray',
    '#c0c0c0': 'Silver',
    '#800000': 'Maroon',
    '#808000': 'Olive',
    '#008000': 'Dark Green',
    '#800080': 'Purple',
    '#008080': 'Teal',
    '#000080': 'Navy',
    '#ffa500': 'Orange',
    '#a52a2a': 'Brown',
    '#ffc0cb': 'Pink'
  };
  return colors[hex.toLowerCase()] || hex;
};
