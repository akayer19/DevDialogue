console.log('Script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve postId attribute from the comment box
    const commentBoxes = document.querySelectorAll('.comment-box');
    commentBoxes.forEach(function(commentBox) {
        const postId = commentBox.getAttribute('data-post-id');

        // Log the comment box and its children for debugging
        console.log('Comment box:', commentBox);
        console.log('Children:', commentBox.children);

        // Add event listener for submit button click
        const submitButton = commentBox.querySelector('button[id^="submit-button-"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(event) {
                event.preventDefault();
                submitComment(postId);
            });
        } else {
            console.error('Submit button not found in comment box');
        }
    });
    console.log('DOMContentLoaded event fired');
});

function handlePostClick(event, postId) {
    // Prevent the default link behavior
    event.preventDefault();

    // Find the comment box for the clicked post
    const commentBox = document.getElementById(`comment-box-${postId}`);

    // Check if the commentBox element exists
    if (commentBox) {
        // Toggle the visibility of the comment box
        if (commentBox.style.display === 'block') {
            commentBox.style.display = 'none';
        } else {
            commentBox.style.display = 'block';
        }
    } else {
        console.error(`Comment box for post with ID ${postId} not found`);
    }
}

function submitComment(postId) {
    const commentTextarea = document.getElementById(`comment-textarea-${postId}`);
    if (!commentTextarea) {
        console.error('Comment textarea not found in comment box');
        return;
    }

    const commentContent = commentTextarea.value;
    console.log('Comment textarea value:', commentContent); // Log the content of the textarea

    if (!commentContent.trim()) {
        console.error('Comment cannot be empty');
        return;
    }

    // Log the data just before sending it
    console.log(`Submitting for postId: ${postId} with comment: ${commentContent}`);

    const formData = new FormData();
    formData.append('comment', commentContent);

    fetch(`/post/${postId}/comment`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }
        return response.json();
    })
    .then(data => {
        console.log('Comment submitted:', data); // Log the server's response data
    })
    .catch(error => {
        console.error('Error submitting comment:', error); // Log any errors that occur
    });
}



