import { PropTypes } from 'react';

const propTypes = {
  buckId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  instrument: PropTypes.oneOf([
    'Any',
    'Baritone',
    'Mellophone',
    'Percussion',
    'Sousaphone',
    'Trombone',
    'Trumpet'
  ]).isRequired,
  lastName: PropTypes.string.isRequired,
  part: PropTypes.oneOf([
    'Any',
    'Bass',
    'Cymbals',
    'Efer',
    'First',
    'Flugel',
    'Second',
    'Snare',
    'Solo',
    'Tenor'
  ]).isRequired,
  role: PropTypes.oneOf(['Admin', 'Director', 'Member', 'SquadLeader']),
  spot: PropTypes.shape({
    file: PropTypes.number,
    row: PropTypes.oneOf(['A', 'B', 'C', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'Q', 'R', 'S', 'T', 'X'])
  })
};

export default propTypes;
