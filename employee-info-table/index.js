const tbody = document.querySelector('#table tbody');
const pagination = document.querySelector('#pagination');
const dropdown = document.querySelector('#dropdown select');

let totalCount = 0;
let pageSize = 5;

pagination.addEventListener('click', (e) => {
  const pageNum = e.target.value;
  const lastPageNum = getLastPageNum();
  switch (pageNum) {
    case 'first':
      goPage(1);
      break;
    case 'last':
      goPage(lastPageNum);
      break;
    default:
      goPage(Number(pageNum));
      break;
  }
});

dropdown.addEventListener('change', (e) => {
  pageSize = Number(e.target.value);
  renderPagination(1);
  goPage(1);
});

const getLastPageNum = () => {
  return Math.ceil(totalCount / pageSize);
};

const goPage = async (pageNum) => {
  if (isNaN(pageNum)) return;
  const pageData = await getPageData(pageNum);
  renderTable(pageData);
  renderPagination(pageNum);
};

const getPageData = async (pageNum) => {
  const data = await fetchData();
  const startIndex = (pageNum - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
};

const fetchData = async () => {
  const res = await fetch('/src/data.json');
  const data = await res.json();
  totalCount = data.length;
  return data;
};

const clearTable = () => {
  tbody.innerHTML = '';
};

const appendRow = (item) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${item.name}</td><td>${item.title}</td><td>${item.email}</td><td>${item.role}</td>`;
  tbody.appendChild(tr);
};

const renderTable = (data) => {
  clearTable();
  data.forEach((item) => {
    appendRow(item);
  });
};

const renderPagination = (pageNum) => {
  const lastPageNum = getLastPageNum();

  const pageButtons = Array(lastPageNum)
    .fill('')
    .map((_, index) => {
      return `<button class="page-number" value="${index + 1}">${
        index + 1
      }</button>`;
    });

  pagination.innerHTML = `
        <button class="arrow" value="first"><<</button>
        ${pageButtons.join('')}
        <button class="arrow" value="last">>></button>
    `;

  const pageButtonList = pagination.querySelectorAll('.page-number');
  pageButtonList.forEach((button) => {
    if (Number(button.value) === pageNum) button.classList.add('selected');
    else button.classList.remove('selected');
  });
};

const app = async () => {
  goPage(1);
};

app();
