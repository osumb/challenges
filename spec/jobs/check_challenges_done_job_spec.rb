require 'rails_helper'

RSpec.describe CheckChallengesDoneJob, type: :job do
  describe '.perform_now' do
    let(:performance_id) { 5 }

    it 'calls the correct service' do
      expect(ChallengeService).to receive(:check_challenges_are_done)
        .with(performance_id: performance_id)
        .and_return(true)

      CheckChallengesDoneJob.perform_now(performance_id: performance_id)
    end
  end
end
