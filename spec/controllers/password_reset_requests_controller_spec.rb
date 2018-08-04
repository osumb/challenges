require 'rails_helper'

RSpec.describe PasswordResetRequestsController do
  describe 'POST create' do
    let(:user) { create(:user) }
    let(:request) { post :create, params: params }
    let(:buck_id) { user.buck_id }
    let(:email) { user.email }

    let(:params) do
      { buck_id: buck_id, email: email }
    end

    it 'creates a password reset request' do
      expect do
        request
      end.to change { PasswordResetRequest.count }.by(1)
    end

    it 'sends a password reset email' do
      expect(EmailJob).to receive(:perform_later).with(
        klass: 'PasswordResetMailer',
        method: 'password_reset_email',
        args: { user_buck_id: buck_id, password_reset_request_id: an_instance_of(String) }
      )

      request
    end

    it 'redirects back' do
      request

      expect(response).to have_http_status(:redirect)
    end

    it 'has a flash message' do
      request

      expect(flash[:message]).to eq("Success! An email has been sent to #{user.email} with instructions")
    end

    context 'but the user doesn\'t exist' do
      let(:buck_id) { 'blah' }

      it 'has a flash error' do
        request

        expect(flash[:errors]).to eq("That combination of name.# and password doesn't exist in the system")
      end
    end

    context 'but the email doesn\'t match the one passed in' do
      let(:email) { 'blah' }

      it 'has a flash error' do
        request

        expect(flash[:errors]).to eq("That combination of name.# and password doesn't exist in the system")
      end
    end
  end
end
