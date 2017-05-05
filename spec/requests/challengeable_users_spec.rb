require 'rails_helper'

describe 'Challengeable Users', type: :request do
  let(:endpoint) { '/api/performances/challengeable_users/' }
  let!(:performance) { create(:performance) }
  let!(:user) { create(:alternate_user, :trumpet, :solo, :spot_a13) }
  let!(:challengee) { create(:user, :trumpet, :solo, :spot_a2) }
  let(:performance_params) do
    {
      performance: {
        name: 'Best name ever',
        window_open: Time.zone.now,
        window_close: Time.zone.now + 3.hours,
        date: Time.zone.now + 1.week
      }
    }
  end
  let(:challengeable_user_shape) do
    {
      'buck_id': true,
      'challenge_id': true,
      'challenge_type': true,
      'file': true,
      'first_name': true,
      'last_name': true,
      'open_spot': true,
      'row': true,
      'members_in_challenge': true
    }
  end

  describe 'GET /api/performances/challengeable_users/' do
    before do
      get endpoint, headers: authenticated_header(user)
    end

    specify { expect(response).to have_http_status(200) }

    context 'when there is a current performance' do
      it 'returns an array of challengeable users' do
        expect(JSON.parse(response.body)['challengeable_users']).to be_instance_of(Array)
      end

      it 'returns the correct shape of data' do
        challengeable_user = JSON.parse(response.body)['challengeable_users'].first
        expect(matches_shape?(challengeable_user_shape, challengeable_user))
      end
    end

    context 'when there is no current performance' do
      let!(:performance) { nil }

      it 'returns an empty array' do
        challengeable_users = JSON.parse(response.body)['challengeable_users']
        expect(challengeable_users.length).to eq(0)
      end
    end

    context 'when the requesting user is an admin' do
      let(:user) { create(:admin_user, :trumpet, :solo) }

      it 'returns an empty array' do
        challengeable_users = JSON.parse(response.body)['challengeable_users']
        expect(challengeable_users.length).to eq(0)
      end
    end
  end
end
