require 'rails_helper'

describe 'User Creation', type: :request do
  subject(:request) { post endpoint, params: params.to_json, headers: authenticated_header(user) }
  let!(:user) { create(:admin_user) }

  describe 'POST /api/users/create' do
    let(:endpoint) { '/api/users/create' }
    let!(:params) do
      {
        user: {
          first_name: 'First',
          last_name: 'Last',
          buck_id: 'last.1',
          email: 'last.1@osu.edu',
          role: 'squad_leader',
          instrument: 'trumpet',
          part: 'solo',
          spot: { row: 'A', file: 2 }
        }
      }
    end
    let!(:spot) { create(:spot, row: params[:user][:spot][:row].to_s.downcase.to_sym, file: params[:user][:spot][:file]) }
    let!(:existing_user) { create(:user, :member, current_spot: spot, original_spot: spot) }

    it 'creates a new user' do
      expect do
        request
      end.to change { User.count }.by 1
    end

    it 'swaps in a new user' do
      expect(UserService).to receive(:create).and_call_original

      request
    end

    it 'creates a password reset request and sends the user creation email' do
      expect(PasswordResetRequestService).to receive(:send_for_new_user).and_return(nil)

      request
    end

    context 'failed request' do
      before do
        params[:user][:email] = nil
      end

      it 'doesn\'t deactivate the old user if the new user fails to get created' do
        expect do
          request
        end.to change { User.where(active: false).count }.by 0
      end
    end

    context 'auth' do
      let(:user) { create(:user, :alternate) }

      it 'prevents non admins from creating a new user' do
        request
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
