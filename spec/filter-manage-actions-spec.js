/* eslint-disable no-undef */
/* filterManageActions should filter out all actions for a spotId if the last action is 'Closed Spot' */
const { filterManageActions } = require('../jobs').sendChallengeListEmail;

console.log('==> FILTER MANAGE ACTIONS');
describe('filterManageActions', () => {
  it('Simple', () => {
    const actions = [
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Closed Spot'
      },
      {
        name: 'Blondell Jeanbaptiste',
        spotid: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      name: 'Blondell Jeanbaptiste',
      spotid: 'B8',
      reason: 'Failed Music Check'
    }]);
  });

  it('User has closed spot, but not at end', () => {
    const actions = [
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Closed Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Failed Music Check'
      },
      {
        name: 'Blondell Jeanbaptiste',
        spotid: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Failed Music Check'
      },
      {
        name: 'Blondell Jeanbaptiste',
        spotid: 'B8',
        reason: 'Failed Music Check'
      }
    ]);
  });

  it('User has multiple closed spots, with one at end', () => {
    const actions = [
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Closed Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Failed Music Check'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Closed Spot'
      },
      {
        name: 'Blondell Jeanbaptiste',
        spotid: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      name: 'Blondell Jeanbaptiste',
      spotid: 'B8',
      reason: 'Failed Music Check'
    }]);
  });

  it('Multiple users get filtered', () => {
    const actions = [
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'A5',
        reason: 'Closed Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'R11',
        reason: 'Volunatrily Opened Spot'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'R11',
        reason: 'Failed Music Check'
      },
      {
        name: 'Kyle Thompson',
        spotid: 'R11',
        reason: 'Closed Spot'
      },
      {
        name: 'Blondell Jeanbaptiste',
        spotid: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      name: 'Blondell Jeanbaptiste',
      spotid: 'B8',
      reason: 'Failed Music Check'
    }]);

  });
});
