require 'rails_helper'

describe PasswordResetRequestService do
  describe '.send_for_new_user' do
    let(:user) { create(:user) }

    it 'sends the user creation email' do
      expect(PasswordResetMailer).to receive(:user_creation_email).and_call_original

      described_class.send_for_new_user(user: user)
    end

    it 'creates a password reset request' do
      expect do
        described_class.send_for_new_user(user: user)
      end.to change { PasswordResetRequest.count }.by 1
    end
  end
end
