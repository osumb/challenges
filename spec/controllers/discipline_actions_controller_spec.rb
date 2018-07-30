require 'rails_helper'

RSpec.describe DisciplineActionsController do
  describe 'POST create' do
    let(:current_user) { create(:admin_user) }
    let(:request) { post :create, params: params }
    let(:reason) { 'Failed Music Check' }
    let(:user) { create(:user) }
    let(:allowed_to_challenge) { true }
    let(:open_spot) { true }
    let(:performance) { create(:performance) }

    let(:params) do
      {
        discipline_action: {
          allowed_to_challenge: allowed_to_challenge ? 'on' : nil,
          open_spot: open_spot ? 'on' : nil,
          performance_id: performance.id,
          reason: reason,
          user_buck_id: user.buck_id
        }
      }
    end
    let(:expected_authenticated_response) { have_http_status(:redirect) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'creates a new discipline action' do
        expect do
          request
        end.to change { DisciplineAction.count }.by(1)
      end

      context 'but there are errors' do
        context 'because the performance window is closed' do
          let(:performance) { create(:stale_performance) }

          it 'redirects with a flash message', :aggregate_errors do
            expect do
              request
            end.not_to change { DisciplineAction.count }

            expect(flash[:errors]).to eq("Performance window can't be closed")
          end
        end
      end

      context 'but the current user isn\'t an admin' do
        let(:current_user) { user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'DELETE destroy' do
    let(:current_user) { create(:admin_user) }
    let(:request) { delete :destroy, params: params }
    let(:reason) { 'Failed Music Check' }
    let(:user) { create(:user) }
    let!(:discipline_action) { create(:discipline_action, user: user) }

    let(:params) { { id: discipline_action.id } }
    let(:expected_authenticated_response) { have_http_status(:redirect) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      it 'deletes the discipline action' do
        expect do
          request
        end.to change { DisciplineAction.count }.by(-1)
      end

      context 'but the user\'s spot has already been challenged' do
        let!(:challenge) do
          create(
            :normal_challenge,
            users: [user, create(:user, :spot_a13)],
            spot: user.current_spot,
            performance: discipline_action.performance
          )
        end

        it 'does not delete the discipline action' do
          expect do
            request
          end.not_to change { DisciplineAction.count }
        end
      end

      context 'but the current user isn\'t an admin' do
        let(:current_user) { user }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
