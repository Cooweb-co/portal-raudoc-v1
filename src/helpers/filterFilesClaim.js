export default function filterFilesClaim(files, types) {
  const filterFiles = {};
  const entryFiles = [];

  // Inicializa los arrays para cada tipo
  types.forEach(type => {
    filterFiles[type] = [];
  });

  // Filtra los archivos
  files.forEach(file => {
    let matched = false;
    types.forEach(type => {
      if (file.name.includes(type)) {
        filterFiles[type].push(file);
        matched = true;
      }
    });
    if (!matched) {
      entryFiles.push(file);
    }
  });

  // Agrega los archivos no coincidentes
  filterFiles['entry'] = entryFiles;

  console.log(filterFiles);
  return filterFiles;
}
