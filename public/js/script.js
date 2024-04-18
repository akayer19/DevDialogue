console.log('Script loaded');

// Submits a comment to the server for a specific post
function submitComment(postId) {
    console.log('Submitting comment for post:', postId);
    var commentText = document.getElementById('commentContent').value;

    fetch(`/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming you use token-based auth
        },
        body: JSON.stringify({ content: commentText }) // Send comment content in the request body
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to submit comment');
        }
    })
    .then(data => {
        console.log('Comment submitted:', data);
        // Optionally, you can update the UI to display the submitted comment
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
    });
}

// Toggles the visibility of the comment box for a specific post
function toggleCommentBox(postId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('postId:', postId); // Log the postId value
    
    var element = document.getElementById('comment-box-' + postId);
    console.log('Element:', element);
    if (element) {
        element.style.display = (element.style.display === 'none' ? 'block' : 'none');
    } else {
        console.error('Element with ID comment-box-' + postId + ' not found');
    }
}
// Submits a comment to the server for a specific post
function submitComment(postId) {
    console.log('Submitting comment for post:', postId);
    var commentText = document.getElementById('commentContent').value;

    fetch(`/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming you use token-based auth
        },
        body: JSON.stringify({ content: commentText }) // Send comment content in the request body
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to submit comment');
        }
    })
    .then(data => {
        console.log('Comment submitted:', data);
        // Optionally, you can update the UI to display the submitted comment
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
    });
}

// Handles the click on a post title, determining if the user is logged in
function handlePostClick(event, userLoggedIn) {
    console.log('Handling post click event');
    console.log('User logged in:', userLoggedIn); // Log whether the user is logged in
    event.preventDefault();  // Prevent default anchor behavior
    event.stopPropagation(); // Stop event bubbling

    if (!userLoggedIn) {
        console.log('Please log in to view post comments.'); // Or redirect to login
        setTimeout(() => {
            window.location.href = '/login'; // Redirects to login if not logged in
        }, 1000); // Delay of 1000 milliseconds (1 second)
    } else {
        console.log('User is logged in. Proceed with default behavior or further actions.');
        // You can add more debugging logs or function calls here if needed
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    const userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')); // Convert string to boolean
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    
    if (userLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
});
