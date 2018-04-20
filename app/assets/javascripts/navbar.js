const containerClassName = 'challenges--js-navbar-link';
const dropdownClassName = 'challenges-navbar-link-dropdown';
const visibleClassName = 'challenges-navbar-link-dropdown-visible';

const handleClick = (event) => {
  const target = event.target;
  const targetChild = getChildFromDropdown(target);
  const expandedDropdowns = Array.from(document.querySelectorAll(`.${dropdownClassName}.${visibleClassName}`));

  expandedDropdowns.forEach(contractDropdown);

  const targetIsDropdown = target.classList.contains(containerClassName);
  if (!targetIsDropdown) {
    return;
  }

  expandDropdown(targetChild);
};

const expandDropdown = (dropdown) => {
  dropdown.classList.add(visibleClassName);
};

const contractDropdown = (dropdown) => {
  dropdown.classList.remove(visibleClassName);
};

const getChildFromDropdown = (container) => container.children[0];

window.addEventListener('click', handleClick);
window.addEventListener('touchend', handleClick);
