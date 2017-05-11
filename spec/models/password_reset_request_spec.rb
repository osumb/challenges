require 'rails_helper'

describe PasswordResetRequest, type: :model do
  context 'when it has been used' do
    let(:prr) { create(:used_password_reset_request) }

    it 'cannot be reused' do
      prr.used = false

      prr.valid?
      expect(prr.errors.full_messages).to include("Password change request can't be reused")
    end
  end
end
