require 'rails_helper'

describe 'DisciplineActions', type: :request do
  let(:endpoint) { '/api/discipline_actions/' }
  let(:admin) { create(:admin_user) }
  let(:user) { create(:user) }
  let(:performance) { create(:performance) }
  let(:discipline_action_params) do
    {
      discipline_action: {
        allowed_to_challenge: false,
        open_spot: true,
        performance_id: performance.id,
        reason: "#{user.first_name} was a very bad boy",
        user_buck_id: user.buck_id
      }
    }
  end
  let(:discipline_action) { create(:discipline_action) }

  describe 'POST /api/discipline_actions/' do
    context 'when the user is an admin' do
      it 'successfully creates a discipline_action' do
        expect {
          post endpoint, params: discipline_action_params.to_json, headers: authenticated_header(admin)
        }.to change { DisciplineAction.count }.by(1)

        expect(response).to have_http_status(201)
      end

      context 'but the params are bad' do
        it 'is invalid without a user_buck_id' do
          discipline_action_params[:discipline_action].except!(:user_buck_id)

          expect {
            post endpoint, params: discipline_action_params.to_json, headers: authenticated_header(admin)
          }.not_to change { DisciplineAction.count }

          expect(response).to have_http_status(409)
        end

        it 'is invalid without a performance_id' do
          discipline_action_params[:discipline_action].except!(:performance_id)

          expect {
            post endpoint, params: discipline_action_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(403)
        end

        it 'is invalid without a reason' do
          discipline_action_params[:discipline_action].except!(:reason)

          expect {
            post endpoint, params: discipline_action_params.to_json, headers: authenticated_header(admin)
          }.not_to change { Performance.count }

          expect(response).to have_http_status(409)
        end
      end
    end

    context 'when the user is an not admin' do
      let(:admin) { create(:user) }

      it 'does not create a discipline action' do
        expect {
          post endpoint, params: discipline_action_params.to_json, headers: authenticated_header(admin)
        }.not_to change { DisciplineAction.count }

        expect(response).to have_http_status(403)
      end
    end
  end

  describe 'DEL /api/discipline_actions/id' do
    context 'when the user is an admin' do
      it 'successfully destroys a discipline action' do
        id = discipline_action.id
        expect {
          delete "#{endpoint}/#{id}", headers: authenticated_header(admin)
        }.to change { DisciplineAction.count }.by(-1)

        expect(response).to have_http_status(204)
      end

      context 'but the performance is expired' do
        let(:discipline_action) { create(:discipline_action, performance: create(:stale_performance)) }

        it 'does\'t destroy the discipline action' do
          id = discipline_action.id
          expect {
            delete "#{endpoint}/#{id}", headers: authenticated_header(admin)
          }.to change { DisciplineAction.count }.by(0)

          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
