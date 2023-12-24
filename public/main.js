
$(document).ready(function () {
    loadPostsWithUsers();
});

// posts funcs

async function loadPostsWithUsers() {
    try {
        showLoader();

        const posts = await getPosts();
        for(const post of posts) {
            await displayPostWithUser(post);
        }

    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
    } finally {
        hideLoader();
    }
}

async function getPosts() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error(`Ошибка при загрузке постов: ${response.status} ${response.statusText}`);
    }
    let posts = await response.json();

    const userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
    if(userPosts.length) {
        posts = posts.concat(userPosts);
    }

    return posts;
}

async function getUser(userId) {
    let data = localStorage.getItem(`users`);
    if(!data) {
        response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке юзеров: ${response.status} ${response.statusText}`);
        }
        const users = await response.text();
        localStorage.setItem(`users`, users);
        data = users;
    }

    data = JSON.parse(data);
    const user = data.filter(user => user.id === userId)[0];

    return user ?? null;
}

async function displayPostWithUser(post, prepend) {
    // const storedData = JSON.parse(localStorage.getItem(`post_${post.id}`));
    // const isImportant = storedData ? storedData.post.important : false;
    const isImportant = localStorage.getItem(`important_post_${post.id}`) === '1';
    const user = await getUser(post.userId);

    const postBlock = $(`
        <div class="post" data-post-id="${post.id}" data-user-id="${post.userId}" data-important="${isImportant}">
            <div class="delete-post">Удалить</div>
            <input type="checkbox" class="important-post" ${isImportant ? 'checked' : ''}>
            <div class="post-title"><h2>${post.title}</h2></div>
            <div class="post-body"><p>${post.body}</p></div>
            <div class="post-user"><p>Creator: ${user.name}</p></div>
        </div>
    `);

    postBlock.find('.delete-post').click(() => {
        deletePost(post);
    });

    postBlock.find('.important-post').change(() => {
        togglePostImportance(post, postBlock);
    });

    if (prepend || isImportant) {
        $('#posts-container').prepend(postBlock);
    } else {
        $('#posts-container').append(postBlock);
    }

}


// Функция для удаления поста с подтверждением
function deletePost(post) {
    const postId = post.id;

    if (`important_post_${postId}` in localStorage) {
        $('#deleteModal').modal('show');

        $('#deletePostButton').click(function () {
            localStorage.removeItem(`important_post_${postId}`);

            const userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
            const items = userPosts.filter(userPost => userPost.id !== postId);
            localStorage.setItem('user_posts', JSON.stringify(items));

            $(`.post[data-post-id="${postId}"]`).remove();

            $('#deleteModal').modal('hide');
        });

    } else {
        localStorage.removeItem(`important_post_${postId}`);
        const userPosts = JSON.parse(localStorage.getItem('user_posts')) || [];
        const items = userPosts.filter(userPost => userPost.id !== postId);
        localStorage.setItem('user_posts', JSON.stringify(items));

        $(`.post[data-post-id="${postId}"]`).remove();
    }



}

function showDeleteModal() {
    $('#delteModal').modal('show');
}


// Функция для изменения важности поста
function togglePostImportance(post, postBlock) {
    const postId = post.id;
    const key = `important_post_${postId}`;

    if(localStorage.getItem(key)) {
        localStorage.removeItem(key);
    }
    else {
        localStorage.setItem(key, 1);
    }

    const checkbox = postBlock.find('.important-post');

    // Перемещение в начало или конец списка в зависимости от важности
    movePost(postBlock, checkbox);
}

// Функция для перемещения поста в начало или конец списка
function movePost(postBlock, checkbox) {
    const postId = postBlock.data('post-id');


    // Перемещаем пост в начало или конец списка в зависимости от важности
    if (checkbox.prop('checked')) {
        $('#posts-container').prepend(postBlock);
    } else {
        $('#posts-container').append(postBlock);
    }

}

function showLoader() {
    $('#loader-container').show();
}

function hideLoader() {
    $('#loader-container').hide();
}


