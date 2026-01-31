function displayAlertMessage(messages) {
  if (messages.length > 0) {
    msg.classList.add('msg-danger');

    msg.innerHTML = "";

    const ul = document.createElement("ul");

    messages.forEach(error => {
      const li = document.createElement("li");
      li.textContent = error;
      ul.appendChild(li);
    });

    msg.appendChild(ul);
    return;
  }
}

function formatDateTime(stringISODate) {
    const date = new Date(stringISODate.replace(' ', 'T'));

    return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatPrice(value) {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}