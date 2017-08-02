require 'rails_helper'

describe 'Challenge Evaluations', type: :request do
  let(:user) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }

  describe 'GET /api/challenges/for_evaluation' do
    subject(:request) { get endpoint, headers: authenticated_header(user) }
    let(:endpoint) { '/api/challenges/for_evaluation' }

    context 'when the user has evaluable challenges' do
      before do
        allow(Challenge).to receive(:evaluable).with(user).and_return([challenge])
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:ok)
      end

      it 'is includes the user_challenges and the users' do
        request
        result = JSON.parse(response.body).with_indifferent_access

        expect(result[:challenges][0][:user_challenges][0]).not_to be_nil
        expect(result[:challenges][0][:user_challenges][0][:user]).not_to be_nil
      end
    end

    context 'when the user has no evaluable challenges' do
      before do
        allow(Challenge).to receive(:evaluable).with(user).and_return([])
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'PUT /api/challenges/:id/submit_for_approval' do
    subject(:request) { put endpoint, headers: authenticated_header(user) }
    let(:endpoint) { "/api/challenges/#{challenge.id}/submit_for_approval" }

    context 'when the user can submit for approval' do
      it 'has the correct status' do
        request
        expect(response).to have_http_status(:no_content)
      end

      it 'updates the stage' do
        expect { request }.to change { challenge.reload.stage }.to('needs_approval')
      end

      context 'but the update fails' do
        before do
          allow(Challenge).to receive(:find).and_return(challenge)
          allow(challenge).to receive(:update).and_return(false)
        end

        it 'has the correct status' do
          request
          expect(response).to have_http_status(:conflict)
        end

        it 'does not update the stage' do
          expect { request }.not_to change { challenge.reload.stage }
        end
      end
    end

    context 'when the user cannot submit for approval' do
      let(:user) { create(:user, :member) }

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
