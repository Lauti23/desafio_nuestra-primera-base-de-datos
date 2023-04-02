const socket = io();

//DOM
const productsForm = document.getElementById("productsForm");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("messageInput");
const chatLogs = document.getElementById("chatHistory");
const chatBtn = document.getElementById("chatBtn");
const table = document.getElementById("table");

const submitProduct = (e) => {
    e.preventDefault();
    let name = e.target[0].value;
    let price = e.target[1].value;
    let image = e.target[2].value;
    if(name && price && image) {
        let product = {name, price, image};
        socket.emit("newProduct", product);
        productsForm.reset()
    } else {
        console.log("Faltan datos por completar")
    }
}

productsForm.addEventListener("submit", (e) => submitProduct(e))

const submitMessage = (e) => {
    e.preventDefault();
    let message = messageInput.value;
    let email = emailInput.value;
    if(email && message) {
        let date = new Date().toLocaleString();
        let chat = {email, date, message}
        console.log(chat)
        socket.emit("newMessage", chat);
    } else {
        console.log("Faltan campos por completar.")
    }
}

chatBtn.addEventListener("click", (e) => submitMessage(e))

socket.on("loadedProducts", data => {
    console.log(data)
    if(data.length === 0) {
        table.innerHTML = "<p>No hay productos almacenados.</p>"
    } else {
        data.forEach(prod => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td class="td">${prod.name}</td>
                            <td class="td">$ ${prod.price}</td>
                            <td class="td"><img class="prodImage" src=${prod.image}></td>
                            <td class="td"><button id="deleteProdBtn" class="${prod.id}">X</button></td>`;
            table.append(tr)
        })
    }
})

socket.on("product", data => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td class="td">${data.name}</td>
                    <td class="td">$ ${data.price}</td>
                    <td class="td"><img class="prodImage" src=${data.image}></td>
                    <td class="td"><button id="deleteProdBtn" class="${data.id}">X</button></td>`
    table.append(tr);
}) 

const deleteItem = (e) => {
    if(e.target.nodeName == "BUTTON") {
        let buttonClicked = e.target;
        let itemId = buttonClicked.className;
        socket.emit("deleteProduct", itemId);
    }
}
table.addEventListener("click", (e) => deleteItem(e))

socket.on("loadedMessages", data => {
    let messages = "";
    data.forEach(text => {
        messages += `<div class="fullMessage"><p class="messageBox"><span class="email"> ${text.email}</span><span class="date">[${text.date}]</span><span class="message">: ${text.message}</span></p></div>`
    })
    chatLogs.innerHTML = messages;
    messageInput.value = "";
})

socket.on("message", data => {
    console.log(data)
    let chat = document.createElement("p");
    chat.innerHTML = `<div class="fullMessage"><span class="email">${data.email}</span><span class="date">[${data.date}]:</span><span class="message"> ${data.message}</span></div>`;
    chatLogs.append(chat);
})