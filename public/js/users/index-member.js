const { banner, validSpot } = require('../utils');

const apiEndPoint = '/users';
const editPartButtonClass = '.UserIndex-editPart';
const editSpotButtonClass = '.UserIndex-editSpot';
const cancelEditPartButtonClass = 'UserIndex-cancelEditPartButton';
const cancelEditTextBoxButtonClass = 'UserIndex-cancelEditTextBoxButton';
const confirmEditPartButtonClass = 'UserIndex-confirmEditPartButton';
const confirmEditTextBoxButtonClass = 'UserIndex-confirmEditTextButton';
const instrumentPartMap = {
  Baritone: ['First'],
  Mellophone: ['First', 'Second'],
  Percussion: ['Bass', 'Cymbals', 'Snare', 'Tenor'],
  Sousaphone: ['First'],
  Trombone: ['First', 'Second', 'Bass'],
  Trumpet: ['Efer', 'Solo', 'First', 'Second', 'Flugel']
};
const selectClass = 'UserIndex-partSelect';
const textAreaClass = 'UserIndex-textarea';
const userIndexItemClass = 'UserIndex-userItem';

$(editSpotButtonClass).on('click', (e) => {
  editSpotClickEventFunction(e);
});

$(editPartButtonClass).on('click', (e) => {
  editPartClickEventFunction(e);
});

const editPartClickEventFunction = (e) => {
  const nameNumber = e.target.className.split(' ')[1];
  const userRowDiv = document.getElementsByClassName(nameNumber)[0];
  const userRowChildren = userRowDiv.children;
  const instrument = userRowChildren[2].innerHTML;
  const partTag = userRowChildren[3];
  const partTagButton = partTag.innerHTML.split(' ').slice(1);
  const part = partTag.innerHTML.split(' ')[0];
  const editPartDiv = createDropDownWithButtons(instrument, part);

  userRowDiv.replaceChild(editPartDiv, partTag);

  const select = editPartDiv.children[0], cancelButton = editPartDiv.children[1], confirmButton = editPartDiv.children[2];

  $(cancelButton).on('click', () => {
    userRowDiv.replaceChild(partTag, editPartDiv);
  });

  $(confirmButton).on('click', () => {
    const newPart = select.options[select.selectedIndex].value;

    if (newPart !== part) {
      fetch(apiEndPoint, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'put',
        body: JSON.stringify({
          nameNumber,
          part: newPart
        })
      })
      .then(() => {
        banner('Successfully updated part!');
        partTag.innerHTML = `${newPart} ${partTagButton.join(' ')}`;
        userRowDiv.replaceChild(partTag, editPartDiv);
        $(partTag.children[0]).on('click', (element) => {
          editPartClickEventFunction(element);
        });
      })
      .catch((err) => {
        console.error(err);
        banner('Sorry! There was a problem with your request');
      });
    } else {
      banner('Please select a different part');
    }
  });
};

const editSpotClickEventFunction = (e) => {
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
        method: 'put',
        body: JSON.stringify({
          nameNumber,
          spotId: newSpotId
        })
      })
      .then(() => {
        banner('Successfully updated spot!');
        spotTag.innerHTML = `${newSpotId} ${spotTagButton.join(' ')}`;
        userRowDiv.replaceChild(spotTag, editSpotDiv);
        $(spotTag.children[0]).on('click', (element) => {
          editSpotClickEventFunction(element);
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

const createDropDownWithButtons = (instrument, oldPart) => {
  const cancelButton = document.createElement('button');
  const confirmButton = document.createElement('button');
  const containerDiv = document.createElement('div');
  let oldPartSelectIndex = 0;
  const options = instrumentPartMap[instrument];
  const select = document.createElement('select');

  options.forEach((part, i) => {
    const option = document.createElement('option');

    if (part === oldPart) {
      oldPartSelectIndex = i;
    }

    option.value = part;
    option.innerHTML = part;
    select.appendChild(option);
  });

  select.selectedIndex = oldPartSelectIndex;
  cancelButton.className += cancelEditPartButtonClass;
  cancelButton.innerHTML = 'Cancel';
  confirmButton.className += confirmEditPartButtonClass;
  confirmButton.innerHTML = 'Confirm';
  containerDiv.className += userIndexItemClass;
  select.className += selectClass;

  containerDiv.appendChild(select);
  containerDiv.appendChild(cancelButton);
  containerDiv.appendChild(confirmButton);

  return containerDiv;
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
  textArea.value = spotId;

  containerDiv.appendChild(textArea);
  containerDiv.appendChild(cancelEditTextBoxButton);
  containerDiv.appendChild(confirmEditTextBoxButton);

  return containerDiv;
};
