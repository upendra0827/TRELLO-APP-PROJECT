
const lists = document.querySelector('#lists')
const form = document.querySelector('form')
const list_name = document.querySelector('#list_name')
const delete_option = document.querySelector('.delete')
const p = document.querySelector('p')
let cards_array = []
const article_section = document.querySelector('#articles')
let temp_obj = {}
let clicks_on_edit = 0
let card_ids = {}

form.addEventListener('submit', function (event) {
    event.preventDefault()

        const list_name_value = list_name.value

        if (list_name_value.trim() == '') {
            alert('Enter list name')
        } else {

            const new_list = document.createElement('section')
            const list_name_li = document.createElement('li')
            list_name_li.innerText = list_name.value
            new_list.append(list_name_li)
            const cards = document.createElement('div')
            cards.setAttribute('class', list_name.value)
            const cards_form = document.createElement('form')
            const input = document.createElement('input')
            input.setAttribute('class', list_name.value)
            input.setAttribute('placeholder', 'Add u r card')
            cards_form.append(input)
            const add_button = document.createElement('button')
            const delete_button = document.createElement('button')
            delete_button.setAttribute('class', 'delete')
            add_button.innerText = 'Add'
            delete_button.innerText = 'Delete list'
            new_list.append(cards)
            cards_form.append(add_button)
            new_list.append(cards_form)
            new_list.append(delete_button)
            
            lists.append(new_list)
            
            form.reset()
        }
    

    fetch(`https://api.trello.com/1/lists?name=${list_name_value}&idBoard=623974ab7a8fab7b1bd30a1f&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
        method: 'POST'
    })
        .then(response => {
            console.log(`Response: ${response.status} ${response.statusText}`);
            return response.text();
        })
        .then(text => {
            let listId = JSON.parse(text)
            temp_obj[list_name_value] = listId['id']
        })
        .catch(err => console.error(err));
})


// DELETE LISTS

lists.addEventListener('click', function (event) {
    if (event.target.innerText === 'Delete list') {
        event.target.parentNode.remove()

        fetch(`https://api.trello.com/1/lists/${temp_obj[event.target.parentNode.children[0].innerText]}/closed?value=true&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
            method: 'PUT'
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .catch(err => console.error(err));
        // document.querySelector()

        const articles_to_delete = document.querySelectorAll(`.article_${event.target.parentNode.firstChild.innerText}`)

        articles_to_delete.forEach(article => {
            console.log(article.firstChild.getAttribute('class').split(' ')[0])
            localStorage.removeItem(article.firstChild.getAttribute('class').split(' ')[0])
            console.log(article.firstChild.getAttribute('class').split(' ')[0])
            article.remove()
        })

        console.log(document.querySelectorAll('#lists'))
        // console.log(typeof document.querySelector('#lists').firstChild)
        // if (document.querySelectorAll('#lists').firstChild == " ") {
            // localStorage.clear()
        // }
    }
})

// CREATE CARDS

