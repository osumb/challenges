import { api } from '../../utils';

const getEvaluableChallenges = () => api.get('/challenges/for_evaluation');

export default {
  getEvaluableChallenges
};
