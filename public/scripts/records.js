document.addEventListener('DOMContentLoaded', function() {
    var downArrow = document.getElementById("btn1");
    var upArrow = document.getElementById("btn2");

    // Textarea
    const textarea = document.querySelector('textarea.dynamic-textarea');

    textarea.addEventListener('input', function() {
        this.style.height = 'auto'; // Reset height to auto to get accurate scroll height
        this.style.height = `${this.scrollHeight}px`; // Adjust height based on content
    });

    // Handle arrow button clicks for list scrolling
    downArrow.onclick = function () {
        'use strict';
        document.getElementById("first-list").style = "top:-620px";
        document.getElementById("second-list").style = "top:-620px";
        downArrow.style = "display:none";
        upArrow.style = "display:block";
    };

    upArrow.onclick = function () {
        'use strict';
        document.getElementById("first-list").style = "top:0";
        document.getElementById("second-list").style = "top:80px";
        upArrow.style = "display:none";
        downArrow.style = "display:block";
    };

    // Handle record clicks to display sidebar
    const records = document.querySelectorAll('.record-item');
    const sidebar = document.getElementById('right-side-panel');
    const info = document.getElementById('record-info');
    const originSite = document.getElementById('origin-site');
    const destinationSite = document.getElementById('destination-site');
    const createdBy = document.getElementById('created-by');
    const status = document.getElementById('status');

    records.forEach(record => {
        record.addEventListener('click', function() {
            // Populate the sidebar with data from the clicked record
            info.textContent = record.getAttribute('data-description');
            originSite.textContent = record.getAttribute('data-origin_site_name');
            destinationSite.textContent = record.getAttribute('data-destination_site_name');
            createdBy.textContent = record.getAttribute('data-created_by');
            status.textContent = "In Process"; // Example status, adjust as needed

            // Make the sidebar visible
            sidebar.style.display = 'block';
        });
    });
});

// Function to close the sidebar
function closePanel() {
    const sidebar = document.getElementById('right-side-panel');
    sidebar.style.display = 'none';
}
