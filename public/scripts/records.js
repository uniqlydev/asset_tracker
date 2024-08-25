let currentRealId = null; // Variable to store the real-id of the clicked record

document.addEventListener('DOMContentLoaded', function() {
    var downArrow = document.getElementById("btn1");
    var upArrow = document.getElementById("btn2");

    // Textarea
    const textarea = document.getElementById('comment-area');

    textarea.addEventListener('input', function() {
        this.style.height = 'auto'; // Reset height to auto to get accurate scroll height
        this.style.height = `${this.scrollHeight}px`; // Adjust height based on content
    });

    // Input form on press "enter"
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            // Capture the current value before resetting
            const commentText = textarea.value;

            console.log(commentText); // Log the current value

            createComment(commentText); // Pass the current value to createComment

            // Clear the textarea and reset its height
            this.value = '';
            this.style.height = 'auto'; // Reset height to auto to get accurate scroll height
            this.style.height = `${this.scrollHeight}px`; // Adjust height based on content
        }
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

            // Store the real-id for later use
            currentRealId = record.getAttribute('real-id');

            console.log('Clicked record:', currentRealId);

            // Load comments for the selected record
            loadComments(currentRealId);

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

// Function to create a comment
function createComment(comment) {
    if (currentRealId) {
        fetch('/api/assets/comment', {
            method: 'POST',
            body: JSON.stringify({
                asset_id: currentRealId, // Send the currentRealId as asset_id
                comment: comment
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Comment successfully created!');

            // Send the new comment to the WebSocket server with the email from the server response
            const wsData = {
                type: 'new-comment',
                asset_id: data.asset_id,
                comment: data.comment,
                useremail: data.useremail, // Use the user email from the server response
                created_at: data.created_at
            };
            ws.send(JSON.stringify(wsData));

            // Optionally, you can also append the comment to the comment list
            const commentsList = document.querySelector('.comments ul');
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="comment-item">
                    <h3>${data.useremail}</h3>
                    <p>${data.comment}</p>
                    <small>${new Date(data.created_at).toLocaleString()}</small>
                </div>
            `;
            commentsList.appendChild(li);
        })
        .catch(error => {
            console.error('Error creating comment:', error);
        });
    } else {
        console.error('No real-id available');
    }
}

// Function to load comments for a specific record
function loadComments(assetId) {
    fetch(`/api/assets/${assetId}/comments`)
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.querySelector('.comments ul');
            commentsList.innerHTML = ''; // Clear existing comments

            comments.forEach(comment => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="comment-item">
                        <h3>${comment.useremail}</h3>
                        <p>${comment.comment}</p>
                        <small>${new Date(comment.created_at).toLocaleString()}</small>
                    </div>
                `;
                commentsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}
