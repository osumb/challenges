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

  describe 'POST /api/users/:buck_id/reset_password/' do
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

describe 'User Requests', type: :request do
  let(:endpoint) { "/api/users/#{user.id}" }
  let(:user) { create(:user, :trumpet, :solo, :spot_a3) }
  let(:update_params) do
    {
      first_name: 'THIS IS A NAME?!',
      last_name: 'NOPE, THIS IS A NAME',
      part: 'first'
    }
  end

  describe 'PUT /api/users/:id' do
    it 'successfully updates a user\'s part' do
      put endpoint, params: update_params.to_json, headers: authenticated_header(user)

      user.reload
      expect(response).to have_http_status(200)
      expect(user.part).to eq(update_params[:part])
    end

    it 'successfully updates a user\'s first and last name' do
      put endpoint, params: update_params.to_json, headers: authenticated_header(user)

      user.reload
      expect(response).to have_http_status(200)
      expect(user.first_name).to eq(update_params[:first_name])
      expect(user.last_name).to eq(update_params[:last_name])
    end

    context 'the part for update doesn\'t exist' do
      let(:update_params) do
        {
          part: 'THIS ISN\'T A PART, DUMMY! :('
        }
      end

      it 'returns a 409' do
        put endpoint, params: update_params.to_json, headers: authenticated_header(user)

        expect(response).to have_http_status(409)
      end
    end
  end

  describe 'PUT /api/users/switch_spot' do
    let(:requesting_user) { create(:admin_user) }
    let(:target_user) { create(:user, :trumpet, :solo, :spot_a4) }
    let(:switch_endpoint) { '/api/users/switch_spot' }
    let(:switch_params) do
      {
        user_buck_id: user.buck_id,
        target_spot: target_user.spot
      }
    end

    it 'successfully switches two user\'s spots' do
      put switch_endpoint, params: switch_params.to_json, headers: authenticated_header(requesting_user)

      old_user_spot = user.spot
      target_spot = switch_params[:target_spot]
      user.reload
      target_user.reload

      expect(response).to have_http_status(200)
      expect(user.spot).to eq(target_spot)
      expect(target_user.spot).to eq(old_user_spot)
    end

    context 'requesting user isn\'t an admin' do
      it 'returns a 403' do
        put switch_endpoint, params: switch_params.to_json, headers: authenticated_header(user)

        user_spot = user.spot
        target_spot = switch_params[:target_spot]
        user.reload
        target_user.reload

        expect(response).to have_http_status(403)
        expect(user.spot).to eq(user_spot)
        expect(target_user.spot).to eq(target_spot)
      end
    end

    context 'the spot doesn\'t exist' do
      let(:switch_params) do
        {
          user_buck_id: user.buck_id,
          target_spot: {
            row: 'a',
            file: 15
          }
        }
      end

      it 'returns a 409' do
        put switch_endpoint, params: switch_params.to_json, headers: authenticated_header(requesting_user)

        user_spot = user.spot
        user.reload

        expect(response).to have_http_status(409)
        expect(user.spot).to eq(user_spot)
      end
    end
  end
end
