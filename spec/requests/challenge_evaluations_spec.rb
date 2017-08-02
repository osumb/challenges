require 'rails_helper'

describe 'Challenge Evaluations', type: :request do
  subject(:request) { get endpoint, headers: authenticated_header(admin) }
  let(:admin) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }

  describe 'GET /api/challenges/for_evaluation' do
    let(:endpoint) { '/api/challenges/for_evaluation' }

    context 'when the user has evaluable challenges' do
      before do
        allow(Challenge).to receive(:evaluable).with(admin).and_return([challenge])
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
        allow(Challenge).to receive(:evaluable).with(admin).and_return([])
      end

      it 'has the correct status' do
        request
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
