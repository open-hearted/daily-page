document.addEventListener('DOMContentLoaded', () => {
  // Renders all stored records to the page
  function renderRecords() {
    const records = JSON.parse(localStorage.getItem('activityRecords') || '[]');
    const list = document.getElementById('record-list');
    list.innerHTML = ''; // Clear previous display

    records.forEach(record => {
      const item = document.createElement('li');
      item.textContent = `${record.type} - ${record.timestamp}`;
      list.appendChild(item);
    });
  }

  // Adds a new record and refreshes the display
  function addRecord(type) {
    const timestamp = new Date().toISOString();
    const record = { type, timestamp };
    const records = JSON.parse(localStorage.getItem('activityRecords') || '[]');
    records.push(record);
    localStorage.setItem('activityRecords', JSON.stringify(records));
    console.log(`Added ${type} record at ${timestamp}`);
    renderRecords();
  }

  // Export data as a downloadable JSON file
  function exportRecords() {
    const records = localStorage.getItem("activityRecords") || "[]";
    const blob = new Blob([records], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "activityRecords.json";
    link.click();
    URL.revokeObjectURL(url);

    console.log("Exported records.");
  }

  // Attach listeners to each button
  document.getElementById("add-laundry")?.addEventListener("click", () => addRecord("laundry"));
  document.getElementById("add-cleanup")?.addEventListener("click", () => addRecord("cleanup"));
  document.getElementById("diary-btn")?.addEventListener("click", () => addRecord("diary"));
  document.getElementById("expense-btn")?.addEventListener("click", () => addRecord("expense"));
  document.getElementById("study-btn")?.addEventListener("click", () => addRecord("study"));
  document.getElementById("export-btn")?.addEventListener("click", exportRecords);

  // Initial render on page load
  renderRecords();
});
