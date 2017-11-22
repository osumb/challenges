# rubocop:disable Lint/AmbiguousBlockAssociation
require 'rails_helper'

describe 'Password Reset Requests', type: :request do
  let(:endpoint) { "/api/users/#{user.id}/reset_password/" }
  let(:user) { create(:user) }
  let(:other_user) { create(:user, :spot_a3) }
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
    let(:switch_endpoint) { '/api/users/switch_spots' }
    let(:switch_params) do
      {
        user_buck_id: user.buck_id,
        target_spot: target_user.current_spot
      }
    end

    it 'successfully switches two user\'s spots' do
      put switch_endpoint, params: switch_params.to_json, headers: authenticated_header(requesting_user)

      old_user_spot = user.current_spot
      target_spot = switch_params[:target_spot]
      user.reload
      target_user.reload

      expect(response).to have_http_status(204)
      expect(user.current_spot).to eq(target_spot)
      expect(target_user.current_spot).to eq(old_user_spot)
    end

    context 'requesting user isn\'t an admin' do
      it 'returns a 403' do
        put switch_endpoint, params: switch_params.to_json, headers: authenticated_header(user)

        user_spot = user.current_spot
        target_spot = switch_params[:target_spot]
        user.reload
        target_user.reload

        expect(response).to have_http_status(403)
        expect(user.current_spot).to eq(user_spot)
        expect(target_user.current_spot).to eq(target_spot)
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

        user_spot = user.current_spot
        user.reload

        expect(response).to have_http_status(409)
        expect(user.current_spot).to eq(user_spot)
      end
    end
  end

  describe 'GET /api/users/can_challenge' do
    let!(:admin) { create(:admin_user) }
    let!(:endpoint) { '/api/users/can_challenge' }
    let!(:performance) { create(:performance) }
    let!(:alternate_no_da) { create(:alternate_user) }
    let!(:alternate_da) { create(:alternate_user, :spot_x13) }
    let!(:member_no_da) { create(:user) }
    let!(:member_da) { create(:user, :spot_a3) }
    let!(:da_for_alternate) {
      create(:discipline_action, user: alternate_da, performance: performance, allowed_to_challenge: false)
    }
    let!(:da_for_member) {
      create(:discipline_action, user: member_da, performance: performance, allowed_to_challenge: true)
    }

    it 'returns alternate(s) with with no discipline actions for the current performance' do
      get endpoint, headers: authenticated_header(admin)

      users = JSON.parse(response.body)['users']

      expect(response).to have_http_status(200)
      expect(users.any? { |u| u['buck_id'] == alternate_no_da.buck_id }).to be(true)
      expect(users.any? { |u| u['buck_id'] == member_da.buck_id }).to be(true)
      expect(users.none? { |u| u['buck_id'] == alternate_da.buck_id }).to be(true)
      expect(users.none? { |u| u['buck_id'] == member_no_da.buck_id }).to be(true)
    end
  end
end
