require 'rails_helper'

describe 'Password Reset Requests', type: :request do
  let(:endpoint) { "/api/users/#{user.id}/reset_password/" }
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:prr) { create(:unused_password_reset_request, user: user) }
  let(:new_password) { 'NEW PASSWORD$$$?!?!?' }
  let(:reset_params) do
    {
      password_reset_request_id: prr.id,
      password: new_password
    }
  end

  describe 'POST /api/users/:id/reset_password/' do
    it 'successfully resets a password' do
      post endpoint, params: reset_params.to_json, headers: unauthenticated_header

      expect(response).to have_http_status(204)
      expect(BCrypt::Password.new(user.reload.password_digest)).to eq(new_password)
      expect(prr.reload.used).to be(true)
    end

    context 'when the reset request is used' do
      let(:prr) { create(:used_password_reset_request, user: user) }

      it 'returns a 403' do
        expect {
          post endpoint, params: reset_params.to_json, headers: unauthenticated_header
        }.not_to change { user.reload }

        expect(response).to have_http_status(403)
      end
    end

    context 'when the reset request is expired' do
      let(:prr) { create(:expired_password_reset_request, user: user) }

      it 'returns a 403' do
        expect {
          post endpoint, params: reset_params.to_json, headers: unauthenticated_header
        }.not_to change { user.reload }

        expect(response).to have_http_status(403)
      end
    end

    context 'when the new password is blank' do
      let(:new_password) { '' }

      it 'returns a 403' do
        expect {
          post endpoint, params: reset_params.to_json, headers: unauthenticated_header
        }.not_to change { user.reload }

        expect(response).to have_http_status(403)
      end
    end

    context 'when the a different user tries to use the reset request' do
      let(:endpoint) { "/api/users/#{other_user.id}/reset_password/" }

      it 'returns a 403' do
        expect {
          post endpoint, params: reset_params.to_json, headers: unauthenticated_header
        }.not_to change { user.reload }

        expect(response).to have_http_status(403)
      end
    end
  end
end
