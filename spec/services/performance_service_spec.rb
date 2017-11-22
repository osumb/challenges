require 'rails_helper'

describe PerformanceService do
  describe '.queue_new_performance_emails' do
    let(:performance) { create(:performance) }
    let(:normal_user) { create(:user, :squad_leader) }
    let(:alternate_user) { create(:user, :alternate) }

    it 'emails the alternate' do
      expect(EmailJob).to receive(:perform_later)
        .with(klass: 'NewPerformanceMailer', method: 'new_performance_email', args: { performance_id: performance.id, email: alternate_user.email })

      described_class.queue_new_performance_emails(performance_id: performance.id)
    end

    it 'doesn\'t email the normal user' do
      expect(EmailJob).not_to receive(:perform_later)
        .with(klass: 'NewPerformanceMailer', method: 'new_performance_email', args: { performance_id: performance.id, email: normal_user.email })

      described_class.queue_new_performance_emails(performance_id: performance.id)
    end
  end
end
