import moment from 'moment';

import { api } from '../../utils';

const create = ({
  date,
  name,
  windowClose: window_close,
  windowOpen: window_open
}) => api.post('/performances', { date, name, window_close, window_open });
const update = ({
  date,
  id,
  name,
  windowClose: window_close,
  windowOpen: window_open
}) =>
  api.put(`/performances/${id}`, {
    performance: {
      date: moment(date).utc(),
      name,
      window_close: moment(window_close).utc(),
      window_open: moment(window_open).utc()
    }
  });

const getAll = () => api.get('/performances');
const getChallengeableUsers = () =>
  api.get('/performances/challengeable_users');
const getNext = () => api.get('/performances/next');

const isValidPerformance = ({ date, name, windowClose, windowOpen }) => {
  if (!isValidPerformanceName(name)) return false;
  if (!isValidDate(date)) return false;
  if (!isValidDate(windowClose)) return false;
  if (!isValidDate(windowOpen)) return false;
  return new Date(windowOpen).getTime() < new Date(windowClose).getTime();
};

const isWindowOpen = ({ windowClose, windowOpen }) => {
  const now = new Date().getTime();
  const close = new Date(windowClose).getTime(),
    open = new Date(windowOpen).getTime();

  return open <= now && now <= close;
};

const isValidPerformanceName = name =>
  typeof name !== 'undefined' && name !== null && name !== '';
const isValidDate = date => new Date(date).toString() !== 'Invalid Date';
const performanceErrors = ({ date, name, windowClose, windowOpen }) => {
  const errs = [];
  if (!isValidPerformanceName(name)) errs.push('Name must not be blank');
  if (!isValidDate(date)) errs.push('Invalid date format');
  if (!isValidDate(windowClose)) errs.push('Invalid window close time format');
  if (!isValidDate(windowOpen)) errs.push('Invalid window open time format');
  if (new Date(windowOpen).getTime() >= new Date(windowClose).getTime()) {
    errs.push('Closing time must be after opening');
  }
  return errs;
};
const performanceKeys = ['date', 'name', 'windowClose', 'windowOpen'];

export default {
  create,
  getAll,
  getChallengeableUsers,
  getNext,
  isValidPerformance,
  isWindowOpen,
  performanceErrors,
  performanceKeys,
  update
};
