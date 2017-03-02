const ADMIN = 'Admin';
const DIRECTOR = 'Director';
const MEMBER = 'Member';
const SQUAD_LEADER = 'SquadLeader';

const isAdmin = ({ role }) => role === ADMIN;
const isDirector = ({ role }) => role === DIRECTOR;
const isMember = ({ role }) => role === MEMBER;
const isSquadLeader = ({ role }) => role === SQUAD_LEADER;

export default {
  isAdmin,
  isDirector,
  isMember,
  isSquadLeader
};
