require 'rails_helper'

RSpec.describe UsersController do
  describe 'GET search' do
    let(:current_user) { create(:admin_user) }
    let(:request) { get :search }
    let(:expected_authenticated_response) { render_template(:search) }
    let(:expected_unauthenticated_response) { redirect_to('/login') }

    it_behaves_like 'controller_authentication'

    context 'when authenticated' do
      include_context 'with authentication'

      context 'and a search was made' do
        let(:request) { get :search, params: { query: query } }

        it 'doesn\'t return any admin users' do
          get :search, params: { query: current_user.first_name }

          expect(assigns(:users)).not_to include(current_user)
        end

        context 'for just the user\'s first name' do
          let(:user) { create(:user) }
          let(:query) { user.first_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end

        context 'for just the user\'s last name' do
          let(:user) { create(:user) }
          let(:query) { user.last_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end

        context 'for both the user\'s first and last name' do
          let(:user) { create(:user) }
          let(:query) { user.full_name }

          it 'returns the user' do
            request

            expect(assigns(:users)).to eq([user])
          end
        end
      end

      context 'but a search wasn\'t made' do
        it 'does not return any users' do
          request

          expect(assigns(:users)).to eq([])
        end
      end
      context 'but the current user is not an admin' do
        let(:current_user) { create(:user) }

        it 'returns a :not_found' do
          request

          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
