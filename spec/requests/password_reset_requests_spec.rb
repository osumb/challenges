require 'rails_helper'

describe 'Password Reset Requests', type: :request do
  let(:endpoint) { '/api/password_reset_requests/' }
  let(:user) { create(:alternate_user, :trumpet, :solo, :spot_a13) }
  let(:email) { user.email }
  let(:buck_id) { user.buck_id }
  let(:reset_params) do
    {
      buck_id: buck_id,
      email: email
    }
  end

  describe 'GET /api/password_reset_requests/' do
    it 'successfully creates a password change request' do
      expect {
        post endpoint, params: reset_params.to_json, headers: unauthenticated_header
      }.to change { PasswordResetRequest.count }.by(1)

      expect(response).to have_http_status(201)
    end

    context 'when an incorrect email is provided' do
      let(:email) { 'not_the_correct_email@very_wrong.incorrect' }

      it 'returns a 403' do
        expect {
          post endpoint, params: reset_params.to_json, headers: unauthenticated_header
        }.not_to change { PasswordResetRequest.count }

        expect(response).to have_http_status(403)
      end
    end
  end
end
