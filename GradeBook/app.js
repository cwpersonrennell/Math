const ROWS = 30;
const COLS = 10;
const STORAGE_KEY = "gradeCalculatorSheet";

const spreadsheet = document.getElementById("spreadsheet");

buildSpreadsheet();
loadSheet();
updateGrade();

document
    .getElementById("clearSheet")
    .addEventListener("click", clearSheet);

function buildSpreadsheet() {

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");

    const corner = document.createElement("th");
    headerRow.appendChild(corner);

    for (let c = 0; c < COLS; c++) {

        const th = document.createElement("th");

        th.textContent =
            String.fromCharCode(65 + c);

        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);

    for (let r = 0; r < ROWS; r++) {

        const row = document.createElement("tr");

        const rowHeader =
            document.createElement("th");

        rowHeader.textContent = r + 1;

        row.appendChild(rowHeader);

        for (let c = 0; c < COLS; c++) {

            const td =
                document.createElement("td");

            const input =
                document.createElement("input");

            const cellId =
                `${String.fromCharCode(
                    65 + c
                )}${r + 1}`;

            input.type = "text";
            input.dataset.cell = cellId;

            input.addEventListener(
                "input",
                handleCellChange
            );

            input.addEventListener(
                "keydown",
                handleNavigation
            );

            td.appendChild(input);

            row.appendChild(td);
        }

        tbody.appendChild(row);
    }

    spreadsheet.appendChild(thead);
    spreadsheet.appendChild(tbody);
}

function getCellValue(cellId) {

    const cell =
        document.querySelector(
            `[data-cell="${cellId}"]`
        );

    return cell ? cell.value : "";
}

function setCellValue(cellId, value) {

    const cell =
        document.querySelector(
            `[data-cell="${cellId}"]`
        );

    if (cell) {
        cell.value = value;
    }
}

function getAllValues() {

    const values = {};

    document
        .querySelectorAll("[data-cell]")
        .forEach(cell => {

            values[
                cell.dataset.cell
            ] = cell.value;

        });

    return values;
}

function handleCellChange(event) {

    const changedCell =
        event.target.dataset.cell;

    const newValue =
        event.target.value;

    console.log(
        `${changedCell} = ${newValue}`
    );

    saveSheet();

    updateGrade();
}

function handleNavigation(event) {

    const current =
        event.target.dataset.cell;

    const match =
        current.match(/^([A-Z]+)(\d+)$/);

    if (!match) return;

    let col =
        match[1].charCodeAt(0) - 65;

    let row =
        parseInt(match[2], 10) - 1;

    switch (event.key) {

        case "ArrowUp":
            row--;
            break;

        case "ArrowDown":
        case "Enter":
            row++;
            break;

        case "ArrowLeft":
            col--;
            break;

        case "ArrowRight":
            col++;
            break;

        case "Tab":

            event.preventDefault();

            if (event.shiftKey) {
                col--;
            }
            else {
                col++;
            }

            break;

        default:
            return;
    }

    event.preventDefault();

    if (
        row < 0 ||
        row >= ROWS ||
        col < 0 ||
        col >= COLS
    ) {
        return;
    }

    const targetId =
        `${String.fromCharCode(
            65 + col
        )}${row + 1}`;

    const target =
        document.querySelector(
            `[data-cell="${targetId}"]`
        );

    if (target) {
        target.focus();
        target.select();
    }
}

function saveSheet() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            getAllValues()
        )
    );
}

function loadSheet() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!saved) return;

    const values =
        JSON.parse(saved);

    Object.entries(values)
        .forEach(([cellId, value]) => {

            setCellValue(
                cellId,
                value
            );

        });
}

function clearSheet() {

    if (
        !confirm(
            "Clear all saved values?"
        )
    ) {
        return;
    }

    localStorage.removeItem(
        STORAGE_KEY
    );

    document
        .querySelectorAll(
            "[data-cell]"
        )
        .forEach(cell => {

            cell.value = "";

        });

    updateGrade();
}

function updateGrade() {

    const values =
        getAllValues();

    /*
     * =====================================================
     * PLACE YOUR GRADE CALCULATION LOGIC HERE
     * =====================================================
     */

    const hw1 =
        Number(values.A1) || 0;

    const hw2 =
        Number(values.B1) || 0;

    const exampleTotal =
        hw1 + hw2;

    document
        .getElementById(
            "finalGrade"
        )
        .textContent =
        exampleTotal;

    /*
    Example:

    const grade =
        (Number(values.B2)||0) * 0.1 +
        (Number(values.C2)||0) * 0.2 +
        (Number(values.D2)||0) * 0.3;

    document.getElementById(
        "finalGrade"
    ).textContent =
        grade.toFixed(2);
    */
}