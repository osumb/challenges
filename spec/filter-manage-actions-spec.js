/* eslint-disable no-undef */
/* filterManageActions should filter out all actions for a spotId if the last action is 'Closed Spot' */
const { filterManageActions } = require('../jobs').sendChallengeListEmail;

console.log('==> FILTER MANAGE ACTIONS');
describe('filterManageActions', () => {
  it('Simple', () => {
    const actions = [
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Closed Spot'
      },
      {
        userName: 'Blondell Jeanbaptiste',
        spotId: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      userName: 'Blondell Jeanbaptiste',
      spotId: 'B8',
      reason: 'Failed Music Check'
    }]);
  });

  it('User has closed spot, but not at end', () => {
    const actions = [
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Closed Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Failed Music Check'
      },
      {
        userName: 'Blondell Jeanbaptiste',
        spotId: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Failed Music Check'
      },
      {
        userName: 'Blondell Jeanbaptiste',
        spotId: 'B8',
        reason: 'Failed Music Check'
      }
    ]);
  });

  it('User has multiple closed spots, with one at end', () => {
    const actions = [
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Closed Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Failed Music Check'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Closed Spot'
      },
      {
        userName: 'Blondell Jeanbaptiste',
        spotId: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      userName: 'Blondell Jeanbaptiste',
      spotId: 'B8',
      reason: 'Failed Music Check'
    }]);
  });

  it('Multiple users get filtered', () => {
    const actions = [
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'A5',
        reason: 'Closed Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'R11',
        reason: 'Volunatrily Opened Spot'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'R11',
        reason: 'Failed Music Check'
      },
      {
        userName: 'Kyle Thompson',
        spotId: 'R11',
        reason: 'Closed Spot'
      },
      {
        userName: 'Blondell Jeanbaptiste',
        spotId: 'B8',
        reason: 'Failed Music Check'
      }
    ];

    const filteredActions = filterManageActions(actions);

    expect(filteredActions).toEqual([{
      userName: 'Blondell Jeanbaptiste',
      spotId: 'B8',
      reason: 'Failed Music Check'
    }]);

  });
});
