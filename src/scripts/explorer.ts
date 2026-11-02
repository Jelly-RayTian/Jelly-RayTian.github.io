const searchInput = document.getElementById('q') as HTMLInputElement | null;
const repoSelect = document.getElementById('repo') as HTMLSelectElement | null;
const statusSelect = document.getElementById('status') as HTMLSelectElement | null;
const rows = [...document.querySelectorAll<HTMLElement>('#list .r')];
const emptyNote = document.getElementById('none');

function apply() {
  const text = (searchInput?.value ?? '').toLowerCase();
  const repo = repoSelect?.value ?? '';
  const st = statusSelect?.value ?? '';
  let shown = 0;
  rows.forEach((row) => {
    const ok = (!repo || row.dataset.repo === repo) && (!st || row.dataset.status === st) && (!text || (row.dataset.text ?? '').includes(text));
    row.hidden = !ok;
    if (ok) shown++;
  });
  if (emptyNote) emptyNote.hidden = shown > 0;
}
[searchInput, repoSelect, statusSelect].forEach((el) => el?.addEventListener('input', apply));
