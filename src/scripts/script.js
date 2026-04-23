function getData() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  return transactions;
}

function saveData(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderEntries() {
  let transactions = getData();

  let entries = document.querySelector("#entries");
  entries.innerHTML = "";

  document.querySelector("#numOfEntries").innerHTML = transactions.length;

  if (transactions.length === 0) {
    entries.innerHTML = `
     <div
        class="mt-2 bg-white border border-[var(--muted)]/40 rounded-2xl px-4 py-6"
      >
        <div class="flex flex-col gap-2 items-center py-10">
          <span class="bi bi-card-text text-[var(--muted)]/60 text-4xl"></span>
          <p class="text-sm font-medium opacity-70">No expenses yet</p>
          <p class="text-[var(--muted)] text-xs">
            Add your first entry above to get started.
          </p>
        </div>
      </div>
    `;
  }

  transactions.forEach(function (entry, index) {
    const config =
      categoryConfig[entry.entryCategory] || categoryConfig["other"];

    let card = document.createElement("div");
    card.innerHTML = `
        <div class="flex gap-4 items-center justify-center">
            <div
              class="icon w-12 h-12 rounded-4xl flex items-center justify-center ${config.bg}"
            >
              <span class="bi ${config.icon} ${config.color}"></span>
            </div>

            <div class="info md:text-sm text-xs">
              <p>${entry.entryName}</p>
              <div class="text-[var(--muted)] text-xs mt-1">${entry.date}</div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-6">
            <div class="amt font-semibold num ${entry.entryType === "expense" ? "text-red-500" : "text-green-500"}"> ${entry.entryType === "expense" ? "-" : "+"}&#8377;${entry.entryAmt}</div>

            <div>
              <button onclick="deleteEntry(${index})"
                class="deleteBtn bi bi-x-lg text-[var(--muted)] border border-[var(--muted)]/40 rounded-lg px-2 py-1 rounded-lg"
              ></button>
            </div>
          </div>
    `;

    card.classList =
      "card mb-4 flex items-center justify-between bg-white border border-[var(--muted)]/40 rounded-2xl px-6 py-6";

    entries.appendChild(card);
  });

  calculateIncome();
  calculateExpense();
  calculateBalance();
}

function addEntry() {
  let transactions = getData();

  let entryName = document.querySelector("#entryName");
  let entryAmt = document.querySelector("#entryAmt");
  let entryType = document.querySelector("#entryType");
  let entryCategory = document.querySelector("#entryCategory");

  if (entryName.value === "" || entryAmt.value === 0) {
    alert("Please enter the required data to proced.");
    return;
  }

  transactions.push({
    entryName: entryName.value,
    entryAmt: parseInt(entryAmt.value),
    entryType: entryType.value,
    entryCategory: entryCategory.value,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  });

  saveData(transactions);
  renderEntries();

  // To clear the input fields
  entryName.value = "";
  entryAmt.value = "";
  entryType.value = "expense";
  entryCategory.value = "select";

  calculateIncome();
  calculateExpense();
  calculateBalance();
}

function deleteEntry(idx) {
  let transactions = getData();
  transactions.splice(idx, 1);

  saveData(transactions);
  renderEntries();

  calculateIncome();
  calculateExpense();
  calculateBalance();
}

function calculateIncome() {
  let transactions = getData();
  let income = transactions.reduce((total, item) => {
    if (item.entryType === "income") {
      return total + item.entryAmt;
    }
    return total;
  }, 0);

  document.querySelector("#incomeAmt").innerHTML = `${income}`;
}

function calculateExpense() {
  let transactions = getData();
  let expense = transactions.reduce((total, item) => {
    if (item.entryType === "expense") {
      return total - item.entryAmt;
    }
    return total;
  }, 0);

  document.querySelector("#expensesAmt").innerHTML = `${expense}`;
}

function calculateBalance() {
  let transactions = getData();
  let balance = transactions.reduce((total, item) => {
    if (item.entryType === "income") {
      return total + item.entryAmt;
    } else {
      return total - item.entryAmt;
    }
  }, 0);

  document.querySelector("#balanceAmt").innerHTML = `${balance}`;
}

const categoryConfig = {
  living: {
    icon: "bi-fork-knife",
    bg: "bg-green-100",
    color: "text-green-500",
  },
  bills: {
    icon: "bi-receipt",
    bg: "bg-red-100",
    color: "text-red-500",
  },
  lifestyle: {
    icon: "bi-bag",
    bg: "bg-purple-100",
    color: "text-purple-500",
  },
  transport: {
    icon: "bi-car-front",
    bg: "bg-blue-100",
    color: "text-blue-500",
  },
  health: {
    icon: "bi-heart-pulse",
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
  other: {
    icon: "bi-box",
    bg: "bg-gray-100",
    color: "text-gray-500",
  },
};
