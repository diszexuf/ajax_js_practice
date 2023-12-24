$('#add-post-button').click(function() {
    showAddModal(1);
});

$('#add-save-button').click(async () => {
    await saveNewPost();
});

function generatePostId() {
    return new Date().getTime();
}

function showAddModal() {
    const users = JSON.parse(localStorage.getItem(`users`));
    const usersData = [];
    for(const user of users) {
        usersData.push(user);
    }

    var userSelector = '<h5 id="edit-lables">Выберите пользователя:</h5>\
                        <select id="user-select" class="form-control">';
    usersData.forEach(userOption => {
        userSelector += `<option value="${userOption.id}">${userOption.name}</option>`;
    });
    userSelector += '</select>';

    var editFormHtml = '<h5 id="edit-labels">Заголовок</h5><p>\
                        <input type="text" id="edit-title" class="edit-title" value=""><br>\
                        <h5 id="edit-labels">Текст</h5><p>\
                        <textarea id="edit-body" class="edit-body"></textarea><br>\
                        ' + userSelector + '<br>\
                        <button type="button" class="save-button btn btn-primary" data-dismiss="modal" onclick="saveNewPost()">Сохранить</button>\
                        <button type="button" class="cancel-button btn btn-secondary" data-dismiss="modal">Отмена</button>';

    $('#editModalBody').html(editFormHtml);
    $('#editModal').modal('show');
}

async function saveNewPost(postId = generatePostId()) {
    var title = $('#edit-title').val();
    var body = $('#edit-body').val();
    var userId = parseInt($('#user-select').val(), 10);

    var post = {
        id: postId,
        title: title,
        body: body,
        userId: userId,
    };

    addUserPostToLocalStorage(post);
    await displayPostWithUser(post, false);
}

function addUserPostToLocalStorage(post) {
    const userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
    const items = userPosts.filter(userPost => userPost.id === post.id);
    if(items.length) {
        return;
    }

    userPosts.push(post);
    localStorage.setItem('user_posts', JSON.stringify(userPosts));
}
