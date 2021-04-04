export function downloadFileAutomatically(data, filename) {
  let fileData = JSON.stringify(data);
  let blob = new Blob([fileData], {type: "text/plain"});
  let url = URL.createObjectURL(blob);
  let link = document.createElement('a');
  let datetime = Date.now();
  link.download = filename + "-" + datetime +'.json';
  link.href = url;
  link.click();
}
