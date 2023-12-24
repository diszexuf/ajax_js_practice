// EDIT MODAL SCRIPTS

$(document).ready(function() {
    $('#posts-container').on('click', '.post', function(event) {
        const clickedElement = $(event.target);
        if (clickedElement.hasClass('delete-post') || clickedElement.hasClass('important-post')) {
            return;
        }
        const postBlock = $(this);
        const post = {
            id: postBlock.data('post-id'),
            title: postBlock.find('.post-title h2').text(),
            body: postBlock.find('.post-body p').text(),
            userId: postBlock.data('user-id'),
        };
        showEditModal(post);
    });
});

$('#delete-post-button').on('click', function () {
    deletePost();
});


$('#editModalBody').on('click', '#edit-save-button', function () {
    saveEditPost();
});

function saveEditPost() {
    // Получаем данные из модального окна
    const postId = parseInt($('#edit-save-button').data('post-id'), 10);
    const title = $('#edit-title').val();
    const body = $('#edit-body').val();
    const userId = parseInt($('#user-select').val(), 10);

    // var postDataWithUser = JSON.parse(localStorage.getItem(`post_${postId}`));
    // if (postDataWithUser) {
    //     postDataWithUser.post.title = title;
    //     postDataWithUser.post.body = body;
    //     postDataWithUser.post.userId = userId;
    //     postDataWithUser.user = findUserById(usersData, userId);
    //     localStorage.setItem(`post_${postId}`, JSON.stringify(postDataWithUser));
    // }

    // Обновляем отображение на странице
    updatePostDisplay(postId);

    // Обновляем данные в localStorage
    const userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];

    for(let i = 0; i < userPosts.length; i++) {
        if(userPosts[i].id === postId) {
            userPosts[i].title = title;
            userPosts[i].body = body;
            userPosts[i].userId = userId;
        }
    }

    localStorage.setItem('user_posts', JSON.stringify(userPosts));
}

// Функция для обновления отображения отредактированного поста
function updatePostDisplay(postId) {
    // Находим блок поста на странице
    var postBlock = $(`.post[data-post-id="${postId}"]`);

    // Обновляем отображение данных
    postBlock.find('.post-title h2').text($('#edit-title').val());
    postBlock.find('.post-body p').text($('#edit-body').val());

    const newUserName = $('#user-select option:selected').text();

    // Обновляем отображение пользователя
    postBlock.find('.post-user p').text('Creator: ' + newUserName);
}

// Функция для поиска пользователя по ID
function findUserById(users, userId) {
    return users.find(user => user.id === parseInt(userId));
}

function showEditModal(post) {
    const users = JSON.parse(localStorage.getItem(`users`));
    const usersData = [];
    for(const user of users) {
        usersData.push(user);
    }

    var userSelector = '<h5 id="edit-lables">Выберите пользователя:</h5>\
                        <select id="user-select" class="form-control">';
    usersData.forEach(function(userOption) {
        var selectedAttr = userOption.id === post.userId ? 'selected' : '';
        userSelector += `<option value="${userOption.id}" ${selectedAttr}>${userOption.name}</option>`;
    });

    userSelector += '</select>';
    var editFormHtml = '<h5 id="edit-labels">Заголовок</h5><p>\
                        <input type="text" id="edit-title" class="edit-title" value="' + post.title + '"><br>\
                        <h5 id="edit-labels">Текст</h5><p>\
                        <textarea id="edit-body" class="edit-body">' + post.body + '</textarea><br>\
                        ' + userSelector + '<br>\
                        <button id="edit-save-button" type="button" class="save-button btn btn-primary" data-dismiss="modal" data-post-id="' + post.id + '">Сохранить</button>\
                        <button type="button" class="cancel-button btn btn-secondary" data-dismiss="modal">Отмена</button>';

    $('#editModalBody').html(editFormHtml);
    $('#editModal').modal('show');
}
