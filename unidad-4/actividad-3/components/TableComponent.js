export default class TableComponent {
  constructor(data) {
    this.data = data;
  }

  buildTable() {
    const table = document.createElement("table");
    table.border = "1";
    table.cellPadding = "5";
    table.cellSpacing = "0";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Encabezados dinámicos (keys del primer objeto)
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    Object.keys(this.data[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      th.style.background = "#f0f0f0";
      headerRow.appendChild(th);
    });

    // Cuerpo de la tabla
    const tbody = table.createTBody();
    this.data.forEach(item => {
      const row = tbody.insertRow();
      Object.values(item).forEach(value => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
    });

    return table;
  }
}
