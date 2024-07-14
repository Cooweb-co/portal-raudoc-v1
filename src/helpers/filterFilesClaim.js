export default function filterFilesClaim(files, types) {
  const filterFiles = {};
  const matchedFiles = new Set();

  // Filtrar los archivos que coinciden con los tipos especificados
  types.forEach(type => {
    filterFiles[type] = files.filter(file => file.name.includes(type)) || null;
    filterFiles[type].forEach(file => matchedFiles.add(file));
  });

  // Filtrar los archivos que no coinciden con ninguno de los tipos
  filterFiles['entry'] = files.filter(file => !matchedFiles.has(file)) || null;

  return filterFiles;
}
