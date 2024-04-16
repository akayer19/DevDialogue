function toggleCommentBox(postId) {
    var element = document.getElementById('comment-box-' + postId);
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function submitComment(postId) {
    var commentBox = document.getElementById('comment-box-' + postId);
    var commentText = commentBox.querySelector('textarea').value;
    // Implement submission logic here, e.g., using Fetch API to send data to your server
    console.log("Submitting comment for post " + postId + ": " + commentText);
}
