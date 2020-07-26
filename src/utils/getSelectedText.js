export default function getSelectedText() {
  if ('getSelection' in window) return window.getSelection().toString();
  if ('selection' in document && document.selection.type === 'Text') return document.selection.createRange().text;
  return null;
}
