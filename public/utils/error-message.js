const deleteMessage = () => {
  const element = document.getElementById('ErrorMessage');

  if (element) {
    element.parentNode.removeChild(element);
  }
};

const errorMessage = (message) => {
  deleteMessage();
  const messageHTML = document.createElement('h2');
  const navbar = document.getElementById('MessageAppend');

  messageHTML.id = 'ErrorMessage';
  messageHTML.innerHTML = message;
  messageHTML.style.color = 'red';
  messageHTML.style.textAlign = 'center';

  navbar.parentNode.insertBefore(messageHTML, navbar.nextSibling);
};

export {
  deleteMessage,
  errorMessage
};
