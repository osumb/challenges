const { banner, validSpot } = require('../utils');

const apiEndPoint = '/users/spot';
const editButtonClass = '.UserIndex-editSpot';
const confirmEditTextBoxButtonClass = 'UserIndex-confirmEditTextButton';
const cancelEditTextBoxButtonClass = 'UserIndex-cancelEditTextBoxButton';
const textAreaClass = 'UserIndex-textarea';
const userIndexItemClass = 'UserIndex-userItem';

$(editButtonClass).on('click', (e) => {
  clickEventFunction(e);
});

const clickEventFunction = (e) => {
  const nameNumber = e.target.className.split(' ')[1];
  const userRowDiv = document.getElementsByClassName(nameNumber)[0];
  const userRowChildren = userRowDiv.children;
  const spotTag = userRowChildren[1];
  const spotTagButton = spotTag.innerHTML.split(' ').slice(1);
  const spotId = spotTag.innerHTML.split(' ')[0];
  const editSpotDiv = createTextAreaWithButtons(spotId);

  userRowDiv.replaceChild(editSpotDiv, spotTag);

  const textArea = editSpotDiv.children[0], cancelButton = editSpotDiv.children[1], confirmButton = editSpotDiv.children[2];

  $(cancelButton).on('click', () => {
    userRowDiv.replaceChild(spotTag, editSpotDiv);
  });

  $(confirmButton).on('click', () => {
    const newSpotId = textArea.value;

    if (newSpotId !== spotId && validSpot(newSpotId)) {
      fetch(apiEndPoint, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'post',
        body: JSON.stringify({
          nameNumber,
          spotId: newSpotId
        })
      })
      .then(() => {
        banner('Successfully updated spot!');
        spotTag.innerHTML = `${newSpotId} ${spotTagButton.join(' ')}`;
        userRowDiv.replaceChild(spotTag, editSpotDiv);
        $(editButtonClass).on('click', (element) => {
          clickEventFunction(element);
        });
      })
      .catch((err) => {
        console.error(err);
        banner('Sorry! There was a problem with your request');
      });
    } else {
      banner(`Spot ${newSpotId} is not a valid spot`);
    }
  });
};

const createTextAreaWithButtons = (spotId) => {
  const cancelEditTextBoxButton = document.createElement('button');
  const confirmEditTextBoxButton = document.createElement('button');
  const containerDiv = document.createElement('div');
  const textArea = document.createElement('textarea');

  cancelEditTextBoxButton.className += `${cancelEditTextBoxButtonClass}`;
  cancelEditTextBoxButton.innerHTML = 'Cancel';
  confirmEditTextBoxButton.className += `${confirmEditTextBoxButtonClass}`;
  confirmEditTextBoxButton.innerHTML = 'Confirm';
  containerDiv.className += `${userIndexItemClass}`;
  textArea.className += `${textAreaClass}`;
  textArea.innerHTML = spotId;

  containerDiv.appendChild(textArea);
  containerDiv.appendChild(cancelEditTextBoxButton);
  containerDiv.appendChild(confirmEditTextBoxButton);

  return containerDiv;
};
