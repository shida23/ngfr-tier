document.addEventListener("DOMContentLoaded", () => {
    const imageArea = document.querySelector(".image-area");
    const filterBtn = document.getElementById("filter-btn");
    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    let allData = [];

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            allData = data;
            renderImages(allData);
        })
        .catch(error => console.error("Error loading data.json:", error));

    filterBtn.addEventListener("click", () => {
        const excludedTags = Array.from(checkboxes)
            .filter(checkbox => !checkbox.checked)
            .map(checkbox => checkbox.id);

        const filteredData = allData.filter(item => {
            if (!item.tags) return true;
            return !item.tags.some(tag => excludedTags.includes(tag));
        });

        document.querySelectorAll(".tier .image-item").forEach(imageItem => {
            imageArea.appendChild(imageItem);
        });

        renderImages(filteredData);

        const accordion = document.querySelector(".accordion");
        accordion.open = false;
    });

    function renderImages(data) {
        imageArea.innerHTML = "";
        data.forEach(item => {
            if (item.src) {
                const imgDiv = document.createElement("div");
                imgDiv.classList.add("image-item");
                imgDiv.setAttribute("draggable", "true");

                const img = document.createElement("img");
                img.src = item.src;
                img.alt = `${item.name1} (${item.name2})`;

                imgDiv.appendChild(img);
                imageArea.appendChild(imgDiv);
            }
        });

        setupDragAndDrop();
    }

    function setupDragAndDrop() {
        Sortable.create(document.querySelector(".image-area"), {
            group: "shared",
            animation: 0,
            draggable: ".image-item"
        });

        document.querySelectorAll(".tier").forEach(tier => {
            Sortable.create(tier, {
                group: "shared",
                animation: 0,
                draggable: ".image-item",
                onAdd: function (evt) {
                    const draggedItem = evt.item;
                    const targetTier = evt.to;

                    if (!targetTier.classList.contains("tier")) {
                        evt.from.appendChild(draggedItem);
                        return;
                    }

                    adjustTierHeight(targetTier);
                }
            });
        });
    }

    function adjustTierHeight(tier) {
        const tierWidth = tier.clientWidth;
        const imageWidth = 60;
        const imagesPerRow = Math.floor(tierWidth / imageWidth);
        const imageCount = tier.querySelectorAll(".image-item").length;
        const rows = Math.ceil(imageCount / imagesPerRow);

        tier.style.minHeight = `${rows * imageWidth}px`;
    }
});
