const gridView = document.getElementById("gridView");
const listView = document.getElementById("listView");

const gridViewer = document.getElementById("viewer");
const listViewer = document.getElementById("listViewer");

gridView.addEventListener("click", () => {
    gridView.setAttribute("class", "selectedView bi bi-grid-fill");
    listView.setAttribute("class", "notSelectedView bi bi-list-ul");

    gridViewer.style.display = "flex";
    listViewer.style.display = "none"

    document.cookie = 'viewerMode=' + 'gridView';
    console.log(document.cookie);
});

listView.addEventListener("click", () => {
    listView.setAttribute("class", "selectedView bi bi-list-ul");
    gridView.setAttribute("class", "notSelectedView bi bi-grid-fill");

    gridViewer.style.display = "none";
    listViewer.style.display = "block";

    document.cookie = "viewerMode=" + "listView";
    console.log(document.cookie);
});

function checkViewMode(){
    if (window.innerWidth < 1024 ) {
        gridView.style.display = "none";
        listView.style.display = "none";

        gridViewer.style.display = "none";
        listViewer.style.display = "none";
    } else {
        if (document.cookie.match(/viewerMode=gridView/i)) {
          gridView.setAttribute("class", "selectedView bi bi-grid-fill");
          listView.setAttribute("class", "notSelectedView bi bi-list-ul");

          gridViewer.style.display = "flex";
          listViewer.style.display = "none";
        } else {
          listView.setAttribute("class", "selectedView bi bi-list-ul");
          gridView.setAttribute("class", "notSelectedView bi bi-grid-fill");

          gridViewer.style.display = "none";
          listViewer.style.display = "block";
        }
    }
}

checkViewMode();