// common util function

const fetchData = async () => {
  const res = await fetch('/src/data.json');
  const data = await res.json();
  totalCount = data.length;
  return data;
};

const getPageData = async (page, pageSize) => {
  const data = await fetchData();
  const startIndex = (page - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
};

const getLastPage = ({ totalCount, pageSize }) => {
  return Math.ceil(totalCount / pageSize);
};

// Component

const Dropdown = () => {
  const el = document.getElementById('dropdown');
  const select = el.querySelector('select');

  let state = {
    pageSize: 5,
  };

  select.addEventListener('change', async (e) => {
    const pageSize = Number(e.target.value);
    const pageData = await getPageData(1, pageSize);
    table({ data: pageData });
    pagination({
      currentPage: 1,
      pageSize,
    });
  });

  return (newState) => {
    // change state
    state = { ...state, ...newState };

    // render component
    select.value = state.pageSize;
  };
};

const Table = () => {
  const el = document.getElementById('table');
  const tbody = el.querySelector('tbody');

  let state = {
    data: null,
  };

  const clearTable = () => {
    tbody.innerHTML = '';
  };

  const appendRow = (item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td><td>${item.title}</td><td>${item.email}</td><td>${item.role}</td>`;
    tbody.appendChild(tr);
  };

  return (newState) => {
    // change state
    state = { ...state, ...newState };

    // render component
    clearTable();
    if (!state.data) return;
    state.data.forEach((item) => {
      appendRow(item);
    });
  };
};

const Pagination = () => {
  const el = document.getElementById('pagination');

  let state = {
    currentPage: 1,
    pageSize: 5,
    totalCount: 25,
  };

  const goPage = async (pageNum) => {
    if (isNaN(pageNum)) return;
    const pageData = await getPageData(pageNum, state.pageSize);

    table({ data: pageData });
    pagination({
      currentPage: pageNum,
      pageSize: state.pageSize,
      totalCount: state.totalCount,
    });
  };

  el.addEventListener('click', async (e) => {
    const pageNum = e.target.value;
    const lastPageNum = getLastPage({
      totalCount: state.totalCount,
      pageSize: state.pageSize,
    });
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

  return (newState) => {
    // change state
    state = { ...state, ...newState };

    // render component
    const pageButtons = Array(
      getLastPage({ totalCount: state.totalCount, pageSize: state.pageSize })
    )
      .fill('')
      .map((_, index) => {
        return `<button class="page-number" value="${index + 1}">${
          index + 1
        }</button>`;
      });

    el.innerHTML = `
        <button class="arrow" value="first"><<</button>
        ${pageButtons.join('')}
        <button class="arrow" value="last">>></button>
    `;

    const pageButtonList = el.querySelectorAll('.page-number');
    pageButtonList.forEach((button) => {
      if (Number(button.value) === state.currentPage)
        button.classList.add('selected');
      else button.classList.remove('selected');
    });
  };
};

// run app

const dropdown = Dropdown();
const table = Table();
const pagination = Pagination();

const app = async () => {
  const currentPage = 1;
  const pageSize = 5;
  const data = await fetchData();
  const pageData = data.slice(0, pageSize);

  dropdown({ pageSize: 5 });
  table({ data: pageData });
  pagination({
    currentPage,
    pageSize,
    totalCount: data.length,
  });
};

app();
