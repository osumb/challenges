export default (message) => {
  const messageHTML = document.createElement('h2');
  const navbar = document.getElementById('MessageAppend');

  messageHTML.innerHTML = message;
  messageHTML.style.color = 'red';
  messageHTML.style.textAlign = 'center';

  navbar.parentNode.insertBefore(messageHTML, navbar.nextSibling);
};