lists.addEventListener('click', function (event) {
    event.preventDefault()
    if (event.target.innerText === 'Add') {
        const card_value = event.target.parentNode.firstChild.value

        if (card_value.trim() == '') {
            alert('enter card name')
        } else {

            const card_div_tag = document.createElement('div')
            
            console.log(event.target.previousElementSibling.getAttribute('class'))
            card_div_tag.setAttribute('class', `card_${event.target.previousElementSibling.getAttribute('class')}`)
            card_div_tag.setAttribute('store', 'container')
            const card_p_tag = document.createElement('p')
            card_p_tag.setAttribute('clicks_for_description', 0)
            card_p_tag.setAttribute('class', 'draggable')
            card_p_tag.setAttribute('draggable', true)
            // const card_value = event.target.parentNode.firstChild.value
            card_p_tag.innerText = card_value
            localStorage.setItem(card_value, 0)
            const cards_container = event.target.parentNode.previousElementSibling
            card_div_tag.append(card_p_tag)
            cards_container.append(card_div_tag)
            event.target.parentNode.reset()
        }
        const list_name = event.target.parentNode.previousElementSibling.parentNode.firstChild.innerText

        let name_of_list = event.target.parentNode.firstChild.getAttribute('class')
        // console.log(temp_obj[name_of_list])

        fetch(`https://api.trello.com/1/cards?name=${card_value}&idList=${temp_obj[name_of_list]}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(text => {
                let card_id = JSON.parse(text)
                card_ids[card_value] = card_id['id']
            })
            .catch(err => console.error(err));

        const containers = document.querySelectorAll('div[store]')

        const draggables = document.querySelectorAll('.draggable')

        console.log(containers)
        draggables.forEach(draggable => {

            draggable.addEventListener('dragstart', dragStart)
        })

        containers.forEach(container => {
            container.addEventListener('dragover', dragOver);
            container.addEventListener('dragenter', dragEnter);
            container.addEventListener('dragleave', dragLeave);
            container.addEventListener('drop', dragDrop);
        });

        function dragOver(e) {
            e.preventDefault()
            console.log('drag over');
        }
        function dragEnter() {
            console.log('drag entered');
        }
        function dragLeave() {
            console.log('drag left');
        }
        function dragDrop() {
            console.log('drag dropped');
        }

        // let dragItem = null;

        function dragStart() {
            console.log('drag started');
            dragItem = this;
            setTimeout(() => this.className = 'invisible', 0)
        }

        function dragEnd() {
            console.log('drag ended');
            this.className = 'item'
            dragItem = null;
        }

        function dragDrop() {
            console.log('drag dropped');
            this.append(dragItem);
        }
    }
})

// CREATING DESCRIPTION AND COMMENT BOX

lists.addEventListener('click', function (event) {
    if (event.target.tagName === 'P' && event.target.getAttribute('clicks_for_description') == 0) {

        localStorage.setItem(event.target.innerText, 1)
        event.target.setAttribute('clicks_for_description', 1)
        const description_comments_div_tag = document.createElement('div')
        const name_of_card_tag = document.createElement('p')
        description_comments_div_tag.setAttribute('class', event.target.innerText)
        description_comments_div_tag.classList.add('describe')

        name_of_card_tag.innerText = event.target.innerText
        name_of_card_tag.setAttribute('class', 'name_of_card')

        const description_div_tag = document.createElement('div')
        const description_and_close = document.createElement('div')
        const description_h2_tag = document.createElement('h2')
        description_h2_tag.innerText = 'Description'
        const description_close = document.createElement('div')
        const description_p_tag = document.createElement('p')

        description_and_close.setAttribute('class', 'describe_close')

        description_close.setAttribute('class', 'close_description')
        description_close.innerHTML = '&times;'
        const description_buttons = document.createElement('div')
        const description_edit_button = document.createElement('button')
        const description_close_button = document.createElement('div')

        description_buttons.setAttribute('class', 'close_block')
        description_edit_button.innerText = 'edit'
        description_close_button.innerHTML = '<div>&times;</div>'
        description_close_button.setAttribute('class', 'close_button')


        description_and_close.append(description_h2_tag)
        description_and_close.append(description_close)
        // description_div_tag.append(description_h2_tag)
        description_div_tag.append(description_and_close)
        description_div_tag.append(description_p_tag)
        description_buttons.append(description_edit_button)
        description_buttons.append(description_close_button)
        description_div_tag.append(description_buttons)

        const comments_div = document.createElement('div')
        const coments_store = document.createElement('div')
        coments_store.setAttribute('class', 'store_comments')
        const comments_h2_tag = document.createElement('h2')
        comments_h2_tag.innerText = 'Commments'

        const comments_input = document.createElement('p')
        comments_input.contentEditable = true
        const comments_button = document.createElement('button')
        comments_button.setAttribute('class', 'comment_btn')

        comments_button.innerText = 'add'


        comments_div.append(comments_h2_tag)
        comments_div.append(coments_store)
        comments_div.append(comments_input)
        comments_div.append(comments_button)

        description_comments_div_tag.append(name_of_card_tag)
        description_comments_div_tag.append(description_div_tag)
        description_comments_div_tag.append(comments_div)

        const div_to_store_each_lists_description = document.createElement('div')

        let parent_of_card = event.target.parentNode

        div_to_store_each_lists_description.setAttribute('class', `article_${parent_of_card.parentNode.previousElementSibling.innerText}`)

        div_to_store_each_lists_description.append(description_comments_div_tag)

        article_section.append(div_to_store_each_lists_description)

    }

    if (event.target.getAttribute('clicks_for_description') == 1) {
        document.querySelector(`.${event.target.innerText}`).style.display = 'block'
    }

})


let clicks_on_card = 0

article_section.addEventListener('click', function (event) {


    if (event.target.getAttribute('class') == 'close_description') {
        let only_description_box = event.target.parentNode
        let description_box = only_description_box.parentNode
        description_box.parentNode.style.display = 'none'
    }

})


article_section.addEventListener('click', function (event) {

    if (event.target.parentNode.getAttribute('class') === 'close_block') {
        event.target.parentNode.previousElementSibling.contentEditable = true
        event.target.innerText = 'save'
        event.target.nextElementSibling.style.display = 'block'

        // console.log(event.target.parentNode.previousElementSibling.parentNode.previousElementSibling.innerText)

    }
})

article_section.addEventListener('click', function (event) {

    if (event.target.parentNode.getAttribute('class') === 'close_button') {
        event.target.parentNode.previousElementSibling.innerText = 'edit'
        event.target.parentNode.style.display = 'none'


        console.log()
        fetch(`https://api.trello.com/1/cards/${card_ids[event.target.parentNode.previousElementSibling.parentNode.previousElementSibling.parentNode.previousElementSibling.innerText]}?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8&desc=${event.target.parentNode.previousElementSibling.parentNode.previousElementSibling.innerText}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            // .then(text => console.log(text))
            .catch(err => console.error(err));
    }
})

article_section.addEventListener('click', function (event) {

    if (event.target.getAttribute('class') === 'comment_btn') {

        if (event.target.previousElementSibling.innerText.trim() !== '') {

            const comment_store_p_tag = document.createElement('article')
            comment_store_p_tag.innerText = event.target.previousElementSibling.innerText
            event.target.parentNode.children[1].append(comment_store_p_tag)

            console.log(card_ids)
            console.log(event.target.previousElementSibling.parentNode.previousElementSibling.parentNode.firstChild.innerText)
            fetch(`https://api.trello.com/1/cards/${card_ids[event.target.previousElementSibling.parentNode.previousElementSibling.parentNode.firstChild.innerText]}/actions/comments?text=${event.target.previousElementSibling.innerText}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    console.log(
                        `Response: ${response.status} ${response.statusText}`
                    );
                    return response.text();
                })
                // .then(text => console.log(text))
                .catch(err => console.error(err));

            event.target.previousElementSibling.innerText = ''
        }
    }
})

// let recreated_lists = ''
const recreate_lists = data => {

    data.forEach(element => {

        let list_name_after_reload = element['name']
        temp_obj[list_name_after_reload] = element['id']

        const new_list_after_reload = document.createElement('section')
        const list_name_li = document.createElement('li')
        list_name_li.innerText = list_name_after_reload
        new_list_after_reload.append(list_name_li)
        const cards = document.createElement('div')
        cards.setAttribute('class', list_name_after_reload)
        const cards_form = document.createElement('form')
        const input = document.createElement('input')
        input.setAttribute('class', list_name_after_reload)
        input.setAttribute('placeholder', 'Add u r card')
        cards_form.append(input)
        const add_button = document.createElement('button')
        const delete_button = document.createElement('button')
        delete_button.setAttribute('class', 'delete')
        add_button.innerText = 'Add'
        delete_button.innerText = 'Delete list'
        new_list_after_reload.append(cards)
        cards_form.append(add_button)
        new_list_after_reload.append(cards_form)
        new_list_after_reload.append(delete_button)

        console.log(new_list_after_reload)
        console.log(lists)
        document.querySelector('#lists').append(new_list_after_reload)


        fetch(`https://api.trello.com/1/lists/${temp_obj[list_name_after_reload]}/cards?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
            })
            .then(text => {

                let cards_data = JSON.parse(text)
                cards_data.forEach(datacard => {
                    recreate_card(list_name_after_reload, datacard['name'], datacard['id'])

                    card_ids[datacard['name']] = datacard['id']
                })
            })
            .catch(err => console.log(err));
    });
}


const recreate_card = (list_name_of_card, card_name, id_of_card) => {

    let comments_data_store

    const card_div_tag = document.createElement('div')
    card_div_tag.setAttribute('store', 'container')
    const card_p_tag = document.createElement('p')
    // card_p_tag.setAttribute('clicks_for_description', 0)
    card_p_tag.setAttribute('clicks_for_description', localStorage.getItem(card_name))
    card_p_tag.setAttribute('draggable', true)
    card_p_tag.innerText = card_name
    card_p_tag.setAttribute('class', 'draggable')

    card_div_tag.append(card_p_tag)

    console.log(document.querySelector(`.${list_name_of_card}`))
    console.log(card_div_tag)
    document.querySelector(`.${list_name_of_card}`).append(card_div_tag)

    // comments_data_store = get_comments(id_of_card)

    fetch(`https://api.trello.com/1/cards/${id_of_card}?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {

        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => {
            let data = JSON.parse(text)
            return data['desc']

            if (data['desc'].trim() !== '') {

                recreate_description(list_name_of_card, card_name, data['desc'], id_of_card)
            }
        })

        .then(data => { get_comments(list_name_of_card, card_name, id_of_card, data) })
}

// RECREATE DESCRIPTION

const recreate_description = (list_name_of_card, card_name, description, id_of_card, comments = []) => {

    const description_comments_div_tag = document.createElement('div')
    const name_of_card_tag = document.createElement('p')
    description_comments_div_tag.setAttribute('class', card_name)
    description_comments_div_tag.classList.add('describe')
    description_comments_div_tag.classList.add(`article_${list_name_of_card}`)
    name_of_card_tag.innerText = card_name
    name_of_card_tag.setAttribute('class', 'name_of_card')
    const description_div_tag = document.createElement('div')
    const description_and_close = document.createElement('div')
    const description_h2_tag = document.createElement('h2')
    description_h2_tag.innerText = 'Description'
    const description_close = document.createElement('div')
    const description_p_tag = document.createElement('p')

    description_p_tag.innerText = description

    description_and_close.setAttribute('class', 'describe_close')
    description_close.setAttribute('class', 'close_description')
    description_close.innerHTML = '&times;'
    const description_buttons = document.createElement('div')
    const description_edit_button = document.createElement('button')
    const description_close_button = document.createElement('div')
    description_buttons.setAttribute('class', 'close_block')
    description_edit_button.innerText = 'edit'
    description_close_button.innerHTML = '<div>&times;</div>'
    description_close_button.setAttribute('class', 'close_button')
    description_and_close.append(description_h2_tag)
    description_and_close.append(description_close)
    // description_div_tag.append(description_h2_tag)
    description_div_tag.append(description_and_close)
    description_div_tag.append(description_p_tag)
    description_buttons.append(description_edit_button)
    description_buttons.append(description_close_button)
    description_div_tag.append(description_buttons)
    const comments_div = document.createElement('div')
    const coments_store = document.createElement('div')
    coments_store.setAttribute('class', 'store_comments')
    const comments_h2_tag = document.createElement('h2')
    comments_h2_tag.innerText = 'Commments'

    const comments_input = document.createElement('p')
    comments_input.contentEditable = true
    const comments_button = document.createElement('button')
    comments_button.setAttribute('class', 'comment_btn')
    comments_button.innerText = 'add'
    comments_div.append(comments_h2_tag)
    comments_div.append(coments_store)

    if (comments != []) {
        comments.forEach(each_comment => {
            const each_comment_p = document.createElement('p')
            each_comment_p.innerText = each_comment['data']['text']
            comments_div.append(each_comment_p)
        })
    }

    comments_div.append(comments_input)
    comments_div.append(comments_button)
    description_comments_div_tag.append(name_of_card_tag)
    description_comments_div_tag.append(description_div_tag)
    description_comments_div_tag.append(comments_div)
    article_section.append(description_comments_div_tag)

    console.log(comments)

    document.querySelector(`.${card_name}`).style.display = 'none'
}


// Get comments

const get_comments = (list_name_of_card, card_name, id_of_card, desc_data) => {

    fetch(`https://api.trello.com/1/cards/${id_of_card}/actions?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {

        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => {
            let comment_data = JSON.parse(text)

            if (desc_data !== '' && comment_data == []) {

                recreate_description(list_name_of_card, card_name, desc_data, id_of_card)
            }
            else if (desc_data !== '') {

                recreate_description(list_name_of_card, card_name, desc_data, id_of_card, comment_data)
            }
            else if (desc_data == '' && comment_data != []) {
                recreate_description(list_name_of_card, card_name, desc_data, id_of_card, comment_data)   
            }
        })
        .catch(err => console.log(err))
}

// To get the board

fetch('https://api.trello.com/1/boards/623974ab7a8fab7b1bd30a1f/lists?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => {
        console.log(
            `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
    })
    .then(text => {
        let lists_data = JSON.parse(text)

        recreate_lists(lists_data)
    })
    .catch(err => console.log(err));

// localStorage.clear()
