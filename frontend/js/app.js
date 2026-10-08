const API_URL = "http://localhost:3000/api/expenses";


// ==============================
// DOM Elements
// ==============================

const expensesTable = document.getElementById("expensesTable");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

const totalAmount = document.getElementById("totalAmount");
const expenseCount = document.getElementById("expenseCount");
const highestExpense = document.getElementById("highestExpense");


// Add Expense Form
const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const titleError = document.getElementById("titleError");
const amountError = document.getElementById("amountError");
const categoryError = document.getElementById("categoryError");
const dateError = document.getElementById("dateError");


// Filter
const categoryFilter = document.getElementById("categoryFilter");


// Edit Modal
const editId = document.getElementById("editId");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");

const editTitleError = document.getElementById("editTitleError");
const editAmountError = document.getElementById("editAmountError");
const editCategoryError = document.getElementById("editCategoryError");
const editDateError = document.getElementById("editDateError");

const saveEditButton = document.getElementById("saveEditButton");

const editModalElement = document.getElementById("editExpenseModal");
const editModal = new bootstrap.Modal(editModalElement);


// Store all expenses
let allExpenses = [];
function clearAddErrors() {

    titleInput.classList.remove("is-invalid");
    amountInput.classList.remove("is-invalid");
    categoryInput.classList.remove("is-invalid");
    dateInput.classList.remove("is-invalid");

}


function clearEditErrors() {

    editTitle.classList.remove("is-invalid");
    editAmount.classList.remove("is-invalid");
    editCategory.classList.remove("is-invalid");
    editDate.classList.remove("is-invalid");

}


// ==============================
// GET Expenses
// ==============================

async function getExpenses() {

    showLoading();
    hideError();

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            const data = await response.json();

            throw new Error(
                data.message || "Failed to load expenses."
            );
        }

        allExpenses = await response.json();

        applyFilter();

        // Summary always uses ALL expenses
        updateSummary(allExpenses);

    } catch (error) {

        showError(
            error.message ||
            "Could not connect to the server. Please make sure the backend server is running."
        );

        allExpenses = [];

        displayExpenses([]);
        updateSummary([]);

    } finally {

        hideLoading();

    }
}


// ==============================
// Display Expenses
// ==============================

function displayExpenses(expenses) {

    expensesTable.innerHTML = "";

    if (expenses.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "text-center text-muted py-4";
        cell.textContent = "No expenses found.";

        row.appendChild(cell);
        expensesTable.appendChild(row);

        return;
    }


    expenses.forEach((expense) => {

        const row = document.createElement("tr");


        // Title
        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;


        // Amount
        const amountCell = document.createElement("td");
        amountCell.textContent =
            Number(expense.amount).toFixed(2);


        // Category
        const categoryCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className =
            `badge ${getCategoryClass(expense.category)}`;

        badge.textContent = expense.category;

        categoryCell.appendChild(badge);


        // Date
        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;


        // Actions
        const actionsCell = document.createElement("td");
        actionsCell.className = "text-nowrap";


        // Edit Button
        const editButton = document.createElement("button");

        editButton.className =
            "btn btn-sm btn-outline-success me-2";

        editButton.textContent = "Edit";

        editButton.addEventListener(
            "click",
            () => openEditModal(expense.id)
        );


        // Delete Button
        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "btn btn-sm btn-outline-danger";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener(
            "click",
            () => deleteExpense(expense.id)
        );


        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);


        row.appendChild(titleCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);


        expensesTable.appendChild(row);

    });

}


// ==============================
// Summary Cards
// ==============================

function updateSummary(expenses) {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount),
        0
    );


    const highest =
        expenses.length > 0
            ? Math.max(
                ...expenses.map(
                    expense =>
                        Number(expense.amount)
                )
            )
            : 0;


    totalAmount.textContent =
        total.toFixed(2);

    expenseCount.textContent =
        expenses.length;

    highestExpense.textContent =
        highest.toFixed(2);

}


// ==============================
// POST - Add Expense
// ==============================

expenseForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        hideError();
        hideSuccess();
        clearAddErrors();


        const title = titleInput.value.trim();
        const amount = Number(amountInput.value);
        const category = categoryInput.value;
        const date = dateInput.value;


        // Validation
        if (!title) {

            titleInput.classList.add("is-invalid");
            return;

        }


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            amountInput.classList.add("is-invalid");
            return;

        }


        if (!category) {

            categoryInput.classList.add("is-invalid");
            return;

        }


        if (!date) {

            dateInput.classList.add("is-invalid");
            return;

        }

        const expense = {
            title,
            amount,
            category,
            date
        };


        try {

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(expense)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add expense."
                );

            }


            expenseForm.reset();


            showSuccess(
                "Expense added successfully."
            );


            await getExpenses();


        } catch (error) {

            showError(error.message);

        }

    }
);


// ==============================
// FILTER
// ==============================

categoryFilter.addEventListener(
    "change",
    applyFilter
);


function applyFilter() {

    const selectedCategory =
        categoryFilter.value;


    if (selectedCategory === "All") {

        displayExpenses(allExpenses);

        return;

    }


    const filteredExpenses =
        allExpenses.filter(
            expense =>
                expense.category ===
                selectedCategory
        );


    displayExpenses(filteredExpenses);

}


// ==============================
// Open Edit Modal
// ==============================

function openEditModal(id) {

    const expense = allExpenses.find(
        item =>
            Number(item.id) === Number(id)
    );


    if (!expense) {

        showError("Expense not found.");
        return;

    }


    editId.value = expense.id;
    editTitle.value = expense.title;
    editAmount.value = expense.amount;
    editCategory.value = expense.category;
    editDate.value = expense.date;


    editModal.show();

}


// ==============================
// PUT - Update Expense
// ==============================

saveEditButton.addEventListener(
    "click",
    async () => {

        hideError();
        hideSuccess();
        clearEditErrors();


        const id = Number(editId.value);
        const title = editTitle.value.trim();
        const amount = Number(editAmount.value);
        const category = editCategory.value;
        const date = editDate.value;


        if (!title) {

            editTitle.classList.add("is-invalid");
            return;

        }


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            editAmount.classList.add("is-invalid");
            return;

        }


        if (!category) {

            editCategory.classList.add("is-invalid");
            return;

        }


        if (!date) {

            editDate.classList.add("is-invalid");
            return;

        }


        const expense = {
            title,
            amount,
            category,
            date
        };


        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(expense)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update expense."
                );

            }


            editModal.hide();  //أغلق Modal.


            showSuccess(
                "Expense updated successfully."
            );


            await getExpenses();


        } catch (error) {

            showError(error.message);

        }

    }
);


// ==============================
// DELETE Expense
// ==============================

async function deleteExpense(id) {

    hideError();
    hideSuccess();


    const confirmed = confirm(
        "Are you sure you want to delete this expense?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete expense."
            );

        }


        showSuccess(
            "Expense deleted successfully."
        );


        await getExpenses();


    } catch (error) {

        showError(error.message);

    }

}


// ==============================
// Category Badge Colors
// ==============================

function getCategoryClass(category) {

    switch (category) {

        case "Food":
            return "bg-success";

        case "Transport":
            return "bg-primary";

        case "Bills":
            return "bg-danger";

        case "Entertainment":
            return "bg-warning text-dark";

        case "Other":
            return "bg-secondary";

        default:
            return "bg-secondary";

    }

}


// ==============================
// Error / Success Alerts
// ==============================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove(
        "d-none"
    ) ;

}


function hideError() {

    errorMessage.classList.add(
        "d-none"
    );

}


function showSuccess(message) {

    successMessage.textContent = message;

    successMessage.classList.remove(
        "d-none"
    );


    setTimeout(
        () => {

            hideSuccess();

        },
        3000
    );

}


function hideSuccess() {

    successMessage.classList.add(
        "d-none"
    );

}


// ==============================
// Loading Spinner
// ==============================

function showLoading() {

    loading.classList.remove(
        "d-none"
    );

}


function hideLoading() {

    loading.classList.add(
        "d-none"
    );

}
// ==============================
// Dark Mode Switch
// ==============================

const darkModeSwitch = document.getElementById("darkModeSwitch");
const savedTheme = localStorage.getItem("theme");

darkModeSwitch.checked = savedTheme === "dark";
document.body.classList.toggle("dark-mode", darkModeSwitch.checked);

darkModeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkModeSwitch.checked);
    localStorage.setItem("theme", darkModeSwitch.checked ? "dark" : "light");
});

// ==============================
// Start Application
// ==============================

getExpenses();